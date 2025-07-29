from email.message import EmailMessage
import smtplib
from pydantic import BaseModel, EmailStr, Field, constr, validator
from datetime import datetime , date
from typing import Optional
from .database import SessionLocal
from enum import Enum
from decimal import Decimal 
# ------------------ Login --------------------
class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str

class UserOut(BaseModel):
    id: int
    email: EmailStr

    class Config:
        orm_mode = True

class LoginResponse(BaseModel):
    token: str
    user: UserOut

# --------------------- Fonds ------------------

# Création (frontend -> backend)
class FondCreate(BaseModel):
    nomCrediteur: str
    sommePercue: float
    dateFonds: str  # format "YYYY-MM-DD"

# Réponse (backend -> frontend)
class FondResponse(BaseModel):
    id: int
    nom_crediteur: str
    somme_percue: float
    date_fonds: str
    created_at: datetime

    class Config:
        orm_mode = True

# Pour la mise à jour (PATCH)
class FondUpdate(BaseModel):
    nom_crediteur: str | None = None
    somme_percue: float | None = None
    date_fonds: str | None = None  # format "YYYY-MM-DD"

#---------------- pour les sorties -------------

class SortieCreate(BaseModel):
    article: str
    quantite: int
    motif: str
    responsable: str
    date_sortie: date

class SortieResponse(SortieCreate):
    id: int

    class Config:
        orm_mode = True

# ------------------ Stocks --------------------
class StockCreate(BaseModel):
    nom: str
    total_acquis: int
    quantite: int
    prix: Optional[float] = 0
    categorie: Optional[str] = "Autre"
    emplacement: Optional[str] = "Principal"
    seuil_min: Optional[int] = 10
    seuil_max: Optional[int] = 100

class StockRead(StockCreate):
    id: int
    status: Optional[str]

    class Config:
        orm_mode = True
        
        # -------------------- CONTACTS --------------
class ContactCreate(BaseModel):
    nom: str
    email: EmailStr
    telephone: str
    entreprise: Optional[str] = None
    message: str

from pydantic import BaseModel, EmailStr, constr

class Contact(BaseModel):
    nom: constr(min_length=2) # type: ignore
    email: EmailStr
    telephone: constr(min_length=8)  # type: ignore
    entreprise: str
    message: constr(min_length=10) # type: ignore


# Dépendance pour obtenir une session DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 📩 Fonction pour envoyer un email automatique
EMAIL_SENDER = "tonemail@gmail.com"
EMAIL_PASSWORD = "tonmotdepasse"
EMAIL_RECEIVER = "tonemaildestinataire@gmail.com"

def envoyer_email(contact: ContactCreate):
    msg = EmailMessage()
    msg["Subject"] = "Nouveau message de contact"
    msg["From"] = EMAIL_SENDER
    msg["To"] = EMAIL_RECEIVER
    msg.set_content(f"""
Nouveau message reçu :

Nom : {contact.nom}
Email : {contact.email}
Téléphone : {contact.telephone}
Entreprise : {contact.entreprise}
Message : {contact.message}
    
""")
    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(EMAIL_SENDER, EMAIL_PASSWORD)
            smtp.send_message(msg)
    except Exception as e:
        print("Erreur lors de l'envoi du mail:", e)

        # ------------------ Ventes --------------------
from pydantic import BaseModel, validator
from decimal import Decimal
from datetime import date, datetime
from typing import Optional

class VenteCreate(BaseModel):
    responsable: str
    client: str
    produit: str
    quantite: int
    prixUnitaire: Decimal 
    montantRecu: Decimal 
    montantNet: Decimal 
    poids: Optional[Decimal] =0.0
    modePaiement: int 
    sale_date: date 

    class Config:
        allow_population_by_field_name = True
    
    @validator('quantite')
    def validate_quantite(cls, v):
        if v <= 0:
            raise ValueError('La quantité doit être positive')
        return v
    
    @validator('prixUnitaire')
    def validate_prix_unitaire(cls, v):
        if v <= 0:
            raise ValueError('Le prix unitaire doit être positif')
        return v
    
    @validator('modePaiement')
    def validate_mode_paiement(cls, v):
        if v not in [1, 2, 3, 4]:
            raise ValueError('Mode de paiement invalide (1-4)')
        return v
    
    class Config:
        from_attributes = True

class VenteUpdate(BaseModel):
    responsable: Optional[str] = None
    client: Optional[str] = None
    produit: Optional[str] = None
    quantite: Optional[int] = None
    prixUnitaire: Optional[Decimal] = None
    montantRecu: Optional[Decimal] = None
    montantNet: Optional[Decimal] = None
    poids: Optional[Decimal] = None
    modePaiement: Optional[int] = None
    sale_date: Optional[date] = None
    
    class Config:
        from_attributes = True

class VenteResponse(BaseModel):
    id: int
    responsable: str
    client: str
    produit: str
    quantite: int
    quantity: int  # alias pour compatibilité frontend
    prixUnitaire: Decimal
    unitPrice: Decimal  # alias pour compatibilité frontend
    montantRecu: Decimal
    montantNet: Decimal
    poids: Decimal
    modePaiement: int
    sale_date: date
    dateVente: date  # alias pour compatibilité frontend
    date: date       # alias pour compatibilité frontend
    totalPrice: float
    status: str
    created_at: datetime
    updated_at: datetime
    
    @validator('quantity', pre=True, always=True)
    def set_quantity(cls, v, values):
        return values.get('quantite', v)
    
    @validator('unitPrice', pre=True, always=True)
    def set_unit_price(cls, v, values):
        return values.get('prixUnitaire', v)
    
    @validator('dateVente', pre=True, always=True)
    def set_date_vente(cls, v, values):
        return values.get('sale_date', v)
    
    @validator('date', pre=True, always=True)
    def set_date(cls, v, values):
        return values.get('sale_date', v)
    
    class Config:
        from_attributes = True


        # ---------- acquisitions -------
        from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from enum import Enum

class TypeAcquisition(str, Enum):
    totale = "totale"
    tranches = "tranches"

class TrancheData(BaseModel):
    date: str
    montant: float

class AcquisitionBase(BaseModel):
    responsable_acquisition: str
    nature_acquisition: str
    quantite_acquise: int
    prix_unitaire: float
    frais_acquisition: float = 0.0
    frais_connexes: float = 0.0
    type_acquisition: TypeAcquisition
    date_acquisition: date
    details: Optional[str] = None
    commentaires: Optional[str] = None

class AcquisitionCreate(AcquisitionBase):
    dates_acquisition_tranches: Optional[List[TrancheData]] = None

class Acquisition(AcquisitionBase):
    id: str
    total_frais: float
    dates_acquisition_tranches: Optional[List[TrancheData]] = None
    last_modified_at: datetime

    class Config:
        orm_mode = True

        # ------- Rapport ---------

class RapportCreate(BaseModel):
    nom: str
    type: str  # jour, periode, mois, année
    date_debut: date
    date_fin: date

class Rapport(BaseModel):
    id: int
    nom: str
    type: str
    date_debut: date
    date_fin: date
    chemin_fichier: str
    created_at: datetime

    class Config:
        orm_mode = True

class StatItem(BaseModel):
    total: float
    change: float

class ActivityOut(BaseModel):
    id: int
    type: str
    description: str
    time: str
    status: str

class DashboardStats(BaseModel):
    ventes: StatItem
    acquisitions: StatItem
    fonds: StatItem
    stocks: StatItem
    activites: list[ActivityOut]