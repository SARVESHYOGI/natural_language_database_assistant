from pydantic import BaseModel, EmailStr
    
class UserCreate(BaseModel):
    username:str
    email:EmailStr
    password:str

class UserResponse(BaseModel):
    id:int
    username:str
    email:EmailStr

    class Config:
        orm_mode=True

class Token(BaseModel):
    access_token:str
    token_type:str


class ChatRequest(BaseModel):
    message:str
    session_id:str  

class ChatResponse(BaseModel):
    status:str
    data:dict|None=None
    explanation:str|None=None