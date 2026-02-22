from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session  
from app.services.db_service import DataBaseService, InvalidDatabaseName
from app.models.user import User
from app.api.auth import get_current_user
from app.db.engine import get_db
from app.models.user_database import UserDatabase
from pydantic import BaseModel

class CreateDatabaseRequest(BaseModel):
    name: str


router=APIRouter(prefix="/db", tags=["database"])


@router.post("/databases")
def create_database(
    request: CreateDatabaseRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = DataBaseService(db)

    try:
        return service.create_database(current_user, request.name)
    except InvalidDatabaseName as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    
@router.delete("/databases/{db_id}")
def delete_database(
    db_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = DataBaseService(db)
    service.delete_database(current_user, db_id)
    return {"message": "Database deleted successfully"}

@router.get("/databases")
def list_databases(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = DataBaseService(db)
    return service.list_databases(current_user)


@router.get("/databases/{db_id}")
def get_database(
    db_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_record = (
        db.query(UserDatabase)
        .filter_by(id=db_id, owner_id=current_user.id)
        .first()
    )

    if not db_record:
        raise HTTPException(status_code=404, detail="Database not found")

    return db_record

