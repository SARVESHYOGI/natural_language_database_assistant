from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from sqlalchemy import text, create_engine
from sqlalchemy.engine import make_url
from app.models.user import User
from app.models.schemas import UserCreate, LoginRequest, UserResponse
from app.db.engine import get_db
from app.core.security import hash_password, verify_password, create_access_token, get_current_user
from app.core.config import settings
from app.services.rag_service import build_index

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.username == user.username).first()
    if existing:
        raise HTTPException(400, "Username exists")

    db_user = User(
        username=user.username,
        email=user.email,
        hash_password=hash_password(user.password)
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/login")
def login(data: LoginRequest, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == data.username).first()

    if not user or not verify_password(data.password, user.hash_password):
        raise HTTPException(400, "Invalid credentials")

    token = create_access_token({"sub": user.username})
    response.set_cookie("access_token", token, httponly=True)

    return {"message": "Login success", "access_token": token}

@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("access_token")
    return {"message": "Logged out"}

@router.get("/me", response_model=UserResponse)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/create-db")
def create_database(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.database_name:
        raise HTTPException(400, "DB already exists")

    db_name = f"user_{current_user.id}_db"

    master_engine = create_engine(settings.DATABASE_URL)

    with master_engine.connect() as conn:
        conn.execution_options(isolation_level="AUTOCOMMIT")
        conn.execute(text(f'CREATE DATABASE "{db_name}"'))

    current_user.database_name = db_name
    db.commit()

    build_index("No tables yet.", current_user.id)

    return {"message": "Database created"}