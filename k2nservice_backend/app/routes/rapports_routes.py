from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from ..schemas import RapportCreate, Rapport
from ..models import Rapport as RapportModel
from ..database import get_db
from datetime import datetime
import uuid
import os

router = APIRouter(
    prefix="/rapport",
    tags=["rapports"]
)

# Dossier où sauvegarder les fichiers générés
RAPPORTS_DIR = "rapports"
os.makedirs(RAPPORTS_DIR, exist_ok=True)


# Fonction utilitaire : génération du contenu selon le type
def generer_contenu_rapport(type_rapport: str, date_debut: datetime, date_fin: datetime):
    if type_rapport == 'ventes':
        return "Rapport des ventes généré entre {} et {}".format(date_debut, date_fin)
    elif type_rapport == 'acquisitions':
        return "Rapport des acquisitions généré entre {} et {}".format(date_debut, date_fin)
    elif type_rapport == 'sorties':
        return "Rapport des sorties généré entre {} et {}".format(date_debut, date_fin)
    elif type_rapport == 'stocks':
        return "État actuel des stocks"
    elif type_rapport == 'fonds':
        return "État des fonds et trésorerie entre {} et {}".format(date_debut, date_fin)
    else:
        return "Type de rapport non reconnu."


@router.post("/", response_model=Rapport)
def create_rapport(rapport: RapportCreate, db: Session = Depends(get_db)):
    # Générer le contenu du rapport
    contenu = generer_contenu_rapport(rapport.type, rapport.date_debut, rapport.date_fin)
    
    # Générer un nom de fichier unique
    nom_fichier = f"{rapport.nom.replace(' ', '_')}_{uuid.uuid4().hex}.txt"
    chemin_fichier = os.path.join(RAPPORTS_DIR, nom_fichier)

    # Sauvegarder le contenu dans un fichier texte (tu peux le convertir en PDF plus tard)
    with open(chemin_fichier, "w", encoding="utf-8") as f:
        f.write(contenu)

    # Enregistrer le rapport dans la base de données
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


@router.get("/", response_model=list[Rapport])
def list_rapports(db: Session = Depends(get_db)):
    return db.query(RapportModel).order_by(RapportModel.created_at.desc()).all()


@router.get("/{rapport_id}/download")
def download_rapport(rapport_id: int, db: Session = Depends(get_db)):
    rapport = db.query(RapportModel).get(rapport_id)
    if not rapport or not os.path.exists(rapport.chemin_fichier):
        raise HTTPException(status_code=404, detail="Fichier non trouvé")
    return FileResponse(rapport.chemin_fichier, filename=os.path.basename(rapport.chemin_fichier))

@router.get("/{rapport_id}/")
def view_rapport(rapport_id: int, db: Session = Depends(get_db)):
    rapport = db.query(RapportModel).get(rapport_id)
    if not rapport:
        raise HTTPException(status_code=404, detail="Rapport introuvable")

    if os.path.exists(rapport.chemin_fichier):
        with open(rapport.chemin_fichier, "r", encoding="utf-8") as f:
            contenu = f.read()
    else:
        contenu = None

    return {
        "id": rapport.id,
        "nom": rapport.nom,
        "type": rapport.type,
        "dateDebut": rapport.date_debut,
        "dateFin": rapport.date_fin,
        "chemin": rapport.chemin_fichier,
        "dateCreation": rapport.created_at,
        "contenu": contenu
    }
