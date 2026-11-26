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
import FloorSpaceViewer from './components/FloorSpaceViewer.jsx';
import { buildWhatsAppUrl } from './data/tuftlyConfig.js';
import {
  loadCatalogProducts,
  resetCatalogProducts,
  saveCatalogProducts,
} from './data/productStore.js';

function getCurrentRoute() {
  const path = window.location.pathname.replace(/\/+$/, '');
  const hash = window.location.hash;
  if (path === '/preview' || hash.startsWith('#preview')) return 'preview';
  if (path === '/admin' || hash === '#admin') return 'admin';
  return 'store';
}

export default function App() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [products, setProducts] = useState(() => loadCatalogProducts());
  const [route, setRoute] = useState(() => getCurrentRoute());

  useEffect(() => {
    const syncRoute = () => setRoute(getCurrentRoute());
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

  const goHome = () => {
    window.history.pushState({}, '', '/');
    window.location.hash = '';
    setRoute('store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (route === 'preview') {
    return <FloorSpaceViewer onBackToSite={goHome} />;
  }

  if (route === 'admin') {
    return (
      <AdminPage
        products={products}
        onSaveProducts={handleSaveProducts}
        onResetProducts={handleResetProducts}
        onExitAdmin={goHome}
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
