from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import models, schemas, utils
from ..database import get_db

router = APIRouter(
    prefix="/register",
    tags=["Register"],
)


@router.post(
    "/", status_code=status.HTTP_201_CREATED, response_model=schemas.UserFullOut
)
async def register_user(user: schemas.UserFullCreate, db: Session = Depends(get_db)):
    if db.query(models.User).filter(models.User.username == user.username).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Username already exists."
        )
    if db.query(models.User).filter(models.User.email == user.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Username with that email already exists."
        )

    # hash password
    user.password = utils.PasswordHasher.get_password_hash(user.password)
    # create user
    new_user = models.User(
        username=user.username,
        email=user.email,
        password=user.password,
        role=user.role,
        first_name=user.first_name,
        last_name=user.last_name,
        phone_number=user.phone_number,
    )
    # add user to db
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # add user's addresses to db
    new_addresses = []
    for address in user.addresses:
        new_address = models.Address(
            user_id=new_user.id,
            street=address.street,
            city=address.city,
            postal_code=address.postal_code,
            country=address.country
        )
        new_address.user_id = new_user.id
        db.add(new_address)
        db.commit()
        db.refresh(new_address)
        new_addresses.append(new_address)

    new_user.addresses = new_addresses
    return new_user
