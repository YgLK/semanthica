from typing import List

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db

router = APIRouter(
    prefix="/addresses",
    tags=["Addresses"],
)


@router.post(
    "/", status_code=status.HTTP_201_CREATED, response_model=schemas.AddressOut
)
async def create_address(address: schemas.AddressCreate, db: Session = Depends(get_db)):
    # Check if the user with the provided user_id exists
    user = db.query(models.User).filter(models.User.id == address.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    new_address = models.Address(**address.model_dump())
    db.add(new_address)
    db.commit()
    db.refresh(new_address)
    return new_address


@router.get(
    "/{address_id}", status_code=status.HTTP_200_OK, response_model=schemas.AddressOut
)
async def get_address(address_id: int, db: Session = Depends(get_db)):
    address = db.query(models.Address).filter(models.Address.id == address_id).first()
    if not address:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Address not found"
        )
    return address


@router.put(
    "/{address_id}", status_code=status.HTTP_200_OK, response_model=schemas.AddressOut
)
async def update_address(
    address_id: int,
    address_updated: schemas.AddressUpdate,
    db: Session = Depends(get_db),
):
    address = db.query(models.Address).filter(models.Address.id == address_id).first()

    if not address:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Address not found"
        )

    for attr, value in address_updated.model_dump().items():
        if value is not None and attr != "user_id":
            setattr(address, attr, value)

    if user_id := address_updated.user_id:
        user = db.query(models.User).filter(models.User.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
            )
        address.user_id = user_id

    db.commit()
    db.refresh(address)
    return address


@router.delete("/{address_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_address(address_id: int, db: Session = Depends(get_db)):
    address = db.query(models.Address).filter(models.Address.id == address_id).first()
    if not address:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Address not found"
        )
    db.delete(address)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get(
    "/", status_code=status.HTTP_200_OK, response_model=List[schemas.AddressOut]
)
async def get_all_addresses(db: Session = Depends(get_db)):
    return db.query(models.Address).all()
