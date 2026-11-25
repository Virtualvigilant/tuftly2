import React, { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import CollectionSection from './components/CollectionSection.jsx';
import PricingGuideSection from './components/PricingGuideSection.jsx';
import BespokeEstimator from './components/BespokeEstimator.jsx';
import AtelierAndFaq from './components/AtelierAndFaq.jsx';
import Footer from './components/Footer.jsx';
import AdminPage from './components/AdminPage.jsx';
import { buildWhatsAppUrl } from './data/tuftlyConfig.js';
import {
  loadCatalogProducts,
  resetCatalogProducts,
  saveCatalogProducts,
} from './data/productStore.js';

function isAdminRoute() {
  return (
    window.location.hash === '#admin' ||
    window.location.pathname.replace(/\/+$/, '') === '/admin'
  );
}

export default function App() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [products, setProducts] = useState(() => loadCatalogProducts());
  const [showAdmin, setShowAdmin] = useState(() => isAdminRoute());

  useEffect(() => {
    const syncRoute = () => setShowAdmin(isAdminRoute());
    window.addEventListener('hashchange', syncRoute);
    window.addEventListener('popstate', syncRoute);
    return () => {
      window.removeEventListener('hashchange', syncRoute);
      window.removeEventListener('popstate', syncRoute);
    };
  }, []);

  const handleSaveProducts = (nextProducts) => {
    const res = saveCatalogProducts(nextProducts);
    if (res.ok) {
      setProducts(nextProducts);
    }
    return res;
  };

  const handleResetProducts = () => {
    const defaults = resetCatalogProducts();
    setProducts(defaults);
  };

  const handleExitAdmin = () => {
    if (window.location.pathname.replace(/\/+$/, '') === '/admin') {
      window.history.pushState({}, '', '/');
    } else {
      window.location.hash = '';
    }
    setShowAdmin(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (showAdmin) {
    return (
      <AdminPage
        products={products}
        onSaveProducts={handleSaveProducts}
        onResetProducts={handleResetProducts}
        onExitAdmin={handleExitAdmin}
      />
    );
  }

  return (
    <div className="app-shell">
      <Navbar />
      <main>
        <Hero />
        <CollectionSection
          products={products}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />
        <PricingGuideSection />
        <BespokeEstimator />
        <AtelierAndFaq />
      </main>
      <Footer />

      <a
        href={buildWhatsAppUrl(
          `Hello Tuftly! I'm browsing your website and have a quick question.`
        )}
        target="_blank"
        rel="noreferrer"
        className="floating-concierge"
        aria-label="Chat with Tuftly on WhatsApp"
      >
        <MessageCircle size={19} />
        <span>WhatsApp Concierge</span>
      </a>
    </div>
  );
}
