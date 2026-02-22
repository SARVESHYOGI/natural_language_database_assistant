
from typing import List

from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr

    class Config:
        orm_mode = True


class DatabaseInfo(BaseModel):
    name: str
    tables_count: int
    tables: List[str]


class QueryRequest(BaseModel):
    message: str
    confirm: bool = False


