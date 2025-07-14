# k2nservice_backend/main.py

from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
import uuid # Pour générer des UUIDs

# --- Imports pour SQLAlchemy (Base de données) ---
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

# Initialisation de l'application FastAPI
app = FastAPI(
    title="K2N Local Backend API",
    description="API locale pour la gestion des services K2N, connectée à SQLite.",
    version="0.1.0"
)

# Configuration CORS (Cross-Origin Resource Sharing)
origins = [
    "http://localhost:5173",  # L'URL de votre frontend React/Vite
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Configuration de la Base de Données SQLite ---
DATABASE_URL = "sqlite:///./k2n_local.db" # Crée un fichier k2n_local.db dans le dossier du backend

# connect_args={"check_same_thread": False} est nécessaire pour SQLite avec FastAPI
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dépendance pour obtenir une session de base de données
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Modèles de Base de Données (SQLAlchemy ORM) ---
class Sale(Base):
    """Modèle SQLAlchemy pour la table 'sales' dans la DB locale."""
    __tablename__ = "sales"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    
    responsable = Column(String, nullable=False)
    livreur = Column(String, nullable=True)
    quantite = Column(Integer, nullable=False)
    montant_net = Column(Float, nullable=False)
    montant_recu = Column(Float, nullable=False)
    mode_paiement = Column(Integer, nullable=False)
    frais = Column(Float, nullable=True)
    poids = Column(Float, nullable=False) # Nouveau champ 'poids'
    
    sale_date = Column(DateTime, default=datetime.utcnow)
    last_modified_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Créer les tables dans la base de données locale (si elles n'existent pas)
def create_db_tables():
    Base.metadata.create_all(bind=engine)

# --- Modèles de données pour les requêtes et réponses (Pydantic) ---
class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    rememberMe: bool = False

class LoginResponse(BaseModel):
    success: bool = True
    token: str
    user: dict
    message: Optional[str] = None

class ErrorResponse(BaseModel):
    message: str
    code: str
    field: Optional[str] = None

class SaleCreate(BaseModel):
    """Modèle Pydantic pour la création d'une vente (données entrantes du frontend)."""
    responsable: str
    livreur: Optional[str] = None
    quantite: int
    montantNet: float
    montantRecu: float
    modePaiement: int
    frais: Optional[float] = None
    poids: float # Nouveau champ 'poids'
    dateVente: str

class SaleResponse(BaseModel):
    """Modèle Pydantic pour la réponse d'une vente (données sortantes)."""
    id: uuid.UUID
    responsable: str
    livreur: Optional[str]
    quantite: int
    montantNet: float = Field(alias="montant_net")
    montantRecu: float = Field(alias="montant_recu")
    modePaiement: int = Field(alias="mode_paiement")
    frais: Optional[float]
    poids: float # Nouveau champ 'poids'
    sale_date: datetime
    last_modified_at: datetime

    class Config:
        from_attributes = True
        populate_by_name = True

# --- Hooks de démarrage de l'application ---
@app.on_event("startup")
async def startup_event():
    create_db_tables()
    print("Tables de la base de données locale vérifiées/créées.")

# --- Routes API ---

@app.get("/")
async def read_root():
    return {"message": "Bienvenue sur l'API Locale K2N Service!"}

@app.post("/api/auth/login", response_model=LoginResponse, responses={
    status.HTTP_400_BAD_REQUEST: {"model": ErrorResponse},
    status.HTTP_401_UNAUTHORIZED: {"model": ErrorResponse},
    status.HTTP_404_NOT_FOUND: {"model": ErrorResponse},
    status.HTTP_429_TOO_MANY_REQUESTS: {"model": ErrorResponse},
    status.HTTP_423_LOCKED: {"model": ErrorResponse},
    status.HTTP_500_INTERNAL_SERVER_ERROR: {"model": ErrorResponse},
    status.HTTP_502_BAD_GATEWAY: {"model": ErrorResponse},
    status.HTTP_503_SERVICE_UNAVAILABLE: {"model": ErrorResponse},
    status.HTTP_504_GATEWAY_TIMEOUT: {"model": ErrorResponse},
})
async def login(request: LoginRequest):
    if request.email == "test@example.com" and request.password == "password123":
        simulated_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJyb2xlIjoiYWRtaW4ifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
        simulated_user = {
            "id": "user123",
            "email": request.email,
            "name": "Utilisateur Test",
            "role": "admin"
        }
        return LoginResponse(success=True, token=simulated_token, user=simulated_user, message="Connexion réussie")
    elif request.email == "locked@example.com":
        raise HTTPException(
            status_code=status.HTTP_423_LOCKED,
            detail=ErrorResponse(message="Compte verrouillé. Contactez le support", code="ACCOUNT_LOCKED").model_dump()
        )
    elif request.email == "notfound@example.com":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=ErrorResponse(message="Aucun compte trouvé avec cet email", code="USER_NOT_FOUND").model_dump()
        )
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=ErrorResponse(message="Email ou mot de passe incorrect", code="INVALID_CREDENTIALS").model_dump()
        )

@app.post("/api/sales", response_model=SaleResponse, status_code=status.HTTP_201_CREATED)
async def create_sale(sale: SaleCreate, db: Session = Depends(get_db)):
    """
    Crée une nouvelle vente dans la base de données locale (SQLite).
    """
    sale_date_dt = datetime.strptime(sale.dateVente, '%Y-%m-%d')

    db_sale = Sale(
        responsable=sale.responsable,
        livreur=sale.livreur,
        quantite=sale.quantite,
        montant_net=sale.montantNet,
        montant_recu=sale.montantRecu,
        mode_paiement=sale.modePaiement,
        frais=sale.frais,
        poids=sale.poids, # Ajout du champ poids
        sale_date=sale_date_dt,
    )
    db.add(db_sale)
    db.commit()
    db.refresh(db_sale)
    return db_sale

@app.get("/api/sales", response_model=List[SaleResponse])
async def get_all_sales(db: Session = Depends(get_db)):
    """
    Récupère toutes les ventes de la base de données locale (SQLite).
    """
    sales = db.query(Sale).all()
    return sales
