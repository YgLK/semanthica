from fastapi import FastAPI

from . import models
from .database import engine
from .routers import address, item, order, review, user

# create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(user.router)
app.include_router(address.router)
app.include_router(order.router)
app.include_router(item.router)
app.include_router(review.router)

@app.get("/")
def index():
    return {"Hello": "World"}
