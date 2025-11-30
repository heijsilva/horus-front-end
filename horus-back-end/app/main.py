from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth
from app.config.database import test_connection
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 Iniciando API Horus...")
    test_connection()
    yield
    # Shutdown
    print("👋 Encerrando API Horus...")

app = FastAPI(
    title="Horus API",
    description="API para sistema de monitoramento com IA",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rotas
app.include_router(auth.router)

@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "Bem-vindo à API Horus",
        "docs": "/docs",
        "redoc": "/redoc",
        "database": "pi",
        "status": "online"
    }

@app.get("/health", tags=["Health"])
async def health_check():
    from app.config.database import get_database
    try:
        db = get_database()
        collections = db.list_collection_names()
        return {
            "status": "healthy",
            "database": "pi",
            "collections": collections
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e)
        }