from typing import List

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db

router = APIRouter(
    prefix="/orders-full",
    tags=["Full Order"],
)


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.OrderFullOut)
async def create_full_order(order_full: schemas.OrderFullCreate, db: Session = Depends(get_db)):
    """
    Create a full order. By full order, we mean an order with the order records.
    """
    if len(order_full.item_ids) != len(order_full.quantities):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Item ids and quantities must be of the same length"
        )

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
    for item_id, quantity in zip(order_full.item_ids, order_full.quantities):
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

    # access the user of the order
    # print(order.user.email)
    return order


@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_full_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Order not found"
        )

    # TODO: it might already be deleted by the cascade so not sure if this is necessary

    order_records = db.query(models.OrderRecord).filter(models.OrderRecord.order_id == order_id).all()
    for order_record in order_records:
        db.delete(order_record)
        db.commit()

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
