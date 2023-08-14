from enum import Enum
from typing import Optional
from pydantic import BaseModel, EmailStr, PastDatetime
from pydantic_extra_types.phone_numbers import PhoneNumber


class Role(str, Enum):
    user = "user"
    moderator = "moderator"
    admin = "admin"


class UserBase(BaseModel):
    username: str
    email: EmailStr
    password: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    role: Optional[Role] = None
    phone_number: Optional[PhoneNumber] = None


class User(UserBase):
    id: int
    created_at: PastDatetime