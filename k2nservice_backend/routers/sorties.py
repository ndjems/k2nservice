from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Sortie
from ..schemas import SortieCreate, SortieResponse
from datetime import datetime
import uuid

router = APIRouter(prefix="/api/sorties", tags=["sorties"])

@router.post("/", response_model=SortieResponse, status_code=status.HTTP_201_CREATED)
def create_sortie(sortie: SortieCreate, db: Session = Depends(get_db)):
    sortie_date = datetime.strptime(sortie.date, "%Y-%m-%d").date()
    db_sortie = Sortie(
        id=str(uuid.uuid4()),
        article=sortie.article,
        quantite=sortie.quantite,
        motif=sortie.motif,
        responsable=sortie.responsable,
        date_sortie=sortie_date
    )
    db.add(db_sortie)
    db.commit()
    db.refresh(db_sortie)
    return db_sortie

@router.get("/", response_model=list[SortieResponse])
def get_all_sorties(db: Session = Depends(get_db)):
    return db.query(Sortie).order_by(Sortie.date_sortie.desc()).all()
