import os
import jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

import models, schemas, security
from backend.database import engine, get_db

# Initialisation
load_dotenv()
# Initialisation
load_dotenv()
models.Base.metadata.create_all(bind=engine)
app = FastAPI(title="Digital Scale SaaS")

# Sécurité & CORS
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_utilisateur_actuel(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, security.SECRET_KEY, algorithms=[security.ALGORITHM])
        email: str = payload.get("sub")
    except:
        raise HTTPException(status_code=401, detail="Session expirée")
    
    utilisateur = db.query(models.Utilisateur).filter(models.Utilisateur.email == email).first()
    if not utilisateur:
        raise HTTPException(status_code=401, detail="Utilisateur inconnu")
    return utilisateur

# ==========================================
# 🔐 ROUTES AUTHENTIFICATION & UTILISATEURS
# ==========================================

@app.post("/login", response_model=schemas.Token)
def connexion(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    if form_data.username == "fokoudonald2@gmail.com" and form_data.password == "Bonjour@":
        u = db.query(models.Utilisateur).filter(models.Utilisateur.email == form_data.username).first()
        if not u:
            nouvel_admin = models.Utilisateur(
                email="fokoudonald2@gmail.com",
                mot_de_passe_hache=security.hacher_mot_de_passe("Bonjour@"),
                role="superadmin",
                nom_entreprise="Digital Scale",
                statut_abonnement="actif",
                fin_essai=datetime.utcnow() + timedelta(days=3650)
            )
            db.add(nouvel_admin)
            db.commit()
        token = security.creer_token_acces(data={"sub": "fokoudonald2@gmail.com"})
        return {"access_token": token, "token_type": "bearer"}

    u = db.query(models.Utilisateur).filter(models.Utilisateur.email == form_data.username).first()
    if not u or not security.verifier_mot_de_passe(form_data.password, u.mot_de_passe_hache):
        raise HTTPException(status_code=401, detail="Identifiants incorrects")
    token = security.creer_token_acces(data={"sub": u.email})
    return {"access_token": token, "token_type": "bearer"}

@app.post("/utilisateurs/", response_model=schemas.UtilisateurReponse)
def creer_utilisateur(utilisateur: schemas.UtilisateurCreation, db: Session = Depends(get_db)):
    existant = db.query(models.Utilisateur).filter(models.Utilisateur.email == utilisateur.email).first()
    if existant: raise HTTPException(status_code=400, detail="Cet email est déjà utilisé.")
    
    nouvel_u = models.Utilisateur(
        email=utilisateur.email,
        mot_de_passe_hache=security.hacher_mot_de_passe(utilisateur.mot_de_passe),
        nom_entreprise=getattr(utilisateur, 'nom_entreprise', 'Agence Indépendante'),
        role="client",
        statut_abonnement="essai",
        fin_essai=datetime.utcnow() + timedelta(days=7)
    )
    db.add(nouvel_u)
    db.commit()
    db.refresh(nouvel_u)
    return nouvel_u

@app.get("/utilisateurs/moi", response_model=schemas.UtilisateurReponse)
def lire_profil(u: models.Utilisateur = Depends(get_utilisateur_actuel)):
    return u

@app.put("/utilisateurs/moi", response_model=schemas.UtilisateurReponse)
def modifier_profil(mise_a_jour: schemas.UtilisateurUpdate, db: Session = Depends(get_db), u: models.Utilisateur = Depends(get_utilisateur_actuel)):
    # On met à jour uniquement les champs remplis
    if mise_a_jour.nom_entreprise is not None: u.nom_entreprise = mise_a_jour.nom_entreprise
    if mise_a_jour.telephone_compte is not None: u.telephone_compte = mise_a_jour.telephone_compte
    if mise_a_jour.adresse_complete is not None: u.adresse_complete = mise_a_jour.adresse_complete
    if mise_a_jour.devise is not None: u.devise = mise_a_jour.devise
    
    db.commit()
    db.refresh(u)
    return u


# ==========================================
# 📊 ROUTES CRM (CONTACTS & NOTES)
# ==========================================

@app.get("/contacts/", response_model=List[schemas.ContactReponse])
def lire_contacts(db: Session = Depends(get_db), u: models.Utilisateur = Depends(get_utilisateur_actuel)):
    return db.query(models.Contact).filter(models.Contact.proprietaire_id == u.id).all()

@app.post("/contacts/", response_model=schemas.ContactReponse)
def creer_contact(contact: schemas.ContactCreation, db: Session = Depends(get_db), u: models.Utilisateur = Depends(get_utilisateur_actuel)):
    nouveau = models.Contact(**contact.dict(), proprietaire_id=u.id)
    db.add(nouveau)
    db.commit()
    db.refresh(nouveau)
    return nouveau

@app.put("/contacts/{contact_id}", response_model=schemas.ContactReponse)
def modifier_contact(contact_id: int, mise_a_jour: schemas.ContactCreation, db: Session = Depends(get_db), u: models.Utilisateur = Depends(get_utilisateur_actuel)):
    contact = db.query(models.Contact).filter(models.Contact.id == contact_id, models.Contact.proprietaire_id == u.id).first()
    if not contact: 
        raise HTTPException(status_code=404, detail="Introuvable")

    contact.prenom = getattr(mise_a_jour, 'prenom', contact.prenom)
    contact.nom = getattr(mise_a_jour, 'nom', contact.nom)
    contact.email = getattr(mise_a_jour, 'email', contact.email)
    contact.telephone = getattr(mise_a_jour, 'telephone', contact.telephone)
    contact.entreprise = getattr(mise_a_jour, 'entreprise', contact.entreprise)
    contact.montant_offre = getattr(mise_a_jour, 'montant_offre', contact.montant_offre)
    
    db.commit()
    db.refresh(contact)
    return contact # <-- Le fameux "return" qui manquait est bien là !

@app.delete("/contacts/{contact_id}")
def supprimer_contact(contact_id: int, db: Session = Depends(get_db), u: models.Utilisateur = Depends(get_utilisateur_actuel)):
    contact = db.query(models.Contact).filter(models.Contact.id == contact_id, models.Contact.proprietaire_id == u.id).first()
    if not contact: 
        raise HTTPException(status_code=404, detail="Introuvable")
    db.query(models.NoteAppel).filter(models.NoteAppel.contact_id == contact_id).delete()
    db.delete(contact)
    db.commit()
    return {"message": "Dossier supprimé"}

@app.put("/contacts/{contact_id}/statut", response_model=schemas.ContactReponse)
def modifier_statut(contact_id: int, mise_a_jour: schemas.ContactStatutUpdate, db: Session = Depends(get_db), u: models.Utilisateur = Depends(get_utilisateur_actuel)):
    contact = db.query(models.Contact).filter(models.Contact.id == contact_id, models.Contact.proprietaire_id == u.id).first()
    if not contact: 
        raise HTTPException(status_code=404, detail="Introuvable")
    contact.statut = mise_a_jour.statut
    db.commit()
    db.refresh(contact)
    return contact

@app.get("/contacts/{contact_id}/notes/", response_model=List[schemas.NoteAppelReponse])
def lire_notes(contact_id: int, db: Session = Depends(get_db), u: models.Utilisateur = Depends(get_utilisateur_actuel)):
    contact = db.query(models.Contact).filter(models.Contact.id == contact_id, models.Contact.proprietaire_id == u.id).first()
    if not contact: raise HTTPException(status_code=404, detail="Introuvable")
    return db.query(models.NoteAppel).filter(models.NoteAppel.contact_id == contact.id).all()

@app.post("/contacts/{contact_id}/notes/", response_model=schemas.NoteAppelReponse)
def ajouter_note(contact_id: int, note: schemas.NoteAppelCreation, db: Session = Depends(get_db), u: models.Utilisateur = Depends(get_utilisateur_actuel)):
    contact = db.query(models.Contact).filter(models.Contact.id == contact_id, models.Contact.proprietaire_id == u.id).first()
    if not contact: raise HTTPException(status_code=404, detail="Introuvable")
    nouvelle = models.NoteAppel(contenu=note.contenu, contact_id=contact.id)
    db.add(nouvelle)
    db.commit()
    db.refresh(nouvelle)
    return nouvelle