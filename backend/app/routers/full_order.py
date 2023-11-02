from typing import List

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db
from app.routers.order_record import find_item

router = APIRouter(
    prefix="/orders-full",
    tags=["Full Order"],
)


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.OrderFullOut)
async def create_full_order(order_full: schemas.OrderFullCreate, db: Session = Depends(get_db)):
    """
    Create a full order. By full order, we mean an order with the order records.
    """
    # Check if the user with the provided user_id exists
    user = db.query(models.User).filter(models.User.id == order_full.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    # Create the order
    new_order = models.Order(user_id=order_full.user_id)

    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    # Create the order records
    order_records = []
    for order_record in order_full.order_records:
        item_id, quantity = order_record.item_id, order_record.quantity
        item = find_item(db, item_id)
        try:
            item.update_stock(quantity)
        except ValueError as e:
            # rollback the stock updates and created order records
            db.rollback()
            # delete the invalid order
            db.delete(new_order)
            db.commit()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Provided quantity ({quantity}) is invalid. "
                       + f"Available: {item.stock_quantity}",
            )
        order_record = models.OrderRecord(
            order_id=new_order.id,
            item_id=item_id,
            quantity=quantity
        )

        db.add(order_record)
        db.commit()
        db.refresh(order_record)
        order_records.append(order_record)

    new_order.order_records = order_records
    return new_order


@router.get(
    "/{order_id}", status_code=status.HTTP_200_OK, response_model=schemas.OrderFullOut
)
async def get_full_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Order not found"
        )
    order_records = db.query(models.OrderRecord).filter(models.OrderRecord.order_id == order_id).all()
    order.order_records = order_records
    return order


@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_full_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Order not found"
        )
    db.delete(order)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get(
    "/", status_code=status.HTTP_200_OK, response_model=List[schemas.OrderFullOut]
)
async def get_all_full_order(db: Session = Depends(get_db)):
    orders = db.query(models.Order).all()
    for order in orders:
        order_records = db.query(models.OrderRecord).filter(models.OrderRecord.order_id == order.id).all()
        order.order_records = order_records
    return orders
