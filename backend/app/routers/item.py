from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Response, status, Query
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..semantic_search import vector_client, QDRANT_COLLECTION_NAME

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

    # add item to  vector db
    _ = vector_client.index_item(QDRANT_COLLECTION_NAME, new_item.id, new_item.name, new_item.image_url)

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

    # update vector db
    if item_updated.name is not None or item_updated.image_url is not None:
        name = item_updated.name if item_updated.name is not None else item.name
        image_url = item_updated.image_url if item_updated.image_url is not None else item.image_url
        _ = vector_client.index_item(QDRANT_COLLECTION_NAME, item.id, name, image_url)

    # commit after vector db update to ensure consistency
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

    # delete from vector db
    _ = vector_client.delete_item(QDRANT_COLLECTION_NAME, item.id)

    db.delete(item)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get(
    "/", status_code=status.HTTP_200_OK, response_model=List[schemas.ItemOut]
)
async def get_items(
        page: Optional[int] = Query(1, description="Page number", gt=0),
        items_per_page: Optional[int] = Query(10, description="Items per page", gt=0),
        db: Session = Depends(get_db)
):
    # Calculate the offset based on the page and items_per_page values
    offset = (page - 1) * items_per_page if page and items_per_page else 0

    # Query the database with pagination
    items = (
        db.query(models.Item)
        .filter(models.Item.is_deleted == False)
        .offset(offset).limit(items_per_page).all()
    )

    return items


@router.get(
    "/{item_id}/reviews", status_code=status.HTTP_200_OK, response_model=List[schemas.ItemReviewsOut]
)
async def get_item_reviews(item_id: int, db: Session = Depends(get_db)):
    item = db.query(models.Item).filter(models.Item.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Item not found"
        )
    reviews = db.query(models.Review).filter(models.Review.item_id == item_id).all()

    # find username for each review
    for review in reviews:
        user = db.query(models.User).filter(models.User.id == review.user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
            )
        review.username = user.username

    return reviews
