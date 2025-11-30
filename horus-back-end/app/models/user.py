from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    nome: str
    cpf: str
    codigo_funcionario: str
    telefone: str
    cep: str

class UserCreate(UserBase):
    senha: str

class UserLogin(BaseModel):
    email: EmailStr
    senha: str

class UserResponse(BaseModel):
    id: str
    email: str
    nome: str
    cpf: str
    codigo_funcionario: str
    telefone: str
    cep: str
    created_at: datetime

    class Config:
        from_attributes = True