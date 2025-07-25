from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import logging
from ..database import get_db
from ..models import Vente
from ..schemas import VenteCreate, VenteUpdate, VenteResponse

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/sales", response_model=List[VenteResponse])
def get_all_sales(db: Session = Depends(get_db)):
    """Récupérer toutes les ventes"""
    try:
        ventes = db.query(Vente).order_by(Vente.created_at.desc()).all()
        
        # Construire la réponse avec tous les champs nécessaires
        result = []
        for vente in ventes:
            vente_dict = {
                "id": vente.id,
                "responsable": vente.responsable,
                "client": vente.client,
                "produit": vente.produit,
                "quantite": vente.quantite,
                "quantity": vente.quantite,
                "prixUnitaire": vente.prixUnitaire,
                "unitPrice": vente.prixUnitaire,
                "montantRecu": vente.montantRecu,
                "montantNet": vente.montantNet,
                "poids": vente.poids,
                "modePaiement": vente.modePaiement,
                "sale_date": vente.sale_date,
                "dateVente": vente.sale_date,
                "date": vente.sale_date,
                "totalPrice": vente.totalPrice,
                "status": vente.status,
                "created_at": vente.created_at,
                "updated_at": vente.updated_at
            }
            result.append(vente_dict)
        
        return result
        
    except Exception as e:
        logger.error(f"Erreur lors de la récupération des ventes: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur lors de la récupération des ventes"
        )

@router.post("/sales", response_model=VenteResponse)
def create_sale(vente_data: VenteCreate, db: Session = Depends(get_db)):
    """Créer une nouvelle vente"""
    try:
        logger.info(f"Données reçues: {vente_data.dict()}")
        
        # Créer la nouvelle vente en mappant les champs du frontend vers la DB
        new_vente = Vente(
            responsable=vente_data.responsable,
            client=vente_data.client,
            produit=vente_data.produit,
            quantite=vente_data.quantite,
            prix_unitaire=vente_data.prixUnitaire,
            montant_recu=vente_data.montantRecu,
            montant_net=vente_data.montantNet,
            poids=vente_data.poids,
            mode_paiement=vente_data.modePaiement,
            sale_date=vente_data.sale_date
        )
        
        db.add(new_vente)
        db.commit()
        db.refresh(new_vente)
        
        # Construire la réponse
        response_data = {
            "id": new_vente.id,
            "responsable": new_vente.responsable,
            "client": new_vente.client,
            "produit": new_vente.produit,
            "quantite": new_vente.quantite,
            "quantity": new_vente.quantite,
            "prixUnitaire": new_vente.prixUnitaire,
            "unitPrice": new_vente.prixUnitaire,
            "montantRecu": new_vente.montantRecu,
            "montantNet": new_vente.montantNet,
            "poids": new_vente.poids,
            "modePaiement": new_vente.modePaiement,
            "sale_date": new_vente.sale_date,
            "dateVente": new_vente.sale_date,
            "date": new_vente.sale_date,
            "totalPrice": new_vente.totalPrice,
            "status": new_vente.status,
            "created_at": new_vente.created_at,
            "updated_at": new_vente.updated_at
        }
        
        logger.info(f"Vente créée avec succès: {new_vente.id}")
        return response_data
        
    except Exception as e:
        logger.error(f"Erreur lors de la création de la vente: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de l'enregistrement: {str(e)}"
        )

@router.get("/sales/{sale_id}", response_model=VenteResponse)
def get_sale(sale_id: int, db: Session = Depends(get_db)):
    """Récupérer une vente spécifique"""
    vente = db.query(Vente).filter(Vente.id == sale_id).first()
    
    if not vente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vente non trouvée"
        )
    
    response_data = {
        "id": vente.id,
        "responsable": vente.responsable,
        "client": vente.client,
        "produit": vente.produit,
        "quantite": vente.quantite,
        "quantity": vente.quantite,
        "prixUnitaire": vente.prixUnitaire,
        "unitPrice": vente.prixUnitaire,
        "montantRecu": vente.montantRecu,
        "montantNet": vente.montantNet,
        "poids": vente.poids,
        "modePaiement": vente.modePaiement,
        "sale_date": vente.sale_date,
        "dateVente": vente.sale_date,
        "date": vente.sale_date,
        "totalPrice": vente.totalPrice,
        "status": vente.status,
        "created_at": vente.created_at,
        "updated_at": vente.updated_at
    }
    
    return response_data

@router.put("/sales/{sale_id}", response_model=VenteResponse)
def update_sale(sale_id: int, vente_data: VenteUpdate, db: Session = Depends(get_db)):
    """Mettre à jour une vente"""
    vente = db.query(Vente).filter(Vente.id == sale_id).first()
    
    if not vente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vente non trouvée"
        )
    
    try:
        # Mettre à jour les champs modifiés
        update_data = vente_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            # Mapper les noms de champs du frontend vers la DB
            if field == 'prixUnitaire':
                setattr(vente, 'prix_unitaire', value)
            elif field == 'montantRecu':
                setattr(vente, 'montant_recu', value)
            elif field == 'montantNet':
                setattr(vente, 'montant_net', value)
            elif field == 'modePaiement':
                setattr(vente, 'mode_paiement', value)
            else:
                setattr(vente, field, value)
        
        db.commit()
        db.refresh(vente)
        
        response_data = {
            "id": vente.id,
            "responsable": vente.responsable,
            "client": vente.client,
            "produit": vente.produit,
            "quantite": vente.quantite,
            "quantity": vente.quantite,
            "prixUnitaire": vente.prixUnitaire,
            "unitPrice": vente.prixUnitaire,
            "montantRecu": vente.montantRecu,
            "montantNet": vente.montantNet,
            "poids": vente.poids,
            "modePaiement": vente.modePaiement,
            "sale_date": vente.sale_date,
            "dateVente": vente.sale_date,
            "date": vente.sale_date,
            "totalPrice": vente.totalPrice,
            "status": vente.status,
            "created_at": vente.created_at,
            "updated_at": vente.updated_at
        }
        
        return response_data
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de la mise à jour: {str(e)}"
        )

@router.delete("/sales/{sale_id}")
def delete_sale(sale_id: int, db: Session = Depends(get_db)):
    """Supprimer une vente"""
    vente = db.query(Vente).filter(Vente.id == sale_id).first()
    
    if not vente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vente non trouvée"
        )
    
    try:
        db.delete(vente)
        db.commit()
        return {"message": "Vente supprimée avec succès"}
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de la suppression: {str(e)}"
        )