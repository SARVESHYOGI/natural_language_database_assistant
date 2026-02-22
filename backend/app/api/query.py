from app.rag.rag import build_schema_index, retrieve_relevant_schema
from app.llm.sql_model import generate_sql
from app.services.schema_service import get_schema_for_model
from app.db.engine import get_user_engine
from fastapi import APIRouter

from pydantic import BaseModel

class QueryRequest(BaseModel):
    message: str

router = APIRouter(prefix="/query", tags=["query"])


@router.post("/")
def process_query(request: QueryRequest):

    engine = get_user_engine("interview_db")

    full_schema = get_schema_for_model(engine)

    build_schema_index(full_schema)

    relevant_schema = retrieve_relevant_schema(request.message)

    generated_sql = generate_sql(relevant_schema, request.message)

    return {
        "retrieved_schema": relevant_schema,
        "generated_sql": generated_sql
    }