from enum import Enum
from pydantic import BaseModel
from sqlalchemy import JSON, Column, Integer, String , Float, DateTime , Date ,Enum,JSON
from .database import Base
from datetime import date, datetime
from sqlalchemy.sql import func

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

# -------------------------------- Fonds -----------------------
class Fond(Base):
    __tablename__ = "fonds"

    id = Column(Integer, primary_key=True, index=True)
    nom_crediteur = Column(String, nullable=False)
    somme_percue = Column(Float, nullable=False)
    date_fonds = Column(String, nullable=False)  # YYYY-MM-DD en texte pour compatibilité
    created_at = Column(DateTime, default=datetime.utcnow)

# ----------------- SORTIES ---------------


class Sortie(Base):
    __tablename__ = "sorties"

    id = Column(Integer, primary_key=True, index=True)
    article = Column(String, nullable=False)
    quantite = Column(Integer, nullable=False)
    motif = Column(String, nullable=False)
    responsable = Column(String, nullable=False)
    date_sortie = Column(Date, nullable=False)

    # ---------- STOCKS --------



class Stock(Base):
    __tablename__ = "stocks"

    id = Column(Integer, primary_key=True, index=True)
    nom = Column(String, nullable=False)
    total_acquis = Column(Integer, nullable=False)
    quantite = Column(Integer, nullable=False)
    prix = Column(Float, default=0)
    categorie = Column(String, default="Autre")
    emplacement = Column(String, default="Principal")
    seuil_min = Column(Integer, default=10)
    seuil_max = Column(Integer, default=100)

# ------CONTACTS-------------------
class Contact(Base):
    __tablename__ = "contacts"
    id = Column(Integer, primary_key=True, index=True)
    nom = Column(String, nullable=False)
    email = Column(String, nullable=False)
    telephone = Column(String, nullable=False)
    entreprise = Column(String, nullable=False)
    message = Column(String, nullable=False)

# ------------------ VENTES --------------------
from sqlalchemy import Column, Integer, String, Date, DateTime, func
from sqlalchemy.types import DECIMAL
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Vente(Base):
    __tablename__ = "ventes"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    responsable = Column(String(100), nullable=False)
    client = Column(String(100), nullable=False)
    produit = Column(String(200), nullable=False)
    quantite = Column(Integer, nullable=False)
    prix_unitaire = Column(DECIMAL(10, 2), nullable=False)
    montant_recu = Column(DECIMAL(10, 2), nullable=False)
    montant_net = Column(DECIMAL(10, 2), nullable=False)
    poids = Column(DECIMAL(8, 2), default=0.0)
    mode_paiement = Column(Integer, nullable=False)  # 1=Espèces, 2=Mobile Money, 3=Virement, 4=Chèque
    sale_date = Column(Date, nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    @property
    def totalPrice(self):
        return float(self.quantite * self.prix_unitaire)
    
    @property
    def status(self):
        return "Confirmé"
    
    @property
    def dateVente(self):
        return self.sale_date
    
    @property
    def date(self):
        return self.sale_date
    
    @property
    def quantity(self):
        return self.quantite
    
    @property
    def unitPrice(self):
        return float(self.prix_unitaire)
    
    @property
    def prixUnitaire(self):
        return self.prix_unitaire
    
    @property
    def montantRecu(self):
        return self.montant_recu
    
    @property
    def montantNet(self):
        return self.montant_net
    
    @property
    def modePaiement(self):
        return self.mode_paiement

        # ------- acquisitions -------

        
from sqlalchemy import Column, String, Integer, Float, Date
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Acquisition(Base):
    __tablename__ = "acquisitions"

    id = Column(String, primary_key=True, index=True)
    responsable_acquisition = Column(String)
    nature_acquisition = Column(String)
    quantite_acquise = Column(Integer)
    prix_unitaire = Column(Float)
    frais_acquisition = Column(Float)
    frais_connexes = Column(Float)
    total_frais = Column(Float)
    type_acquisition = Column(String)
    date_acquisition = Column(Date)
    dates_acquisition_tranches = Column(String, nullable=True)
    details = Column(String)
    commentaires = Column(String)
    last_modified_at = Column(DateTime, default=datetime.utcnow)

# ----------------- Rapport -----------

class Rapport(Base):
    __tablename__ = "rapports"

    id = Column(Integer, primary_key=True, index=True)
    nom = Column(String, nullable=False)
    type = Column(String, nullable=False)  # jour / periode / mois / année
    date_debut = Column(String, nullable=False)
    date_fin = Column(String, nullable=False)
    chemin_fichier = Column(String, nullable=False)
    created_at = Column(DateTime, server_default=func.now())