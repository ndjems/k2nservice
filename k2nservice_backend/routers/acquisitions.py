from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Acquisition
from ..schemas import AcquisitionCreate, AcquisitionResponse
from datetime import datetime
import json

router = APIRouter(prefix="/api/acquisitions", tags=["acquisitions"])

@router.post("/", response_model=AcquisitionResponse, status_code=status.HTTP_201_CREATED)
def create_acquisition(acquisition: AcquisitionCreate, db: Session = Depends(get_db)):
    frais_acquisition = int(acquisition.quantiteAcquise * acquisition.prixUnitaire)
    total_frais = frais_acquisition + acquisition.fraisConnexes
    date_acquisition_dt = datetime.strptime(acquisition.dateAcquisition, '%Y-%m-%d')
    tranches_json = json.dumps([t.model_dump() for t in acquisition.datesAcquisitionTranches]) if acquisition.datesAcquisitionTranches else None

    db_acq = Acquisition(
        responsable_acquisition=acquisition.responsableAcquisition,
        nature_acquisition=acquisition.natureAcquisition,
        quantite_acquise=acquisition.quantiteAcquise,
        prix_unitaire=acquisition.prixUnitaire,
        frais_acquisition=frais_acquisition,
        frais_connexes=acquisition.fraisConnexes,
        total_frais=total_frais,
        type_acquisition=acquisition.typeAcquisition,
        date_acquisition=date_acquisition_dt,
        dates_acquisition_tranches=tranches_json,
        details=acquisition.details,
        commentaires=acquisition.commentaires
    )
    db.add(db_acq)
    db.commit()
    db.refresh(db_acq)
    return db_acq

@router.get("/", response_model=list[AcquisitionResponse])
def get_all_acquisitions(db: Session = Depends(get_db)):
    return db.query(Acquisition).all()
