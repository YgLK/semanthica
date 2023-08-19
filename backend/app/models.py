from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql.expression import text
from sqlalchemy.sql.sqltypes import TIMESTAMP

from .database import Base


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
    addresses = relationship("Address", backref="user")


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
