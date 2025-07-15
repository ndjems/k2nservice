from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from datetime import datetime

app = FastAPI()

# ---------------------
# Modèles de données
# ---------------------
class Acquisition(BaseModel):
    id: int
    natureAcquisition: str
    quantiteAcquise: int
    fraisAcquisition: int
    fraisAnnexes: int
    totalFrais: int
    typeAcquisition: str
    dateAcquisition: str  # format YYYY-MM-DD
    datesAcquisitionTranches: List[str] = []

class Sortie(BaseModel):
    id: int
    article: str
    quantite: int
    unite: str
    motif: str
    responsable: str
    date: str  # format YYYY-MM-DD

class Vente(BaseModel):
    id: int
    responsable: str
    livreur: str
    quantite: int
    montantNet: int
    montantRecu: int
    modePaiement: int
    frais: int
    dateVente: str  # format YYYY-MM-DD

class Fonds(BaseModel):
    id: int
    nomCrediteur: str
    sommePercue: int
    dateFonds: str  # format YYYY-MM-DD

# ---------------------
# Stockage en mémoire
# ---------------------
acquisitions = []
sorties = []
ventes = []
fonds = []

# ---------------------
# Routes CRUD simples
# ---------------------
@app.get("/acquisitions", response_model=List[Acquisition])
def get_acquisitions():
    return acquisitions

@app.post("/acquisitions", response_model=Acquisition)
def add_acquisition(acquisition: Acquisition):
    acquisitions.append(acquisition)
    return acquisition

@app.get("/sorties", response_model=List[Sortie])
def get_sorties():
    return sorties

@app.post("/sorties", response_model=Sortie)
def add_sortie(sortie: Sortie):
    sorties.append(sortie)
    return sortie

@app.get("/ventes", response_model=List[Vente])
def get_ventes():
    return ventes

@app.post("/ventes", response_model=Vente)
def add_vente(vente: Vente):
    ventes.append(vente)
    return vente

@app.get("/fonds", response_model=List[Fonds])
def get_fonds():
    return fonds

@app.post("/fonds", response_model=Fonds)
def add_fonds(f: Fonds):
    fonds.append(f)
    return f

# ---------------------
# Endpoint statistiques dashboard
# ---------------------
@app.get("/stats/dashboard")
def get_dashboard_stats():
    # Date du jour
    now = datetime.now()
    mois = now.month
    annee = now.year

    # Stock restant du mois
    acquisitions_mois = sum(a.quantiteAcquise for a in acquisitions if datetime.strptime(a.dateAcquisition, "%Y-%m-%d").month == mois and datetime.strptime(a.dateAcquisition, "%Y-%m-%d").year == annee)
    sorties_mois = sum(s.quantite for s in sorties if datetime.strptime(s.date, "%Y-%m-%d").month == mois and datetime.strptime(s.date, "%Y-%m-%d").year == annee)
    stock_restant = acquisitions_mois - sorties_mois

    # Nombre de ventes du mois
    ventes_mois = [v for v in ventes if datetime.strptime(v.dateVente, "%Y-%m-%d").month == mois and datetime.strptime(v.dateVente, "%Y-%m-%d").year == annee]
    nb_ventes = len(ventes_mois)

    # Etat de fonds
    fonds_injectes = sum(f.sommePercue for f in fonds)
    fonds_utilises = sum(a.fraisAcquisition + a.fraisAnnexes for a in acquisitions)
    etat_fonds = fonds_injectes - fonds_utilises

    return {
        "stock_restant": stock_restant,
        "nb_ventes": nb_ventes,
        "etat_fonds": etat_fonds
    }
