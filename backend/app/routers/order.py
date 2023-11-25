from typing import List

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db

router = APIRouter(
    prefix="/orders",
    tags=["Orders"],
)


@router.get("/history/{user_id}", status_code=status.HTTP_200_OK)
async def get_all_orders(user_id: int, db: Session = Depends(get_db)):
    """Get order history for frontend since its easier to process it here..."""

    # TODO: Retrieve user id from token instead of the request body (security issue)
    #       as anybody can send a request with any user id

    orders = db.query(models.Order).filter(models.Order.user_id == user_id).all()
    # for all orders add the "order_records" attribute which will contain the name, id, price and quantity of each item
    for order in orders:
        order_records = db.query(models.OrderRecord).filter(models.OrderRecord.order_id == order.id).all()
        order.order_records = order_records
        # retrieve item name and price
        for order_record in order_records:
            item = db.query(models.Item).filter(models.Item.id == order_record.item_id).first()
            order_record.item_name = item.name
            order_record.item_price = item.price
    return orders


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.OrderOut)
async def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    # Check if the user with the provided user_id exists
    user = db.query(models.User).filter(models.User.id == order.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    new_order = models.Order(**order.model_dump())
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    return new_order


@router.get(
    "/{order_id}", status_code=status.HTTP_200_OK, response_model=schemas.OrderOut
)
async def get_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Order not found"
        )
    # access the user of the order
    # print(order.user.email)
    return order


@router.put(
    "/{order_id}", status_code=status.HTTP_200_OK, response_model=schemas.OrderOut
)
async def update_order(
        order_id: int, order_updated: schemas.OrderUpdate, db: Session = Depends(get_db)
):
    print(order_updated.model_dump())
    order = db.query(models.Order).filter(models.Order.id == order_id).first()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Order not found"
        )

    for attr, value in order_updated.model_dump().items():
        if value is not None and attr != "user_id":
            setattr(order, attr, value)

    if user_id := order_updated.user_id:
        user = db.query(models.User).filter(models.User.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
            )
        order.user_id = user_id

    db.commit()
    db.refresh(order)
    return order


@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_order(order_id: int, db: Session = Depends(get_db)):
    # TODO: does order records be deleted by CASCADE? what about the product quantities, should they
    #       be added back to the stock?
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Order not found"
        )
    db.delete(order)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/", status_code=status.HTTP_200_OK, response_model=List[schemas.OrderOut])
async def get_all_orders(db: Session = Depends(get_db)):
    return db.query(models.Order).all()
