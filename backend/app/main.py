from fastapi import FastAPI
from app.api.auth import router as auth_router

app = FastAPI(title="NL DB Assistant")

app.include_router(auth_router)