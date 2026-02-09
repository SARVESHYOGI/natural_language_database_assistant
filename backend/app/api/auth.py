from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.schemas import UserCreate, UserResponse, Token
from app.models.user import User
from app.core.security import hash_password, verify_password, create_access_token, get_current_user
from app.db.engine import get_db

router=APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UserResponse)
def register(user:UserCreate, db:Session=Depends(get_db)):
    exist_user = db.query(User).filter((User.username == user.username) | (User.email == user.email)).first()
    if exist_user:
        raise HTTPException(status_code=400, detail="Username or email already registered")
    try:
        hashed_password = hash_password(user.password)
        print(f"Hashed password for {user.username}: {hashed_password}")
        db_user = User(username=user.username, email=user.email, hash_password=hashed_password)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return {"id": db_user.id, "username": db_user.username, "email": db_user.email}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/token", response_model=Token)
def login(form_data:UserCreate, db:Session=Depends(get_db)):
    user=db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hash_password):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user