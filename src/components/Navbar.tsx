import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag, Heart, User, Coffee, LogOut, Package, Settings, MessageCircle, ChevronDown } from 'lucide-react';
import { authService } from '../services/auth';
import { cartService } from '../services/cart';
import { wishlistService } from '../services/wishlist';

const navLinks = [
  { label: 'Home', href: '#hero' },
  { 
    label: 'Collection', 
    href: '#collection',
    dropdown: [
      { label: 'All Coffee', href: '#collection' },
      { label: 'Dark Roast', href: '#collection' },
      { label: 'Medium Roast', href: '#collection' },
      { label: 'Light Roast', href: '#collection' },
      { label: 'Gift Sets', href: '#collection' },
    ]
  },
  { label: 'Journey', href: '#journey' },
  { 
    label: 'Craft', 
    href: '#craftsmanship',
    dropdown: [
      { label: 'Our Process', href: '#craftsmanship' },
      { label: 'Roasting', href: '#craftsmanship' },
      { label: 'Quality', href: '#craftsmanship' },
    ]
  },
  { label: 'Sustainability', href: '#sustainability' },
  { 
    label: 'Subscribe', 
    href: '#subscription',
    dropdown: [
      { label: 'Explorer Plan', href: '#subscription' },
      { label: 'Connoisseur Plan', href: '#subscription' },
      { label: 'Reserve Plan', href: '#subscription' },
    ]
  },
  { label: 'Contact', href: '#contact' },
];

interface NavbarProps {
  onCartClick: () => void;
  onAuthClick: () => void;
  onProfileClick: () => void;
  onAIAssistantClick: () => void;
}

export default function Navbar({ onCartClick, onAuthClick, onProfileClick, onAIAssistantClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [user, setUser] = useState(authService.getCurrentUser());
  const [cartCount, setCartCount] = useState(cartService.getItemCount());
  const [wishlistCount, setWishlistCount] = useState(wishlistService.getCount());

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Refresh counts periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setCartCount(cartService.getItemCount());
      setWishlistCount(wishlistService.getCount());
      setUser(authService.getCurrentUser());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setUserMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'glass-premium py-3 shadow-2xl' : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 group perspective-800">
            <motion.div
              whileHover={{ rotateY: 180 }}
              transition={{ duration: 0.6 }}
              className="preserve-3d"
            >
              <Coffee className="w-8 h-8 text-gold-400" />
            </motion.div>
            <span className="font-display text-2xl font-bold text-gradient-3d">NOIR</span>
          </a>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="relative group"
                onMouseEnter={() => link.dropdown && setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  onClick={() => {
                    const element = document.querySelector(link.href);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className="flex items-center gap-1 text-cream-200/70 hover:text-gold-400 transition-all duration-300 text-sm font-medium tracking-[0.15em] uppercase relative"
                >
                  {link.label}
                  {link.dropdown && (
                    <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${activeDropdown === link.label ? 'rotate-180' : ''}`} />
                  )}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold-400 transition-all duration-300 group-hover:w-full" />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {link.dropdown && activeDropdown === link.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-3 w-56 glass-premium rounded-xl overflow-hidden shadow-2xl z-[999]"
                    >
                      <div className="p-2">
                        {link.dropdown.map((item) => (
                          <button
                            key={item.label}
                            onClick={() => {
                              const element = document.querySelector(item.href);
                              if (element) {
                                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }
                              setActiveDropdown(null);
                            }}
                            className="w-full text-left px-4 py-2.5 rounded-lg text-cream-200/70 hover:text-gold-400 hover:bg-gold-400/5 transition-all text-sm"
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* AI Assistant */}
            <button 
              onClick={onAIAssistantClick}
              className="relative p-2.5 glass-3d rounded-xl text-gold-400 hover:text-gold-300 transition-all hover:scale-110"
              title="AI Coffee Assistant"
            >
              <MessageCircle className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <button 
              onClick={() => user ? onProfileClick() : onAuthClick()}
              className="relative p-2.5 glass-3d rounded-xl text-cream-200/70 hover:text-gold-400 transition-all hover:scale-110"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold-500 text-noir-900 text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart */}
            <button 
              onClick={onCartClick}
              className="relative p-2.5 glass-3d rounded-xl text-cream-200/70 hover:text-gold-400 transition-all hover:scale-110"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold-500 text-noir-900 text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Menu */}
            <div className="relative">
              <button 
                onClick={() => user ? setUserMenuOpen(!userMenuOpen) : onAuthClick()}
                className="p-2.5 glass-3d rounded-xl text-cream-200/70 hover:text-gold-400 transition-all hover:scale-110"
                title={user ? 'My Account' : 'Sign In'}
              >
                <User className="w-5 h-5" />
              </button>

              {/* User Dropdown */}
              <AnimatePresence>
                {user && userMenuOpen && (
                  <>
                    {/* Backdrop to close dropdown */}
                    <div 
                      className="fixed inset-0 z-[998]" 
                      onClick={() => setUserMenuOpen(false)}
                    />
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-2 w-56 glass-premium rounded-xl overflow-hidden shadow-2xl z-[999]"
                    >
                      <div className="p-4 border-b border-gold-400/10">
                        <p className="text-cream-100 font-medium">{user.firstName} {user.lastName}</p>
                        <p className="text-cream-200/40 text-xs">{user.email}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-gold-400 text-sm font-bold">{user.loyaltyPoints}</span>
                          <span className="text-cream-200/40 text-xs">points</span>
                        </div>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={() => { onProfileClick(); setUserMenuOpen(false); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-cream-200/70 hover:text-gold-400 hover:bg-gold-400/5 transition-all text-sm"
                        >
                          <Package className="w-4 h-4" />
                          My Orders
                        </button>
                        <button
                          onClick={() => { onProfileClick(); setUserMenuOpen(false); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-cream-200/70 hover:text-gold-400 hover:bg-gold-400/5 transition-all text-sm"
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-cream-200/70 hover:text-red-400 hover:bg-red-400/5 transition-all text-sm"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2.5 glass-3d rounded-xl text-cream-200/70 hover:text-gold-400 transition-colors"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-0 z-40 bg-noir-900/98 backdrop-blur-2xl flex flex-col items-center justify-center gap-8"
          >
            {navLinks.map((link, i) => (
              <motion.button
                key={link.label}
                onClick={() => {
                  setMobileOpen(false);
                  setTimeout(() => {
                    const element = document.querySelector(link.href);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }, 400);
                }}
                initial={{ opacity: 0, x: 50, rotateY: -20 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-3xl font-display text-cream-200 hover:text-gold-400 transition-colors"
              >
                {link.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
