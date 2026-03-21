import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 📊 Notre "cerveau" pour les statistiques
  const [stats, setStats] = useState({
    totalContacts: 0,
    caSigne: 0,
    caAttente: 0
  });

  useEffect(() => {
    const chargerDashboard = async () => {
      const token = localStorage.getItem('badge_vip');
      if (!token) return navigate('/login');

      try {
        const reponse = await axios.get('http://localhost:8000/contacts/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const data = reponse.data;
        setContacts(data);

        // 🧠 LE CALCUL MAGIQUE DES STATISTIQUES
        let total = data.length;
        let signe = 0;
        let attente = 0;

       data.forEach(client => {
          const montant = client.montant_offre || 0;
          // On vérifie si le statut CONTIENT le mot "Signé"
          if (client.statut && client.statut.includes('Signé')) {
            signe += montant;
          } else {
            // Sinon, c'est en attente
            attente += montant;
          }
        });

        setStats({ totalContacts: total, caSigne: signe, caAttente: attente });

      } catch (error) {
        console.error("Erreur de chargement du dashboard :", error);
      } finally {
        setIsLoading(false);
      }
    };

    chargerDashboard();
  }, [navigate]);

  if (isLoading) return <div style={{ minHeight: '100vh', backgroundColor: '#0f1115', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Chargement de votre espace...</div>;

  return (
    <div style={{ backgroundColor: '#0f1115', minHeight: '100vh', padding: '40px', color: '#f9fafb', fontFamily: 'sans-serif' }}>
      
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
      {/* EN-TÊTE DU DASHBOARD AVEC BOUTON PARAMÈTRES */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid #2a2d35', paddingBottom: '20px' }}>
          <div>
            <h1 style={{ margin: '0 0 10px 0', fontSize: '32px', color: '#fff' }}>Tableau de Bord</h1>
            <p style={{ margin: 0, color: '#9ca3af' }}>Bienvenue sur votre espace Digital Scale CRM.</p>
          </div>
        <button onClick={() => navigate('/google-business')} style={{ backgroundColor: '#f59e0b', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
  ⭐ Avis Google
</button>  
          <div style={{ display: 'flex', gap: '10px' }}> {/* Groupe de boutons */}
            <button onClick={() => navigate('/profil')} style={{ backgroundColor: '#2a2d35', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
              ⚙️ Paramètres de l'Agence
            </button>
            <button onClick={() => navigate('/nouveau-contact')} style={{ backgroundColor: '#4f46e5', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
              + Nouveau Client
            </button>
          </div>
        </div>

        {/* 📊 LES CARTES DE STATISTIQUES */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          
          {/* Carte 1 : CA Signé */}
          <div style={{ backgroundColor: '#17191e', padding: '25px', borderRadius: '12px', border: '1px solid #2a2d35', borderLeft: '4px solid #10b981' }}>
            <h3 style={{ color: '#9ca3af', margin: '0 0 10px 0', fontSize: '14px', textTransform: 'uppercase' }}>Chiffre d'Affaires Encaissé</h3>
            <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}>{stats.caSigne.toFixed(2)} $</p>
          </div>

          {/* Carte 2 : CA en Attente */}
          <div style={{ backgroundColor: '#17191e', padding: '25px', borderRadius: '12px', border: '1px solid #2a2d35', borderLeft: '4px solid #f59e0b' }}>
            <h3 style={{ color: '#9ca3af', margin: '0 0 10px 0', fontSize: '14px', textTransform: 'uppercase' }}>Opportunités en cours</h3>
            <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#f59e0b' }}>{stats.caAttente.toFixed(2)} $</p>
          </div>

          {/* Carte 3 : Total Contacts */}
          <div style={{ backgroundColor: '#17191e', padding: '25px', borderRadius: '12px', border: '1px solid #2a2d35', borderLeft: '4px solid #3b82f6' }}>
            <h3 style={{ color: '#9ca3af', margin: '0 0 10px 0', fontSize: '14px', textTransform: 'uppercase' }}>Total des Prospects</h3>
            <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#3b82f6' }}>{stats.totalContacts}</p>
          </div>

        </div>

        {/* 📋 LE TABLEAU DES CLIENTS */}
        <div style={{ backgroundColor: '#17191e', borderRadius: '12px', border: '1px solid #2a2d35', overflow: 'hidden' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #2a2d35' }}>
            <h2 style={{ margin: 0, fontSize: '18px', color: '#fff' }}>Vos Dossiers Clients</h2>
          </div>
          
          {contacts.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
              Aucun client pour le moment. Cliquez sur "+ Nouveau Client" pour commencer !
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#1f2229', color: '#9ca3af', fontSize: '13px', textTransform: 'uppercase' }}>
                  <th style={{ padding: '15px 20px', fontWeight: 'normal' }}>Client</th>
                  <th style={{ padding: '15px 20px', fontWeight: 'normal' }}>Entreprise</th>
                  <th style={{ padding: '15px 20px', fontWeight: 'normal' }}>Statut</th>
                  <th style={{ padding: '15px 20px', fontWeight: 'normal', textAlign: 'right' }}>Montant</th>
                  <th style={{ padding: '15px 20px', fontWeight: 'normal', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr key={contact.id} style={{ borderBottom: '1px solid #2a2d35', transition: '0.2s' }}>
                    <td style={{ padding: '15px 20px', fontWeight: 'bold', textTransform: 'capitalize' }}>{contact.prenom} {contact.nom}</td>
                    <td style={{ padding: '15px 20px', color: '#9ca3af' }}>{contact.entreprise || '-'}</td>
                   <td style={{ padding: '15px 20px' }}>
                      <span style={{ 
                        padding: '5px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold',
                        backgroundColor: contact.statut?.includes('Signé') ? '#10b98122' : contact.statut?.includes('négociation') ? '#f59e0b22' : '#3b82f622',
                        color: contact.statut?.includes('Signé') ? '#10b981' : contact.statut?.includes('négociation') ? '#f59e0b' : '#3b82f6'
                      }}>
                        {contact.statut}
                      </span>
                    </td>
                    <td style={{ padding: '15px 20px', textAlign: 'right', fontWeight: 'bold' }}>{contact.montant_offre} $</td>
                    <td style={{ padding: '15px 20px', textAlign: 'center' }}>
                      <Link to={`/contact/${contact.id}`} style={{ backgroundColor: '#2a2d35', color: '#fff', textDecoration: 'none', padding: '8px 16px', borderRadius: '5px', fontSize: '13px', transition: '0.2s' }}>
                        Ouvrir le dossier
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;