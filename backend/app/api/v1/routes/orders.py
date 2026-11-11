import csv
import io
import uuid
from decimal import Decimal
from uuid import UUID


from fastapi import (
    APIRouter,
    BackgroundTasks,
    Depends,
    HTTPException,
    status,
)
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import (
    Session,
    selectinload,
)


from app.api.v1.dependencies import get_current_admin
from app.core.database import get_db
from app.models.order import (
    Order,
    OrderItem,
    OrderStatusHistory,
)
from app.models.product import Product
from app.models.profile import Profile
from app.schemas.order import (
    OrderCreate,
    OrderResponse,
    OrderStatusHistoryResponse,
    OrderStatusUpdate,
)
from app.utils.email import send_order_status_email




router = APIRouter(
    prefix="/orders",
    tags=["Orders"],
)




FREE_DELIVERY_LIMIT = Decimal("5000.00")
STANDARD_DELIVERY_FEE = Decimal("250.00")




@router.post(
    "/",
    response_model=OrderResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_order(
    order_data: OrderCreate,
    db: Session = Depends(get_db),
):
    if not order_data.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order must contain at least one item",
        )


    product_ids = [
        item.product_id for item in order_data.items
    ]


    products = (
        db.query(Product)
        .filter(Product.id.in_(product_ids))
        .all()
    )


    products_by_id = {
        product.id: product for product in products
    }


    subtotal = Decimal("0.00")
    tax_amount = Decimal("0.00")
    discount_amount = Decimal("0.00")


    order_items = []


    for item_data in order_data.items:
        product = products_by_id.get(item_data.product_id)


        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found",
            )


        if (
            product.status != "published"
            or not product.is_active
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Product is not available: {product.name}",
            )


        if product.stock < item_data.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient stock for {product.name}",
            )


        unit_price = Decimal(str(product.price))
        item_total = unit_price * item_data.quantity


        order_items.append(
            OrderItem(
                product_id=product.id,
                product_name=product.name,
                quantity=item_data.quantity,
                unit_price=unit_price,
                total_price=item_total,
            )
        )


        subtotal += item_total
        product.stock -= item_data.quantity


    shipping_fee = (
        Decimal("0.00")
        if subtotal >= FREE_DELIVERY_LIMIT
        else STANDARD_DELIVERY_FEE
    )


    total_amount = (
        subtotal
        + shipping_fee
        + tax_amount
        - discount_amount
    )


    order = Order(
        customer_name=order_data.customer_name,
        customer_phone=order_data.customer_phone,
        customer_email=order_data.customer_email,
        shipping_address=order_data.shipping_address,
        shipping_city=order_data.shipping_city,
        subtotal=subtotal,
        shipping_fee=shipping_fee,
        tax_amount=tax_amount,
        discount_amount=discount_amount,
        total_amount=total_amount,
        status="pending",
        payment_status="unpaid",
        payment_method="cash_on_delivery",
        items=order_items,
    )


    db.add(order)
    db.commit()
    db.refresh(order)


    return order




@router.get(
    "/",
    response_model=list[OrderResponse],
)
def get_orders(
    db: Session = Depends(get_db),
    current_admin: Profile = Depends(get_current_admin),
):
    orders = (
        db.query(Order)
        .options(selectinload(Order.items))
        .order_by(Order.created_at.desc())
        .all()
    )


    return orders




@router.get(
    "/track/{order_id}",
)
def track_order_public(
    order_id: UUID,
    db: Session = Depends(get_db),
):
    order = (
        db.query(Order)
        .options(selectinload(Order.items))
        .filter(Order.id == order_id)
        .first()
    )


    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )


    return {
        "id": str(order.id),
        "status": order.status,
        "total_amount": order.total_amount,
        "items": [
            {
                "id": item.id,
                "product_name": item.product_name,
                "quantity": item.quantity,
                "unit_price": item.unit_price,
                "total_price": item.total_price,
            }
            for item in order.items
        ],
    }




@router.get(
    "/track",
    response_model=OrderResponse,
)
def track_order(
    order_id: UUID,
    phone: str,
    db: Session = Depends(get_db),
):
    order = (
        db.query(Order)
        .options(selectinload(Order.items))
        .filter(
            Order.id == order_id,
            Order.customer_phone == phone,
        )
        .first()
    )


    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No order found for this order ID and phone number",
        )


    return order




