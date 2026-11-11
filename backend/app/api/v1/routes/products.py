import re
import uuid
from decimal import Decimal


from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session


from app.api.v1.dependencies import get_current_admin
from app.core.database import get_db
from app.models.category import Category
from app.models.product import Product
from app.models.profile import Profile
from app.schemas.product import (
    ProductCreate,
    ProductResponse,
    ProductStatus,
    ProductUpdate,
)


router = APIRouter(
    prefix="/products",
    tags=["Products"],
    dependencies=[Depends(get_current_admin)],
)


def make_slug(name: str) -> str:
    slug = name.lower().strip()
    slug = re.sub(r"[^a-z0-9]+", "-", slug)
    return slug.strip("-")


@router.post("/", response_model=ProductResponse, status_code=201)
def create_product(
    product_data: ProductCreate,
    db: Session = Depends(get_db),
    current_admin: Profile = Depends(get_current_admin),
):
    category = (
        db.query(Category)
        .filter(Category.id == product_data.category_id)
        .first()
    )

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )

    slug = make_slug(product_data.name)

    existing_product = (
        db.query(Product)
        .filter(Product.slug == slug)
        .first()
    )

    if existing_product:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A product with this name already exists",
        )

    product = Product(
        category_id=product_data.category_id,
        name=product_data.name,
        slug=slug,
        description=product_data.description,
        status="draft",
        regular_price=product_data.price,
        price=product_data.price,
        tax_rate=Decimal("0.00"),
        stock_quantity=product_data.stock,
        stock=product_data.stock,
        image_url=(
            product_data.images[0]
            if product_data.images
            else product_data.image_url
        ),
        images=product_data.images,
        video_url=product_data.video_url,
        is_active=product_data.is_active,
    )

    db.add(product)
    db.commit()
    db.refresh(product)

    return product


@router.get("/", response_model=list[ProductResponse])
def get_products(
    db: Session = Depends(get_db),
    current_admin: Profile = Depends(get_current_admin),
):
    products = (
        db.query(Product)
        .order_by(Product.created_at.desc())
        .all()
    )

    return products


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(
    product_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_admin: Profile = Depends(get_current_admin),
):
    product = (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    return product


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: uuid.UUID,
    product_data: ProductUpdate,
    db: Session = Depends(get_db),
    current_admin: Profile = Depends(get_current_admin),
):
    product = (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    if product_data.category_id is not None:
        category = (
            db.query(Category)
            .filter(Category.id == product_data.category_id)
            .first()
        )

        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found",
            )

        product.category_id = product_data.category_id

    if product_data.name is not None:
        new_slug = make_slug(product_data.name)

        existing_product = (
            db.query(Product)
            .filter(
                Product.id != product.id,
                Product.slug == new_slug,
            )
            .first()
        )

        if existing_product:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A product with this name already exists",
            )

        product.name = product_data.name
        product.slug = new_slug

    if product_data.description is not None:
        product.description = product_data.description

    if product_data.price is not None:
        product.price = product_data.price
        product.regular_price = product_data.price
    if product_data.cost_price is not None:
        product.cost_price = product_data.cost_price

    if product_data.stock is not None:
        product.stock = product_data.stock
        product.stock_quantity = product_data.stock

    if product_data.images is not None:
        product.images = product_data.images

        if product_data.images:
            product.image_url = product_data.images[0]

    if product_data.image_url is not None:
        product.image_url = product_data.image_url

    if product_data.video_url is not None:
        product.video_url = product_data.video_url

    if product_data.model_url is not None:
        product.model_url = product_data.model_url

    if product_data.status is not None:
        product.status = product_data.status.value

        if product_data.status == ProductStatus.published:
            product.is_active = True
        elif product_data.status == ProductStatus.archived:
            product.is_active = False

    if product_data.is_active is not None:
        product.is_active = product_data.is_active

    db.commit()
    db.refresh(product)

    return product


@router.patch("/{product_id}/status", response_model=ProductResponse)
def update_product_status(
    product_id: uuid.UUID,
    product_status: ProductStatus,
    db: Session = Depends(get_db),
    current_admin: Profile = Depends(get_current_admin),
):
    product = (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    product.status = product_status.value

    if product_status == ProductStatus.published:
        product.is_active = True
    elif product_status == ProductStatus.archived:
        product.is_active = False

    db.commit()
    db.refresh(product)

    return product


@router.delete("/{product_id}", status_code=204)
def delete_product(
    product_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_admin: Profile = Depends(get_current_admin),
):
    product = (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    db.delete(product)
    db.commit()