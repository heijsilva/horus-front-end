from fastapi import APIRouter, HTTPException, status
from app.models.user import UserCreate, UserLogin, UserResponse
from app.config.database import get_database
from app.services.auth import get_password_hash, verify_password, create_access_token
from datetime import datetime, timedelta
from app.config.settings import settings

router = APIRouter(prefix="/auth", tags=["Autenticação"])

@router.post("/cadastro", response_model=dict, status_code=status.HTTP_201_CREATED)
async def cadastro(user: UserCreate):
    db = get_database()
    users_collection = db["users"]
    
    # Verifica se o email já existe
    if users_collection.find_one({"email": user.email}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email já cadastrado"
        )
    
    # Verifica se o CPF já existe
    if users_collection.find_one({"cpf": user.cpf}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="CPF já cadastrado"
        )
    
    # Cria o usuário
    user_dict = user.model_dump()
    user_dict["senha"] = get_password_hash(user_dict["senha"])
    user_dict["created_at"] = datetime.utcnow()
    
    result = users_collection.insert_one(user_dict)
    
    # Cria o token
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=settings.access_token_expire_minutes)
    )
    
    return {
        "message": "Usuário cadastrado com sucesso",
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.post("/login", response_model=dict)
async def login(credentials: UserLogin):
    db = get_database()
    users_collection = db["users"]
    
    # Busca o usuário
    user = users_collection.find_one({"email": credentials.email})
    
    if not user or not verify_password(credentials.senha, user["senha"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Cria o token
    access_token = create_access_token(
        data={"sub": credentials.email},
        expires_delta=timedelta(minutes=settings.access_token_expire_minutes)
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "email": user["email"],
            "nome": user["nome"]
        }
    }