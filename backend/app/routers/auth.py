import os
from datetime import datetime, timedelta
from typing import Annotated, Union

from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status, APIRouter
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
import jose
from jose import JWTError, jwt
from logging.config import dictConfig
import logging

from app.schemas import Token, TokenData, UserOut
from app.database import get_db
from app import models, schemas
from ..logging import LogConfig

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

dictConfig(LogConfig().dict())
logger = logging.getLogger("semanthica_logger")

# auth
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/token")

# to get a random secret key run: openssl rand -hex 32
SECRET_KEY = os.environ.get("JWT_SECRET_KEY")
ALGORITHM = os.environ.get("JWT_ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get("JWT_EXPIRE_MINUTES"))

auth_dependency = Annotated[str, Depends(oauth2_scheme)]


def custom_oauth2_scheme(bearerToken: str = Depends(oauth2_scheme)):
    # logger.info(f"Bearer token: {bearerToken}")
    if bearerToken in ["", "null"] or bearerToken is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="JWT Token is empty.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        decode_token(bearerToken, SECRET_KEY, ALGORITHM)
    except jose.exceptions.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has already expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return bearerToken


def get_password_hash(password):
    return pwd_context.hash(password)


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def decode_token(token, secret_key, algorithm="HS256"):
    return jwt.decode(token, secret_key, algorithms=[algorithm])


def authenticate_user(username: str, password: str, db: Session) -> Union[models.User, bool]:
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user:
        return False
    if not verify_password(password, user.password):
        return False
    return user


def create_access_token(username: str, user_id: int, expires_delta: timedelta):
    to_encode = {
        "sub": username,
        "id": user_id,
        "exp": int(datetime.timestamp(datetime.now()) + expires_delta.total_seconds())
    }
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


@router.post("/token", response_model=Token)
async def login_for_access_token(
        form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
        db: Session = Depends(get_db)
):
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        user.username, user.id, expires_delta=access_token_expires
    )

    result = {
        "access_token": access_token,
        "token_type": "bearer"
    }
    return result


@router.get("/users/me/", response_model=UserOut)
async def get_current_user(
        token: auth_dependency,
        db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = db.query(models.User).filter(models.User.username == token_data.username).first()
    if user is None:
        raise credentials_exception
    return user.__dict__
