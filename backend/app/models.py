from sqlalchemy import Column, ForeignKey, Integer, Numeric, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql.expression import text
from sqlalchemy.sql.sqltypes import TIMESTAMP

from .database import Base
from .schemas import OrderStatus


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False, index=True)
    email = Column(String, unique=True, nullable=False, index=True)
    # hashed password
    password = Column(String, nullable=False)
    # roles: admin / moderator / user
    role = Column(String, nullable=False, default="user")
    created_at = Column(
        TIMESTAMP(timezone=True),
        index=True,
        nullable=False,
        server_default=text("NOW()"),
    )
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    phone_number = Column(String, index=True)
    addresses = relationship("Address", backref="users")
    orders = relationship("Order", back_populates="user")
    reviews = relationship("Review", back_populates="user")


class Address(Base):
    __tablename__ = "addresses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False
    )
    street = Column(String, index=True, nullable=False)
    city = Column(String, index=True, nullable=False)
    postal_code = Column(String, index=True, nullable=False)
    created_at = Column(
        TIMESTAMP(timezone=True),
        index=True,
        nullable=False,
        server_default=text("NOW()"),
    )


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    status = Column(String, index=True, nullable=False, default=OrderStatus.CREATED)
    created_at = Column(
        TIMESTAMP(timezone=True),
        index=True,
        nullable=False,
        server_default=text("NOW()"),
    )
    user = relationship("User", back_populates="orders")
    order_records = relationship("OrderRecord", back_populates="order")


class OrderRecord(Base):
    __tablename__ = "order_records"

    order_id = Column(
        Integer, ForeignKey("orders.id", ondelete="CASCADE"), primary_key=True
    )
    item_id = Column(Integer, ForeignKey("items.id"), primary_key=True)
    quantity = Column(Integer)
    order = relationship("Order", back_populates="order_records")
    item = relationship("Item", backref="order_records")


class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    description = Column(String)
    main_category = Column(String, index=True, nullable=False)
    sub_category = Column(String, index=True)
    image_url = Column(String, nullable=False)
    stock_quantity = Column(Integer, nullable=False)
    price = Column(Numeric, nullable=False)
    created_at = Column(
        TIMESTAMP(timezone=True),
        index=True,
        nullable=False,
        server_default=text("NOW()"),
    )
    reviews = relationship("Review", back_populates="item")


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    item_id = Column(Integer, ForeignKey("items.id", ondelete="CASCADE"), index=True)
    rating = Column(Integer)
    comment = Column(String)
    created_at = Column(
        TIMESTAMP(timezone=True),
        index=True,
        nullable=False,
        server_default=text("NOW()"),
    )
    item = relationship("Item", back_populates="reviews")
    user = relationship("User", back_populates="reviews")
