import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nomEntreprise, setNomEntreprise] = useState('');
  const [erreur, setErreur] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // 🟢 CORRECTION : On envoie les données complètes pour ne pas faire planter FastAPI
      await axios.post('https://digital-scale-crm.onrender.com/utilisateurs/', {
        email: email,
        mot_de_passe: password,
        nom_entreprise: nomEntreprise,
        type_client: "standard",
        devise: "CAD"
      });
      alert('Compte créé avec succès ! Connectez-vous.');
      navigate('/login');
    } catch (err) {
      console.error(err);
      setErreur('Erreur lors de la création. Cet email est peut-être utilisé, ou le serveur est injoignable.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#0f1115', fontFamily: 'sans-serif' }}>
      <div style={{ backgroundColor: '#17191e', padding: '40px', borderRadius: '10px', width: '100%', maxWidth: '400px', border: '1px solid #2a2d35', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h1 style={{ color: '#f9fafb', margin: '0 0 10px 0', fontSize: '28px' }}>Digital <span style={{ color: '#4f46e5' }}>Scale</span></h1>
            <p style={{ color: '#9ca3af', margin: 0, fontSize: '14px' }}>Créez votre espace agence</p>
        </div>

        {erreur && <div style={{ backgroundColor: '#ff4d4d22', color: '#ff4d4d', padding: '10px', borderRadius: '5px', marginBottom: '20px', fontSize: '13px', textAlign: 'center', border: '1px solid #ff4d4d' }}>{erreur}</div>}

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '5px', display: 'block' }}>Nom de l'entreprise</label>
            <input type="text" value={nomEntreprise} onChange={(e) => setNomEntreprise(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '5px', backgroundColor: '#0f1115', color: '#f9fafb', border: '1px solid #2a2d35', boxSizing: 'border-box', outline: 'none' }} placeholder="Ex: Ma Super Agence" />
          </div>
          <div>
            <label style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '5px', display: 'block' }}>Adresse Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '5px', backgroundColor: '#0f1115', color: '#f9fafb', border: '1px solid #2a2d35', boxSizing: 'border-box', outline: 'none' }} placeholder="contact@email.com" />
          </div>
          <div>
            <label style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '5px', display: 'block' }}>Mot de passe</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '5px', backgroundColor: '#0f1115', color: '#f9fafb', border: '1px solid #2a2d35', boxSizing: 'border-box', outline: 'none' }} placeholder="••••••••" />
          </div>

          <button type="submit" style={{ padding: '15px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', marginTop: '10px' }}>
            Démarrer maintenant
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;