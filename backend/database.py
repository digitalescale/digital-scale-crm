from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# 🔒 VÉRIFICATION DE SÉCURITÉ :
# L'utilisation de SQLAlchemy nous protège nativement contre les injections SQL, 
# qui sont la faille numéro 1 des applications web.

# URL de notre base de données locale (un fichier qui va se créer tout seul)
SQLALCHEMY_DATABASE_URL = "sqlite:///./digital_scale.db"

# Le "moteur" qui connecte Python à la base de données
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False} # Nécessaire uniquement pour SQLite
)

# La "Session" nous permet de discuter avec la base de données
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# La classe de base pour créer nos futures "Tables" (Utilisateurs, Contacts, etc.)
Base = declarative_base()

# Fonction pour ouvrir et fermer la connexion proprement à chaque requête
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()