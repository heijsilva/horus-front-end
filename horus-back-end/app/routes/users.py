from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from bson import ObjectId
import bcrypt
from app.config.database import get_database

router = APIRouter(prefix="/users", tags=["Users"])

# Modelo para atualização de usuário
class UserUpdate(BaseModel):
    nome: Optional[str] = None
    email: Optional[str] = None
    cpf: Optional[str] = None
    codigo_funcionario: Optional[str] = None
    telefone: Optional[str] = None
    cep: Optional[str] = None
    senha: Optional[str] = None

# Rota para buscar usuário por email
@router.get("/email/{email}")
async def get_user_by_email(email: str):
    try:
        db = get_database()
        users_collection = db["users"]
        
        print(f"🔍 Buscando usuário com email: {email}")
        
        user = users_collection.find_one({"email": email})
        
        if user:
            print(f"✅ Usuário encontrado: {user}")
            user["_id"] = str(user["_id"])
            
            # Não retornar a senha
            if "senha" in user:
                del user["senha"]
            
            return user
        
        print(f"❌ Usuário não encontrado com email: {email}")
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Erro ao buscar usuário: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro ao buscar usuário: {str(e)}")

# Rota para buscar usuário por ID
@router.get("/{user_id}")
async def get_user_by_id(user_id: str):
    try:
        db = get_database()
        users_collection = db["users"]
        
        print(f"🔍 Buscando usuário com ID: {user_id}")
        
        # Validar ObjectId
        if not ObjectId.is_valid(user_id):
            raise HTTPException(status_code=400, detail="ID inválido")
        
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        
        if user:
            print(f"✅ Usuário encontrado: {user}")
            user["_id"] = str(user["_id"])
            
            # Não retornar a senha
            if "senha" in user:
                del user["senha"]
            
            return user
        
        print(f"❌ Usuário não encontrado com ID: {user_id}")
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Erro ao buscar usuário: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro ao buscar usuário: {str(e)}")

# Rota para atualizar usuário
@router.put("/{user_id}")
async def update_user(user_id: str, user_update: UserUpdate):
    try:
        db = get_database()
        users_collection = db["users"]
        
        print(f"📝 Atualizando usuário com ID: {user_id}")
        print(f"📦 Dados recebidos: {user_update.dict(exclude_none=True)}")
        
        # Validar ObjectId
        if not ObjectId.is_valid(user_id):
            raise HTTPException(status_code=400, detail="ID inválido")
        
        # Verificar se o usuário existe
        existing_user = users_collection.find_one({"_id": ObjectId(user_id)})
        if not existing_user:
            print(f"❌ Usuário não encontrado com ID: {user_id}")
            raise HTTPException(status_code=404, detail="Usuário não encontrado")
        
        # Preparar dados para atualização
        update_data = {}
        
        if user_update.nome is not None:
            update_data["nome"] = user_update.nome
        if user_update.email is not None:
            # Verificar se o email já existe em outro usuário
            email_exists = users_collection.find_one({
                "email": user_update.email,
                "_id": {"$ne": ObjectId(user_id)}
            })
            if email_exists:
                raise HTTPException(status_code=400, detail="Email já está em uso")
            update_data["email"] = user_update.email
        if user_update.cpf is not None:
            update_data["cpf"] = user_update.cpf
        if user_update.codigo_funcionario is not None:
            update_data["codigo_funcionario"] = user_update.codigo_funcionario
        if user_update.telefone is not None:
            update_data["telefone"] = user_update.telefone
        if user_update.cep is not None:
            update_data["cep"] = user_update.cep
        
        # Se a senha foi fornecida, fazer hash
        if user_update.senha is not None and user_update.senha != "":
            print("🔐 Atualizando senha...")
            hashed_password = bcrypt.hashpw(user_update.senha.encode('utf-8'), bcrypt.gensalt())
            update_data["senha"] = hashed_password.decode('utf-8')
        
        if not update_data:
            raise HTTPException(status_code=400, detail="Nenhum dado para atualizar")
        
        print(f"📤 Dados que serão atualizados: {update_data}")
        
        # Atualizar no banco
        result = users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data}
        )
        
        if result.modified_count == 0:
            print("⚠️ Nenhuma alteração foi feita (dados iguais aos existentes)")
        
        # Buscar usuário atualizado
        updated_user = users_collection.find_one({"_id": ObjectId(user_id)})
        updated_user["_id"] = str(updated_user["_id"])
        
        # Não retornar a senha
        if "senha" in updated_user:
            del updated_user["senha"]
        
        print(f"✅ Usuário atualizado com sucesso: {updated_user}")
        
        return {
            "message": "Usuário atualizado com sucesso",
            "user": updated_user
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Erro ao atualizar usuário: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro ao atualizar usuário: {str(e)}")

# Rota para deletar usuário
@router.delete("/{user_id}")
async def delete_user(user_id: str):
    try:
        db = get_database()
        users_collection = db["users"]
        
        print(f"🗑️ Deletando usuário com ID: {user_id}")
        
        # Validar ObjectId
        if not ObjectId.is_valid(user_id):
            raise HTTPException(status_code=400, detail="ID inválido")
        
        # Verificar se o usuário existe
        existing_user = users_collection.find_one({"_id": ObjectId(user_id)})
        if not existing_user:
            print(f"❌ Usuário não encontrado com ID: {user_id}")
            raise HTTPException(status_code=404, detail="Usuário não encontrado")
        
        # Deletar usuário
        result = users_collection.delete_one({"_id": ObjectId(user_id)})
        
        if result.deleted_count == 0:
            print(f"❌ Erro ao deletar usuário com ID: {user_id}")
            raise HTTPException(status_code=400, detail="Erro ao deletar usuário")
        
        print(f"✅ Usuário deletado com sucesso: {existing_user.get('email')}")
        
        return {
            "message": "Usuário deletado com sucesso",
            "email": existing_user.get("email")
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Erro ao deletar usuário: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro ao deletar usuário: {str(e)}")

# Rota para listar todos os usuários (útil para debug)
@router.get("/")
async def list_users():
    try:
        db = get_database()
        users_collection = db["users"]
        
        print("📋 Listando todos os usuários...")
        
        users = list(users_collection.find())
        
        # Converter ObjectId para string e remover senhas
        for user in users:
            user["_id"] = str(user["_id"])
            if "senha" in user:
                del user["senha"]
        
        print(f"✅ Total de usuários encontrados: {len(users)}")
        
        return {
            "total": len(users),
            "users": users
        }
    
    except Exception as e:
        print(f"❌ Erro ao listar usuários: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro ao listar usuários: {str(e)}")
    