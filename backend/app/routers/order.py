from typing import List

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db

router = APIRouter(
    prefix="/orders",
    tags=["Orders"],
)


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
