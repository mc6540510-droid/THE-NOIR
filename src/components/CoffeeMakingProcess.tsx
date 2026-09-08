import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface StepProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isActive: boolean;
}

function ProcessStep({ title, description, icon, isActive }: StepProps) {
  return (
    <motion.div
      className={`relative p-8 rounded-3xl transition-all duration-700 ${
        isActive 
          ? 'glass-premium scale-105 shadow-2xl shadow-gold-500/20' 
          : 'glass-3d scale-95 opacity-60'
      }`}
      animate={{
        rotateY: isActive ? [0, 5, -5, 0] : 0,
        rotateX: isActive ? [0, -3, 3, 0] : 0,
      }}
      transition={{
        duration: 4,
        repeat: isActive ? Infinity : 0,
        ease: 'easeInOut',
      }}
    >
      <motion.div
        className="text-6xl mb-4"
        animate={{
          scale: isActive ? [1, 1.2, 1] : 1,
          rotate: isActive ? [0, 10, -10, 0] : 0,
        }}
        transition={{
          duration: 3,
          repeat: isActive ? Infinity : 0,
          ease: 'easeInOut',
        }}
      >
        {icon}
      </motion.div>
      <h3 className="font-display text-2xl font-bold text-gold-400 mb-3">{title}</h3>
      <p className="text-cream-200/70 leading-relaxed">{description}</p>
      
      {isActive && (
        <motion.div
          className="absolute -inset-1 rounded-3xl border-2 border-gold-400/30"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
    </motion.div>
  );
}

export default function CoffeeMakingProcess() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);

  const steps = [
    {
      title: 'Growing',
      description: 'Coffee cherries grow on trees in tropical climates at high altitudes, taking 3-4 years to bear fruit.',
      icon: '🌱',
    },
    {
      title: 'Harvesting',
      description: 'Ripe red cherries are hand-picked at peak maturity to ensure optimal flavor development.',
      icon: '🫐',
    },
    {
      title: 'Processing',
      description: 'Cherries are processed using washed, natural, or honey methods to remove fruit and prepare beans.',
      icon: '💧',
    },
    {
      title: 'Roasting',
      description: 'Green beans are roasted at precise temperatures to unlock complex flavors and aromas.',
      icon: '🔥',
    },
    {
      title: 'Grinding',
      description: 'Roasted beans are ground to the perfect consistency for the chosen brewing method.',
      icon: '⚙️',
    },
    {
      title: 'Brewing',
      description: 'Hot water extracts flavors through various methods: espresso, pour-over, French press, or drip.',
      icon: '☕',
    },
    {
      title: 'Serving',
      description: 'The perfect cup is served immediately to preserve aroma, temperature, and taste.',
      icon: '✨',
    },
  ];

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen py-20 px-6 overflow-hidden"
    >
      {/* Video background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-20"
        >
          <source src="/videos/roasting.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-noir-900/80 via-noir-900/60 to-noir-900/80" />
      </div>

      <motion.div 
        className="relative z-10 max-w-7xl mx-auto"
        style={{ opacity, scale }}
      >
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-6xl md:text-7xl font-bold text-cream-100 mb-6">
            From <span className="text-gradient-gold">Bean</span> to <span className="text-gradient-gold">Cup</span>
          </h2>
          <p className="text-xl text-cream-200/60 max-w-3xl mx-auto">
            The art and science of crafting the perfect cup of coffee
          </p>
        </motion.div>

        {/* Process steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.slice(0, 4).map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
            >
              <ProcessStep
                {...step}
                isActive={index === 0}
              />
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.slice(4).map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: (index + 4) * 0.15 }}
            >
              <ProcessStep
                {...step}
                isActive={index === 2}
              />
            </motion.div>
          ))}
        </div>

        {/* Animated connection line */}
        <motion.svg
          className="absolute top-1/2 left-0 w-full h-32 -translate-y-1/2 pointer-events-none opacity-20"
          viewBox="0 0 1200 100"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M 0 50 Q 300 0 600 50 Q 900 100 1200 50"
            stroke="url(#line-gradient)"
            strokeWidth="3"
            fill="none"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 3, ease: 'easeInOut' }}
          />
          <defs>
            <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C8A96E" stopOpacity="0" />
              <stop offset="50%" stopColor="#C8A96E" stopOpacity="1" />
              <stop offset="100%" stopColor="#C8A96E" stopOpacity="0" />
            </linearGradient>
          </defs>
        </motion.svg>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center mt-16"
        >
          <p className="text-cream-200/60 mb-6">
            Every step matters in creating your perfect cup
          </p>
          <a
            href="#collection"
            className="inline-block magnetic-btn px-12 py-5 bg-gradient-to-r from-gold-500 to-gold-600 text-noir-900 font-bold rounded-full text-lg tracking-wider uppercase hover:from-gold-400 hover:to-gold-500 transition-all"
          >
            Explore Our Collection
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
