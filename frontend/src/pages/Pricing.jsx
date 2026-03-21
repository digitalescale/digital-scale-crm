import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Pricing() {
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState(null);

  const plans = [
    {
      id: 'price_starter',
      nom: 'Starter',
      prix: '49',
      description: 'Idéal pour les indépendants qui se lancent.',
      features: ['Jusqu\'à 100 contacts', 'Générateur de factures', 'Support par email'],
      couleur: '#4caf50',
      populaire: false
    },
    {
      id: 'price_pro',
      nom: 'Pro',
      prix: '99',
      description: 'Pour les entreprises qui veulent automatiser leur marketing.',
      features: ['Contacts illimités', 'Générateur de factures', 'Réponses IA aux Avis Google', 'Planificateur Réseaux Sociaux', 'Support prioritaire'],
      couleur: '#4285f4',
      populaire: true
    },
    {
      id: 'price_elite',
      nom: 'Élite',
      prix: '199',
      description: 'La solution complète pour dominer votre marché.',
      features: ['Tout du forfait Pro', 'Bouclier Anti-Mauvais Avis', 'Génération d\'articles de blog IA', 'Accès API complet', 'Accompagnement dédié'],
      couleur: '#ff9800',
      populaire: false
    }
  ];

  const sAbonner = async (planId) => {
    setLoadingPlan(planId);
    const token = localStorage.getItem('badge_vip');
    
    if (!token) {
        alert("Vous devez être connecté pour vous abonner.");
        navigate('/login');
        return;
    }

    try {
        // 1. On demande le lien de paiement au serveur Python
        const reponse = await axios.post('http://localhost:8000/stripe/create-checkout', 
            { plan_id: planId },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        // 2. Si Python répond avec succès, on redirige le client vers le lien (Stripe)
        if (reponse.data.succes) {
            window.location.href = reponse.data.url;
        } else {
            alert("Erreur lors de la création du paiement : " + reponse.data.erreur);
            setLoadingPlan(null);
        }
    } catch (erreur) {
        alert("Erreur de connexion avec le serveur de paiement.");
        setLoadingPlan(null);
    }
  };

  return (
    <div style={{ padding: '40px', backgroundColor: '#1a1d24', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <button onClick={() => navigate('/dashboard')} style={{ color: '#4285f4', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', marginBottom: '20px' }}>← Retour au Dashboard</button>
        <h1 style={{ fontSize: '36px', margin: '0 0 15px 0' }}>Choisissez votre forfait</h1>
        <p style={{ color: '#bbb', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
          Débloquez toute la puissance de notre CRM. Sans engagement, annulez à tout moment.
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap', maxWidth: '1200px', margin: '0 auto' }}>
        {plans.map((plan) => (
          <div key={plan.id} style={{ 
            backgroundColor: '#21252b', 
            borderRadius: '15px', 
            padding: '40px', 
            width: '300px', 
            border: plan.populaire ? `2px solid ${plan.couleur}` : '1px solid #333',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column'
          }}>
            
            {plan.populaire && (
              <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', backgroundColor: plan.couleur, color: 'white', padding: '5px 15px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                LE PLUS POPULAIRE
              </div>
            )}

            <h2 style={{ margin: '0 0 10px 0', color: plan.couleur }}>{plan.nom}</h2>
            <div style={{ marginBottom: '15px' }}>
              <span style={{ fontSize: '48px', fontWeight: 'bold' }}>{plan.prix}$</span>
              <span style={{ color: '#888' }}> / mois</span>
            </div>
            <p style={{ color: '#bbb', fontSize: '14px', marginBottom: '30px', minHeight: '40px' }}>{plan.description}</p>
            
            <button 
              onClick={() => sAbonner(plan.id)}
              disabled={loadingPlan === plan.id}
              style={{ 
                width: '100%', 
                padding: '15px', 
                backgroundColor: plan.populaire ? plan.couleur : '#333', 
                color: 'white', 
                border: plan.populaire ? 'none' : '1px solid #555', 
                borderRadius: '8px', 
                fontWeight: 'bold', 
                fontSize: '16px', 
                cursor: 'pointer',
                marginBottom: '30px',
                transition: '0.3s'
              }}
            >
              {loadingPlan === plan.id ? '⏳ Chargement...' : 'Commencer maintenant'}
            </button>

            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 'bold', marginBottom: '15px', fontSize: '14px' }}>Ce qui est inclus :</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {plan.features.map((feature, idx) => (
                  <li key={idx} style={{ marginBottom: '10px', fontSize: '14px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <span style={{ color: plan.couleur }}>✓</span>
                    <span style={{ color: '#ddd' }}>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

export default Pricing;