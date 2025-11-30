from fastapi import APIRouter, HTTPException, status
from app.models.user import UserCreate, UserLogin
from app.config.database import get_database
from app.services.auth import get_password_hash, verify_password, create_access_token
from datetime import datetime, timedelta
from app.config.settings import settings
from bson import ObjectId
import traceback

router = APIRouter(prefix="/auth", tags=["Autenticação"])

@router.post("/cadastro", status_code=status.HTTP_201_CREATED)
async def cadastro(user: UserCreate):
    try:
        db = get_database()
        users_collection = db["users"]
        
        # Verifica se o email já existe
        existing_user = users_collection.find_one({"email": user.email})
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email já cadastrado"
            )
        
        # Verifica se o CPF já existe
        existing_cpf = users_collection.find_one({"cpf": user.cpf})
        if existing_cpf:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="CPF já cadastrado"
            )
        
        # Cria o documento do usuário
        user_dict = {
            "email": user.email,
            "nome": user.nome,
            "cpf": user.cpf,
            "codigo_funcionario": user.codigo_funcionario,
            "telefone": user.telefone,
            "cep": user.cep,
            "senha": get_password_hash(user.senha),
            "created_at": datetime.utcnow()
        }
        
        # Insere no banco
        result = users_collection.insert_one(user_dict)
        
        # Cria o token
        access_token = create_access_token(
            data={"sub": user.email, "user_id": str(result.inserted_id)},
            expires_delta=timedelta(minutes=settings.access_token_expire_minutes)
        )
        
        return {
            "message": "Usuário cadastrado com sucesso",
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": str(result.inserted_id),
                "email": user.email,
                "nome": user.nome
            }
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Erro no cadastro: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao cadastrar usuário: {str(e)}"
        )

@router.post("/login")
async def login(credentials: UserLogin):
    try:
        db = get_database()
        users_collection = db["users"]
        
        # Busca o usuário
        user = users_collection.find_one({"email": credentials.email})
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email ou senha incorretos"
            )
        
        # Verifica a senha
        if not verify_password(credentials.senha, user["senha"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email ou senha incorretos"
            )
        
        # Cria o token
        access_token = create_access_token(
            data={"sub": credentials.email, "user_id": str(user["_id"])},
            expires_delta=timedelta(minutes=settings.access_token_expire_minutes)
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": str(user["_id"]),
                "email": user["email"],
                "nome": user["nome"]
            }
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Erro no login: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao fazer login: {str(e)}"
        )