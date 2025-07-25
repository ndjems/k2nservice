from fastapi import FastAPI

from .database import Base, engine, SessionLocal
from .models import User 
from .auth import hash_password
from .routes import auth_routes ,fond_routes , sortie_routes, stock_routes,etat_fond_routes ,vente_routes,acquisitions_routes
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
from .models import Acquisition
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from app.routes import contact_routes
from app.routes import rapports_routes
Base = declarative_base()
engine = create_engine("sqlite:///./k2n.db", echo=True)
# Création des tables
Base.metadata.create_all(bind=engine)

# Configuration CORS — adapte l’URL du frontend ici
origins = [
    "http://localhost:8080",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Création d’un utilisateur de test
def create_test_user():
    db = SessionLocal()
    if not db.query(User).filter_by(email="test@example.com").first():
        user = User(email="test@example.com", hashed_password=hash_password("password1234"))
        db.add(user)
        db.commit()
        print("✅ Utilisateur de test créé")
    else:
        print("ℹ️ Utilisateur déjà existant")
    db.close()

create_test_user()

# Inclusion des routes
app.include_router(auth_routes.router)
app.include_router(fond_routes.router)
app.include_router(sortie_routes.router)
app.include_router(stock_routes.router)
app.include_router(etat_fond_routes.router)
app.include_router(contact_routes.router)
app.include_router(vente_routes.router)
app.include_router(acquisitions_routes.router)
app.include_router(rapports_routes.router)