from pydantic import BaseModel, EmailStr
from typing import Optional

class UserRead(BaseModel):
    id: int
    username: str
    email: EmailStr
    full_name: str
    role: str
    location: Optional[str] = None
    is_active: bool

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    full_name: str
    role: str
    location: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserRead

class TokenData(BaseModel):
    username: Optional[str] = None
