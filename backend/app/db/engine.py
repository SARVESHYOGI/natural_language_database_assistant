import os
from sqlalchemy import create_engine, make_url
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
    url = make_url(MASTER_DATABASE_URL)
    new_url = url.set(database=db_name)
    return create_engine(new_url, echo=True, future=True)

def get_master_engine():
    return master_engine