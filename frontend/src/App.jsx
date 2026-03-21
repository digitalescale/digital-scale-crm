import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AddContact from './pages/AddContact';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Pricing from './pages/Pricing';
import ContactDetail from './pages/ContactDetail';
import Facture from './pages/Facture';
import GoogleBusiness from "./pages/GoogleBusiness.jsx";
import Profil from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pricing" element={<Pricing />} />
        
        {/* Les outils internes */}
        <Route path="/contact/:id" element={<ContactDetail />} />
        <Route path="/contact/:id/facture" element={<Facture />} />
        <Route path="/google-business" element={<GoogleBusiness />} />
        <Route path="/add-contact" element={<AddContact />} />
        <Route path="/profil" element={<Profil />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;