from typing import List

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db

router = APIRouter(
    prefix="/reviews",
    tags=["Reviews"],
)


@router.get(
    "/{review_id}", status_code=status.HTTP_200_OK, response_model=schemas.ReviewOut
)
async def get_review(review_id: int, db: Session = Depends(get_db)):
    review = db.query(models.Review).filter(models.Review.id == review_id).first()
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Review not found"
        )
    return review


@router.post(
    "/", status_code=status.HTTP_201_CREATED, response_model=schemas.ReviewOut
)
async def create_review(review: schemas.ReviewCreate, db: Session = Depends(get_db)):
    item = db.query(models.Item).filter(models.Item.id == review.item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Item not found"
        )
    user = db.query(models.User).filter(models.User.id == review.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    new_review = models.Review(**review.model_dump())
    db.add(new_review)
    db.commit()
    db.refresh(new_review)
    return new_review


@router.put(
    "/{review_id}", status_code=status.HTTP_200_OK, response_model=schemas.ReviewOut
)
async def update_review(
    review_id: int,
    review_updated: schemas.ReviewUpdate,
    db: Session = Depends(get_db),
):
    review = db.query(models.Review).filter(models.Review.id == review_id).first()

    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Review not found"
        )

    for attr, value in review_updated.dict().items():
        if value is not None:
            setattr(review, attr, value)

    db.commit()
    db.refresh(review)
    return review


@router.delete("/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_review(review_id: int, db: Session = Depends(get_db)):
    review = db.query(models.Review).filter(models.Review.id == review_id).first()
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Review not found"
        )
    db.delete(review)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get(
    "/", status_code=status.HTTP_200_OK, response_model=List[schemas.ReviewOut]
)
async def get_all_reviews(db: Session = Depends(get_db)):
    return db.query(models.Review).all()
