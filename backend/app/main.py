import traceback
from loguru import logger
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.api import auth, query
from app.db.engine import engine, Base
from app.core.logger import setup_logger
from app.models import user
from app.api import database

setup_logger()

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI DB Assistant")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(query.router)
app.include_router(database.router)

@app.middleware("http")
async def error_handling_middleware(request: Request, call_next):
    try:
        response = await call_next(request)
        return response

    except Exception as e:
        error_trace = traceback.format_exc()

        logger.error(f"Unhandled Error: {str(e)}")
        logger.error(error_trace)

        return JSONResponse(
            status_code=500,
            content={
                "error": str(e),
                "type": type(e).__name__,
                "trace": error_trace,
            },
        )
