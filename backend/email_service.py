import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

def envoyer_email_test(destinataire: str):
    # On récupère les clés que tu viens de mettre dans Render
    smtp_server = os.getenv("SMTP_SERVER")
    smtp_port = int(os.getenv("SMTP_PORT", 465))
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")

    msg = MIMEMultipart()
    # Expéditeur obligatoire pour le mode test de Resend
    msg['From'] = "onboarding@resend.dev"
    msg['To'] = destinataire
    msg['Subject'] = "🚀 Succès : Ton CRM envoie des emails !"

    corps_du_message = """
    Félicitations !
    
    Si tu reçois cet email, c'est que ton backend Python et Resend communiquent parfaitement ensemble. Tu as réussi à configurer un serveur SMTP professionnel !
    
    Le Cerveau Digital Scale.
    """
    
    msg.attach(MIMEText(corps_du_message, 'plain', 'utf-8'))

    try:
        server = smtplib.SMTP_SSL(smtp_server, smtp_port)
        server.login(smtp_user, smtp_password)
        server.send_message(msg)
        server.quit()
        print("✅ Email envoyé avec succès !")
        return True
    except Exception as e:
        print(f"❌ Erreur lors de l'envoi : {e}")
        return False