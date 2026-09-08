import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, ChevronDown } from 'lucide-react';

function CoffeeBean3D({ index }: { index: number }) {
  const size = 14 + Math.random() * 16;
  const style: React.CSSProperties = {
    left: `${Math.random() * 100}%`,
    width: `${size}px`,
    height: `${size * 1.4}px`,
    animation: `beanFloat ${10 + Math.random() * 15}s linear infinite ${Math.random() * 10}s`,
    opacity: 0.2 + Math.random() * 0.5,
  };
  return <div className="coffee-bean" style={style} />;
}

function SteamParticle3D({ delay, x }: { delay: number; x: number }) {
  return (
    <div
      className="steam-particle"
      style={{
        left: `${x}%`,
        width: `${8 + Math.random() * 8}px`,
        height: `${8 + Math.random() * 8}px`,
        animation: `${delay % 2 === 0 ? 'steam' : 'steamAlt'} ${3 + Math.random() * 2}s ease-out infinite ${delay * 0.4}s`,
      }}
    />
  );
}

function FloatingOrb({ size, x, y, delay }: { size: number; x: string; y: string; delay: number }) {
  return (
    <div
      className="orb-3d absolute animate-orb-float"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left: x,
        top: y,
        animationDelay: `${delay}s`,
        animationDuration: `${10 + Math.random() * 8}s`,
      }}
    />
  );
}

export default function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;
    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (!heroRef.current) return;
        const rect = heroRef.current.getBoundingClientRect();
        setMousePos({
          x: ((e.clientX - rect.left) / rect.width - 0.5) * 30,
          y: ((e.clientY - rect.top) / rect.height - 0.5) * 30,
        });
      });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* VIDEO BACKGROUND */}
      <div className="absolute inset-0 z-0 will-change-transform">
        <video autoPlay muted loop playsInline className="w-full h-full object-cover">
          <source src="/videos/hero-coffee.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-noir-900/70 via-noir-900/50 to-noir-900" />
        <div className="absolute inset-0 bg-gradient-to-r from-noir-900/60 via-transparent to-noir-900/60" />
        <div
          className="absolute inset-0 opacity-40 transition-all duration-700 ease-out"
          style={{
            background: `radial-gradient(circle at ${50 + mousePos.x * 0.5}% ${50 + mousePos.y * 0.5}%, rgba(200, 169, 110, 0.2) 0%, transparent 50%)`,
          }}
        />
      </div>

      {/* FLOATING ORBS */}
      <div className="absolute inset-0 pointer-events-none z-[1]">
        <FloatingOrb size={200} x="10%" y="20%" delay={0} />
        <FloatingOrb size={150} x="75%" y="60%" delay={2} />
        <FloatingOrb size={100} x="50%" y="30%" delay={4} />
        <FloatingOrb size={250} x="80%" y="15%" delay={1} />
        <FloatingOrb size={120} x="20%" y="70%" delay={3} />
      </div>

      {/* FLOATING COFFEE BEANS */}
      <div className="absolute inset-0 pointer-events-none z-[2]">
        {Array.from({ length: 35 }).map((_, i) => (
          <CoffeeBean3D key={i} index={i} />
        ))}
      </div>

      {/* ROTATING RINGS */}
      <div className="absolute inset-0 pointer-events-none z-[1] flex items-center justify-center">
        <div className="ring-3d absolute w-[500px] h-[500px] animate-spin-slow opacity-20" style={{ animationDuration: '30s' }} />
        <div className="ring-3d absolute w-[700px] h-[700px] opacity-10" style={{ animation: 'spin-slow 50s linear infinite reverse' }} />
        <div className="ring-3d absolute w-[350px] h-[350px] opacity-15" style={{ animation: 'spin-slow 20s linear infinite' }} />
      </div>

      {/* 3D COFFEE CUP */}
      <motion.div
        className="absolute right-[5%] top-1/2 -translate-y-1/2 z-[3] hidden xl:block scene-3d"
        animate={{
          rotateY: mousePos.x * 0.4,
          rotateX: -mousePos.y * 0.4,
        }}
        transition={{ type: 'spring', stiffness: 30, damping: 25 }}
      >
        <div className="cup-3d relative">
          <div className="w-72 h-56 relative preserve-3d">
            <div className="cup-3d-body absolute inset-0">
              <div className="cup-3d-liquid absolute top-6 left-5 right-5 h-16" />
              <div className="cup-3d-rim absolute top-0 left-0 right-0 h-4" />
              <div className="absolute top-8 left-4 w-8 h-32 bg-gradient-to-b from-white/5 to-transparent rounded-full" />
            </div>
            <div className="absolute -right-10 top-10 w-12 h-24 border-[5px] border-gold-400/30 rounded-r-full shadow-lg" />
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[120%] h-6">
              <div className="w-full h-full bg-gradient-to-b from-noir-600 to-noir-800 rounded-[50%] border border-gold-400/10 shadow-2xl" />
            </div>
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-40 h-28">
              {Array.from({ length: 12 }).map((_, i) => (
                <SteamParticle3D key={i} delay={i} x={10 + i * 7} />
              ))}
            </div>
            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-80 h-16 bg-gold-400/5 rounded-[50%] blur-2xl" />
          </div>
        </div>
      </motion.div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center xl:text-left">
        <motion.div
          initial={{ opacity: 0, y: 60, rotateX: 15 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-6 perspective-1000"
        >
          <span className="inline-block px-5 py-2 glass-3d rounded-full text-gold-400/80 text-[10px] font-medium tracking-[0.4em] uppercase">
            ✦ Premium Artisan Coffee
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="font-luxury text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold leading-[0.85] mb-8 tracking-tight"
        >
          <span className="text-gradient-3d block">Every Bean</span>
          <span className="text-cream-100 block mt-2">Tells A </span>
          <span className="font-accent italic text-gold-300 block mt-1" style={{ filter: 'drop-shadow(0 4px 8px rgba(200,169,110,0.3))' }}>Story</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-cream-200/60 text-lg md:text-xl max-w-xl mx-auto xl:mx-0 mb-12 font-light leading-relaxed"
        >
          Crafted for those who demand extraordinary coffee.
          <br />
          Each cup is a journey from the world's finest estates to your senses.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex flex-col sm:flex-row gap-5 justify-center xl:justify-start"
        >
          <button
            onClick={() => {
              const element = document.querySelector('#collection');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className="magnetic-btn px-10 py-5 bg-gradient-to-r from-gold-500 to-gold-600 text-noir-900 font-bold rounded-full text-sm tracking-[0.2em] uppercase"
          >
            Explore Collection
          </button>
          <button
            onClick={() => {
              const element = document.querySelector('#subscription');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className="magnetic-btn px-10 py-5 border-2 border-gold-400/30 text-gold-300 rounded-full text-sm tracking-[0.2em] uppercase hover:bg-gold-400/10 hover:border-gold-400/60 flex items-center justify-center gap-3"
          >
            <Play className="w-5 h-5" /> Shop Now
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10"
      >
        <span className="text-cream-200/30 text-xs uppercase tracking-[0.3em]">Scroll or use ↓ keys</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-6 h-10 border-2 border-gold-400/30 rounded-full flex items-start justify-center p-1.5"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1.5 h-3 bg-gold-400 rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
