import os
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy_utils import create_database, database_exists

import meilisearch

# Load environment variables from the specified .env file
dotenv_path = Path(__file__).resolve().parent / "../.env"
load_dotenv(dotenv_path)

# Construct the database URL
DB_USER = os.getenv("POSTGRES_USER")
DB_PASSWORD = os.getenv("POSTGRES_PASSWORD")
DB_HOST = os.getenv("POSTGRES_HOST")
DB_NAME = os.getenv("POSTGRES_DB")
# Construct the database URL
SQLALCHEMY_DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"

if not database_exists(SQLALCHEMY_DATABASE_URL):
    print(f"Database \"{DB_NAME}\" doesn't exist. Creating database...")
    create_database(SQLALCHEMY_DATABASE_URL)
    print("Database created!")

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# meilisearch used in classic search
MEILI_HOST = os.getenv("MEILI_HOST")
MEILI_MASTER_KEY = os.getenv("MEILI_MASTER_KEY")
MEILI_INDEX_NAME = os.getenv("MEILI_INDEX_NAME")

classic_search_client = meilisearch.Client(MEILI_HOST, MEILI_MASTER_KEY)


# Dependencies
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_meili_index():
    """Used for classic search"""
    return classic_search_client.index(MEILI_INDEX_NAME)
