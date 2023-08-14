from .database import Base
from sqlalchemy import Column, Integer, String
from sqlalchemy.sql.sqltypes import TIMESTAMP
from sqlalchemy.sql.expression import text


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False, index=True)
    email = Column(String, unique=True, nullable=False, index=True)
    # hashed password
    password = Column(String, nullable=False) 
    # roles: admin / moderator / user
    role = Column(String, nullable=False, default="user") 
    created_at = Column(TIMESTAMP(timezone=True), index=True, nullable=False, server_default=text('NOW()'))
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    phone_number = Column(String, index=True)
