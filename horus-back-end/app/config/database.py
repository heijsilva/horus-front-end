from pymongo import MongoClient
from pymongo.server_api import ServerApi
from app.config.settings import settings

# Conexão com MongoDB Atlas
client = MongoClient(
    settings.mongodb_url,
    server_api=ServerApi('1'),
    tls=True,
    tlsAllowInvalidCertificates=False
)

db = client[settings.database_name]

def get_database():
    return db

# Teste de conexão
def test_connection():
    try:
        client.admin.command('ping')
        print("✅ Conectado ao MongoDB Atlas com sucesso!")
        print(f"📦 Banco de dados: {settings.database_name}")
        print(f"📊 Coleções disponíveis: {db.list_collection_names()}")
        return True
    except Exception as e:
        print(f"❌ Erro ao conectar ao MongoDB: {e}")
        return False