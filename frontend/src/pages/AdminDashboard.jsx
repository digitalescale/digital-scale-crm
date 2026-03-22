import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const navigate = useNavigate();

  const chargerUtilisateurs = async () => {
    const token = localStorage.getItem('badge_vip');
    if (!token) { navigate('/login'); return; }

    try {
      const res = await axios.get('https://digital-scale-crm.onrender.com/admin/utilisateurs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUtilisateurs(res.data);
    } catch (erreur) {
      alert("🛑 Accès refusé : Vous n'êtes pas SuperAdmin.");
      navigate('/dashboard');
    }
  };

  useEffect(() => {
    chargerUtilisateurs();
  }, []);

  const changerStatut = async (id, nouveauStatut) => {
    const token = localStorage.getItem('badge_vip');
    try {
      await axios.put(`https://digital-scale-crm.onrender.com/admin/utilisateurs/${id}/abonnement?nouveau_statut=${nouveauStatut}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      chargerUtilisateurs(); // On recharge la liste pour voir le changement
    } catch (erreur) {
      alert("Erreur lors de la modification de l'abonnement.");
    }
  };

  return (
    <div style={{ padding: '40px', backgroundColor: '#0d1117', minHeight: '100vh', color: '#c9d1d9', fontFamily: 'sans-serif' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', borderBottom: '1px solid #30363d', paddingBottom: '20px' }}>
        <h1 style={{ margin: 0, color: '#ff7b72' }}>👑 Panneau SuperAdmin - Digital Scale</h1>
        <button onClick={() => navigate('/dashboard')} style={{ padding: '10px 20px', backgroundColor: '#238636', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          Retour à mon CRM
        </button>
      </div>

      <div style={{ backgroundColor: '#161b22', padding: '25px', borderRadius: '10px', border: '1px solid #30363d' }}>
        <h3 style={{ marginTop: 0 }}>Abonnés ({utilisateurs.length})</h3>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #30363d', textAlign: 'left', color: '#8b949e' }}>
              <th style={{ padding: '12px' }}>Email / Entreprise</th>
              <th style={{ padding: '12px' }}>Type</th>
              <th style={{ padding: '12px' }}>Fin de l'essai</th>
              <th style={{ padding: '12px' }}>Statut Abonnement</th>
              <th style={{ padding: '12px' }}>Action Manuelle</th>
            </tr>
          </thead>
          <tbody>
            {utilisateurs.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid #30363d' }}>
                <td style={{ padding: '12px' }}>
                  <strong style={{ color: '#58a6ff' }}>{u.email}</strong><br/>
                  <small style={{ color: '#8b949e' }}>{u.nom_entreprise || "Particulier"} ({u.devise})</small>
                </td>
                <td style={{ padding: '12px' }}>{u.type_client}</td>
                <td style={{ padding: '12px' }}>
                  {u.fin_essai ? new Date(u.fin_essai).toLocaleDateString() : 'N/A'}
                </td>
                <td style={{ padding: '12px' }}>
                  <span style={{ 
                    backgroundColor: u.statut_abonnement === 'actif' ? '#2ea043' : u.statut_abonnement === 'annule' ? '#da3633' : '#d29922', 
                    padding: '4px 8px', borderRadius: '5px', fontSize: '12px', color: 'white', fontWeight: 'bold' 
                  }}>
                    {u.statut_abonnement.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  <select 
                    value={u.statut_abonnement} 
                    onChange={(e) => changerStatut(u.id, e.target.value)}
                    style={{ padding: '6px', borderRadius: '5px', backgroundColor: '#0d1117', color: 'white', border: '1px solid #30363d', cursor: 'pointer' }}
                  >
                    <option value="essai">En essai (7j)</option>
                    <option value="actif">Payant (Actif)</option>
                    <option value="gratuit">Offert (Gratuit)</option>
                    <option value="annule">Bloqué / Annulé</option>
                  </select>
                </td>
              </tr>
            ))}
            {utilisateurs.length === 0 && (
              <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>Aucun autre utilisateur inscrit pour le moment.</td></tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default AdminDashboard;