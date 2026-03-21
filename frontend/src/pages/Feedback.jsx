import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Feedback() {
  const { id } = useParams(); // L'ID du contact
  const [etape, setEtape] = useState(1); // 1: Choix, 2: Positif, 3: Négatif
  const [plainte, setPlainte] = useState('');
  const [envoye, setEnvoye] = useState(false);

  // ⚠️ Plus tard, ce lien viendra de la base de données de l'agence
  const lienGoogleMyBusiness = "https://g.page/r/ton-lien-google-ici/review";

  const envoyerPlainte = async () => {
    if (!plainte) return;
    try {
      // On enverra la plainte au serveur Python plus tard
      // await axios.post(`http://localhost:8000/contacts/${id}/plainte`, { message: plainte });
      setEnvoye(true);
    } catch (error) {
      alert("Erreur lors de l'envoi du message.");
    }
  };

  return (
    <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif', padding: '20px' }}>
      
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
        
        {/* ÉTAPE 1 : LE FILTRE */}
        {etape === 1 && (
          <>
            <h2 style={{ color: '#333', marginBottom: '10px' }}>Votre avis compte !</h2>
            <p style={{ color: '#666', marginBottom: '30px' }}>Avez-vous été satisfait de notre prestation aujourd'hui ?</p>
            
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button onClick={() => setEtape(2)} style={{ flex: 1, padding: '20px', fontSize: '30px', backgroundColor: '#e8f5e9', border: '2px solid #4caf50', borderRadius: '10px', cursor: 'pointer', transition: '0.2s' }}>
                👍
                <div style={{ fontSize: '14px', marginTop: '10px', color: '#4caf50', fontWeight: 'bold' }}>Oui, super !</div>
              </button>
              
              <button onClick={() => setEtape(3)} style={{ flex: 1, padding: '20px', fontSize: '30px', backgroundColor: '#ffebee', border: '2px solid #f44336', borderRadius: '10px', cursor: 'pointer', transition: '0.2s' }}>
                👎
                <div style={{ fontSize: '14px', marginTop: '10px', color: '#f44336', fontWeight: 'bold' }}>Peut mieux faire</div>
              </button>
            </div>
          </>
        )}

        {/* ÉTAPE 2 : LE CLIENT EST CONTENT (Direction Google !) */}
        {etape === 2 && (
          <>
            <div style={{ fontSize: '50px', marginBottom: '10px' }}>🎉</div>
            <h2 style={{ color: '#333' }}>Génial ! Merci beaucoup.</h2>
            <p style={{ color: '#666', marginBottom: '30px' }}>Accepteriez-vous de prendre 10 secondes pour partager votre expérience sur Google ? Cela nous aide énormément !</p>
            <a href={lienGoogleMyBusiness} target="_blank" rel="noreferrer" style={{ display: 'block', padding: '15px', backgroundColor: '#4285f4', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px' }}>
              ⭐⭐⭐⭐⭐ Laisser un avis Google
            </a>
          </>
        )}

        {/* ÉTAPE 3 : LE CLIENT EST DÉÇU (Formulaire privé) */}
        {etape === 3 && !envoye && (
          <>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>😔</div>
            <h2 style={{ color: '#333' }}>Nous sommes désolés.</h2>
            <p style={{ color: '#666', marginBottom: '20px', fontSize: '14px' }}>Votre satisfaction est notre priorité. Dites-nous ce qui n'a pas été pour que notre direction puisse corriger le tir immédiatement.</p>
            <textarea 
              value={plainte} 
              onChange={(e) => setPlainte(e.target.value)} 
              placeholder="Que s'est-il passé ?"
              style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid #ccc', minHeight: '120px', boxSizing: 'border-box', marginBottom: '20px', fontFamily: 'inherit' }}
            />
            <button onClick={envoyerPlainte} style={{ width: '100%', padding: '15px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              Envoyer mon message au gérant
            </button>
          </>
        )}

        {/* ÉTAPE 4 : CONFIRMATION DE LA PLAINTE */}
        {etape === 3 && envoye && (
          <>
            <div style={{ fontSize: '50px', marginBottom: '10px' }}>✅</div>
            <h2 style={{ color: '#333' }}>Message bien reçu.</h2>
            <p style={{ color: '#666' }}>Merci pour votre franchise. La direction a été notifiée et nous allons faire le nécessaire pour nous améliorer.</p>
          </>
        )}

      </div>
    </div>
  );
}

export default Feedback;