from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session  
from app.services.db_service import DataBaseService
from app.models.user import User
from app.api.auth import get_current_user
from app.db.engine import get_db

router = APIRouter()

@router.post("/databases")
def create_database(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = DataBaseService(db)
    return service.create_database(current_user)
