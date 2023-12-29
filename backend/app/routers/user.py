from typing import List

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from .. import models, schemas, utils
from ..database import get_db

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.UserOut)
async def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # hash password
    user.password = utils.PasswordHasher.get_password_hash(user.password)
    # create user
    new_user = models.User(**user.model_dump())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.get(
    "/{user_id}", status_code=status.HTTP_200_OK, response_model=schemas.UserOut
)
async def get_user(user_id: str, db: Session = Depends(get_db)):  # -> schemas.User:
    # retrieve user from database
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    return user


@router.put(
    "/{user_id}", status_code=status.HTTP_200_OK, response_model=schemas.UserOut
)
async def update_user(
        user_id: str, user_updated: schemas.UserUpdate, db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    # Update only the fields that are provided in the user_updated object
    for attr, value in user_updated.model_dump().items():
        if value is not None and attr != "password":
            setattr(user, attr, value)

    if password := user_updated.password:
        user.password = utils.PasswordHasher.get_password_hash(password)

    db.commit()
    db.refresh(user)
    return user


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    db.delete(user)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/", status_code=status.HTTP_200_OK, response_model=List[schemas.UserOut])
async def get_all_users(db: Session = Depends(get_db)):
    # retrieve all users from database
    return db.query(models.User).all()
