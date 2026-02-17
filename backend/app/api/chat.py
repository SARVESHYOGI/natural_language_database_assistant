from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.engine import get_db
from app.models.schemas import ChatRequest, ChatResponse, ChatRequest
from app.services.chat_service import ChatService


router= APIRouter(prefix="/chat", tags=["chat"])
@router.post("/query",response_model=ChatResponse)
def query_data(request:ChatRequest,db:Session=Depends(get_db)):
    try:
        service=ChatService(db=db)
        result=service.handle_message(
            message=request.message,
            session_id=request.session_id
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

