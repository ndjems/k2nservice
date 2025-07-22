from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from datetime import datetime
from ..database import get_db
from ..models import Fond
from ..schemas import FondCreate, FondResponse

router = APIRouter(prefix="/api/fonds", tags=["fonds"])

@router.post("/", response_model=FondResponse, status_code=status.HTTP_201_CREATED)
def create_fond(fond: FondCreate, db: Session = Depends(get_db)):
    fond_date = datetime.strptime(fond.dateFonds, "%Y-%m-%d")
    db_fond = Fond(
        nom_crediteur=fond.nomCrediteur,
        somme_percue=fond.sommePercue,
        date_fonds=fond_date,
    )
    db.add(db_fond)
    db.commit()
    db.refresh(db_fond)
    return db_fond

@router.get("/", response_model=list[FondResponse])
def get_all_fonds(db: Session = Depends(get_db)):
    return db.query(Fond).order_by(Fond.date_fonds.desc()).all()
