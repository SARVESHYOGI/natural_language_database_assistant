from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.engine import make_url
from sqlalchemy import create_engine
from app.models.user import User
from app.core.security import get_current_user
from app.services.rag_service import retrieve_schema
from app.services.llm_service import generate_sql
from app.services.query_service import QueryService
from app.core.config import settings
from app.models.schemas import QueryRequest

router = APIRouter(prefix="/query", tags=["query"])

@router.post("/")
def run_query(
    request: QueryRequest,
    current_user: User = Depends(get_current_user),
):
    if not current_user.database_name:
        raise HTTPException(400, "No database created")
    message = request.message
    confirm = request.confirm
    url = make_url(settings.DATABASE_URL).set(database=current_user.database_name)
    engine = create_engine(url)

    schema_context = retrieve_schema(message, current_user.id)

    sql = generate_sql(schema_context, message)

    service = QueryService(engine,current_user.id)
    result = service.execute(
        sql=sql,
        confirm=confirm,
        question=message,
        schema=schema_context
    )

    return {
        "generated_sql": sql,
        "result": result
    }