from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Sale
from ..schemas import SaleCreate, SaleResponse
from datetime import datetime

router = APIRouter(prefix="/api/sales", tags=["sales"])

@router.post("/", response_model=SaleResponse, status_code=status.HTTP_201_CREATED)
def create_sale(sale: SaleCreate, db: Session = Depends(get_db)):
    sale_date_dt = datetime.strptime(sale.dateVente, '%Y-%m-%d')
    db_sale = Sale(
        responsable=sale.responsable,
        livreur=sale.livreur,
        quantite=sale.quantite,
        montant_net=sale.montantNet,
        montant_recu=sale.montantRecu,
        mode_paiement=sale.modePaiement,
        frais=sale.frais,
        poids=sale.poids,
        sale_date=sale_date_dt,
    )
    db.add(db_sale)
    db.commit()
    db.refresh(db_sale)
    return db_sale
from fastapi import Query
from sqlalchemy import func

@router.get("/rapport")
def sales_report(
    type: str = Query(..., description="jour | periode | mois | annee"),
    date: Optional[str] = None,
    start: Optional[str] = None,
    end: Optional[str] = None,
    mois: Optional[int] = None,
    annee: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Sale)

    if type == "jour" and date:
        target = datetime.strptime(date, "%Y-%m-%d").date()
        query = query.filter(func.date(Sale.sale_date) == target)
        results = [{"label": date, "total": sum(s.montant_net for s in query.all())}]

    elif type == "periode" and start and end:
        debut = datetime.strptime(start, "%Y-%m-%d")
        fin = datetime.strptime(end, "%Y-%m-%d")
        grouped = (
            db.query(func.date(Sale.sale_date).label("label"), func.sum(Sale.montant_net).label("total"))
            .filter(Sale.sale_date.between(debut, fin))
            .group_by(func.date(Sale.sale_date))
            .order_by(func.date(Sale.sale_date))
            .all()
        )
        results = [{"label": r.label.isoformat(), "total": r.total} for r in grouped]

    elif type == "mois" and mois and annee:
        grouped = (
            db.query(func.strftime("%d", Sale.sale_date).label("label"), func.sum(Sale.montant_net).label("total"))
            .filter(func.strftime("%m", Sale.sale_date) == f"{mois:02d}", func.strftime("%Y", Sale.sale_date) == str(annee))
            .group_by("label")
            .order_by("label")
            .all()
        )
        results = [{"label": f"{r.label}/{mois:02d}/{annee}", "total": r.total} for r in grouped]

    elif type == "annee" and annee:
        grouped = (
            db.query(func.strftime("%m", Sale.sale_date).label("mois"), func.sum(Sale.montant_net).label("total"))
            .filter(func.strftime("%Y", Sale.sale_date) == str(annee))
            .group_by("mois")
            .order_by("mois")
            .all()
        )
        month_names = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"]
        results = [{"label": month_names[int(r.mois) - 1], "total": r.total} for r in grouped]

    else:
        raise HTTPException(status_code=400, detail="Paramètres invalides pour le type de rapport.")

    return results


@router.get("/", response_model=list[SaleResponse])
def get_all_sales(db: Session = Depends(get_db)):
    return db.query(Sale).all()
