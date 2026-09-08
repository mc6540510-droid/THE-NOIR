import { motion } from 'framer-motion';
import { useState, useRef, useCallback } from 'react';

const flavorCategories = [
  { name: 'Fruity', flavors: ['Berry', 'Citrus', 'Stone Fruit', 'Tropical'], color: '#e74c3c' },
  { name: 'Floral', flavors: ['Jasmine', 'Rose', 'Lavender', 'Chamomile'], color: '#9b59b6' },
  { name: 'Sweet', flavors: ['Caramel', 'Honey', 'Vanilla', 'Brown Sugar'], color: '#f39c12' },
  { name: 'Nutty', flavors: ['Almond', 'Hazelnut', 'Pecan', 'Walnut'], color: '#8b6914' },
  { name: 'Chocolate', flavors: ['Dark Cocoa', 'Milk Chocolate', 'Cacao Nib', 'Mocha'], color: '#6b4226' },
  { name: 'Spicy', flavors: ['Cinnamon', 'Clove', 'Cardamom', 'Black Pepper'], color: '#c0392b' },
  { name: 'Earthy', flavors: ['Cedar', 'Tobacco', 'Mushroom', 'Wet Stone'], color: '#4a3020' },
  { name: 'Roasted', flavors: ['Smoky', 'Toasted', 'Burnt Sugar', 'Charcoal'], color: '#2c3e50' },
];