@router.get(
    "/customer/{phone}",
)
def get_customer_orders(
    phone: str,
    db: Session = Depends(get_db),
):
    orders = (
        db.query(Order)
        .options(selectinload(Order.items))
        .filter(Order.customer_phone == phone)
        .order_by(Order.created_at.desc())
        .all()
    )


    return [
        {
            "id": str(order.id),
            "status": order.status,
            "total_amount": order.total_amount,
            "created_at": order.created_at,
            "items": [
                {
                    "id": item.id,
                    "product_name": item.product_name,
                    "quantity": item.quantity,
                    "total_price": item.total_price,
                }
                for item in order.items
            ],
        }
        for order in orders
    ]




@router.patch(
    "/customer/{order_id}/cancel",
)
def cancel_customer_order(
    order_id: UUID,
    phone_data: dict,
    db: Session = Depends(get_db),
):
    customer_phone = phone_data.get("customer_phone")


    if not customer_phone:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Customer phone number is required",
        )


    order = (
        db.query(Order)
        .filter(
            Order.id == order_id,
            Order.customer_phone == customer_phone,
        )
        .first()
    )


    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )


    if order.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only pending orders can be cancelled",
        )


    order.status = "cancelled"


    for item in order.items:
        product = (
            db.query(Product)
            .filter(Product.id == item.product_id)
            .first()
        )


        if product:
            product.stock += item.quantity


    db.commit()
    db.refresh(order)


    return {
        "id": str(order.id),
        "status": order.status,
        "message": "Order cancelled successfully",
    }




@router.get(
    "/{order_id}",
    response_model=OrderResponse,
)
def get_order(
    order_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_admin: Profile = Depends(get_current_admin),
):
    order = (
        db.query(Order)
        .options(selectinload(Order.items))
        .filter(Order.id == order_id)
        .first()
    )


    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )


    return order




@router.patch(
    "/{order_id}/status",
    response_model=OrderResponse,
)
def update_order_status(
    order_id: uuid.UUID,
    status_data: OrderStatusUpdate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_admin: Profile = Depends(get_current_admin),
):
    order = (
        db.query(Order)
        .options(selectinload(Order.items))
        .filter(Order.id == order_id)
        .first()
    )


    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )


    previous_status = order.status
    new_status = status_data.status.value


    if previous_status == new_status:
        return order


    order.status = new_status


    status_history = OrderStatusHistory(
        order_id=order.id,
        previous_status=previous_status,
        new_status=new_status,
        changed_by=current_admin.email,
    )


    db.add(status_history)
    db.commit()
    db.refresh(order)


    if order.customer_email:
        background_tasks.add_task(
            send_order_status_email,
            order.customer_email,
            order.customer_name,
            str(order.id),
            order.status,
        )


    return order




@router.get(
    "/{order_id}/status-history",
    response_model=list[OrderStatusHistoryResponse],
)
def get_order_status_history(
    order_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_admin: Profile = Depends(get_current_admin),
):
    history = (
        db.query(OrderStatusHistory)
        .filter(
            OrderStatusHistory.order_id == order_id
        )
        .order_by(
            OrderStatusHistory.created_at.desc()
        )
        .all()
    )


    return history




@router.get(
    "/export/csv",
    response_class=StreamingResponse,
)
def export_orders_csv(
    db: Session = Depends(get_db),
    current_admin: Profile = Depends(get_current_admin),
):
    orders = (
        db.query(Order)
        .options(selectinload(Order.items))
        .order_by(Order.created_at.desc())
        .all()
    )


    output = io.StringIO()
    writer = csv.writer(output)


    writer.writerow(
        [
            "Order ID",
            "Customer Name",
            "Customer Phone",
            "Shipping Address",
            "Shipping City",
            "Subtotal",
            "Shipping Fee",
            "Tax",
            "Discount",
            "Total",
            "Status",
            "Payment Status",
            "Payment Method",
            "Created At",
        ]
    )


    for order in orders:
        writer.writerow(
            [
                str(order.id),
                order.customer_name,
                order.customer_phone,
                order.shipping_address,
                order.shipping_city,
                str(order.subtotal),
                str(order.shipping_fee),
                str(order.tax_amount),
                str(order.discount_amount),
                str(order.total_amount),
                order.status,
                order.payment_status,
                order.payment_method,
                order.created_at.isoformat(),
            ]
        )


    output.seek(0)


    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={
            "Content-Disposition": "attachment; filename=nexoramart-orders.csv"
        },
    )