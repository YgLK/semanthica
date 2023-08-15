from enum import Enum
from typing import Optional
from pydantic import BaseModel, EmailStr, PastDatetime
from pydantic_extra_types.phone_numbers import PhoneNumber


class Role(str, Enum):
    USER = "user"
    MODERATOR = "moderator"
    ADMIN = "admin"

class OrderStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


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


class AddressBase(BaseModel):
    user_id: int
    street: str
    city: str
    state: str
    postal_code: str
    created_at: PastDatetime

class Address(AddressBase):
    id: int


class OderBase(BaseModel):
    user_id: int
    order_status: Optional[OrderStatus] = None
    created_at: PastDatetime

class Order(OderBase):
    id: int


class OrderRecord(BaseModel):
    order_id: int
    item_id: int
    quantity: int


class ItemBase(BaseModel):
    name: str
    description: str
    main_category: str
    sub_category: str
    image_url: str
    price: float
    stock_quantity: int

class Item(ItemBase):
    id: int


class ReviewBase(BaseModel):
    user_id: int
    item_id: int
    rating: int
    comment: str

class Review(ReviewBase):
    id: int
    created_at: PastDatetime
