from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..models import Acquisition, Sale
from ..schemas import StockResult
from datetime import datetime
from typing import Optional

router = APIRouter(prefix="/api/stocks", tags=["stocks"])

@router.get("/rapport", response_model=list[StockResult])
def rapport_stock(
    type: str = Query(..., description="jour | periode | mois | annee"),
    date: Optional[str] = None,
    start: Optional[str] = None,
    end: Optional[str] = None,
    mois: Optional[int] = None,
    annee: Optional[int] = None,
    db: Session = Depends(get_db),
):
    # Appliquer les filtres temporels
    filtres_acquisition = []
    filtres_vente = []

    if type == "jour" and date:
        target = datetime.strptime(date, "%Y-%m-%d").date()
        filtres_acquisition.append(func.date(Acquisition.date_acquisition) == target)
        filtres_vente.append(func.date(Sale.sale_date) == target)

    elif type == "periode" and start and end:
        debut = datetime.strptime(start, "%Y-%m-%d")
        fin = datetime.strptime(end, "%Y-%m-%d")
        filtres_acquisition.append(Acquisition.date_acquisition.between(debut, fin))
        filtres_vente.append(Sale.sale_date.between(debut, fin))

    elif type == "mois" and mois and annee:
        filtres_acquisition.append(func.strftime("%m", Acquisition.date_acquisition) == f"{mois:02d}")
        filtres_acquisition.append(func.strftime("%Y", Acquisition.date_acquisition) == str(annee))

        filtres_vente.append(func.strftime("%m", Sale.sale_date) == f"{mois:02d}")
        filtres_vente.append(func.strftime("%Y", Sale.sale_date) == str(annee))

    elif type == "annee" and annee:
        filtres_acquisition.append(func.strftime("%Y", Acquisition.date_acquisition) == str(annee))
        filtres_vente.append(func.strftime("%Y", Sale.sale_date) == str(annee))

    # Agréger les acquisitions
    acquisitions = (
        db.query(Acquisition.article, func.sum(Acquisition.quantite).label("total_acquis"))
        .filter(*filtres_acquisition)
        .group_by(Acquisition.article)
        .all()
    )

    # Agréger les ventes
    ventes = (
        db.query(Sale.article, func.sum(Sale.quantite).label("total_vendu"))
        .filter(*filtres_vente)
        .group_by(Sale.article)
        .all()
    )

    # Fusionner acquisitions et ventes
    resultats = []
    ventes_dict = {v.article: v.total_vendu for v in ventes}

    for a in acquisitions:
        vendu = ventes_dict.get(a.article, 0)
        restant = a.total_acquis - vendu
        resultats.append({
            "nom": a.article,
            "totalAcquis": a.total_acquis,
            "quantiteRestante": restant
        })

    return resultats
