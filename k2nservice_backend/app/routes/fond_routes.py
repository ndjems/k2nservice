from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas

router = APIRouter()

# GET tous les fonds
@router.get("/fonds", response_model=list[schemas.FondResponse])
def get_fonds(db: Session = Depends(get_db)):
    fonds = db.query(models.Fond).order_by(models.Fond.created_at.desc()).all()
    return fonds

# POST nouveau fond
@router.post("/fonds", response_model=schemas.FondResponse)
def create_fond(fond: schemas.FondCreate, db: Session = Depends(get_db)):
    db_fond = models.Fond(
        nom_crediteur=fond.nomCrediteur,
        somme_percue=fond.sommePercue,
        date_fonds=fond.dateFonds,
    )
    db.add(db_fond)
    db.commit()
    db.refresh(db_fond)
    return db_fond

# PATCH un fond
@router.patch("/fonds/{fond_id}", response_model=schemas.FondResponse)
def update_fond(fond_id: int, fond_data: schemas.FondUpdate, db: Session = Depends(get_db)):
    fond = db.query(models.Fond).get(fond_id)
    if not fond:
        raise HTTPException(status_code=404, detail="Fond introuvable")

    for field, value in fond_data.dict(exclude_unset=True).items():
        setattr(fond, field, value)

    db.commit()
    db.refresh(fond)
    return fond
# DELETE un fond
@router.delete("/fonds/{fond_id}", response_model=schemas.FondResponse)
def delete_fond(fond_id: int, db: Session = Depends(get_db)):   
    fond = db.query(models.Fond).get(fond_id)
    if not fond:
        raise HTTPException(status_code=404, detail="Fond introuvable")

    db.delete(fond)
    db.commit()
    return fond