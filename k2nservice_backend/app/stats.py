from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import Acquisition, Sortie, Stock, Vente, Fond

router = APIRouter(
    prefix="/stats",
    tags=["statistiques"]
)
@router.get("/acquisitions")
def stats_acquisitions(db: Session = Depends(get_db)):
    count = db.query(Acquisition).count()
    amount = db.query(func.coalesce(func.sum(Acquisition.total_frais), 0)).scalar()
    return {"count": count, "amount": float(amount)}

@router.get("/sorties")
def stats_sorties(db: Session = Depends(get_db)):
    count = db.query(Sortie).count()
    return {"count": count}

@router.get("/stocks")
def stats_stocks(db: Session = Depends(get_db)):
    count = db.query(Stock).count()
    return {"count": count}

@router.get("/ventes")
def stats_ventes(db: Session = Depends(get_db)):
    count = db.query(Vente).count()
    amount = db.query(func.coalesce(func.sum(Vente.montant_recu), 0)).scalar()
    return {"count": count, "amount": float(amount)}

@router.get("/fonds")
def stats_fonds(db: Session = Depends(get_db)):
    count = db.query(Fond).count()
    amount = db.query(func.coalesce(func.sum(Fond.somme_percue), 0)).scalar()
    return {"count": count, "amount": float(amount)}