function WheelSegment({ category, index, isActive, onClick }: {
  category: typeof flavorCategories[0];
  index: number;
  isActive: boolean;
  onClick: () => void;
}) {
  const angle = (index * 45 - 90) * (Math.PI / 180);
  const radius = 38;
  const x = 50 + radius * Math.cos(angle);
  const y = 50 + radius * Math.sin(angle);

  return (
    <motion.div
      className="absolute cursor-pointer z-10"
      style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
      whileHover={{ scale: 1.25, z: 50 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <motion.div
        animate={{
          scale: isActive ? 1.3 : 1,
          boxShadow: isActive
            ? `0 0 30px ${category.color}66, 0 0 60px ${category.color}33`
            : `0 4px 12px rgba(0,0,0,0.3)`,
        }}
        className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center preserve-3d transition-all"
        style={{
          background: `linear-gradient(135deg, ${category.color}99, ${category.color}44)`,
          border: `2px solid ${isActive ? category.color : category.color + '44'}`,
        }}
      >
        <span className="text-cream-100 text-xs font-semibold text-center leading-tight">
          {category.name}
        </span>
      </motion.div>
    </motion.div>
  );
}

export default function Craftsmanship() {
  const [activeFlavor, setActiveFlavor] = useState<number | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const [wheelRotation, setWheelRotation] = useState({ x: 0, y: 0 });

  const handleWheelMouseMove = useCallback((e: React.MouseEvent) => {
    if (!wheelRef.current) return;
    const rect = wheelRef.current.getBoundingClientRect();
    setWheelRotation({
      x: ((e.clientY - rect.top - rect.height / 2) / rect.height) * 10,
      y: -((e.clientX - rect.left - rect.width / 2) / rect.width) * 10,
    });
  }, []);

  return (
    <section id="craftsmanship" className="relative py-32 px-6">
      <div className="absolute inset-0 pointer-events-none">
        <div className="orb-3d absolute w-[350px] h-[350px] right-0 top-1/3 animate-orb-float" style={{ animationDuration: '16s' }} />
      </div>

      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <span className="text-gold-400/60 text-[10px] font-medium tracking-[0.5em] uppercase block mb-6">The Art</span>
          <h2 className="font-display text-5xl md:text-7xl font-bold text-cream-100 mb-6">
            Coffee <span className="text-gradient-3d">Craftsmanship</span>
          </h2>
          <p className="text-cream-200/50 max-w-2xl mx-auto text-lg">
            Explore our interactive flavor wheel — discover the complex
            taste profiles that define each of our signature blends.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* 3D Flavor Wheel */}
          <motion.div
            ref={wheelRef}
            initial={{ opacity: 0, scale: 0.7, rotateX: 20 }}
            whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            onMouseMove={handleWheelMouseMove}
            onMouseLeave={() => setWheelRotation({ x: 0, y: 0 })}
            className="relative aspect-square max-w-lg mx-auto perspective-1500"
          >
            <motion.div
              className="w-full h-full relative preserve-3d"
              animate={{
                rotateX: wheelRotation.x,
                rotateY: wheelRotation.y,
              }}
              transition={{ type: 'spring', stiffness: 50, damping: 20 }}
            >
              {/* Center orb */}
              <div className="absolute inset-[32%] rounded-full glass-premium flex items-center justify-center z-20 animate-pulse-gold preserve-3d"
                style={{ transform: 'translateZ(40px)' }}
              >
                <span className="font-display text-gold-400 text-sm font-bold text-center leading-tight">NOIR<br/>FLAVOR</span>
              </div>

              {/* Segments */}
              {flavorCategories.map((category, index) => (
                <WheelSegment
                  key={category.name}
                  category={category}
                  index={index}
                  isActive={activeFlavor === index}
                  onClick={() => setActiveFlavor(activeFlavor === index ? null : index)}
                />
              ))}

              {/* SVG connecting lines with 3D */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" style={{ transform: 'translateZ(-10px)' }}>
                {flavorCategories.map((cat, i) => {
                  const angle = (i * 45 - 90) * (Math.PI / 180);
                  const x = 50 + 38 * Math.cos(angle);
                  const y = 50 + 38 * Math.sin(angle);
                  return (
                    <g key={i}>
                      <line x1="50" y1="50" x2={x} y2={y} stroke={activeFlavor === i ? cat.color + '66' : 'rgba(200,169,110,0.08)'} strokeWidth={activeFlavor === i ? '0.8' : '0.3'} />
                      <circle cx={x} cy={y} r="1" fill={activeFlavor === i ? cat.color : 'transparent'} opacity="0.5" />
                    </g>
                  );
                })}
                {/* Outer ring */}
                <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(200,169,110,0.06)" strokeWidth="0.3" />
                <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(200,169,110,0.04)" strokeWidth="0.2" />
              </svg>
            </motion.div>
          </motion.div>

          {/* Details Panel */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="perspective-1000"
          >
            {activeFlavor !== null ? (
              <motion.div
                key={activeFlavor}
                initial={{ opacity: 0, y: 30, rotateX: 10 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                className="glass-premium rounded-2xl p-8 preserve-3d"
              >
                <h3 className="font-display text-3xl font-bold text-cream-100 mb-4" style={{ transform: 'translateZ(20px)' }}>
                  {flavorCategories[activeFlavor].name}
                </h3>
                <p className="text-cream-200/50 mb-6">
                  Explore the {flavorCategories[activeFlavor].name.toLowerCase()} notes present in our premium selections.
                </p>
                <div className="grid grid-cols-2 gap-3" style={{ transform: 'translateZ(15px)' }}>
                  {flavorCategories[activeFlavor].flavors.map((flavor) => (
                    <motion.div
                      key={flavor}
                      whileHover={{ scale: 1.05, translateZ: 30 }}
                      className="px-4 py-3 rounded-xl glass-3d text-cream-200/70 text-sm cursor-default"
                    >
                      {flavor}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="glass-premium rounded-2xl p-10 text-center">
                <p className="text-cream-200/40 text-lg">Click on a flavor category to explore its tasting notes</p>
              </div>
            )}

            {/* 3D Brewing Guide */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-8 glass-premium rounded-2xl p-8 preserve-3d"
            >
              <h4 className="font-display text-xl font-bold text-cream-100 mb-5" style={{ transform: 'translateZ(20px)' }}>
                Brewing Guide
              </h4>
              <div className="space-y-4" style={{ transform: 'translateZ(10px)' }}>
                {[
                  { method: 'Espresso', temp: '93°C', time: '25-30s', ratio: '1:2' },
                  { method: 'Pour Over', temp: '96°C', time: '3-4 min', ratio: '1:16' },
                  { method: 'French Press', temp: '93°C', time: '4 min', ratio: '1:15' },
                ].map((brew) => (
                  <motion.div
                    key={brew.method}
                    whileHover={{ translateX: 8, translateZ: 20 }}
                    className="flex items-center justify-between py-3 px-4 rounded-xl border border-gold-400/5 hover:border-gold-400/20 hover:bg-gold-400/5 transition-all cursor-default"
                  >
                    <span className="text-cream-100 font-medium">{brew.method}</span>
                    <div className="flex gap-5 text-sm text-cream-200/40">
                      <span>{brew.temp}</span>
                      <span>{brew.time}</span>
                      <span>{brew.ratio}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
