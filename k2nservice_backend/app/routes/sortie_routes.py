# Backend pour les sorties

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.database import get_db
from app.models import Sortie  # modèle SQLAlchemy
from app.schemas import SortieCreate, SortieResponse

router = APIRouter()

# GET toutes les sorties
@router.get("/sorties", response_model=List[SortieResponse])
def get_all_sorties(db: Session = Depends(get_db)):
    return db.query(Sortie).order_by(Sortie.date_sortie.desc()).all()

# POST nouvelle sortie
@router.post("/sorties", response_model=SortieResponse)
def create_sortie(sortie: SortieCreate, db: Session = Depends(get_db)):
    new_sortie = Sortie(
        article=sortie.article,
        quantite=sortie.quantite,
        motif=sortie.motif,
        responsable=sortie.responsable,
        date_sortie=sortie.date_sortie
    )
    db.add(new_sortie)
    db.commit()
    db.refresh(new_sortie)
    return new_sortie
