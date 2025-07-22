from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import ContactMessage
from ..schemas import ContactMessageCreate, ContactMessageResponse

router = APIRouter(prefix="/api/contact", tags=["contact"])

@router.post("/", response_model=ContactMessageResponse, status_code=status.HTTP_201_CREATED)
def submit_message(contact: ContactMessageCreate, db: Session = Depends(get_db)):
    db_msg = ContactMessage(**contact.dict())
    db.add(db_msg)
    db.commit()
    db.refresh(db_msg)
    return db_msg

@router.get("/", response_model=list[ContactMessageResponse])
def get_messages(db: Session = Depends(get_db)):
    return db.query(ContactMessage).order_by(ContactMessage.created_at.desc()).all()
