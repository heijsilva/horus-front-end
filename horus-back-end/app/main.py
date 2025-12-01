from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth
from app.config.database import test_connection
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Iniciando API Horus...")
    test_connection()
    yield
    print("👋 Encerrando API Horus...")

app = FastAPI(
    title="Horus API",
    description="API para sistema de monitoramento com IA",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://localhost:3000",
        "https://studious-space-journey-pxw44v6xvxg2659p-3000.app.github.dev",
        "*"
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
        