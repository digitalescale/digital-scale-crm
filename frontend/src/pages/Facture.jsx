import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Facture() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [erreur, setErreur] = useState('');

  // 🎨 ÉTAT : Le Logo de l'agence
  const [logo, setLogo] = useState(null);

  // 📝 ÉTAT : Les informations générales (100% modifiables)
  const [infos, setInfos] = useState({
      numero: '',
      date: new Date().toLocaleDateString('fr-CA'),
      agenceNom: '',
      agenceEmail: '',
      agenceTel: '',
      clientNom: '',
      clientEntreprise: '',
      clientEmail: '',
      clientTel: ''
  });

  // 💰 ÉTAT : Les lignes de facturation dynamiques
  const [lignes, setLignes] = useState([]);

  useEffect(() => {
    const chargerDonnees = async () => {
      const token = localStorage.getItem('badge_vip');
      if (!token) return navigate('/login');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      try {
        const resContacts = await axios.get('http://localhost:8000/contacts/', config);
        const leContact = resContacts.data.find(c => c.id === parseInt(id));
        if (!leContact) { setErreur("Client introuvable."); setIsLoading(false); return; }

        let infosAgence = { nom_entreprise: 'Mon Agence', email: '', telephone_compte: '' };
        try {
            const resMoi = await axios.get('http://localhost:8000/utilisateurs/moi', config);
            infosAgence = resMoi.data;
        } catch (e) { console.warn("Infos agence non trouvées"); }

        // Initialisation des données modifiables
        setInfos({
            numero: `FAC-${new Date().getFullYear()}-${leContact.id.toString().padStart(4, '0')}`,
            date: new Date().toLocaleDateString('fr-CA'),
            agenceNom: infosAgence.nom_entreprise || 'Digital Scale',
            agenceEmail: infosAgence.email || 'contact@agence.com',
            agenceTel: infosAgence.telephone_compte || '',
            clientNom: `${leContact.prenom} ${leContact.nom}`,
            clientEntreprise: leContact.entreprise || '',
            clientEmail: leContact.email || '',
            clientTel: leContact.telephone || ''
        });

        // Initialisation de la première ligne de service
        setLignes([
            { id: Date.now(), description: 'Création de site vitrine', quantite: 1, prix: leContact.montant_offre || 0 }
        ]);

      } catch (error) {
        setErreur("Impossible de contacter le serveur Python.");
      } finally {
        setIsLoading(false);
      }
    };
    chargerDonnees();
  }, [id, navigate]);

  // --- ACTIONS INTERACTIVES ---

  const handleLogoUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => setLogo(reader.result);
          reader.readAsDataURL(file);
      }
  };

  const handleInfoChange = (champ, valeur) => {
      setInfos({ ...infos, [champ]: valeur });
  };

  const ajouterLigne = () => {
      setLignes([...lignes, { id: Date.now(), description: 'Nouveau service', quantite: 1, prix: 0 }]);
  };

  const modifierLigne = (id, champ, valeur) => {
      setLignes(lignes.map(l => l.id === id ? { ...l, [champ]: champ === 'description' ? valeur : parseFloat(valeur) || 0 } : l));
  };

  const supprimerLigne = (id) => {
      setLignes(lignes.filter(l => l.id !== id));
  };

  const imprimerFacture = () => window.print();

  // --- CALCULS EN TEMPS RÉEL ---
  const sousTotal = lignes.reduce((acc, ligne) => acc + (ligne.quantite * ligne.prix), 0);
  const tps = sousTotal * 0.05;      
  const tvq = sousTotal * 0.09975;   
  const totalTTC = sousTotal + tps + tvq;

  // --- STYLES ---
  // Style pour les champs de texte modifiables (Invisibles à l'impression)
  const inputStyle = {
      border: '1px dashed #d1d5db', background: 'transparent', padding: '4px', width: '100%', 
      fontFamily: 'inherit', fontSize: 'inherit', color: 'inherit', fontWeight: 'inherit', outline: 'none', transition: '0.2s', borderRadius: '4px'
  };

  if (isLoading) return <div style={{ minHeight: '100vh', backgroundColor: '#0f1115', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Chargement du générateur...</div>;
  if (erreur) return <div style={{ minHeight: '100vh', backgroundColor: '#0f1115', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{erreur}</div>;

  return (
    <div style={{ backgroundColor: '#0f1115', minHeight: '100vh', padding: '40px', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* 🔴 INJECTION CSS : Gère l'impression parfaite */}
      <style>{`
        @media print {
          body { background-color: white !important; margin: 0; padding: 0; }
          .no-print { display: none !important; }
          .page-facture { box-shadow: none !important; width: 100% !important; max-width: 100% !important; padding: 0 !important; margin: 0 !important; color: black !important; }
          input { border: none !important; padding: 0 !important; background: transparent !important; }
          input[type="number"]::-webkit-inner-spin-button { display: none; }
        }
        input:focus { border: 1px solid #4f46e5 !important; background-color: #f9fafb !important; }
      `}</style>

      {/* BARRE D'OUTILS (Non imprimée) */}
      <div className="no-print" style={{ width: '100%', maxWidth: '800px', display: 'flex', justifyContent: 'space-between', marginBottom: '20px', backgroundColor: '#17191e', padding: '20px', borderRadius: '10px', border: '1px solid #2a2d35' }}>
        <div>
            <h3 style={{color: '#fff', margin: '0 0 10px 0'}}>Mode Édition Activé ✏️</h3>
            <p style={{color: '#9ca3af', fontSize: '14px', margin: 0}}>Cliquez sur les textes pour les modifier. Ajoutez votre logo ci-dessous :</p>
            <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ marginTop: '10px', color: '#fff' }} />
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <button onClick={() => navigate(`/contact/${id}`)} style={{ backgroundColor: 'transparent', color: '#9ca3af', border: '1px solid #2a2d35', borderRadius: '5px', padding: '12px 20px', cursor: 'pointer' }}>Retour</button>
            <button onClick={imprimerFacture} style={{ backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '5px', padding: '12px 20px', cursor: 'pointer', fontWeight: 'bold' }}>🖨️ Imprimer / PDF</button>
        </div>
      </div>

      {/* 📄 LA FACTURE A4 */}
      <div className="page-facture" style={{ backgroundColor: 'white', width: '100%', maxWidth: '800px', padding: '60px', borderRadius: '10px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', color: '#1f2937' }}>
        
        {/* EN-TÊTE : Logo + Agence / Facture Infos */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #f3f4f6', paddingBottom: '30px', marginBottom: '40px' }}>
          
          {/* Colonne Gauche : Logo & Agence */}
          <div style={{ flex: 1, paddingRight: '20px' }}>
            {logo && <img src={logo} alt="Logo Agence" style={{ maxHeight: '80px', maxWidth: '200px', marginBottom: '15px' }} />}
            <input type="text" value={infos.agenceNom} onChange={(e) => handleInfoChange('agenceNom', e.target.value)} style={{ ...inputStyle, fontSize: '24px', fontWeight: 'bold', color: '#4f46e5', marginBottom: '5px' }} />
            <input type="text" value={infos.agenceEmail} onChange={(e) => handleInfoChange('agenceEmail', e.target.value)} style={{ ...inputStyle, fontSize: '14px', color: '#6b7280', marginBottom: '2px' }} placeholder="Email de l'agence" />
            <input type="text" value={infos.agenceTel} onChange={(e) => handleInfoChange('agenceTel', e.target.value)} style={{ ...inputStyle, fontSize: '14px', color: '#6b7280' }} placeholder="Téléphone de l'agence" />
          </div>

          {/* Colonne Droite : Infos Facture */}
          <div style={{ textAlign: 'right', width: '250px' }}>
            <h2 style={{ margin: '0 0 10px 0', fontSize: '28px', color: '#111827', textTransform: 'uppercase' }}>Facture</h2>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '5px' }}>
                <span style={{ fontSize: '14px', fontWeight: 'bold', marginRight: '10px' }}>N°</span>
                <input type="text" value={infos.numero} onChange={(e) => handleInfoChange('numero', e.target.value)} style={{ ...inputStyle, width: '150px', textAlign: 'right', fontSize: '14px', fontWeight: 'bold' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: '14px', color: '#6b7280', marginRight: '10px' }}>Date:</span>
                <input type="text" value={infos.date} onChange={(e) => handleInfoChange('date', e.target.value)} style={{ ...inputStyle, width: '100px', textAlign: 'right', fontSize: '14px', color: '#6b7280' }} />
            </div>
          </div>
        </div>

        {/* CLIENT INFO */}
        <div style={{ marginBottom: '50px', width: '350px' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#9ca3af', textTransform: 'uppercase' }}>Facturé à :</h3>
          <input type="text" value={infos.clientNom} onChange={(e) => handleInfoChange('clientNom', e.target.value)} style={{ ...inputStyle, fontSize: '18px', fontWeight: 'bold' }} placeholder="Nom du client" />
          <input type="text" value={infos.clientEntreprise} onChange={(e) => handleInfoChange('clientEntreprise', e.target.value)} style={{ ...inputStyle, fontSize: '16px', marginBottom: '5px' }} placeholder="Nom de l'entreprise" />
          <input type="text" value={infos.clientEmail} onChange={(e) => handleInfoChange('clientEmail', e.target.value)} style={{ ...inputStyle, fontSize: '14px', color: '#6b7280' }} placeholder="Email du client" />
          <input type="text" value={infos.clientTel} onChange={(e) => handleInfoChange('clientTel', e.target.value)} style={{ ...inputStyle, fontSize: '14px', color: '#6b7280' }} placeholder="Téléphone du client" />
        </div>

        {/* 🛠️ TABLEAU DES SERVICES DYNAMIQUES */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <th style={{ padding: '15px', textAlign: 'left', fontSize: '14px', color: '#6b7280' }}>Description du service</th>
              <th style={{ padding: '15px', textAlign: 'center', fontSize: '14px', color: '#6b7280', width: '80px' }}>Qté</th>
              <th style={{ padding: '15px', textAlign: 'right', fontSize: '14px', color: '#6b7280', width: '120px' }}>Prix Unitaire</th>
              <th style={{ padding: '15px', textAlign: 'right', fontSize: '14px', color: '#6b7280', width: '120px' }}>Total</th>
              <th className="no-print" style={{ width: '40px' }}></th>
            </tr>
          </thead>
          <tbody>
            {lignes.map((ligne) => (
              <tr key={ligne.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '10px' }}>
                    <input type="text" value={ligne.description} onChange={(e) => modifierLigne(ligne.id, 'description', e.target.value)} style={{ ...inputStyle, fontSize: '15px' }} placeholder="Description du service..." />
                </td>
                <td style={{ padding: '10px' }}>
                    <input type="number" min="1" value={ligne.quantite} onChange={(e) => modifierLigne(ligne.id, 'quantite', e.target.value)} style={{ ...inputStyle, fontSize: '15px', textAlign: 'center' }} />
                </td>
                <td style={{ padding: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <input type="number" min="0" value={ligne.prix} onChange={(e) => modifierLigne(ligne.id, 'prix', e.target.value)} style={{ ...inputStyle, fontSize: '15px', textAlign: 'right' }} />
                        <span style={{ marginLeft: '5px' }}>$</span>
                    </div>
                </td>
                <td style={{ padding: '15px', textAlign: 'right', fontSize: '15px', fontWeight: 'bold' }}>
                    {(ligne.quantite * ligne.prix).toFixed(2)} $
                </td>
                <td className="no-print" style={{ padding: '10px', textAlign: 'center' }}>
                    <button onClick={() => supprimerLigne(ligne.id)} style={{ background: '#ff4d4d22', color: '#ff4d4d', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '5px 10px' }}>X</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Bouton Ajouter Service (Invisible à l'impression) */}
        <button className="no-print" onClick={ajouterLigne} style={{ backgroundColor: '#f3f4f6', color: '#4f46e5', border: '1px dashed #4f46e5', borderRadius: '5px', padding: '10px 20px', cursor: 'pointer', fontWeight: 'bold', width: '100%', marginBottom: '40px' }}>
            + Ajouter une ligne de service
        </button>

        {/* TOTAUX */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: '320px', backgroundColor: '#f9fafb', padding: '20px', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px', color: '#6b7280' }}>
              <span>Sous-total</span>
              <span>{sousTotal.toFixed(2)} $</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px', color: '#6b7280' }}>
              <span>TPS (5%)</span>
              <span>{tps.toFixed(2)} $</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '14px', color: '#6b7280', borderBottom: '1px solid #e5e7eb', paddingBottom: '15px' }}>
              <span>TVQ (9.975%)</span>
              <span>{tvq.toFixed(2)} $</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: 'bold', color: '#4f46e5' }}>
              <span>Total CAD</span>
              <span>{totalTTC.toFixed(2)} $</span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '60px', borderTop: '2px solid #f3f4f6', paddingTop: '20px', textAlign: 'center' }}>
          <input type="text" defaultValue="Merci pour votre confiance." style={{ ...inputStyle, textAlign: 'center', fontWeight: 'bold', fontSize: '14px', marginBottom: '5px' }} />
          <input type="text" defaultValue="Veuillez effectuer le paiement par virement sous 15 jours." style={{ ...inputStyle, textAlign: 'center', fontSize: '12px', color: '#9ca3af' }} />
        </div>

      </div>
    </div>
  );
}

export default Facture;