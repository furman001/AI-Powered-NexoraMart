from uuid import UUID


from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func
from sqlalchemy.orm import Session


from app.core.database import get_db
from app.models.product import Product
from app.models.review import ProductReview
from app.schemas.product import ProductResponse



router = APIRouter(
    prefix="/catalog",
    tags=["Catalog"],
)



@router.get("/products", response_model=list[ProductResponse])
def get_public_products(
    search: str | None = None,
    category_id: UUID | None = None,
    min_price: float | None = Query(default=None, ge=0),
    max_price: float | None = Query(default=None, ge=0),
    in_stock_only: bool = True,
    sort: str = Query(
        default="newest",
        pattern="^(newest|oldest|price_low_to_high|price_high_to_low|rating_high_to_low)$",
    ),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=12, ge=1, le=50),
    db: Session = Depends(get_db),
):
    average_rating = (
        func.coalesce(func.avg(ProductReview.rating), 0)
    ).label("average_rating")


    review_count = (
        func.count(ProductReview.id)
    ).label("review_count")


    query = (
        db.query(
            Product,
            average_rating,
            review_count,
        )
        .outerjoin(
            ProductReview,
            ProductReview.product_id == Product.id,
        )
        .filter(
            Product.status == "published",
            Product.is_active == True,
        )
        .group_by(Product.id)
    )


    if in_stock_only:
        query = query.filter(Product.stock > 0)


    if search:
        search_term = f"%{search.lower()}%"
        query = query.filter(
            Product.name.ilike(search_term)
            | Product.description.ilike(search_term)
        )


    if category_id:
        query = query.filter(
            Product.category_id == category_id
        )


    if min_price is not None:
        query = query.filter(Product.price >= min_price)


    if max_price is not None:
        query = query.filter(Product.price <= max_price)


    if sort == "newest":
        query = query.order_by(Product.created_at.desc())
    elif sort == "oldest":
        query = query.order_by(Product.created_at.asc())
    elif sort == "price_low_to_high":
        query = query.order_by(Product.price.asc())
    elif sort == "price_high_to_low":
        query = query.order_by(Product.price.desc())
    elif sort == "rating_high_to_low":
        query = query.order_by(average_rating.desc())
    else:
        query = query.order_by(Product.created_at.desc())


    offset = (page - 1) * limit


    results = query.offset(offset).limit(limit).all()


    products = []


    for product, rating, count in results:
        product.average_rating = round(float(rating), 1)
        product.review_count = count
        products.append(product)


    return products



@router.get("/products/count", response_model=int)
def get_public_products_count(
    search: str | None = None,
    category_id: UUID | None = None,
    min_price: float | None = Query(default=None, ge=0),
    max_price: float | None = Query(default=None, ge=0),
    in_stock_only: bool = True,
    db: Session = Depends(get_db),
):
    query = (
        db.query(func.count(Product.id))
        .filter(
            Product.status == "published",
            Product.is_active == True,
        )
    )


    if in_stock_only:
        query = query.filter(Product.stock > 0)


    if search:
        search_term = f"%{search.lower()}%"
        query = query.filter(
            Product.name.ilike(search_term)
            | Product.description.ilike(search_term)
        )


    if category_id:
        query = query.filter(
            Product.category_id == category_id
        )


    if min_price is not None:
        query = query.filter(Product.price >= min_price)


    if max_price is not None:
        query = query.filter(Product.price <= max_price)


    total = query.scalar()


    return int(total or 0)



@router.get("/products/{slug}", response_model=ProductResponse)
def get_public_product(
    slug: str,
    db: Session = Depends(get_db),
):
    product = (
        db.query(Product)
        .filter(
            Product.slug == slug,
            Product.status == "published",
            Product.is_active == True,
        )
        .first()
    )


    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )


    review_stats = (
        db.query(
            func.coalesce(func.avg(ProductReview.rating), 0),
            func.count(ProductReview.id),
        )
        .filter(ProductReview.product_id == product.id)
        .first()
    )


    average_rating, review_count = review_stats


    product.average_rating = round(float(average_rating), 1)
    product.review_count = review_count


    return product



@router.get(
    "/products/{slug}/related",
    response_model=list[ProductResponse],
)
def get_related_products(
    slug: str,
    db: Session = Depends(get_db),
):
    product = (
        db.query(Product)
        .filter(
            Product.slug == slug,
            Product.status == "published",
            Product.is_active == True,
        )
        .first()
    )


    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )


    related_products = (
        db.query(Product)
        .filter(
            Product.category_id == product.category_id,
            Product.id != product.id,
            Product.status == "published",
            Product.is_active == True,
        )
        .order_by(Product.created_at.desc())
        .limit(4)
        .all()
    )


    for related_product in related_products:
        related_product.average_rating = 0
        related_product.review_count = 0


    return related_products