import { motion } from 'framer-motion';
import { coffeeProducts } from '../lib/store';
import { useState } from 'react';

interface ProductObject3DProps {
  productId: number;
  isHovered?: boolean;
}

export default function ProductObject3D({ productId, isHovered = false }: ProductObject3DProps) {
  const product = coffeeProducts.find(p => p.id === productId);
  const [imgLoaded, setImgLoaded] = useState(false);
  if (!product) return null;

  return (
    <div className="relative w-full h-full flex items-center justify-center perspective-1000">
      {/* 3D Shadow pool */}
      <motion.div
        animate={{
          scaleX: isHovered ? 1.3 : 1,
          opacity: isHovered ? 0.7 : 0.4,
        }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-black/60 rounded-[50%] blur-xl"
      />

      {/* Ambient glow */}
      <motion.div
        animate={{
          opacity: isHovered ? 0.5 : 0.15,
          scale: isHovered ? 1.2 : 1,
        }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,169,110,0.2)_0%,transparent_70%)]"
      />

      {/* 3D Product Image */}
      <motion.div
        animate={{
          rotateY: isHovered ? 12 : 0,
          rotateX: isHovered ? -5 : 0,
          scale: isHovered ? 1.08 : 1,
          y: isHovered ? -8 : 0,
        }}
        transition={{ type: 'spring', stiffness: 80, damping: 15 }}
        className="relative preserve-3d"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Floating idle animation */}
        <motion.div
          animate={{
            y: [0, -6, 0],
            rotateZ: [0, 1, -1, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <motion.img
            src={product.image}
            alt={product.name}
            onLoad={() => setImgLoaded(true)}
            className="w-44 h-44 md:w-48 md:h-48 object-contain"
            style={{
              opacity: imgLoaded ? 1 : 0,
              transition: 'opacity 0.5s ease, filter 0.4s ease',
              filter: isHovered
                ? 'drop-shadow(0 20px 40px rgba(200, 169, 110, 0.5)) drop-shadow(0 0 20px rgba(200, 169, 110, 0.2))'
                : 'drop-shadow(0 10px 25px rgba(0, 0, 0, 0.6))',
            }}
          />

          {/* Loading shimmer */}
          {!imgLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-noir-700/50 animate-pulse" />
            </div>
          )}
        </motion.div>

        {/* Floating golden particles on hover */}
        {isHovered && (
          <div className="absolute inset-0 pointer-events-none">
            {[
              { x: '20%', y: '40%', delay: 0, size: 3 },
              { x: '75%', y: '35%', delay: 0.4, size: 2 },
              { x: '50%', y: '60%', delay: 0.8, size: 2.5 },
              { x: '30%', y: '70%', delay: 1.2, size: 2 },
              { x: '70%', y: '55%', delay: 0.6, size: 3 },
            ].map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0, y: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0.5],
                  y: [-10, -50],
                  x: [0, (i % 2 === 0 ? -1 : 1) * 15],
                }}
                transition={{ duration: 2, repeat: Infinity, delay: p.delay }}
                className="absolute rounded-full bg-gold-400"
                style={{
                  left: p.x,
                  top: p.y,
                  width: p.size,
                  height: p.size,
                  boxShadow: '0 0 6px rgba(200, 169, 110, 0.6)',
                }}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
