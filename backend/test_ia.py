import os
from dotenv import load_dotenv
import google.generativeai as genai

# Charger le fichier .env
load_dotenv()
cle_api = os.getenv("GEMINI_API_KEY")

print(f"🔑 Clé utilisée : {cle_api[:10]}... (cachée par sécurité)")
genai.configure(api_key=cle_api)

print("🔍 Recherche des modèles autorisés pour cette clé...")
try:
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"✅ Modèle disponible : {m.name}")
except Exception as e:
    print(f"❌ Erreur bloquante : {e}")