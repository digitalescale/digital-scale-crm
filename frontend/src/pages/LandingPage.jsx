import React from 'react';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();

  // Palette de couleurs "American Tech"
  const colors = {
    bg_deep: '#0f1115', // Fond ultra-sombre
    card: '#17191e', // Cartes et sections
    accent: '#4f46e5', // Indigo vif (Principal)
    gold: '#ffc107', // Or (Tarifs Premium)
    text_light: '#f9fafb',
    text_dim: '#9ca3af'
  };

  const features = [
    { title: '📍 Google Business Sync', desc: 'Centralisez vos fiches, avis et publications en un clic.' },
    { title: '⭐ Review Gating Boost', desc: 'Boostez vos avis 5 étoiles et bloquez les mauvais avis.' },
    { title: '🤖 Gemini AI Response', desc: 'Laissez l\'IA rédiger des réponses parfaites et professionnelles.' },
    { title: '📄 Invoice Builder Pro', desc: 'Générez des PDF de factures ultra-personnalisables.' }
  ];

  return (
    <div style={{ backgroundColor: colors.bg_deep, minHeight: '100vh', color: colors.text_light, fontFamily: 'sans-serif' }}>
      
      {/* 🟢 HEADER (Invisible à l'impression) */}
      <div style={{ padding: '20px 60px', borderBottom: '1px solid #2a2d35', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>Altitude <span style={{ color: colors.accent }}>CRM</span></div>
          <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
              <button onClick={() => navigate('/pricing')} style={{ background: 'none', border: 'none', color: colors.text_dim, cursor: 'pointer', fontSize: '15px' }}>Tarifs</button>
              <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: colors.text_light, cursor: 'pointer', fontSize: '15px', padding: '10px 20px', borderRadius: '5px', border: '1px solid #444' }}>Se Connecter</button>
              <button onClick={() => navigate('/register')} style={{ backgroundColor: colors.accent, color: 'white', border: 'none', borderRadius: '5px', padding: '10px 20px', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold' }}>Démarrer Gratuitement</button>
          </div>
      </div>

      {/* 🔴 HERO SECTION (L'effet Waouh américain) */}
      <div style={{ textAlign: 'center', padding: '120px 20px', backgroundColor: colors.card }}>
          <h1 style={{ fontSize: '64px', fontWeight: 'bold', maxWidth: '800px', margin: '0 auto 20px auto', lineHeight: '1.2' }}>
            Multipliez vos clients grâce à une <span style={{ color: colors.accent }}>présence locale imbattable</span>.
          </h1>
          <p style={{ fontSize: '20px', color: colors.text_dim, maxWidth: '600px', margin: '0 auto 50px auto' }}>
            Centralisez Google, gérez vos contacts, rédigez vos factures et boostez votre réputation avec l\'IA. Le tout depuis un seul tableau de bord premium.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
              <button onClick={() => navigate('/register')} style={{ padding: '18px 40px', backgroundColor: colors.accent, color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }}>Créer mon Compte Gratuit</button>
              <button onClick={() => navigate('/pricing')} style={{ padding: '18px 40px', backgroundColor: 'transparent', color: colors.text_light, border: `2px solid #444`, borderRadius: '8px', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }}>Voir les Tarifs</button>
          </div>
      </div>

      {/* 🔵 FEATURES SECTION (Premium Layout) */}
      <div style={{ padding: '100px 60px', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
              {features.map((f, i) => (
                  <div key={i} style={{ backgroundColor: colors.card, padding: '35px', borderRadius: '10px', border: '1px solid #2a2d35' }}>
                      <div style={{ color: colors.accent, fontSize: '30px', marginBottom: '20px' }}>✓</div>
                      <h3 style={{ fontSize: '20px', marginBottom: '10px', color: colors.text_light }}>{f.title}</h3>
                      <p style={{ color: colors.text_dim, fontSize: '15px', lineHeight: '1.6' }}>{f.desc}</p>
                  </div>
              ))}
          </div>
      </div>

      {/* 🟠 FOOTER */}
      <div style={{ textAlign: 'center', padding: '50px', borderTop: '1px solid #2a2d35', color: colors.text_dim, fontSize: '14px' }}>
          © 2024 Altitude CRM / Care My Business. Tous droits réservés.
      </div>

    </div>
  );
}

export default LandingPage;