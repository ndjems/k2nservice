# routers/etatfond.py

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from datetime import datetime
from ..database import get_db
from ..models import EtatFond
from ..schemas import EtatFondCreate, EtatFondResponse

router = APIRouter(prefix="/api/etatfond", tags=["etatfond"])

@router.post("/", response_model=EtatFondResponse, status_code=status.HTTP_201_CREATED)
def create_etatfond(fond: EtatFondCreate, db: Session = Depends(get_db)):
    db_fond = EtatFond(
        date=fond.date,
        montant=fond.montant,
        type_rapport=fond.typeRapport,
        label=fond.label
    )
    db.add(db_fond)
    db.commit()
    db.refresh(db_fond)
    return db_fond

@router.get("/", response_model=list[EtatFondResponse])
def get_etatfonds(typeRapport: str = "", year: int = 0, month: int = 0, db: Session = Depends(get_db)):
    query = db.query(EtatFond)
    if typeRapport:
        query = query.filter(EtatFond.type_rapport == typeRapport)
    if year:
        query = query.filter(EtatFond.date >= datetime(year, 1, 1), EtatFond.date <= datetime(year, 12, 31))
    if month and year:
        query = query.filter(
            EtatFond.date >= datetime(year, month, 1),
            EtatFond.date < datetime(year, month + 1, 1) if month < 12 else datetime(year + 1, 1, 1)
        )
    return query.order_by(EtatFond.date.asc()).all()
