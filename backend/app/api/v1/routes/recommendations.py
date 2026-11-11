from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session, selectinload

from app.core.database import get_db
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.schemas.product import ProductResponse



router = APIRouter(
    prefix="/recommendations",
    tags=["Recommendations"],
)



@router.get(
    "/products/{product_id}/frequently-bought-together",
    response_model=list[ProductResponse],
)
def get_frequently_bought_together(
    product_id: UUID,
    limit: int = 4,
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

    orders_with_product = (
        db.query(OrderItem.order_id)
        .filter(OrderItem.product_id == product_id)
        .subquery()
    )

    recommendations = (
        db.query(
            Product,
            func.count(OrderItem.id).label("purchase_count"),
        )
        .join(
            OrderItem,
            OrderItem.product_id == Product.id,
        )
        .join(
            Order,
            Order.id == OrderItem.order_id,
        )
        .filter(
            OrderItem.order_id.in_(
                db.query(OrderItem.order_id).filter(
                    OrderItem.product_id == product_id
                )
            )
        )
        .filter(Product.id != product_id)
        .filter(Product.status == "published")
        .filter(Product.is_active == True)
        .group_by(Product.id)
        .order_by(func.count(OrderItem.id).desc())
        .limit(limit)
        .all()
    )

    return [item[0] for item in recommendations]