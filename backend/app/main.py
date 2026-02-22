from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, query
from app.db.engine import engine, Base
from app.core.logger import setup_logger
from app.models import user
setup_logger()

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI DB Assistant")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(query.router)