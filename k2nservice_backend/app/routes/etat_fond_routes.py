from fastapi import APIRouter
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/etat_fonds")
def get_etat_fonds():
    # Données simulées (tu pourras les connecter à ta DB plus tard)
    total_fonds = 1500000
    objectif_annuel = 5000000
    variation_mensuelle = 12.5

    repartition = [
        {
            "type": "Subvention",
            "montant": 800000,
            "pourcentage": round(800000 / total_fonds * 100, 1),
            "couleur": "bg-green-500"
        },
        {
            "type": "Investissement",
            "montant": 700000,
            "pourcentage": round(700000 / total_fonds * 100, 1),
            "couleur": "bg-blue-500"
        }
    ]

    mouvements = [
        {
            "type": "Entrée",
            "description": "Subvention ministérielle",
            "montant": 500000,
            "date": datetime.now().isoformat()
        },
        {
            "type": "Sortie",
            "description": "Achat matériel informatique",
            "montant": -200000,
            "date": (datetime.now() - timedelta(days=1)).isoformat()
        }
    ]

    return {
        "totalFonds": total_fonds,
        "variation": variation_mensuelle,
        "objectif": objectif_annuel,
        "repartition": repartition,
        "mouvements": mouvements
    }
