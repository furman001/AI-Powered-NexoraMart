from datetime import datetime, timedelta
from decimal import Decimal


from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session, selectinload


from app.api.v1.dependencies import get_current_admin
from app.core.database import get_db
from app.models.category import Category
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.models.profile import Profile
from app.schemas.order import OrderResponse
from app.schemas.product import ProductResponse



router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"],
    dependencies=[Depends(get_current_admin)],
)




@router.get("/sales-overview")
def get_sales_overview(
    db: Session = Depends(get_db),
    current_admin: Profile = Depends(get_current_admin),
):
    total_revenue = (
        db.query(
            func.coalesce(func.sum(Order.total_amount), 0)
        )
        .filter(Order.status != "cancelled")
        .scalar()
    )


    total_orders = (
        db.query(func.count(Order.id))
        .filter(Order.status != "cancelled")
        .scalar()
    )


    average_order_value = (
        float(total_revenue or 0) / total_orders
        if total_orders
        else 0
    )


    status_rows = (
        db.query(
            Order.status,
            func.count(Order.id).label("order_count"),
            func.coalesce(
                func.sum(Order.total_amount),
                0,
            ).label("revenue"),
        )
        .group_by(Order.status)
        .all()
    )


    status_breakdown = {
        row.status: {
            "orders": int(row.order_count),
            "revenue": float(row.revenue or 0),
        }
        for row in status_rows
    }


    today = datetime.utcnow().replace(
        hour=0,
        minute=0,
        second=0,
        microsecond=0,
    )


    revenue_trend = []


    for day_offset in range(6, -1, -1):
        day_start = today - timedelta(days=day_offset)
        day_end = day_start + timedelta(days=1)


        day_revenue = (
            db.query(
                func.coalesce(
                    func.sum(Order.total_amount),
                    0,
                )
            )
            .filter(
                Order.created_at >= day_start,
                Order.created_at < day_end,
                Order.status != "cancelled",
            )
            .scalar()
        )


        revenue_trend.append(
            {
                "date": day_start.strftime("%Y-%m-%d"),
                "revenue": float(day_revenue or 0),
            }
        )


    top_products = (
        db.query(
            Product.name.label("product_name"),
            func.coalesce(
                func.sum(OrderItem.quantity),
                0,
            ).label("quantity_sold"),
            func.coalesce(
                func.sum(OrderItem.total_price),
                0,
            ).label("revenue"),
        )
        .join(
            OrderItem,
            OrderItem.product_id == Product.id,
        )
        .join(
            Order,
            Order.id == OrderItem.order_id,
        )
        .filter(Order.status != "cancelled")
        .group_by(Product.id, Product.name)
        .order_by(
            func.sum(OrderItem.total_price).desc()
        )
        .limit(5)
        .all()
    )


    return {
        "total_revenue": float(total_revenue or 0),
        "total_orders": int(total_orders or 0),
        "average_order_value": round(
            average_order_value,
            2,
        ),
        "status_breakdown": status_breakdown,
        "revenue_trend": revenue_trend,
        "top_products": [
            {
                "product_name": row.product_name,
                "quantity_sold": int(row.quantity_sold or 0),
                "revenue": float(row.revenue or 0),
            }
            for row in top_products
        ],
    }




@router.get("/summary")
def get_analytics_summary(
    db: Session = Depends(get_db),
    current_admin: Profile = Depends(get_current_admin),
):
    total_sales = (
        db.query(
            func.coalesce(
                func.sum(OrderItem.total_price),
                0,
            )
        )
        .scalar()
    )


    total_cost = (
        db.query(
            func.coalesce(
                func.sum(
                    OrderItem.quantity * Product.cost_price
                ),
                0,
            )
        )
        .join(
            Product,
            Product.id == OrderItem.product_id,
        )
        .scalar()
    )


    total_profit = (
        float(total_sales) - float(total_cost)
    )


    category_stats = (
        db.query(
            Category.name.label("category_name"),
            func.count(Product.id).label("product_count"),
        )
        .outerjoin(
            Product,
            Product.category_id == Category.id,
        )
        .group_by(Category.id, Category.name)
        .order_by(func.count(Product.id).desc())
        .all()
    )


    product_sales = (
        db.query(
            Product.name.label("product_name"),
            func.coalesce(
                func.sum(OrderItem.quantity),
                0,
            ).label("quantity_sold"),
            func.coalesce(
                func.sum(OrderItem.total_price),
                0,
            ).label("sales"),
        )
        .outerjoin(
            OrderItem,
            OrderItem.product_id == Product.id,
        )
        .group_by(Product.id, Product.name)
        .order_by(
            func.sum(OrderItem.total_price).desc()
        )
        .limit(10)
        .all()
    )


    return {
        "total_sales": float(total_sales),
        "total_cost": float(total_cost),
        "total_profit": total_profit,
        "category_stats": [
            {
                "category_name": row.category_name,
                "product_count": row.product_count,
            }
            for row in category_stats
        ],
        "top_products": [
            {
                "product_name": row.product_name,
                "quantity_sold": int(row.quantity_sold),
                "sales": float(row.sales),
                "profit": float(row.sales)
                - (
                    int(row.quantity_sold)
                    * float(
                        db.query(Product.cost_price)
                        .filter(
                            Product.name
                            == row.product_name
                        )
                        .scalar()
                        or 0
                    )
                ),
            }
            for row in product_sales
        ],
    }




@router.get(
    "/recent-orders",
    response_model=list[OrderResponse],
)
def get_recent_orders(
    db: Session = Depends(get_db),
    current_admin: Profile = Depends(get_current_admin),
):
    recent_orders = (
        db.query(Order)
        .options(selectinload(Order.items))
        .order_by(Order.created_at.desc())
        .limit(5)
        .all()
    )


    return recent_orders




@router.get(
    "/low-stock-products",
    response_model=list[ProductResponse],
)
def get_low_stock_products(
    db: Session = Depends(get_db),
    current_admin: Profile = Depends(get_current_admin),
):
    low_stock_products = (
        db.query(Product)
        .filter(Product.stock <= 5)
        .order_by(Product.stock.asc())
        .limit(10)
        .all()
    )


    return low_stock_products