# k2nservice_backend/main.py

from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional, List
from datetime import datetime
import uuid
import json

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
    "http://localhost:5173",
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
DATABASE_URL = "sqlite:///./k2n_local.db"
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
    poids = Column(Float, nullable=False)
    
    sale_date = Column(DateTime, default=datetime.utcnow)
    last_modified_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Acquisition(Base):
    """Nouveau modèle SQLAlchemy pour la table 'acquisitions' dans la DB locale."""
    __tablename__ = "acquisitions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    responsable_acquisition = Column(String, nullable=False) # Nouveau champ
    nature_acquisition = Column(String, nullable=False)
    quantite_acquise = Column(Float, nullable=False) # Reste Float pour la quantité (ex: 1.5 kg)
    prix_unitaire = Column(Integer, nullable=False) # Changé de Float à Integer
    frais_acquisition = Column(Integer, nullable=False) # Changé de Float à Integer
    frais_connexes = Column(Integer, nullable=False) # Changé de Float à Integer
    total_frais = Column(Integer, nullable=False) # Changé de Float à Integer
    type_acquisition = Column(String, nullable=False)
    date_acquisition = Column(DateTime, nullable=False)
    # Stocke les tranches comme une chaîne JSON (liste d'objets {date, montant})
    dates_acquisition_tranches = Column(String, nullable=True) 
    details = Column(String, nullable=True)
    commentaires = Column(String, nullable=True)
    last_modified_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Créer toutes les tables dans la base de données locale (si elles n'existent pas)
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

# Pydantic Model pour les tranches d'acquisition
class TrancheData(BaseModel):
    date: str
    montant: int # Changé de float à int

class SaleCreate(BaseModel):
    responsable: str
    livreur: Optional[str] = None
    quantite: int
    montantNet: float
    montantRecu: float
    modePaiement: int
    frais: Optional[float] = None
    poids: float
    dateVente: str

class SaleResponse(BaseModel):
    id: uuid.UUID
    responsable: str
    livreur: Optional[str]
    quantite: int
    montantNet: float = Field(alias="montant_net")
    montantRecu: float = Field(alias="montant_recu")
    modePaiement: int = Field(alias="mode_paiement")
    frais: Optional[float]
    poids: float
    sale_date: datetime
    last_modified_at: datetime

    class Config:
        from_attributes = True
        populate_by_name = True

class AcquisitionCreate(BaseModel):
    """Modèle Pydantic pour la création d'une acquisition (données entrantes du frontend)."""
    responsableAcquisition: str # Nouveau champ
    natureAcquisition: str
    quantiteAcquise: float
    prixUnitaire: int # Changé de float à int
    fraisConnexes: int # Changé de float à int
    typeAcquisition: str
    dateAcquisition: str
    datesAcquisitionTranches: Optional[List[TrancheData]] = None
    details: Optional[str] = None
    commentaires: Optional[str] = None

class AcquisitionResponse(BaseModel):
    """Modèle Pydantic pour la réponse d'une acquisition (données sortantes)."""
    id: uuid.UUID
    responsableAcquisition: str = Field(alias="responsable_acquisition") # Nouveau champ
    natureAcquisition: str = Field(alias="nature_acquisition")
    quantiteAcquise: float = Field(alias="quantite_acquise")
    prixUnitaire: int = Field(alias="prix_unitaire") # Changé de float à int
    fraisAcquisition: int = Field(alias="frais_acquisition") # Changé de float à int
    fraisConnexes: int = Field(alias="frais_connexes") # Changé de float à int
    totalFrais: int = Field(alias="total_frais") # Changé de float à int
    typeAcquisition: str = Field(alias="type_acquisition")
    dateAcquisition: datetime = Field(alias="date_acquisition")
    datesAcquisitionTranches: Optional[List[TrancheData]] = Field(alias="dates_acquisition_tranches")
    details: Optional[str]
    commentaires: Optional[str]
    last_modified_at: datetime

    @field_validator('datesAcquisitionTranches', mode='before')
    @classmethod
    def parse_tranches_from_json(cls, v):
        if isinstance(v, str) and v:
            return json.loads(v)
        return v

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
        poids=sale.poids,
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

# --- Nouvelles Routes pour la gestion des acquisitions ---
@app.post("/api/acquisitions", response_model=AcquisitionResponse, status_code=status.HTTP_201_CREATED)
async def create_acquisition(acquisition: AcquisitionCreate, db: Session = Depends(get_db)):
    """
    Crée une nouvelle acquisition dans la base de données locale (SQLite).
    """
    # Calcul des frais d'acquisition et du total des frais
    # Assurez-vous que les calculs utilisent des entiers si les prix sont des entiers
    frais_acquisition_calculated = int(acquisition.quantiteAcquise * acquisition.prixUnitaire) # Convertir en int
    total_frais_calculated = frais_acquisition_calculated + acquisition.fraisConnexes # Utilise fraisConnexes

    # Convertir la date d'acquisition du format string (YYYY-MM-DD) en objet datetime
    date_acquisition_dt = datetime.strptime(acquisition.dateAcquisition, '%Y-%m-%d')

    # Sérialiser datesAcquisitionTranches en JSON string si non nul
    dates_tranches_json = None
    if acquisition.datesAcquisitionTranches:
        # Assurez-vous que les montants des tranches sont des entiers avant de sérialiser
        dates_tranches_json = json.dumps([t.model_dump() for t in acquisition.datesAcquisitionTranches])

    db_acquisition = Acquisition(
        responsable_acquisition=acquisition.responsableAcquisition, # Nouveau champ
        nature_acquisition=acquisition.natureAcquisition,
        quantite_acquise=acquisition.quantiteAcquise,
        prix_unitaire=acquisition.prixUnitaire,
        frais_acquisition=frais_acquisition_calculated,
        frais_connexes=acquisition.fraisConnexes,
        total_frais=total_frais_calculated,
        type_acquisition=acquisition.typeAcquisition,
        date_acquisition=date_acquisition_dt,
        dates_acquisition_tranches=dates_tranches_json, # Stocke la chaîne JSON
        details=acquisition.details,
        commentaires=acquisition.commentaires,
    )
    db.add(db_acquisition)
    db.commit()
    db.refresh(db_acquisition)
    return db_acquisition

@app.get("/api/acquisitions", response_model=List[AcquisitionResponse])
async def get_all_acquisitions(db: Session = Depends(get_db)):
    """
    Récupère toutes les acquisitions de la base de données locale (SQLite).
    """
    acquisitions = db.query(Acquisition).all()
    # Le validateur de champ dans AcquisitionResponse gérera la désérialisation de dates_acquisition_tranches
    return acquisitions
