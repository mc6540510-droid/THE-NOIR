import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CoffeeCollection from './components/CoffeeCollection';
import FarmToCup from './components/FarmToCup';
import Craftsmanship from './components/Craftsmanship';
import Sustainability from './components/Sustainability';
import CustomerStories from './components/CustomerStories';
import Subscription from './components/Subscription';
import Blog from './components/Blog';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CoffeeQuiz from './components/CoffeeQuiz';
import FloatingParticles from './components/FloatingParticles';
import DepthLayers from './components/DepthLayers';
import SlideContainer from './components/SlideContainer';
import AuthModal from './components/AuthModal';
import CartDrawer from './components/CartDrawer';
import CheckoutPage from './components/CheckoutPage';
import UserProfile from './components/UserProfile';
import ToastContainer from './components/Toast';
import ProductDetailModal from './components/ProductDetailModal';
import AIAssistant from './components/AIAssistant';
import Animated3DBackground from './components/Animated3DBackground';
import CoffeeMakingProcess from './components/CoffeeMakingProcess';
import { db } from './services/database';
import { showToast } from './components/Toast';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

type AppView = 'home' | 'checkout' | 'profile';

export default function App() {
  const [view, setView] = useState<AppView>('home');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);

  useEffect(() => {
    db.seed();
    showToast({ type: 'info', title: 'Welcome to NOIR Coffee', message: 'Experience premium coffee', duration: 4000 });
  }, []);

  const handleAuthSuccess = () => {
    setAuthModalOpen(false);
    showToast({ type: 'success', title: 'Welcome!', message: 'You\'ve earned 100 loyalty points.' });
  };

  const handleCheckout = () => {
    setCartDrawerOpen(false);
    setView('checkout');
  };

  const handleCheckoutComplete = () => {
    setView('home');
    showToast({ type: 'success', title: 'Order confirmed!', message: 'Check your email for order details.' });
  };

  if (view === 'checkout') {
    return (
      <>
        <ToastContainer />
        <CheckoutPage onBack={() => setView('home')} onComplete={handleCheckoutComplete} />
      </>
    );
  }

  if (view === 'profile') {
    return (
      <>
        <ToastContainer />
        <Navbar
          onCartClick={() => setCartDrawerOpen(true)}
          onAuthClick={() => setAuthModalOpen(true)}
          onProfileClick={() => setView('profile')}
          onAIAssistantClick={() => setAiAssistantOpen(true)}
        />
        <UserProfile onBack={() => setView('home')} />
        <CartDrawer
          isOpen={cartDrawerOpen}
          onClose={() => setCartDrawerOpen(false)}
          onCheckout={handleCheckout}
          onLoginRequired={() => setAuthModalOpen(true)}
        />
        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} onAuthSuccess={handleAuthSuccess} />
        <AIAssistant isOpen={aiAssistantOpen} onClose={() => setAiAssistantOpen(false)} />
      </>
    );
  }

  const slides = [
    {
      id: 'hero',
      label: 'Home',
      component: (
        <div className="relative w-full h-full">
          <Animated3DBackground variant="coffee-beans" opacity={0.12} scale={1.2} />
          <DepthLayers variant="dark" />
          <Hero />
        </div>
      ),
    },
    {
      id: 'collection',
      label: 'Collection',
      component: (
        <div className="relative w-full h-full slide-scrollable">
          <Animated3DBackground variant="coffee-cups" opacity={0.1} scale={1} />
          <DepthLayers variant="warm" />
          <CoffeeCollection
            onAuthRequired={() => setAuthModalOpen(true)}
            onViewDetail={(id) => setSelectedProductId(id)}
          />
        </div>
      ),
    },
    {
      id: 'journey',
      label: 'Journey',
      component: (
        <div className="relative w-full h-full slide-scrollable">
          <Animated3DBackground variant="coffee-cherries" opacity={0.15} scale={0.9} />
          <FarmToCup />
        </div>
      ),
    },
    {
      id: 'process',
      label: 'Process',
      component: (
        <div className="relative w-full h-full slide-scrollable">
          <Animated3DBackground variant="roasting-drum" opacity={0.08} scale={1.1} />
          <CoffeeMakingProcess />
        </div>
      ),
    },
    {
      id: 'craftsmanship',
      label: 'Craft',
      component: (
        <div className="relative w-full h-full slide-scrollable">
          <Animated3DBackground variant="pourover" opacity={0.1} scale={1} />
          <DepthLayers variant="gold" />
          <Craftsmanship />
        </div>
      ),
    },
    {
      id: 'sustainability',
      label: 'Sustainability',
      component: (
        <div className="relative w-full h-full slide-scrollable">
          <Animated3DBackground variant="steam" opacity={0.18} scale={1.3} />
          <DepthLayers variant="dark" />
          <Sustainability />
        </div>
      ),
    },
    {
      id: 'stories',
      label: 'Stories',
      component: (
        <div className="relative w-full h-full slide-scrollable">
          <Animated3DBackground variant="latte-art" opacity={0.12} scale={1} />
          <CustomerStories />
        </div>
      ),
    },
    {
      id: 'subscription',
      label: 'Subscribe',
      component: (
        <div className="relative w-full h-full slide-scrollable">
          <Animated3DBackground variant="grinder" opacity={0.1} scale={1.1} />
          <DepthLayers variant="gold" />
          <Subscription />
        </div>
      ),
    },
    {
      id: 'blog',
      label: 'Blog',
      component: (
        <div className="relative w-full h-full slide-scrollable">
          <Animated3DBackground variant="roasting-drum" opacity={0.08} scale={0.9} />
          <Blog />
        </div>
      ),
    },
    {
      id: 'contact',
      label: 'Contact',
      component: (
        <div className="relative w-full h-full slide-scrollable">
          <Animated3DBackground variant="coffee-beans" opacity={0.08} scale={0.8} />
          <DepthLayers variant="warm" />
          <Contact />
          <Footer />
        </div>
      ),
    },
  ];

  return (
    <div className="relative bg-noir-900">
      <FloatingParticles />
      <ToastContainer />

      <Navbar
        onCartClick={() => setCartDrawerOpen(true)}
        onAuthClick={() => setAuthModalOpen(true)}
        onProfileClick={() => setView('profile')}
        onAIAssistantClick={() => setAiAssistantOpen(true)}
      />

      <SlideContainer slides={slides} />

      <CoffeeQuiz />

      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        onCheckout={handleCheckout}
        onLoginRequired={() => setAuthModalOpen(true)}
      />
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} onAuthSuccess={handleAuthSuccess} />
      <ProductDetailModal
        productId={selectedProductId}
        onClose={() => setSelectedProductId(null)}
        onAuthRequired={() => setAuthModalOpen(true)}
      />
      <AIAssistant isOpen={aiAssistantOpen} onClose={() => setAiAssistantOpen(false)} />

      {/* Floating AI Chat Button */}
      {!aiAssistantOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 2, type: 'spring', stiffness: 200 }}
          onClick={() => setAiAssistantOpen(true)}
          className="fixed bottom-24 right-8 z-40 w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full shadow-2xl shadow-gold-500/50 flex items-center justify-center hover:scale-110 transition-transform"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <MessageCircle className="w-7 h-7 text-noir-900" />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-gold-400/30"
          />
        </motion.button>
      )}
    </div>
  );
}
