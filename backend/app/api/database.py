from fastapi import APIRouter, Depends, HTTPException
from requests import Session
from sqlalchemy import create_engine, inspect, text
from sqlalchemy.engine import make_url
from app.core.security import get_current_user
from app.core.config import settings
from app.models.user import User
from app.models.schemas import DatabaseInfo
from app.db.engine import get_db
from app.services.rag_service import build_index

router = APIRouter(prefix="/databases", tags=["databases"])

@router.post("/")
def create_database(
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    name = payload.get("name")

    if not name:
        raise HTTPException(400, "Database name required")

    db_name = f"user_{current_user.id}_{name.lower().replace(' ', '_')}"

    master_engine = create_engine(settings.ADMIN_DATABASE_URL)

    with master_engine.connect() as conn:
        conn.execution_options(isolation_level="AUTOCOMMIT")
        conn.execute(text(f'CREATE DATABASE "{db_name}"'))
    current_user.database_name = db_name
    db.commit()
    build_index("No tables yet.", current_user.id)
    return {
        "id": db_name,
        "name": name,
        "tables": []
    }


@router.get("/", response_model=list[DatabaseInfo])
def get_user_databases(current_user: User = Depends(get_current_user)):

    if not current_user.database_name:
        return []

    db_names = [current_user.database_name]

    result = []

    for db_name in db_names:
        url = make_url(settings.DATABASE_URL).set(database=db_name)
        engine = create_engine(url)

        try:
            inspector = inspect(engine)
            tables = inspector.get_table_names()
            result.append(
                DatabaseInfo(
                    name=db_name,
                    tables_count=len(tables),
                    tables=tables
                )
            )
        except Exception:
            result.append(
                DatabaseInfo(
                    name=db_name,
                    tables_count=0,
                    tables=[]
                )
            )

    return result



@router.get("/{db_name}/tables")
def get_tables(
    db_name: str,
    current_user: User = Depends(get_current_user)
):
    if db_name != current_user.database_name:
        raise HTTPException(403, "Unauthorized")

    url = make_url(settings.DATABASE_URL).set(database=db_name)
    engine = create_engine(url)

    inspector = inspect(engine)
    tables = inspector.get_table_names()

    return {"tables": tables}


