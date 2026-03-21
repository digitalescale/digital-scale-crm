import jwt
from datetime import datetime, timedelta
import bcrypt # 🚀 On utilise bcrypt directement, fini passlib !

SECRET_KEY = "digital_scale_cle_secrete_ultra_complexe_2026" 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# Fonction 1 : Vérifier le mot de passe
def verifier_mot_de_passe(mot_de_passe_clair: str, mot_de_passe_hache: str):
    # bcrypt a besoin de "bytes" (octets) pour travailler, on encode donc le texte
    mot_de_passe_bytes = mot_de_passe_clair.encode('utf-8')
    hache_bytes = mot_de_passe_hache.encode('utf-8')
    return bcrypt.checkpw(mot_de_passe_bytes, hache_bytes)

# Fonction 2 : Crypter un nouveau mot de passe
def hacher_mot_de_passe(mot_de_passe: str):
    mot_de_passe_bytes = mot_de_passe.encode('utf-8')
    # On génère un "sel" (salt) aléatoire pour rendre le cryptage mathématiquement indéchiffrable
    sel = bcrypt.gensalt()
    mot_de_passe_hache = bcrypt.hashpw(mot_de_passe_bytes, sel)
    # On le décode en texte normal pour pouvoir le ranger dans notre base de données
    return mot_de_passe_hache.decode('utf-8')

# Fonction 3 : Fabriquer le Badge VIP (Token JWT)
def creer_token_acces(data: dict):
    a_encoder = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    a_encoder.update({"exp": expire})
    
    token_encode = jwt.encode(a_encoder, SECRET_KEY, algorithm=ALGORITHM)
    return token_encode