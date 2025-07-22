# database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

from sqlalchemy.orm import Session

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Charge les variables depuis le fichier .env
load_dotenv()

# Récupère l'URL de la BDD
DATABASE_URL = os.getenv("DATABASE_URL")

# Crée le moteur de la base
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

DATABASE_URL = os.getenv("DATABASE_URL")
print("DATABASE_URL =", DATABASE_URL)

# Création de la session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base pour les modèles
Base = declarative_base()
