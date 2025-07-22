from sqlalchemy import Column, String, Integer, Float, DateTime
from datetime import datetime
import uuid
from .database import Base

class Sale(Base):
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
    __tablename__ = "acquisitions"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    responsable_acquisition = Column(String, nullable=False)
    nature_acquisition = Column(String, nullable=False)
    quantite_acquise = Column(Float, nullable=False)
    prix_unitaire = Column(Integer, nullable=False)
    frais_acquisition = Column(Integer, nullable=False)
    frais_connexes = Column(Integer, nullable=False)
    total_frais = Column(Integer, nullable=False)
    type_acquisition = Column(String, nullable=False)
    date_acquisition = Column(DateTime, nullable=False)
    dates_acquisition_tranches = Column(String, nullable=True)
    details = Column(String, nullable=True)
    commentaires = Column(String, nullable=True)
    last_modified_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class EtatFond(Base):
    __tablename__ = "etat_fonds"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    date = Column(DateTime, nullable=False)
    montant = Column(Float, nullable=False)
    type_rapport = Column(String, nullable=False)  # jour, mois, année, etc.
    label = Column(String, nullable=True)  # ex: "Jan", "01/07/2025"
    last_modified_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

from sqlalchemy import Column, String, Float, DateTime
from datetime import datetime
import uuid

class Fond(Base):
    __tablename__ = "fonds"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    nom_crediteur = Column(String, nullable=False)
    somme_percue = Column(Float, nullable=False)
    date_fonds = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

from sqlalchemy import Column, String, DateTime
from datetime import datetime
import uuid

class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    nom = Column(String, nullable=False)
    email = Column(String, nullable=False)
    telephone = Column(String, nullable=True)
    entreprise = Column(String, nullable=True)
    message = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

from sqlalchemy import Column, String, Integer, Date
from datetime import date

class Sortie(Base):
    __tablename__ = "sorties"

    id = Column(String, primary_key=True, index=True)
    article = Column(String, nullable=False)
    quantite = Column(Integer, nullable=False)
    motif = Column(String, nullable=False)
    responsable = Column(String, nullable=False)
    date_sortie = Column(Date, nullable=False)
