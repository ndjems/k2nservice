# k2nservice_backend/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import sales, acquisitions ,fond, etatfond , contact ,sorties , stocks


from .database import Base, engine
import models  # nécessaire pour enregistrer les tables

# Crée toutes les tables à partir des modèles
Base.metadata.create_all(bind=engine)

app = FastAPI(title="K2N Local Backend API")

# Autorise les requêtes depuis ton frontend React (localhost:5173)
origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # ou ["*"] si tu veux tout autoriser
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(sales.router)
app.include_router(acquisitions.router)
app.include_router(etatfond.router)
app.include_router(fond.router)
app.include_router(contact.router)
app.include_router(sorties.router)
app.include_router(stocks.router)
@app.get("/")
def root():
    return {"message": "Bienvenue sur l'API Locale K2N Service!"}

@app.get("/api/dashboard/stats")
def get_dashboard_stats():
    return {
        "ventes": {
            "total": 42350,
            "change": 12.5,
        },
        "acquisitions": {
            "total": 1234,
            "change": 8.2,
        },
        "fonds": {
            "total": 28500,
            "change": -2.1,
        },
        "stocks": {
            "total": 567,
            "change": 5.4,
        },
        "activites": [
            {
                "id": 1,
                "type": "vente",
                "description": "Vente produit #1234",
                "amount": "+1 250 €",
                "time": "Il y a 2h",
                "status": "completed",
            },
            # ...
        ]
    }