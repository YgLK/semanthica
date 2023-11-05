from fastapi import FastAPI

from . import models
from .database import engine
from .routers import address, item, order, order_record, full_order, review, user, search, register

from app.logging import LogConfig
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


@app.get("/")
def index():
    return {"message": "Hello World"}


@app.get("/healthcheck", include_in_schema=False)
def healthcheck():
    return {"status": "ok"}
