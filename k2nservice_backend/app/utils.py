from pydantic import EmailStr
from .schemas import ContactCreate
import smtplib
from email.message import EmailMessage

def envoyer_email(contact: ContactCreate):
    msg = EmailMessage()
    msg['Subject'] = "Nouveau contact reçu"
    msg['From'] = "ton.email@example.com"
    msg['To'] = "ton.email@example.com"
    msg.set_content(
        f"Nom: {contact.nom}\n"
        f"Email: {contact.email}\n"
        f"Téléphone: {contact.telephone}\n"
        f"Entreprise: {contact.entreprise}\n"
        f"Message:\n{contact.message}"
    )

    # # Exemple avec Gmail
    # with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
    #     smtp.login("ton.email@example.com", "TON_MOT_DE_PASSE")
    #     smtp.send_message(msg)
