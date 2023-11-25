from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db

router = APIRouter(
    prefix="/order-records",
    tags=["Order Records"],
)


def find_order_record(db: Session, order_id: int, item_id: int):
    order_record = (
        db.query(models.OrderRecord)
        .filter(
            models.OrderRecord.order_id == order_id,
            models.OrderRecord.item_id == item_id,
        )
        .first()
    )
    if not order_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Order record not found"
        )
    return order_record


def find_item(db: Session, item_id: int):
    item = db.query(models.Item).filter(models.Item.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Item not found"
        )
    return item


def find_order(db: Session, order_id: int):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Order not found"
        )
    return order


def is_order_record_duplicated(
    db: Session, order_id: int, item_id: int
) -> bool:
    try:
        find_order_record(db, order_id, item_id)
    except HTTPException as e:
        if e.status_code != status.HTTP_404_NOT_FOUND:
            raise e  # Reraise if there's another error
        return False  # No duplicate, continue with order record creation
    else:
        # found duplicate
        return True


@router.get(
    "/", status_code=status.HTTP_200_OK, response_model=List[schemas.OrderRecordOut]
)
async def get_all_order_records(db: Session = Depends(get_db)):
    return db.query(models.OrderRecord).all()


@router.post(
    "/", status_code=status.HTTP_201_CREATED, response_model=schemas.OrderRecordOut
)
async def create_order_record(
    record: schemas.OrderRecordCreate, db: Session = Depends(get_db)
):
    # check if the item exists
    item = find_item(db, record.item_id)
    # check if the order exists
    find_order(db, record.order_id)

    # check if the order record already exists
    if is_order_record_duplicated(db, record.order_id, record.item_id):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An order record with the same item_id and order_id already exists.",
        )

    # check the available quantity of the item
    if record.quantity > item.stock_quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Quantity is greater than the available quantity. "
            + f"Available: {item.stock_quantity}",
        )
    # update the quantity of the item
    item.stock_quantity -= record.quantity
    new_order_record = models.OrderRecord(**record.model_dump())
    db.add(new_order_record)
    db.commit()
    db.refresh(new_order_record)
    return new_order_record


@router.get("/", status_code=status.HTTP_200_OK, response_model=schemas.OrderRecordOut)
async def get_order_record(order_id: int, item_id: int, db: Session = Depends(get_db)):
    return find_order_record(db, order_id, item_id)


@router.put(
    "/",
    status_code=status.HTTP_200_OK,
    response_model=schemas.OrderRecordOut,
)
async def update_order_record(
    order_id: int,
    item_id: int,
    record_update: schemas.OrderRecordUpdate,
    db: Session = Depends(get_db),
):
    order_record = find_order_record(db, order_id, item_id)
    item = find_item(db, order_record.item_id)

    # change item of the order record
    if record_update.item_id:
        target_item = find_item(db, record_update.item_id)

        item.stock_quantity += order_record.quantity
        order_record.item_id = record_update.item_id

        if record_update.quantity:
            if record_update.quantity > target_item.stock_quantity:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Quantity is greater than the available quantity. "
                    + f"Available: {target_item.stock_quantity}",
                )
            target_item.stock_quantity -= record_update.quantity
            order_record.quantity = record_update.quantity
        else:
            target_item.stock_quantity -= order_record.quantity
    # change only the quantity of the order record
    elif record_update.quantity:
        item.stock_quantity += order_record.quantity
        # for logging
        curr_available_items = item.stock_quantity
        item.stock_quantity -= record_update.quantity

        if item.stock_quantity < 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Quantity is greater than the available quantity. "
                + f"Available: {curr_available_items}",
            )

        order_record.quantity = record_update.quantity

    # update the order
    if (
        record_update.order_id is not None
        and record_update.order_id != order_record.order_id
    ):
        # check if the order exists
        _ = find_order(db, record_update.order_id)
        order_record.order_id = record_update.order_id

    db.commit()
    db.refresh(order_record)
    return order_record


@router.delete("/", status_code=status.HTTP_204_NO_CONTENT)
async def delete_order_record(
    order_id: int, item_id: int, db: Session = Depends(get_db)
):
    order_record = find_order_record(db, order_id, item_id)
    # return the quantity of the item to the stock
    item = find_item(db, order_record.item_id)
    item.stock_quantity += order_record.quantity

    db.delete(order_record)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
