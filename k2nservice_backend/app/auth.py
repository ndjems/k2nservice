from .models import User
from sqlalchemy.orm import Session
import hashlib

def hash_password(password: str):
    return hashlib.sha256(password.encode()).hexdigest()

def authenticate_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()
    if not user or user.hashed_password != hash_password(password):
        return None
    return user

def create_token(user_id: int):
    return f"fake-jwt-token-for-user-{user_id}"
