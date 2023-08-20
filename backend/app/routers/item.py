from typing import List

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db

router = APIRouter(
    prefix="/items",
    tags=["Items"],
)


@router.post(
    "/", status_code=status.HTTP_201_CREATED, response_model=schemas.ItemOut
)
async def create_item(item: schemas.ItemCreate, db: Session = Depends(get_db)):
    new_item = models.Item(**item.model_dump())
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item


@router.get(
    "/{item_id}", status_code=status.HTTP_200_OK, response_model=schemas.ItemOut
)
async def get_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(models.Item).filter(models.Item.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Item not found"
        )
    return item


@router.put(
    "/{item_id}", status_code=status.HTTP_200_OK, response_model=schemas.ItemOut
)
async def update_item(
    item_id: int,
    item_updated: schemas.ItemUpdate,
    db: Session = Depends(get_db),
):
    item = db.query(models.Item).filter(models.Item.id == item_id).first()

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Item not found"
        )

    for attr, value in item_updated.model_dump().items():
        if value is not None:
            setattr(item, attr, value)

    db.commit()
    db.refresh(item)
    return item


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(models.Item).filter(models.Item.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Item not found"
        )
    db.delete(item)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get(
    "/", status_code=status.HTTP_200_OK, response_model=List[schemas.ItemOut]
)
async def get_all_items(db: Session = Depends(get_db)):
    return db.query(models.Item).all()
