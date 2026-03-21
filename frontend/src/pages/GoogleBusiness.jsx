import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function GoogleBusiness() {
  const navigate = useNavigate();
  // Simule l'état de connexion à Google
  const [isConnected, setIsConnected] = useState(false);

  // Faux avis pour te montrer le design
  const avis = [
    { id: 1, auteur: "Sophie Martin", note: 5, texte: "Excellente agence, mon site web est magnifique et j'ai beaucoup plus de clients !", date: "Il y a 2 jours" },
    { id: 2, auteur: "Marc Dubois", note: 5, texte: "Très professionnels et réactifs. Le CRM qu'ils m'ont installé a changé ma façon de travailler.", date: "Il y a 1 semaine" },
    { id: 3, auteur: "Julie Lemaire", note: 4, texte: "Bon travail dans l'ensemble, l'équipe de Digital Scale est vraiment à l'écoute.", date: "Il y a 2 semaines" }
  ];

  return (
    <div style={{ backgroundColor: '#0f1115', minHeight: '100vh', padding: '40px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* En-tête */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid #2a2d35', paddingBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '32px' }}>⭐</span>
            <div>
              <h1 style={{ color: '#fff', margin: '0', fontSize: '28px' }}>Google My Business</h1>
              <p style={{ color: '#9ca3af', margin: '5px 0 0 0', fontSize: '14px' }}>Gérez votre e-réputation et répondez aux avis de vos clients.</p>
            </div>
          </div>
          <button onClick={() => navigate('/dashboard')} style={{ backgroundColor: '#2a2d35', color: '#fff', border: 'none', borderRadius: '6px', padding: '10px 20px', cursor: 'pointer', fontWeight: 'bold' }}>
            ← Retour au Dashboard
          </button>
        </div>

        {!isConnected ? (
          // ÉCRAN DE CONNEXION
          <div style={{ backgroundColor: '#17191e', padding: '50px', borderRadius: '12px', border: '1px dashed #4f46e5', textAlign: 'center' }}>
            <h2 style={{ color: '#fff', marginBottom: '15px' }}>Connectez votre compte Google</h2>
            <p style={{ color: '#9ca3af', marginBottom: '30px', maxWidth: '500px', margin: '0 auto 30px auto' }}>
              Pour afficher et répondre à vos avis directement depuis Digital Scale, vous devez autoriser l'accès à votre fiche d'établissement Google.
            </p>
            <button onClick={() => setIsConnected(true)} style={{ backgroundColor: '#fff', color: '#000', border: 'none', borderRadius: '6px', padding: '12px 24px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', margin: '0 auto' }}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" style={{ width: '20px' }} />
              Se connecter avec Google
            </button>
          </div>
        ) : (
          // ÉCRAN DU TABLEAU DE BORD DES AVIS
          <div>
            {/* Statistiques globales */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
              <div style={{ backgroundColor: '#17191e', padding: '20px', borderRadius: '12px', border: '1px solid #2a2d35', flex: 1, display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#fff' }}>4.8</div>
                <div>
                  <div style={{ color: '#f59e0b', fontSize: '20px', letterSpacing: '2px' }}>★★★★★</div>
                  <div style={{ color: '#9ca3af', fontSize: '14px', marginTop: '5px' }}>Basé sur 42 avis</div>
                </div>
              </div>
              <div style={{ backgroundColor: '#17191e', padding: '20px', borderRadius: '12px', border: '1px solid #2a2d35', flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                 <button style={{ backgroundColor: '#4f46e5', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                   Demander un avis par email
                 </button>
              </div>
            </div>

            {/* Liste des avis */}
            <h3 style={{ color: '#fff', marginBottom: '20px' }}>Avis récents</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {avis.map((a) => (
                <div key={a.id} style={{ backgroundColor: '#17191e', padding: '20px', borderRadius: '12px', border: '1px solid #2a2d35' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ color: '#fff', fontWeight: 'bold' }}>{a.auteur}</div>
                    <div style={{ color: '#9ca3af', fontSize: '12px' }}>{a.date}</div>
                  </div>
                  <div style={{ color: '#f59e0b', fontSize: '14px', marginBottom: '10px', letterSpacing: '2px' }}>
                    {'★'.repeat(a.note)}{'☆'.repeat(5 - a.note)}
                  </div>
                  <p style={{ color: '#d1d5db', margin: '0 0 15px 0', fontSize: '14px', lineHeight: '1.5' }}>
                    "{a.texte}"
                  </p>
                  <button style={{ backgroundColor: 'transparent', color: '#4f46e5', border: '1px solid #4f46e5', borderRadius: '5px', padding: '6px 12px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                    Répondre
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default GoogleBusiness;