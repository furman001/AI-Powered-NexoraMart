from uuid import UUID


from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session, selectinload


from app.api.v1.dependencies import get_current_admin
from app.core.database import get_db
from app.models.product import Product
from app.models.review import ProductReview
from app.schemas.review import ReviewCreate, ReviewResponse



router = APIRouter(
    prefix="/products",
    tags=["Reviews"],
)




@router.get(
    "/{product_id}/reviews",
    response_model=list[ReviewResponse],
)
def get_product_reviews(
    product_id: UUID,
    db: Session = Depends(get_db),
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


    reviews = (
        db.query(ProductReview)
        .filter(
            ProductReview.product_id == product_id,
            ProductReview.is_approved == True,
        )
        .order_by(ProductReview.created_at.desc())
        .all()
    )


    return reviews




@router.post(
    "/{product_id}/reviews",
    response_model=ReviewResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_product_review(
    product_id: UUID,
    review_data: ReviewCreate,
    db: Session = Depends(get_db),
):
    if not review_data.customer_name.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Customer name is required",
        )


    if review_data.rating < 1 or review_data.rating > 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Rating must be between 1 and 5",
        )


    product = (
        db.query(Product)
        .filter(
            Product.id == product_id,
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


    existing_review = (
        db.query(ProductReview)
        .filter(
            ProductReview.product_id == product_id,
            func.lower(ProductReview.customer_name)
            == review_data.customer_name.strip().lower(),
        )
        .first()
    )


    if existing_review:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already reviewed this product",
        )


    review = ProductReview(
        product_id=product_id,
        customer_name=review_data.customer_name.strip(),
        rating=review_data.rating,
        comment=review_data.comment.strip()
        if review_data.comment
        else None,
        is_approved=False,
    )


    db.add(review)
    db.commit()
    db.refresh(review)


    return review




@router.get(
    "/admin/reviews",
    response_model=list[ReviewResponse],
)
def get_all_reviews(
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    reviews = (
        db.query(ProductReview)
        .options(
            selectinload(ProductReview.product)
        )
        .order_by(ProductReview.created_at.desc())
        .all()
    )


    return reviews




@router.patch(
    "/admin/reviews/{review_id}/approve",
    response_model=ReviewResponse,
)
def approve_review(
    review_id: UUID,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    review = (
        db.query(ProductReview)
        .filter(ProductReview.id == review_id)
        .first()
    )


    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found",
        )


    review.is_approved = True


    db.commit()
    db.refresh(review)


    return review




@router.patch(
    "/admin/reviews/{review_id}/hide",
    response_model=ReviewResponse,
)
def hide_review(
    review_id: UUID,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    review = (
        db.query(ProductReview)
        .filter(ProductReview.id == review_id)
        .first()
    )


    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found",
        )


    review.is_approved = False


    db.commit()
    db.refresh(review)


    return review




@router.delete(
    "/admin/reviews/{review_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_review(
    review_id: UUID,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    review = (
        db.query(ProductReview)
        .filter(ProductReview.id == review_id)
        .first()
    )


    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found",
        )


    db.delete(review)
    db.commit()


    return None