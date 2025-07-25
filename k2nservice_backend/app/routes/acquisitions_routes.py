from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from typing import List
import uuid
from datetime import datetime

from ..schemas import Acquisition, AcquisitionCreate
from ..models import Acquisition as DBAcquisition
from ..database import get_db

router = APIRouter()

def calculate_total(acquisition: AcquisitionCreate) -> float:
    """Calcule le total des frais d'acquisition"""
    return (
        (acquisition.quantite_acquise * acquisition.prix_unitaire) 
        + acquisition.frais_acquisition 
        + acquisition.frais_connexes
    )

def generate_id() -> str:
    """Génère un ID unique pour une acquisition"""
    return f"ACQ{uuid.uuid4().hex[:6].upper()}"

@router.get("/acquisitions", response_model=List[Acquisition])
def list_acquisitions(db: Session = Depends(get_db)):
    """Liste toutes les acquisitions"""
    return db.query(DBAcquisition).all()

@router.post("/acquisitions", response_model=Acquisition, status_code=status.HTTP_201_CREATED)
def create_acquisition(acquisition: AcquisitionCreate, db: Session = Depends(get_db)):
    """Crée une nouvelle acquisition"""
    
    # Validation des dates
    try:
        # datetime.strptime(acquisition.date_acquisition, "%Y-%m-%d")
        if acquisition.dates_acquisition_tranches:
            for tranche in acquisition.dates_acquisition_tranches:
                datetime.strptime(tranche.date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Format de date invalide. Utilisez YYYY-MM-DD"
        )
    
    # Calcul du total
    total = calculate_total(acquisition)
    
    # Création de l'objet acquisition
    db_acquisition = DBAcquisition(
        id=generate_id(),
        total_frais=total,
        **acquisition.dict()
    )
    
    db.add(db_acquisition)
    db.commit()
    db.refresh(db_acquisition)
    return db_acquisition

@router.get("/{acquisition_id}", response_model=Acquisition)
def get_acquisition(acquisition_id: str, db: Session = Depends(get_db)):
    """Récupère une acquisition spécifique"""
    db_acquisition = db.query(DBAcquisition).filter(DBAcquisition.id == acquisition_id).first()
    if not db_acquisition:
        raise HTTPException(status_code=404, detail="Acquisition non trouvée")
    return db_acquisition

@router.delete("/{acquisition_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_acquisition(acquisition_id: str, db: Session = Depends(get_db)):
    """Supprime une acquisition"""
    db_acquisition = db.query(DBAcquisition).filter(DBAcquisition.id == acquisition_id).first()
    if not db_acquisition:
        raise HTTPException(status_code=404, detail="Acquisition non trouvée")
    
    db.delete(db_acquisition)
    db.commit()
    return