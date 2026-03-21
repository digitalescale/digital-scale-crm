from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.database import Base

class Utilisateur(Base):
    __tablename__ = "utilisateurs"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    mot_de_passe_hache = Column(String)
    role = Column(String, default="client")
    nom_entreprise = Column(String, nullable=True)
    type_client = Column(String, default="standard")
    adresse_complete = Column(String, nullable=True)
    telephone_compte = Column(String, nullable=True)
    devise = Column(String, default="CAD")
    statut_abonnement = Column(String, default="essai")
    fin_essai = Column(DateTime, nullable=True)

    contacts = relationship("Contact", back_populates="proprietaire")

class Contact(Base):
    __tablename__ = "contacts"

    id = Column(Integer, primary_key=True, index=True)
    prenom = Column(String)
    nom = Column(String)
    email = Column(String, nullable=True)
    telephone = Column(String, nullable=True)
    entreprise = Column(String, nullable=True)  # 👈 La fameuse colonne est bien ici !
    montant_offre = Column(Float, default=0.0)
    statut = Column(String, default="Nouveau")
    date_creation = Column(DateTime, default=datetime.utcnow)
    proprietaire_id = Column(Integer, ForeignKey("utilisateurs.id"))

    proprietaire = relationship("Utilisateur", back_populates="contacts")
    notes = relationship("NoteAppel", back_populates="contact")

class NoteAppel(Base):
    __tablename__ = "notes_appels"

    id = Column(Integer, primary_key=True, index=True)
    contenu = Column(String)
    date_creation = Column(DateTime, default=datetime.utcnow)
    contact_id = Column(Integer, ForeignKey("contacts.id"))

    contact = relationship("Contact", back_populates="notes")