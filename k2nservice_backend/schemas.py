from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional, List
from datetime import datetime
import uuid

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

class TrancheData(BaseModel):
    date: str
    montant: int

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
    responsableAcquisition: str
    natureAcquisition: str
    quantiteAcquise: float
    prixUnitaire: int
    fraisConnexes: int
    typeAcquisition: str
    dateAcquisition: str
    datesAcquisitionTranches: Optional[List[TrancheData]] = None
    details: Optional[str] = None
    commentaires: Optional[str] = None

class AcquisitionResponse(BaseModel):
    id: uuid.UUID
    responsableAcquisition: str = Field(alias="responsable_acquisition")
    natureAcquisition: str = Field(alias="nature_acquisition")
    quantiteAcquise: float = Field(alias="quantite_acquise")
    prixUnitaire: int = Field(alias="prix_unitaire")
    fraisAcquisition: int = Field(alias="frais_acquisition")
    fraisConnexes: int = Field(alias="frais_connexes")
    totalFrais: int = Field(alias="total_frais")
    typeAcquisition: str = Field(alias="type_acquisition")
    dateAcquisition: datetime = Field(alias="date_acquisition")
    datesAcquisitionTranches: Optional[List[TrancheData]] = Field(alias="dates_acquisition_tranches")
    details: Optional[str]
    commentaires: Optional[str]
    last_modified_at: datetime

# schemas pour les etatfonds

class EtatFondCreate(BaseModel):
    date: datetime
    montant: float
    typeRapport: str
    label: Optional[str] = None

class EtatFondResponse(BaseModel):
    id: uuid.UUID
    date: datetime
    montant: float
    typeRapport: str = Field(alias="type_rapport")
    label: Optional[str]
    last_modified_at: datetime

    class Config:
        from_attributes = True
        populate_by_name = True

class EtatFondCreate(BaseModel):
    date: datetime
    montant: float
    typeRapport: str
    label: Optional[str] = None

class EtatFondResponse(BaseModel):
    id: uuid.UUID
    date: datetime
    montant: float
    typeRapport: str = Field(alias="type_rapport")
    label: Optional[str]
    last_modified_at: datetime

# schema pour les fonds

    from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
import uuid

class FondCreate(BaseModel):
    nomCrediteur: str
    sommePercue: float
    dateFonds: str  # string format (YYYY-MM-DD)

class FondResponse(BaseModel):
    id: uuid.UUID
    nomCrediteur: str = Field(alias="nom_crediteur")
    sommePercue: float = Field(alias="somme_percue")
    dateFonds: datetime = Field(alias="date_fonds")
    created_at: datetime

# schemas pour les contacts

from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
import uuid

class ContactMessageCreate(BaseModel):
    nom: str
    email: EmailStr
    telephone: Optional[str] = None
    entreprise: Optional[str] = None
    message: str

class ContactMessageResponse(BaseModel):
    id: uuid.UUID
    nom: str
    email: EmailStr
    telephone: Optional[str]
    entreprise: Optional[str]
    message: str
    created_at: datetime
 
#  schema pour les sorties

    from pydantic import BaseModel, Field
from datetime import date
from uuid import uuid4

class SortieCreate(BaseModel):
    article: str
    quantite: int
    motif: str
    responsable: str
    date: str

class SortieResponse(BaseModel):
    id: str
    article: str
    quantite: int
    motif: str
    responsable: str
    date_sortie: date

    class Config:
        from_attributes = True

# schemas pour les stocks

from pydantic import BaseModel

class StockResult(BaseModel):
    nom: str
    totalAcquis: int
    quantiteRestante: int




    @field_validator('datesAcquisitionTranches', mode='before')
    @classmethod
    def parse_tranches_from_json(cls, v):
        import json
        if isinstance(v, str) and v:
            return json.loads(v)
        return v

    class Config:
        from_attributes = True
        populate_by_name = True
