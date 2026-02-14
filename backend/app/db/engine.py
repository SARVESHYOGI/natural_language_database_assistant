import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv

load_dotenv()

MASTER_DATABASE_URL = os.getenv("DATABASE_URL")

master_engine = create_engine(
    MASTER_DATABASE_URL,
    echo=True,
    future=True,
    isolation_level="AUTOCOMMIT"
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=master_engine
)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_user_engine(db_name: str):
    """
    Create engine for a specific user database.
    """
    base_url = MASTER_DATABASE_URL.rsplit("/", 1)[0]
    user_db_url = f"{base_url}/{db_name}"

    return create_engine(
        user_db_url,
        echo=True,
        future=True
    )
