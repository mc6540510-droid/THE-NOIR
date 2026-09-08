import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  depth: number;
  velocity: { x: number; y: number };
}

export default function FloatingParticles() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Initialize particles with different depths
    const newParticles: Particle[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 6,
      depth: Math.random(),
      velocity: {
        x: (Math.random() - 0.5) * 0.3,
        y: (Math.random() - 0.5) * 0.3,
      },
    }));
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((particle) => {
        const dx = mousePos.x - particle.x;
        const dy = mousePos.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxInfluence = 20;
        const influence = Math.max(0, 1 - distance / maxInfluence);

        const offsetX = -dx * influence * 0.5 * particle.depth;
        const offsetY = -dy * influence * 0.5 * particle.depth;

        return (
          <motion.div
            key={particle.id}
            animate={{
              x: [
                `${particle.x}%`,
                `${particle.x + particle.velocity.x * 100}%`,
                `${particle.x}%`,
              ],
              y: [
                `${particle.y}%`,
                `${particle.y + particle.velocity.y * 100}%`,
                `${particle.y}%`,
              ],
            }}
            transition={{
              duration: 20 + particle.depth * 10,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              position: 'absolute',
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(200, 169, 110, ${0.2 + particle.depth * 0.3}), transparent)`,
              filter: `blur(${particle.depth * 2}px)`,
              transform: `translate(${offsetX}px, ${offsetY}px)`,
              transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
          />
        );
      })}
    </div>
  );
}
