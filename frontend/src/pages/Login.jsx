import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erreur, setErreur] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErreur('');
    
    try {
      // 1. LE TRADUCTEUR : On force le format "Formulaire" pour FastAPI
      const params = new URLSearchParams();
      params.append('username', email); // FastAPI exige le mot "username" (même pour un email)
      params.append('password', password); // FastAPI exige le mot "password"

      // 2. L'ENVOI : On utilise ton nouveau lien Render !
      const res = await axios.post('https://digital-scale-crm.onrender.com/login', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      // 3. LE SUCCÈS : On sauvegarde le pass VIP et on entre !
      localStorage.setItem('badge_vip', res.data.access_token);
      localStorage.setItem('email_utilisateur', email);
      
      navigate('/dashboard');
      
    } catch (err) {
      console.error("Erreur de connexion:", err);
      setErreur('Identifiants incorrects. Veuillez réessayer.');
    }
    
    setIsLoading(false);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#0f1115', fontFamily: 'sans-serif' }}>
      <div style={{ backgroundColor: '#17191e', padding: '40px', borderRadius: '10px', width: '100%', maxWidth: '400px', border: '1px solid #2a2d35', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h1 style={{ color: '#f9fafb', margin: '0 0 10px 0', fontSize: '28px' }}>Digital <span style={{ color: '#4f46e5' }}>Scale</span></h1>
            <p style={{ color: '#9ca3af', margin: 0, fontSize: '14px' }}>Ravi de vous revoir !</p>
        </div>

        {erreur && <div style={{ backgroundColor: '#ff4d4d22', color: '#ff4d4d', padding: '10px', borderRadius: '5px', marginBottom: '20px', fontSize: '13px', textAlign: 'center', border: '1px solid #ff4d4d' }}>{erreur}</div>}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '5px', display: 'block' }}>Adresse Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              style={{ width: '100%', padding: '12px', borderRadius: '5px', backgroundColor: '#0f1115', color: '#f9fafb', border: '1px solid #2a2d35', boxSizing: 'border-box', outline: 'none' }} 
              placeholder="contact@email.com"
            />
          </div>
          <div>
            <label style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '5px', display: 'block' }}>Mot de passe</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              style={{ width: '100%', padding: '12px', borderRadius: '5px', backgroundColor: '#0f1115', color: '#f9fafb', border: '1px solid #2a2d35', boxSizing: 'border-box', outline: 'none' }} 
              placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={isLoading} style={{ padding: '15px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', marginTop: '10px', transition: '0.3s' }}>
            {isLoading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p style={{ color: '#9ca3af', fontSize: '14px' }}>
            Nouveau ? <span onClick={() => navigate('/register')} style={{ color: '#4f46e5', cursor: 'pointer', fontWeight: 'bold' }}>Créer un compte agence</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;