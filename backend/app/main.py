from fastapi import FastAPI,logger
import logging
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.api.auth import router as auth_router
from app.api.database import router as database_router
from app.api.query import router as query_router

logger = logging.getLogger(__name__)
app = FastAPI(title="NL DB Assistant")

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(database_router)
app.include_router(query_router)


@app.middleware("http")
async def global_error_handler(request, call_next):
    try:
        response = await call_next(request)
        return response
    except Exception as e:
        logger.exception("Unhandled error")
        return JSONResponse(
            status_code=500,
            content={"error": "Internal Server Error"},
        )