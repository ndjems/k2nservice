from app.models import Vente, Acquisition, Fond, Stock, Activite
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.schemas import DashboardStats, StatItem, ActivityOut  


def compute_percentage_change(current: float, previous: float) -> float:
    if previous == 0:
        return 0.0
    return round(((current - previous) / previous) * 100, 2)


def generate_dashboard_data(db: Session) -> DashboardStats:
    now = datetime.utcnow()
    debut_mois = datetime(now.year, now.month, 1)
    debut_mois_prec = datetime(now.year, now.month - 1, 1) if now.month > 1 else datetime(now.year - 1, 12, 1)

    # ----------- VENTES ------------
    ventes_mois = db.query(Vente).filter(Vente.sale_date >= debut_mois).all()
    ventes_prec = db.query(Vente).filter(Vente.sale_date >= debut_mois_prec, Vente.sale_date < debut_mois).all()
    ventes_total = sum(float(v.montant_net) for v in ventes_mois)
    ventes_prec_total = sum(float(v.montant_net) for v in ventes_prec)
    ventes_change = compute_percentage_change(ventes_total, ventes_prec_total)

    # ----------- ACQUISITIONS ------------
    acquisitions_mois = db.query(Acquisition).filter(Acquisition.date_acquisition >= debut_mois).all()
    acquisitions_prec = db.query(Acquisition).filter(
        Acquisition.date_acquisition >= debut_mois_prec,
        Acquisition.date_acquisition < debut_mois
    ).all()
    acq_total = sum((a.prix_unitaire or 0) * (a.quantite_acquise or 0) for a in acquisitions_mois)
    acq_prec_total = sum((a.prix_unitaire or 0) * (a.quantite_acquise or 0) for a in acquisitions_prec)
    acq_change = compute_percentage_change(acq_total, acq_prec_total)

    # ----------- FONDS ------------
    fonds_total = sum(f.somme_percue for f in db.query(Fond).all())
    fonds_change = 0.0  # Historique non utilisé ici

    # ----------- STOCKS ------------
    stocks_total = sum(s.quantite for s in db.query(Stock).all())
    stocks_change = 0.0  # Historique non utilisé ici

    # ----------- ACTIVITÉS ------------
    activites = db.query(Activite).order_by(Activite.time.desc()).limit(5).all()
    activites_out = [
        ActivityOut(
            id=a.id,
            type=a.type,
            description=a.description,
            time=a.time.strftime("%Y-%m-%d %H:%M"),
            status=a.status,
        )
        for a in activites
    ]

    # ----------- ASSEMBLAGE ------------
    return DashboardStats(
        ventes=StatItem(total=ventes_total, change=ventes_change),
        acquisitions=StatItem(total=acq_total, change=acq_change),
        fonds=StatItem(total=fonds_total, change=fonds_change),
        stocks=StatItem(total=stocks_total, change=stocks_change),
        activites=activites_out
    )
