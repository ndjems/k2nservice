from fastapi import FastAPI , Depends

from .database import Base, engine, SessionLocal, get_db
from .models import User 
from .auth import hash_password
from app.routes import auth_routes ,fond_routes , sortie_routes, stock_routes,etat_fond_routes ,vente_routes,acquisitions_routes
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
from .models import Acquisition
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base , Session
from app.routes import contact_routes
from app.routes import rapports_routes
from app.stats import router as stats_router
from .schemas import DashboardStats
from app.fake_data import generate_dashboard_data
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

@app.get("/api/dashboard/stats", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    return generate_dashboard_data(db)

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
app.include_router(stats_router)
