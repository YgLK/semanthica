from fastapi import FastAPI

from . import models
from .database import engine
from .routers import address, user

# create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(user.router)
app.include_router(address.router)


@app.get("/")
def index():
    return {"Hello": "World"}
