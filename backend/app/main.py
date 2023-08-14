from enum import Enum

from fastapi import Depends, FastAPI, HTTPException, Response, status
from sqlalchemy.orm import Session

from . import models, schemas
from .database import engine, get_db
from .hasher import HashGenerator

# create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()


@app.get('/')
def index():
    return {"Hello": "World"}

 
@app.get('/sqlalchemy')
async def sqlalchemy(db: Session = Depends(get_db)):
    return {"status": "ok"}


# USERS
@app.post("/users/", status_code = status.HTTP_201_CREATED)
async def create_user(user: schemas.UserBase, db: Session = Depends(get_db)) -> schemas.UserBase:
    # hash password
    user.password = HashGenerator.get_password_hash(user.password)
    # create user
    new_user = models.User(**user.model_dump())
    db.add(new_user)
    db.commit()
    return new_user


@app.get("/users/{user_id}", status_code = status.HTTP_200_OK)
async def get_user(user_id: str, db: Session = Depends(get_db)) -> schemas.User:
    # retrieve user from database
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user
