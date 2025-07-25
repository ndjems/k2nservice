import pandas as pd
from fastapi import FastAPI, HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session
from ..database import get_db  # dépend de ton organisation
from app.models import Contact as ContactModel
from app.schemas import Contact as ContactSchema, ContactCreate
from app.utils import envoyer_email  # fonction à définir


router = APIRouter()

@router.post("/contact")
def create_contact(contact: ContactCreate, db: Session = Depends(get_db)):
    db_contact = ContactModel(**contact.dict())
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)

    # 🔄 Sauvegarde dans Excel
    contacts = db.query(ContactModel).all()
    df = pd.DataFrame([
        {
            "nom": c.nom,
            "email": c.email,
            "telephone": c.telephone,
            "entreprise": c.entreprise,
            "message": c.message
        } for c in contacts
    ])
    df.to_excel("contacts.xlsx", index=False)

    # ✉️ Envoi email
    envoyer_email(contact)

    return {"message": "Contact enregistré avec succès."}

@router.get("/contact")
def get_contacts(db: Session = Depends(get_db)):
    return db.query(ContactModel).all()
