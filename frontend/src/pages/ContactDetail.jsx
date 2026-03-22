import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ContactDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [contact, setContact] = useState(null);
  const [notes, setNotes] = useState([]);
  const [nouvelleNote, setNouvelleNote] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Nouveaux états pour la modification
  const [modeEdition, setModeEdition] = useState(false);
  const [donneesEdition, setDonneesEdition] = useState({});

  useEffect(() => {
    const chargerDonnees = async () => {
      const token = localStorage.getItem('badge_vip');
      if (!token) return navigate('/login');

      const config = { headers: { Authorization: `Bearer ${token}` } };

      try {
        const resContacts = await axios.get('https://digital-scale-crm.onrender.com/contacts/', config);
        const leContact = resContacts.data.find(c => c.id === parseInt(id));
        
        if (leContact) {
          setContact(leContact);
          setDonneesEdition(leContact); // On prépare les données pour le formulaire de modif
          
          try {
              const resNotes = await axios.get(`https://digital-scale-crm.onrender.com/contacts/${id}/notes/`, config);
              setNotes(resNotes.data);
          } catch (e) { console.log("Aucune note."); }
        } else {
          alert("Client introuvable !");
          navigate('/dashboard');
        }
      } catch (error) {
        console.error("Erreur chargement :", error);
      } finally {
        setIsLoading(false);
      }
    };
    chargerDonnees();
  }, [id, navigate]);

  // --- ACTIONS ---

  const changerStatut = async (nouveauStatut) => {
    const token = localStorage.getItem('badge_vip');
    try {
      await axios.put(`https://digital-scale-crm.onrender.com/contacts/${id}/statut`, { statut: nouveauStatut }, { headers: { Authorization: `Bearer ${token}` } });
      setContact({ ...contact, statut: nouveauStatut });
    } catch (error) { console.error(error); }
  };

  const ajouterNote = async (e) => {
    e.preventDefault();
    if (!nouvelleNote.trim()) return;
    const token = localStorage.getItem('badge_vip');
    try {
      const res = await axios.post(`https://digital-scale-crm.onrender.com/contacts/${id}/notes/`, { contenu: nouvelleNote }, { headers: { Authorization: `Bearer ${token}` } });
      setNotes([...notes, res.data]);
      setNouvelleNote('');
    } catch (error) { console.error(error); }
  };

  // 1. Fonction pour sauvegarder les modifications
  const sauvegarderModifications = async () => {
    const token = localStorage.getItem('badge_vip');
    try {
      const res = await axios.put(`https://digital-scale-crm.onrender.com/contacts/${id}`, donneesEdition, { headers: { Authorization: `Bearer ${token}` } });
      setContact(res.data);
      setModeEdition(false); // On quitte le mode édition
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la modification. Vérifiez que tous les champs requis sont remplis.");
    }
  };

  // 2. Fonction pour supprimer le contact
  const supprimerContact = async () => {
    if (window.confirm("⚠️ Êtes-vous sûr de vouloir supprimer définitivement ce client ? Tout son historique sera effacé.")) {
        const token = localStorage.getItem('badge_vip');
        try {
            await axios.delete(`https://digital-scale-crm.onrender.com/contacts/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            navigate('/dashboard'); // Retour au bercail après suppression
        } catch (error) {
            console.error(error);
            alert("Erreur lors de la suppression.");
        }
    }
  };


  if (isLoading) return <div style={{ minHeight: '100vh', backgroundColor: '#0f1115', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Chargement du dossier client...</div>;
  if (!contact) return null;

  return (
    <div style={{ padding: '40px', backgroundColor: '#0f1115', minHeight: '100vh', color: '#f9fafb', fontFamily: 'sans-serif' }}>
      
      {/* 🟢 EN-TÊTE DE LA FICHE */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #2a2d35', paddingBottom: '20px' }}>
        <div>
            <button onClick={() => navigate('/dashboard')} style={{ backgroundColor: 'transparent', color: '#9ca3af', border: 'none', cursor: 'pointer', marginBottom: '10px', fontSize: '14px', padding: 0 }}>
               ← Retour au Dashboard
            </button>
            <h1 style={{ margin: '0 0 5px 0', fontSize: '32px', color: '#f9fafb', textTransform: 'capitalize' }}>
                {contact.prenom || ''} {contact.nom || 'Client Sans Nom'}
            </h1>
            <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0 }}>Dossier Client #{contact.id}</p>
        </div>
        
        <div style={{ display: 'flex', gap: '15px' }}>
            {/* BOUTON SUPPRIMER */}
            <button onClick={supprimerContact} style={{ backgroundColor: 'transparent', color: '#ff4d4d', border: '1px solid #ff4d4d', borderRadius: '5px', padding: '12px 20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
               🗑️ Supprimer
            </button>
            {/* BOUTON FACTURE */}
            <button onClick={() => navigate(`/contact/${contact.id}/facture`)} style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '5px', padding: '12px 24px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
               📄 Générer une Facture
            </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
          
          {/* 📍 COLONNE GAUCHE : INFOS & STATUT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Carte Statut */}
              <div style={{ backgroundColor: '#17191e', padding: '25px', borderRadius: '10px', border: '1px solid #2a2d35' }}>
                  <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#9ca3af' }}>Statut du dossier</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <button onClick={() => changerStatut('Nouveau')} style={{ padding: '10px', borderRadius: '5px', border: contact.statut === 'Nouveau' ? '2px solid #4f46e5' : '1px solid #2a2d35', backgroundColor: contact.statut === 'Nouveau' ? '#4f46e522' : 'transparent', color: contact.statut === 'Nouveau' ? '#4f46e5' : '#fff', cursor: 'pointer', fontWeight: 'bold' }}>
                          🔵 Nouveau
                      </button>
                      <button onClick={() => changerStatut('En négociation')} style={{ padding: '10px', borderRadius: '5px', border: contact.statut === 'En négociation' ? '2px solid #ffc107' : '1px solid #2a2d35', backgroundColor: contact.statut === 'En négociation' ? '#ffc10722' : 'transparent', color: contact.statut === 'En négociation' ? '#ffc107' : '#fff', cursor: 'pointer', fontWeight: 'bold' }}>
                          🟠 En négociation
                      </button>
                      <button onClick={() => changerStatut('Signé')} style={{ padding: '10px', borderRadius: '5px', border: contact.statut === 'Signé' ? '2px solid #10b981' : '1px solid #2a2d35', backgroundColor: contact.statut === 'Signé' ? '#10b98122' : 'transparent', color: contact.statut === 'Signé' ? '#10b981' : '#fff', cursor: 'pointer', fontWeight: 'bold' }}>
                          🟢 Signé (Gagné)
                      </button>
                  </div>
              </div>

              {/* Carte Coordonnées avec Mode Édition */}
              <div style={{ backgroundColor: '#17191e', padding: '25px', borderRadius: '10px', border: '1px solid #2a2d35' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                      <h3 style={{ margin: 0, fontSize: '16px', color: '#9ca3af' }}>Coordonnées</h3>
                      {!modeEdition ? (
                          <button onClick={() => setModeEdition(true)} style={{ background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}>✏️ Modifier</button>
                      ) : (
                          <div style={{ display: 'flex', gap: '10px' }}>
                              <button onClick={() => setModeEdition(false)} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '12px' }}>Annuler</button>
                              <button onClick={sauvegarderModifications} style={{ background: '#4f46e5', border: 'none', color: '#fff', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Enregistrer</button>
                          </div>
                      )}
                  </div>

                  {!modeEdition ? (
                      // Affichage normal
                      <>
                          <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}><strong style={{ color: '#fff' }}>Email:</strong> {contact.email || 'N/A'}</p>
                          <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}><strong style={{ color: '#fff' }}>Téléphone:</strong> {contact.telephone || 'N/A'}</p>
                          <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}><strong style={{ color: '#fff' }}>Entreprise:</strong> {contact.entreprise || 'N/A'}</p>
                          <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #2a2d35' }}>
                              <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#9ca3af' }}>Montant de l'offre</p>
                              <p style={{ margin: 0, fontSize: '24px', color: '#10b981', fontWeight: 'bold' }}>{contact.montant_offre || '0'} $</p>
                          </div>
                      </>
                  ) : (
                      // Mode Formulaire
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <input type="text" placeholder="Prénom" value={donneesEdition.prenom || ''} onChange={(e) => setDonneesEdition({...donneesEdition, prenom: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '5px', backgroundColor: '#0f1115', color: '#fff', border: '1px solid #2a2d35' }} />
                          <input type="text" placeholder="Nom" value={donneesEdition.nom || ''} onChange={(e) => setDonneesEdition({...donneesEdition, nom: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '5px', backgroundColor: '#0f1115', color: '#fff', border: '1px solid #2a2d35' }} />
                          <input type="email" placeholder="Email" value={donneesEdition.email || ''} onChange={(e) => setDonneesEdition({...donneesEdition, email: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '5px', backgroundColor: '#0f1115', color: '#fff', border: '1px solid #2a2d35' }} />
                          <input type="text" placeholder="Téléphone" value={donneesEdition.telephone || ''} onChange={(e) => setDonneesEdition({...donneesEdition, telephone: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '5px', backgroundColor: '#0f1115', color: '#fff', border: '1px solid #2a2d35' }} />
                          <input type="text" placeholder="Entreprise" value={donneesEdition.entreprise || ''} onChange={(e) => setDonneesEdition({...donneesEdition, entreprise: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '5px', backgroundColor: '#0f1115', color: '#fff', border: '1px solid #2a2d35' }} />
                          <input type="number" placeholder="Montant ($)" value={donneesEdition.montant_offre || 0} onChange={(e) => setDonneesEdition({...donneesEdition, montant_offre: parseFloat(e.target.value)})} style={{ width: '100%', padding: '8px', borderRadius: '5px', backgroundColor: '#0f1115', color: '#10b981', border: '1px solid #2a2d35', fontWeight: 'bold' }} />
                      </div>
                  )}
              </div>
          </div>

          {/* 📝 COLONNE DROITE : NOTES D'APPELS */}
          <div style={{ backgroundColor: '#17191e', padding: '25px', borderRadius: '10px', border: '1px solid #2a2d35', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#fff', borderBottom: '1px solid #2a2d35', paddingBottom: '15px' }}>Historique & Notes</h3>
              
              <div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {notes.length === 0 ? (
                      <p style={{ color: '#9ca3af', fontStyle: 'italic', textAlign: 'center', marginTop: '20px' }}>Aucune note pour le moment.</p>
                  ) : (
                      notes.map((note, index) => (
                          <div key={index} style={{ backgroundColor: '#0f1115', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #4f46e5' }}>
                              <p style={{ color: '#9ca3af', fontSize: '12px', margin: '0 0 5px 0' }}>Le {new Date(note.date_creation).toLocaleDateString('fr-FR')} à {new Date(note.date_creation).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}</p>
                              <p style={{ color: '#f9fafb', fontSize: '14px', margin: 0, lineHeight: '1.5' }}>{note.contenu}</p>
                          </div>
                      ))
                  )}
              </div>

              <form onSubmit={ajouterNote} style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                  <input type="text" value={nouvelleNote} onChange={(e) => setNouvelleNote(e.target.value)} placeholder="Résumé de l'appel, prochain rdv..." style={{ flex: 1, padding: '15px', borderRadius: '5px', backgroundColor: '#0f1115', color: '#f9fafb', border: '1px solid #2a2d35', outline: 'none' }} />
                  <button type="submit" style={{ backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '5px', padding: '0 25px', cursor: 'pointer', fontWeight: 'bold' }}>Ajouter</button>
              </form>
          </div>
      </div>
    </div>
  );
}

export default ContactDetail;