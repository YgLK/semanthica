from fastapi import FastAPI

from . import models
from .database import engine
from .routers import address, item, order, order_record, review, user, search

# create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(user.router, prefix="/api")
app.include_router(address.router, prefix="/api")
app.include_router(order.router, prefix="/api")
app.include_router(item.router, prefix="/api")
app.include_router(review.router, prefix="/api")
app.include_router(order_record.router, prefix="/api")
app.include_router(search.router, prefix="/api")


@app.get("/")
def index():
    return {"Hello": "World"}
