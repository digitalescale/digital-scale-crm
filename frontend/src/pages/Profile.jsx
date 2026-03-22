import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Profil() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' }); // Pour les alertes de succès/erreur

  // Les données du formulaire
  const [profil, setProfil] = useState({
    email: '',
    nom_entreprise: '',
    telephone_compte: '',
    adresse_complete: '',
    devise: 'CAD'
  });

  // 1. Charger les données au démarrage
  useEffect(() => {
    const chargerProfil = async () => {
      const token = localStorage.getItem('badge_vip');
      if (!token) return navigate('/login');

      try {
        const reponse = await axios.get('https://digital-scale-crm.onrender.com/utilisateurs/moi', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // On remplit le formulaire avec les infos de la base de données
        setProfil({
          email: reponse.data.email || '',
          nom_entreprise: reponse.data.nom_entreprise || '',
          telephone_compte: reponse.data.telephone_compte || '',
          adresse_complete: reponse.data.adresse_complete || '',
          devise: reponse.data.devise || 'CAD'
        });
      } catch (error) {
        console.error("Erreur :", error);
      } finally {
        setIsLoading(false);
      }
    };
    chargerProfil();
  }, [navigate]);

  // 2. Gérer la saisie dans les champs
  const handleChange = (e) => {
    setProfil({ ...profil, [e.target.name]: e.target.value });
  };

  // 3. Sauvegarder les modifications
  const sauvegarderModifications = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('badge_vip');
    
    try {
      await axios.put('https://digital-scale-crm.onrender.com/utilisateurs/moi', profil, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage({ text: '✅ Profil mis à jour avec succès !', type: 'success' });
      
      // Le message disparaît après 3 secondes
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      setMessage({ text: '❌ Erreur lors de la sauvegarde.', type: 'error' });
    }
  };

  // --- STYLES ---
  const inputStyle = {
    width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '6px',
    border: '1px solid #2a2d35', backgroundColor: '#1f2229', color: '#fff', fontSize: '15px'
  };

  const labelStyle = {
    display: 'block', marginBottom: '8px', color: '#9ca3af', fontSize: '14px', fontWeight: 'bold'
  };

  if (isLoading) return <div style={{ minHeight: '100vh', backgroundColor: '#0f1115', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Chargement...</div>;

  return (
    <div style={{ backgroundColor: '#0f1115', minHeight: '100vh', padding: '40px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        
        {/* En-tête de page propre */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid #2a2d35', paddingBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '32px' }}>⚙️</span> {/* L'icône séparée */}
            <div>
                <h1 style={{ color: '#fff', margin: '0', fontSize: '28px' }}>Paramètres de l'Agence</h1>
                <p style={{ color: '#9ca3af', margin: '5px 0 0 0', fontSize: '14px' }}>Gérez les informations qui apparaîtront sur vos factures.</p>
            </div>
          </div>
          <button onClick={() => navigate('/dashboard')} style={{ backgroundColor: '#2a2d35', color: '#fff', border: 'none', borderRadius: '6px', padding: '10px 20px', cursor: 'pointer', fontWeight: 'bold' }}>
            ← Retour au Dashboard
          </button>
        </div>

        {/* Alerte de succès/erreur */}
        {message.text && (
          <div style={{ padding: '15px', borderRadius: '6px', marginBottom: '20px', backgroundColor: message.type === 'success' ? '#10b98122' : '#ff4d4d22', color: message.type === 'success' ? '#10b981' : '#ff4d4d', border: `1px solid ${message.type === 'success' ? '#10b981' : '#ff4d4d'}` }}>
            {message.text}
          </div>
        )}

        {/* Le Formulaire */}
        <div style={{ backgroundColor: '#17191e', padding: '30px', borderRadius: '12px', border: '1px solid #2a2d35' }}>
          <form onSubmit={sauvegarderModifications}>
            
            <label style={labelStyle}>Adresse Email de Connexion (Non modifiable)</label>
            <input type="email" value={profil.email} disabled style={{ ...inputStyle, opacity: 0.5, cursor: 'not-allowed' }} />

            <label style={labelStyle}>Nom de l'Agence (S'affichera sur la facture)</label>
            <input type="text" name="nom_entreprise" value={profil.nom_entreprise} onChange={handleChange} placeholder="Ex: Digital Scale CRM" style={inputStyle} />

            <label style={labelStyle}>Téléphone Professionnel</label>
            <input type="text" name="telephone_compte" value={profil.telephone_compte} onChange={handleChange} placeholder="Ex: +1 438 000 0000" style={inputStyle} />

            <label style={labelStyle}>Adresse Physique (Optionnelle)</label>
            <input type="text" name="adresse_complete" value={profil.adresse_complete} onChange={handleChange} placeholder="Ex: 123 Rue Principale, Montréal" style={inputStyle} />

            <button type="submit" style={{ width: '100%', padding: '15px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
              💾 Sauvegarder les modifications
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default Profil;