import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddContact() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // Les champs du formulaire
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    entreprise: '',
    montant_offre: '',
    statut: 'Nouveau'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const token = localStorage.getItem('badge_vip');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      // On envoie les données au serveur Python
      await axios.post('http://localhost:8000/contacts/', {
        ...formData,
        montant_offre: formData.montant_offre ? parseFloat(formData.montant_offre) : 0
      }, config);
      
      // Si succès, on retourne au Dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
      alert("Erreur lors de la création du client. Vérifiez la console.");
    }
    setIsLoading(false);
  };

  return (
    <div style={{ padding: '40px', backgroundColor: '#0f1115', minHeight: '100vh', color: '#f9fafb', fontFamily: 'sans-serif', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
      
      <div style={{ backgroundColor: '#17191e', padding: '40px', borderRadius: '10px', width: '100%', maxWidth: '600px', border: '1px solid #2a2d35', boxShadow: '0 4px 20px rgba(0,0,0,0.5)', marginTop: '20px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #2a2d35', paddingBottom: '20px' }}>
            <h1 style={{ margin: 0, fontSize: '24px', color: '#f9fafb' }}>Nouveau Client</h1>
            <button onClick={() => navigate('/dashboard')} style={{ backgroundColor: 'transparent', color: '#9ca3af', border: 'none', cursor: 'pointer', fontSize: '14px' }}>
               ✕ Annuler
            </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '5px', display: 'block' }}>Prénom</label>
                <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} required style={{ width: '100%', padding: '12px', borderRadius: '5px', backgroundColor: '#0f1115', color: '#f9fafb', border: '1px solid #2a2d35', boxSizing: 'border-box', outline: 'none' }} placeholder="Ex: Jean" />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '5px', display: 'block' }}>Nom</label>
                <input type="text" name="nom" value={formData.nom} onChange={handleChange} required style={{ width: '100%', padding: '12px', borderRadius: '5px', backgroundColor: '#0f1115', color: '#f9fafb', border: '1px solid #2a2d35', boxSizing: 'border-box', outline: 'none' }} placeholder="Ex: Dupont" />
              </div>
          </div>

          <div>
            <label style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '5px', display: 'block' }}>Adresse Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '5px', backgroundColor: '#0f1115', color: '#f9fafb', border: '1px solid #2a2d35', boxSizing: 'border-box', outline: 'none' }} placeholder="jean.dupont@email.com" />
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '5px', display: 'block' }}>Téléphone</label>
                <input type="text" name="telephone" value={formData.telephone} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '5px', backgroundColor: '#0f1115', color: '#f9fafb', border: '1px solid #2a2d35', boxSizing: 'border-box', outline: 'none' }} placeholder="+1 234 567 8900" />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '5px', display: 'block' }}>Entreprise</label>
                <input type="text" name="entreprise" value={formData.entreprise} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '5px', backgroundColor: '#0f1115', color: '#f9fafb', border: '1px solid #2a2d35', boxSizing: 'border-box', outline: 'none' }} placeholder="Nom de sa société" />
              </div>
          </div>

          <div>
            <label style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '5px', display: 'block' }}>Montant estimé de l'offre ($)</label>
            <input type="number" name="montant_offre" value={formData.montant_offre} onChange={handleChange} required style={{ width: '100%', padding: '12px', borderRadius: '5px', backgroundColor: '#0f1115', color: '#10b981', fontWeight: 'bold', border: '1px solid #2a2d35', boxSizing: 'border-box', outline: 'none', fontSize: '18px' }} placeholder="Ex: 1500" />
          </div>

          <button type="submit" disabled={isLoading} style={{ padding: '15px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', marginTop: '20px', transition: '0.3s' }}>
            {isLoading ? 'Enregistrement...' : 'Enregistrer le client'}
          </button>
        </form>

      </div>
    </div>
  );
}

export default AddContact;