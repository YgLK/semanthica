from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, EmailStr, Field, PastDatetime, conint
from pydantic_extra_types.phone_numbers import PhoneNumber


class Role(str, Enum):
    USER = "user"
    MODERATOR = "moderator"
    ADMIN = "admin"


class OrderStatus(str, Enum):
    CREATED = "created"
    PROCESSING = "processing"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


class AddressBase(BaseModel):
    street: str
    city: str
    postal_code: str
    country: str


class AddressCreate(AddressBase):
    user_id: int


class AddressOut(AddressBase):
    id: int
    user_id: int
    created_at: PastDatetime


class AddressUpdate(BaseModel):
    user_id: Optional[int] = None
    street: Optional[str] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = None


class UserBase(BaseModel):
    username: str
    email: EmailStr
    first_name: str
    last_name: str
    role: Optional[Role] = Role.USER
    phone_number: PhoneNumber


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
    total: float
    created_at: PastDatetime


class OrderUpdate(BaseModel):
    user_id: Optional[int] = None
    status: Optional[OrderStatus] = None
    total: float


class OrderRecordBase(BaseModel):
    item_id: int
    quantity: int


class OrderRecord(OrderRecordBase):
    order_id: int


class OrderFullBase(BaseModel):
    user_id: int
    order_records: List[OrderRecordBase]


class OrderFullCreate(OrderFullBase):
    pass


class OrderFullOut(BaseModel):
    id: int
    user_id: int
    total: float
    status: OrderStatus
    created_at: PastDatetime
    order_records: List[OrderRecord]


class ReviewBase(BaseModel):
    user_id: int
    item_id: int
    rating: Optional[int] = Field(None, ge=1, le=5)  # Restrict to integer values between 1 and 5
    title: str
    comment: str


class ReviewOut(ReviewBase):
    id: int
    created_at: PastDatetime


class ItemReviewsOut(ReviewBase):
    """
    This class is used to return reviews for a specific item in the GET /items/{item_id}/reviews endpoint.
    """
    id: int
    created_at: PastDatetime
    title: str = Field("Temporary title, TBD", max_length=50)
    username: str


class ReviewCreate(ReviewBase):
    pass


class ReviewUpdate(BaseModel):
    rating: Optional[int] = Field(None, ge=1, le=5)
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


class OrderRecordBase(BaseModel):
    order_id: int
    item_id: int
    quantity: conint(gt=0)


class OrderRecordCreate(OrderRecordBase):
    pass


class OrderRecordOut(OrderRecordBase):
    pass


class OrderRecordUpdate(BaseModel):
    order_id: Optional[int] = None
    item_id: Optional[int] = None
    quantity: Optional[conint(gt=0)] = None


class SearchQuery(BaseModel):
    top_k: Optional[int]


class SearchQueryText(SearchQuery):
    text_query: str


class SearchQueryImage(SearchQuery):
    image_url: Optional[str]


class ResponseItem(BaseModel):
    item_id: int
    score: float
    content: ItemOut


class SearchResponse(BaseModel):
    items: List[ResponseItem]


class UserFullCreate(UserCreate):
    addresses: List[AddressBase]


class UserFullOut(UserFullCreate):
    id: int
    addresses: List[AddressOut]
    created_at: PastDatetime
