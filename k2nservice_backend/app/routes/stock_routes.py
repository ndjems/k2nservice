from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models import Stock
from app.schemas import StockCreate, StockRead
from app.database import get_db

router = APIRouter()

def calculate_status(stock: Stock):
    if stock.quantite <= stock.seuil_min:
        return "Critique"
    elif stock.quantite <= stock.seuil_min * 1.5:
        return "Faible"
    else:
        return "OK"

@router.get("/stocks", response_model=list[StockRead])
def get_stocks(db: Session = Depends(get_db)):
    stocks = db.query(Stock).all()
    for stock in stocks:
        stock.status = calculate_status(stock)
    return stocks

@router.post("/stocks", response_model=StockRead)
def create_stock(data: StockCreate, db: Session = Depends(get_db)):
    stock = Stock(**data.dict())
    db.add(stock)
    db.commit()
    db.refresh(stock)
    stock.status = calculate_status(stock)
    return stock
