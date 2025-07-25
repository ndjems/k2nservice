from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from ..schemas import RapportCreate, Rapport
from ..models import Rapport as RapportModel
from ..database  import SessionLocal
import uuid
import os

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/rapport", response_model=Rapport)
def create_rapport(rapport: RapportCreate, db: Session = Depends(get_db)):
    chemin_fichier = f"rapports/{rapport.nom}_{uuid.uuid4().hex}.pdf"
    nouveau_rapport = RapportModel(
        nom=rapport.nom,
        type=rapport.type,
        date_debut=rapport.date_debut,
        date_fin=rapport.date_fin,
        chemin_fichier=chemin_fichier
    )
    db.add(nouveau_rapport)
    db.commit()
    db.refresh(nouveau_rapport)
    return nouveau_rapport

@router.get("/rapport", response_model=list[Rapport])
def list_rapports(db: Session = Depends(get_db)):
    return db.query(RapportModel).all()

@router.get("/rapport/{rapport_id}/download")
def download_rapport(rapport_id: int, db: Session = Depends(get_db)):
    rapport = db.query(RapportModel).get(rapport_id)
    if not rapport or not os.path.exists(rapport.chemin_fichier):
        raise HTTPException(status_code=404, detail="Fichier non trouvé")
    return FileResponse(rapport.chemin_fichier, filename=os.path.basename(rapport.chemin_fichier))
