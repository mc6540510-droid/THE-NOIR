import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { coffeeProducts } from '../lib/store';

interface ProductSliderProps {
  productId: number;
}

export default function ProductSlider({ productId }: ProductSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const constraintsRef = useRef(null);

  const product = coffeeProducts.find(p => p.id === productId);
  if (!product) return null;

  // Create multiple views/angles for the product
  const slides = [
    { image: product.image, label: 'Front View' },
    { image: product.image, label: 'Detail View', rotate: 15 },
    { image: product.image, label: 'Side View', rotate: -15 },
  ];

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => {
      let next = prev + newDirection;
      if (next < 0) next = slides.length - 1;
      if (next >= slides.length) next = 0;
      return next;
    });
  };

  const handleDragEnd = (e: any, info: PanInfo) => {
    const swipe = Math.abs(info.offset.x) > 50 || Math.abs(info.velocity.x) > 500;
    if (swipe) {
      paginate(info.offset.x < 0 ? 1 : -1);
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
  };

  return (
    <div className="relative w-full h-full overflow-hidden" ref={constraintsRef}>
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.3 },
            scale: { duration: 0.3 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.7}
          onDragEnd={handleDragEnd}
          className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing"
        >
          <div className="relative w-full h-full flex items-center justify-center perspective-1000">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-gold-400/5 via-transparent to-transparent blur-3xl" />
            
            {/* Product image */}
            <motion.img
              src={slides[currentIndex].image}
              alt={product.name}
              className="w-48 h-48 object-contain drop-shadow-2xl select-none pointer-events-none"
              style={{
                filter: 'drop-shadow(0 20px 40px rgba(200, 169, 110, 0.3))',
                transform: `rotateY(${slides[currentIndex].rotate || 0}deg)`,
              }}
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Floating particles */}
            <motion.div
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                y: [-20, -60],
                x: [-30, -40],
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 0 }}
              className="absolute top-1/2 left-1/4 w-2 h-2 bg-gold-400 rounded-full blur-sm"
            />
            <motion.div
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                y: [-20, -60],
                x: [30, 40],
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              className="absolute top-1/2 right-1/4 w-2 h-2 bg-gold-300 rounded-full blur-sm"
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Subtle swipe hint - only shows on first slide */}
      {currentIndex === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 text-cream-200/30 text-xs"
        >
          Swipe to explore
        </motion.div>
      )}
    </div>
  );
}
