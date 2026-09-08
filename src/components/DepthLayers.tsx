import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

interface DepthLayersProps {
  variant?: 'dark' | 'warm' | 'gold';
}

export default function DepthLayers({ variant = 'dark' }: DepthLayersProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  // Layer transforms based on scroll
  const layer1Y = useSpring(useTransform(scrollYProgress, [0, 1], ['0%', '-20%']), { stiffness: 50, damping: 20 });
  const layer2Y = useSpring(useTransform(scrollYProgress, [0, 1], ['0%', '-40%']), { stiffness: 50, damping: 20 });
  const layer3Y = useSpring(useTransform(scrollYProgress, [0, 1], ['0%', '-60%']), { stiffness: 50, damping: 20 });

  // Mouse-reactive transforms
  const layer1MouseX = useTransform(smoothMouseX, [0, 1], [-20, 20]);
  const layer1MouseY = useTransform(smoothMouseY, [0, 1], [-20, 20]);
  const layer2MouseX = useTransform(smoothMouseX, [0, 1], [-40, 40]);
  const layer2MouseY = useTransform(smoothMouseY, [0, 1], [-40, 40]);
  const layer3MouseX = useTransform(smoothMouseX, [0, 1], [-60, 60]);
  const layer3MouseY = useTransform(smoothMouseY, [0, 1], [-60, 60]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width);
      mouseY.set((e.clientY - rect.top) / rect.height);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const getGradient = () => {
    switch (variant) {
      case 'warm':
        return 'from-mocha-500/10 via-noir-900/5 to-mocha-400/10';
      case 'gold':
        return 'from-gold-600/10 via-noir-900/5 to-gold-500/10';
      default:
        return 'from-noir-800/20 via-transparent to-noir-800/20';
    }
  };

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Layer 1 - Deepest */}
      <motion.div
        style={{
          y: layer1Y,
          x: layer1MouseX,
          scale: 1.2,
        }}
        className="absolute inset-0"
      >
        <div className={`absolute inset-0 bg-gradient-to-b ${getGradient()} opacity-30`} />
        <div className="absolute top-[10%] left-[5%] w-96 h-96 rounded-full bg-gold-400/5 blur-3xl" />
        <div className="absolute bottom-[10%] right-[5%] w-[500px] h-[500px] rounded-full bg-mocha-400/5 blur-3xl" />
      </motion.div>

      {/* Layer 2 - Middle */}
      <motion.div
        style={{
          y: layer2Y,
          x: layer2MouseX,
          scale: 1.1,
        }}
        className="absolute inset-0"
      >
        <div className="absolute top-[20%] right-[15%] w-80 h-80 rounded-full bg-gold-500/8 blur-2xl" />
        <div className="absolute bottom-[20%] left-[15%] w-72 h-72 rounded-full bg-mocha-300/8 blur-2xl" />
        
        {/* Floating geometric shapes */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="absolute top-[30%] left-[20%] w-32 h-32 border border-gold-400/10 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-[30%] right-[20%] w-40 h-40 border border-gold-400/10 rounded-full"
        />
      </motion.div>

      {/* Layer 3 - Closest */}
      <motion.div
        style={{
          y: layer3Y,
          x: layer3MouseX,
        }}
        className="absolute inset-0"
      >
        <div className="absolute top-[40%] left-[10%] w-64 h-64 rounded-full bg-gold-400/10 blur-xl" />
        <div className="absolute bottom-[40%] right-[10%] w-56 h-56 rounded-full bg-mocha-200/10 blur-xl" />
        
        {/* Floating orbs */}
        <motion.div
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[25%] right-[25%] w-20 h-20 rounded-full bg-gradient-to-br from-gold-400/20 to-transparent blur-md"
        />
        <motion.div
          animate={{
            y: [0, 40, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-[25%] left-[25%] w-24 h-24 rounded-full bg-gradient-to-br from-mocha-300/20 to-transparent blur-md"
        />
      </motion.div>
    </div>
  );
}
