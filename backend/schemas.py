from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

# --- UTILISATEURS ---
class UtilisateurCreation(BaseModel):
    email: str
    mot_de_passe: str
    nom_entreprise: Optional[str] = None
    type_client: Optional[str] = "standard"
    adresse_complete: Optional[str] = None
    telephone_compte: Optional[str] = None
    devise: Optional[str] = "CAD"

class UtilisateurUpdate(BaseModel):
    nom_entreprise: Optional[str] = None
    adresse_complete: Optional[str] = None
    telephone_compte: Optional[str] = None
    devise: Optional[str] = None   

class UtilisateurReponse(BaseModel):
    id: int
    email: str
    role: Optional[str] = "client"
    nom_entreprise: Optional[str] = None
    statut_abonnement: Optional[str] = "actif"
    fin_essai: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- CONTACTS (CRM) ---
class ContactBase(BaseModel):
    prenom: str
    nom: str
    email: Optional[str] = None
    telephone: Optional[str] = None
    entreprise: Optional[str] = None
    montant_offre: Optional[float] = 0.0
    statut: Optional[str] = "Nouveau"

class ContactCreation(ContactBase):
    pass

class ContactStatutUpdate(BaseModel):
    statut: str

class ContactReponse(ContactBase):
    id: int
    proprietaire_id: int
    date_creation: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- NOTES D'APPELS ---
class NoteAppelCreation(BaseModel):
    contenu: str

class NoteAppelReponse(BaseModel):
    id: int
    contenu: str
    date_creation: datetime
    contact_id: int

    class Config:
        from_attributes = True

# --- AUTHENTIFICATION ---
class Token(BaseModel):
    access_token: str
    token_type: str