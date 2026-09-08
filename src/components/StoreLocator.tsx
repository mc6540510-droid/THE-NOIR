import { motion } from 'framer-motion';
import { MapPin, Clock, Phone, Navigation } from 'lucide-react';
import { useState } from 'react';

const stores = [
  { name: 'NOIR Flagship — Manhattan', address: '142 Fifth Avenue, New York, NY 10011', hours: 'Mon-Sun: 6AM - 10PM', phone: '+1 (212) 555-0142', distance: '0.3 mi', featured: true },
  { name: 'NOIR Lounge — SoHo', address: '78 Spring Street, New York, NY 10012', hours: 'Mon-Sun: 7AM - 11PM', phone: '+1 (212) 555-0178', distance: '1.2 mi', featured: false },
  { name: 'NOIR Atelier — Brooklyn', address: '245 Bedford Avenue, Brooklyn, NY 11211', hours: 'Mon-Sun: 6:30AM - 9PM', phone: '+1 (718) 555-0245', distance: '2.8 mi', featured: false },
  { name: 'NOIR Reserve — Midtown', address: '520 Madison Avenue, New York, NY 10022', hours: 'Mon-Fri: 6AM - 8PM, Sat-Sun: 7AM - 9PM', phone: '+1 (212) 555-0520', distance: '3.1 mi', featured: true },
];

export default function StoreLocator() {
  const [selectedStore, setSelectedStore] = useState(0);

  return (
    <section id="stores" className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <span className="text-gold-400/60 text-[10px] font-medium tracking-[0.5em] uppercase block mb-6">Visit Us</span>
          <h2 className="font-display text-5xl md:text-7xl font-bold text-cream-100 mb-6">
            Store <span className="text-gradient-3d">Locator</span>
          </h2>
          <p className="text-cream-200/50 max-w-2xl mx-auto text-lg">
            Experience NOIR in person at one of our luxury locations.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* 3D Map/Image */}
          <motion.div
            initial={{ opacity: 0, x: -60, rotateY: 10 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            whileHover={{ rotateY: -5, rotateX: 3, translateZ: 20 }}
            className="relative rounded-2xl overflow-hidden aspect-[4/3] lg:aspect-auto lg:min-h-[450px] perspective-1500 preserve-3d"
          >
            <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
              <source src="/videos/latte-art.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-noir-900/90 via-noir-900/30 to-noir-900/20" />
            
            {/* 3D Search overlay */}
            <motion.div
              className="absolute bottom-6 left-6 right-6"
              style={{ transform: 'translateZ(40px)' }}
            >
              <div className="glass-premium rounded-2xl p-5">
                <div className="flex items-center gap-2 text-gold-400 mb-3">
                  <Navigation className="w-4 h-4" />
                  <span className="text-sm font-medium">Find your nearest NOIR</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter your location..."
                    className="flex-1 bg-noir-800/60 rounded-xl px-4 py-3 text-sm text-cream-100 placeholder:text-cream-200/30 border border-gold-400/10 focus:outline-none focus:border-gold-400/30"
                  />
                  <button className="px-5 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-noir-900 rounded-xl text-sm font-bold hover:from-gold-400 hover:to-gold-500 transition-all">
                    Search
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* 3D Store list */}
          <div className="space-y-4">
            {stores.map((store, index) => (
              <motion.div
                key={store.name}
                initial={{ opacity: 0, x: 40, rotateY: -5 }}
                whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ translateX: 8, translateZ: 20, rotateY: -2 }}
                onClick={() => setSelectedStore(index)}
                className={`glass-premium rounded-xl p-6 cursor-pointer transition-all preserve-3d ${
                  selectedStore === index ? 'ring-1 ring-gold-400/30' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-3" style={{ transform: 'translateZ(15px)' }}>
                  <h4 className="font-display text-lg font-bold text-cream-100">{store.name}</h4>
                  {store.featured && (
                    <span className="px-3 py-1 bg-gold-400/10 text-gold-400 text-xs rounded-full font-medium">Featured</span>
                  )}
                </div>
                <div className="space-y-2 text-sm text-cream-200/40" style={{ transform: 'translateZ(10px)' }}>
                  <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-gold-400/50" /><span>{store.address}</span></div>
                  <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-gold-400/50" /><span>{store.hours}</span></div>
                  <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-gold-400/50" /><span>{store.phone}</span></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
