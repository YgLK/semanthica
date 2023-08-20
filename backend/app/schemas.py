from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, EmailStr, Field, PastDatetime
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


class AddressBase(BaseModel):
    user_id: int
    street: str
    city: str
    postal_code: str

class AddressCreate(AddressBase):
    pass

class AddressOut(AddressBase):
    id: int
    created_at: PastDatetime

class AddressUpdate(BaseModel):
    user_id : Optional[int] = None
    street: Optional[str] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None


class UserBase(BaseModel):
    username: str
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    role: Optional[Role] = None
    phone_number: Optional[PhoneNumber] = None

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: int
    created_at: PastDatetime
    addresses: Optional[List[AddressOut]] = None

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    role: Optional[Role] = None
    phone_number: Optional[PhoneNumber] = None


class OderBase(BaseModel):
    user_id: int
    status: Optional[OrderStatus] = None

class OrderCreate(OderBase):
    pass

class OrderOut(OderBase):
    id: int
    created_at: PastDatetime

class OrderUpdate(BaseModel):
    user_id: Optional[int] = None
    status: Optional[OrderStatus] = None


class OrderRecord(BaseModel):
    order_id: int
    item_id: int
    quantity: int


class ReviewBase(BaseModel):
    user_id: int
    item_id: int
    rating: int = Field(None, ge=1, le=5) # Restrict to integer values between 1 and 5
    comment: str

class ReviewOut(ReviewBase):
    id: int
    created_at: PastDatetime

class ReviewCreate(ReviewBase):
    pass

class ReviewUpdate(BaseModel):
    rating: Optional[int] = Field(None, ge=1, le=5)  # Restrict to integer values between 1 and 5
    comment: Optional[str] = None

class ItemBase(BaseModel):
    name: str
    description: str
    main_category: str
    sub_category: str
    image_url: str
    stock_quantity: int
    price: float

class ItemOut(ItemBase):
    id: int
    created_at: PastDatetime
    reviews: Optional[List[ReviewOut]] = None

class ItemCreate(ItemBase):
    pass

class ItemUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    main_category: Optional[str] = None
    sub_category: Optional[str] = None
    image_url: Optional[str] = None
    stock_quantity: Optional[int] = None
    price: Optional[float] = None
