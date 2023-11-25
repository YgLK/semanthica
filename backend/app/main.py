from fastapi import FastAPI, Depends, HTTPException
from typing import Annotated

from . import models
from .database import engine
from .routers import (address, item, order,
                      order_record, full_order,
                      review, user, search,
                      register, auth)
from app.logging import LogConfig
from app.routers.auth import get_current_user

from logging.config import dictConfig
import logging

dictConfig(LogConfig().dict())
logger = logging.getLogger("semanthica_logger")

# create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(debug=True)

app.include_router(user.router, prefix="/api")
app.include_router(address.router, prefix="/api")
app.include_router(order.router, prefix="/api")
app.include_router(item.router, prefix="/api")
app.include_router(review.router, prefix="/api")
app.include_router(order_record.router, prefix="/api")
app.include_router(search.router, prefix="/api")
app.include_router(full_order.router, prefix="/api")
app.include_router(register.router, prefix="/api")
app.include_router(auth.router, prefix="/api")


@app.get("/")
def index():
    return {"Hello": "World"}


user_dependency = Annotated[dict, Depends(get_current_user)]


@app.post("/only-for-auth-users")
async def only_for_auth_users(user: user_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return {"User": user}
