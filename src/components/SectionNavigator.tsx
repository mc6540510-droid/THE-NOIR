import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Coffee, 
  Leaf, 
  Sparkles, 
  Globe, 
  Users, 
  Crown, 
  BookOpen, 
  MapPin, 
  Mail,
  ChevronRight,
  Menu
} from 'lucide-react';

interface Section {
  id: string;
  label: string;
  icon: any;
}

const sections: Section[] = [
  { id: 'hero', label: 'Home', icon: Home },
  { id: 'collection', label: 'Collection', icon: Coffee },
  { id: 'journey', label: 'Journey', icon: Leaf },
  { id: 'craftsmanship', label: 'Craft', icon: Sparkles },
  { id: 'sustainability', label: 'Sustainability', icon: Globe },
  { id: 'stories', label: 'Stories', icon: Users },
  { id: 'subscription', label: 'Subscribe', icon: Crown },
  { id: 'blog', label: 'Blog', icon: BookOpen },
  { id: 'stores', label: 'Stores', icon: MapPin },
  { id: 'contact', label: 'Contact', icon: Mail },
];

export default function SectionNavigator() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);

      // Determine active section
      const sectionElements = sections.map(s => ({
        id: s.id,
        element: document.getElementById(s.id)
      }));

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const section = sectionElements[i];
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-24 left-8 z-50 w-14 h-14 glass-premium rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Menu className="w-6 h-6 text-gold-400" />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full bg-gold-400/20"
        />
      </motion.button>

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-noir-800 z-40">
        <motion.div
          className="h-full bg-gradient-to-r from-gold-400 to-gold-600"
          style={{ width: `${scrollProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Section Indicators (Right Side) */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          
          return (
            <motion.button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className="group relative"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <div
                className={`w-3 h-3 rounded-full transition-all ${
                  isActive 
                    ? 'bg-gold-400 shadow-lg shadow-gold-400/50 scale-125' 
                    : 'bg-cream-200/30 group-hover:bg-gold-400/50'
                }`}
              />
              
              {/* Tooltip */}
              <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="glass-premium px-3 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-2">
                  <Icon className="w-4 h-4 text-gold-400" />
                  <span className="text-xs text-cream-100 font-medium">{section.label}</span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Floating Navigation Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[998]"
            />

            {/* Navigation Panel */}
            <motion.div
              initial={{ x: -400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -400, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-80 glass-premium z-[999] shadow-2xl overflow-y-auto"
            >
              {/* Header */}
              <div className="p-8 border-b border-gold-400/20">
                <h2 className="font-display text-2xl font-bold text-gradient-gold mb-2">Navigate</h2>
                <p className="text-sm text-cream-200/60">Jump to any section</p>
              </div>

              {/* Sections List */}
              <div className="p-6 space-y-2">
                {sections.map((section, index) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  
                  return (
                    <motion.button
                      key={section.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all group ${
                        isActive
                          ? 'bg-gradient-to-r from-gold-500/20 to-gold-600/20 border border-gold-400/30'
                          : 'hover:bg-gold-400/10 border border-transparent'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                          isActive
                            ? 'bg-gradient-to-br from-gold-400 to-gold-600 text-noir-900'
                            : 'glass-3d text-cream-200/60 group-hover:text-gold-400'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      
                      <span
                        className={`flex-1 text-left font-medium transition-colors ${
                          isActive ? 'text-gold-400' : 'text-cream-100 group-hover:text-gold-400'
                        }`}
                      >
                        {section.label}
                      </span>

                      {isActive && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 rounded-full bg-gold-400"
                        />
                      )}

                      <ChevronRight
                        className={`w-5 h-5 transition-all ${
                          isActive
                            ? 'text-gold-400 translate-x-1'
                            : 'text-cream-200/30 group-hover:text-gold-400 group-hover:translate-x-1'
                        }`}
                      />
                    </motion.button>
                  );
                })}
              </div>

              {/* Progress Info */}
              <div className="p-6 border-t border-gold-400/20">
                <div className="glass-3d rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-cream-200/60">Page Progress</span>
                    <span className="text-xs text-gold-400 font-bold">{Math.round(scrollProgress)}%</span>
                  </div>
                  <div className="h-2 bg-noir-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-gold-500 to-gold-400"
                      style={{ width: `${scrollProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-cream-200/60">Current Section</span>
                  <span className="text-gold-400 font-medium">
                    {sections.find(s => s.id === activeSection)?.label}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-cream-200/60">Total Sections</span>
                  <span className="text-cream-100 font-medium">{sections.length}</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}