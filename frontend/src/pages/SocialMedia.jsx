import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function SocialMedia() {
  const navigate = useNavigate();
  const [textePost, setTextePost] = useState('');
  const [reseaux, setReseaux] = useState({ facebook: false, instagram: false, linkedin: false });
  const [statutConnexion, setStatutConnexion] = useState({ facebook: true, instagram: false, linkedin: false }); // On simule que FB est déjà connecté

  const publierPost = async () => {
    if (!textePost) return alert("Veuillez écrire un message.");
    if (!reseaux.facebook && !reseaux.instagram && !reseaux.linkedin) return alert("Sélectionnez au moins un réseau social.");
    
    const token = localStorage.getItem('badge_vip');
    try {
      const reponse = await axios.post('http://localhost:8000/social/publier', {
        texte: textePost,
        reseaux: reseaux
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert(`✅ Succès : ${reponse.data.message}\nRéseaux : ${reponse.data.reseaux_touches.join(', ')}`);
      setTextePost(''); // On vide le champ après succès
      setReseaux({ facebook: false, instagram: false, linkedin: false }); // On décoche
    } catch (erreur) {
      alert("Erreur lors de la publication. Vérifiez votre connexion.");
    }
  };

  const toggleReseau = (reseau) => {
    if (!statutConnexion[reseau]) {
      alert(`Vous devez d'abord connecter votre compte ${reseau.toUpperCase()} (Boutons en haut à droite).`);
      return;
    }
    setReseaux({ ...reseaux, [reseau]: !reseaux[reseau] });
  };

  const simulerConnexion = (reseau) => {
    alert(`Redirection vers la page de connexion de ${reseau.toUpperCase()} (OAuth)...`);
    // Simulation de la réponse OAuth
    setTimeout(() => {
      setStatutConnexion({ ...statutConnexion, [reseau]: true });
      alert(`✅ Compte ${reseau.toUpperCase()} connecté avec succès !`);
    }, 1500);
  };

  return (
    <div style={{ padding: '40px', backgroundColor: '#1a1d24', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
            <button onClick={() => navigate('/dashboard')} style={{ color: '#4285f4', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', padding: 0, marginBottom: '10px' }}>← Retour au Dashboard</button>
            <h2 style={{ margin: 0 }}>📱 Planificateur Réseaux Sociaux</h2>
        </div>

        {/* BOUTONS DE CONNEXION OAUTH */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => simulerConnexion('facebook')} style={{ padding: '10px 15px', backgroundColor: statutConnexion.facebook ? '#1877F2' : '#333', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
             {statutConnexion.facebook ? '✅ Facebook Connecté' : '🔗 Connecter Facebook'}
          </button>
          <button onClick={() => simulerConnexion('instagram')} style={{ padding: '10px 15px', backgroundColor: statutConnexion.instagram ? '#E4405F' : '#333', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
             {statutConnexion.instagram ? '✅ Instagram Connecté' : '🔗 Connecter Instagram'}
          </button>
          <button onClick={() => simulerConnexion('linkedin')} style={{ padding: '10px 15px', backgroundColor: statutConnexion.linkedin ? '#0A66C2' : '#333', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
             {statutConnexion.linkedin ? '✅ LinkedIn Connecté' : '🔗 Connecter LinkedIn'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '30px' }}>
        {/* COLONNE GAUCHE : CRÉATION DU POST */}
        <div style={{ flex: 2, backgroundColor: '#21252b', padding: '30px', borderRadius: '10px', border: '1px solid #333' }}>
          <h3>Nouveau Post</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <p style={{ color: '#bbb', marginBottom: '10px' }}>1. Où voulez-vous publier ?</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', opacity: statutConnexion.facebook ? 1 : 0.5 }}>
                <input type="checkbox" checked={reseaux.facebook} onChange={() => toggleReseau('facebook')} /> Facebook
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', opacity: statutConnexion.instagram ? 1 : 0.5 }}>
                <input type="checkbox" checked={reseaux.instagram} onChange={() => toggleReseau('instagram')} /> Instagram
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', opacity: statutConnexion.linkedin ? 1 : 0.5 }}>
                <input type="checkbox" checked={reseaux.linkedin} onChange={() => toggleReseau('linkedin')} /> LinkedIn
              </label>
            </div>
          </div>

          <p style={{ color: '#bbb', marginBottom: '10px' }}>2. Votre message (Utilisez l'IA depuis le Dashboard si besoin) :</p>
          <textarea 
            placeholder="Écrivez votre post ici..." 
            value={textePost} 
            onChange={e => setTextePost(e.target.value)} 
            style={{ width: '100%', height: '150px', padding: '15px', borderRadius: '5px', backgroundColor: '#333', color: 'white', border: '1px solid #444', boxSizing: 'border-box', marginBottom: '20px', fontFamily: 'sans-serif', resize: 'vertical' }}
          />

          <button onClick={publierPost} style={{ padding: '15px 30px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>
            🚀 Publier Maintenant
          </button>
        </div>

        {/* COLONNE DROITE : APERÇU */}
        <div style={{ flex: 1, backgroundColor: '#21252b', padding: '30px', borderRadius: '10px', border: '1px solid #333' }}>
           <h3 style={{ marginTop: 0 }}>Aperçu (Mobile)</h3>
           <div style={{ backgroundColor: '#fff', color: '#000', borderRadius: '10px', padding: '15px', minHeight: '200px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: '#ddd', borderRadius: '50%' }}></div>
                <div>
                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>Mon Entreprise</div>
                    <div style={{ fontSize: '12px', color: '#777' }}>À l'instant</div>
                </div>
              </div>
              <p style={{ whiteSpace: 'pre-wrap', fontSize: '14px', margin: 0 }}>
                {textePost || "L'aperçu de votre texte apparaîtra ici..."}
              </p>
           </div>
        </div>
      </div>

    </div>
  );
}

export default SocialMedia;