import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

type BackgroundVariant = 
  | 'coffee-beans'
  | 'coffee-cups'
  | 'coffee-cherries'
  | 'pourover'
  | 'grinder'
  | 'roasting-drum'
  | 'steam'
  | 'latte-art';

interface Animated3DBackgroundProps {
  variant: BackgroundVariant;
  opacity?: number;
  scale?: number;
}

// 3D Coffee Bean SVG
function CoffeeBean3D({ delay = 0, size = 80 }: { delay?: number; size?: number }) {
  return (
    <motion.div
      className="absolute"
      style={{
        width: size,
        height: size * 1.4,
      }}
      animate={{
        rotateY: [0, 360],
        rotateX: [0, 15, -15, 0],
        y: [0, -20, 0],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        delay,
        ease: 'linear',
      }}
    >
      <svg viewBox="0 0 100 140" className="w-full h-full drop-shadow-2xl">
        <defs>
          <radialGradient id={`bean-grad-${delay}`} cx="30%" cy="30%">
            <stop offset="0%" stopColor="#8B6F47" />
            <stop offset="50%" stopColor="#6B4423" />
            <stop offset="100%" stopColor="#3D2817" />
          </radialGradient>
          <filter id={`bean-shadow-${delay}`}>
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
            <feOffset dx="2" dy="4" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.5" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <ellipse
          cx="50"
          cy="70"
          rx="40"
          ry="60"
          fill={`url(#bean-grad-${delay})`}
          filter={`url(#bean-shadow-${delay})`}
        />
        <path
          d="M 50 20 Q 45 70 50 120"
          stroke="#2D1810"
          strokeWidth="3"
          fill="none"
          opacity="0.6"
        />
        <ellipse
          cx="35"
          cy="50"
          rx="8"
          ry="15"
          fill="#A0826D"
          opacity="0.3"
        />
      </svg>
    </motion.div>
  );
}

// 3D Coffee Cup SVG
function CoffeeCup3D({ delay = 0, size = 120 }: { delay?: number; size?: number }) {
  return (
    <motion.div
      className="absolute"
      style={{ width: size, height: size }}
      animate={{
        rotateY: [0, 360],
        rotateZ: [0, 5, -5, 0],
        y: [0, -15, 0],
      }}
      transition={{
        duration: 25,
        repeat: Infinity,
        delay,
        ease: 'linear',
      }}
    >
      <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-2xl">
        <defs>
          <linearGradient id={`cup-grad-${delay}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5F5F5" />
            <stop offset="50%" stopColor="#E0E0E0" />
            <stop offset="100%" stopColor="#C0C0C0" />
          </linearGradient>
          <radialGradient id={`coffee-grad-${delay}`} cx="50%" cy="50%">
            <stop offset="0%" stopColor="#6B4423" />
            <stop offset="100%" stopColor="#3D2817" />
          </radialGradient>
        </defs>
        {/* Cup body */}
        <ellipse cx="60" cy="90" rx="45" ry="8" fill="#000" opacity="0.2" />
        <path
          d="M 25 40 L 30 95 Q 60 105 90 95 L 95 40 Z"
          fill={`url(#cup-grad-${delay})`}
          stroke="#999"
          strokeWidth="1"
        />
        {/* Coffee surface */}
        <ellipse cx="60" cy="45" rx="35" ry="12" fill={`url(#coffee-grad-${delay})`} />
        {/* Cup rim */}
        <ellipse cx="60" cy="40" rx="38" ry="13" fill="none" stroke="#DDD" strokeWidth="3" />
        {/* Handle */}
        <path
          d="M 95 55 Q 115 55 115 75 Q 115 90 95 90"
          fill="none"
          stroke={`url(#cup-grad-${delay})`}
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Steam */}
        <motion.path
          d="M 50 30 Q 45 20 50 10"
          stroke="#FFF"
          strokeWidth="2"
          fill="none"
          opacity="0.4"
          animate={{
            d: [
              'M 50 30 Q 45 20 50 10',
              'M 50 30 Q 55 20 50 10',
              'M 50 30 Q 45 20 50 10',
            ],
            opacity: [0.4, 0.2, 0.4],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.path
          d="M 65 28 Q 60 18 65 8"
          stroke="#FFF"
          strokeWidth="2"
          fill="none"
          opacity="0.3"
          animate={{
            d: [
              'M 65 28 Q 60 18 65 8',
              'M 65 28 Q 70 18 65 8',
              'M 65 28 Q 60 18 65 8',
            ],
            opacity: [0.3, 0.15, 0.3],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.5,
          }}
        />
      </svg>
    </motion.div>
  );
}

// 3D Coffee Cherry SVG
function CoffeeCherry3D({ delay = 0, size = 60 }: { delay?: number; size?: number }) {
  return (
    <motion.div
      className="absolute"
      style={{ width: size, height: size }}
      animate={{
        rotateY: [0, 360],
        rotateX: [0, 20, -20, 0],
        y: [0, -25, 0],
      }}
      transition={{
        duration: 18,
        repeat: Infinity,
        delay,
        ease: 'linear',
      }}
    >
      <svg viewBox="0 0 60 60" className="w-full h-full drop-shadow-xl">
        <defs>
          <radialGradient id={`cherry-grad-${delay}`} cx="30%" cy="30%">
            <stop offset="0%" stopColor="#FF4444" />
            <stop offset="70%" stopColor="#CC0000" />
            <stop offset="100%" stopColor="#880000" />
          </radialGradient>
        </defs>
        <circle cx="30" cy="30" r="25" fill={`url(#cherry-grad-${delay})`} />
        <ellipse cx="22" cy="22" rx="6" ry="8" fill="#FF6666" opacity="0.4" />
        <path
          d="M 30 5 Q 28 2 32 0"
          stroke="#2D5016"
          strokeWidth="2"
          fill="none"
        />
        <ellipse cx="32" cy="2" rx="4" ry="2" fill="#4A7C2C" />
      </svg>
    </motion.div>
  );
}

// 3D Pour Over Dripper SVG
function Pourover3D({ delay = 0, size = 140 }: { delay?: number; size?: number }) {
  return (
    <motion.div
      className="absolute"
      style={{ width: size, height: size }}
      animate={{
        rotateY: [0, 360],
        rotateZ: [0, 3, -3, 0],
        y: [0, -10, 0],
      }}
      transition={{
        duration: 30,
        repeat: Infinity,
        delay,
        ease: 'linear',
      }}
    >
      <svg viewBox="0 0 140 140" className="w-full h-full drop-shadow-2xl">
        <defs>
          <linearGradient id={`dripper-grad-${delay}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2C2C2C" />
            <stop offset="50%" stopColor="#1A1A1A" />
            <stop offset="100%" stopColor="#0A0A0A" />
          </linearGradient>
        </defs>
        {/* Dripper cone */}
        <path
          d="M 40 30 L 50 100 L 90 100 L 100 30 Z"
          fill={`url(#dripper-grad-${delay})`}
          stroke="#444"
          strokeWidth="2"
        />
        {/* Ridges */}
        <path d="M 45 40 L 52 95" stroke="#333" strokeWidth="1" opacity="0.5" />
        <path d="M 55 40 L 60 95" stroke="#333" strokeWidth="1" opacity="0.5" />
        <path d="M 65 40 L 68 95" stroke="#333" strokeWidth="1" opacity="0.5" />
        <path d="M 75 40 L 76 95" stroke="#333" strokeWidth="1" opacity="0.5" />
        <path d="M 85 40 L 84 95" stroke="#333" strokeWidth="1" opacity="0.5" />
        <path d="M 95 40 L 92 95" stroke="#333" strokeWidth="1" opacity="0.5" />
        {/* Rim */}
        <ellipse cx="70" cy="30" rx="32" ry="8" fill="#333" stroke="#555" strokeWidth="2" />
        {/* Coffee grounds */}
        <ellipse cx="70" cy="35" rx="28" ry="6" fill="#3D2817" />
        {/* Drip */}
        <motion.circle
          cx="70"
          cy="105"
          r="3"
          fill="#6B4423"
          animate={{
            cy: [105, 125, 105],
            opacity: [1, 0, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeIn',
          }}
        />
      </svg>
    </motion.div>
  );
}

// 3D Coffee Grinder SVG
function Grinder3D({ delay = 0, size = 130 }: { delay?: number; size?: number }) {
  return (
    <motion.div
      className="absolute"
      style={{ width: size, height: size }}
      animate={{
        rotateY: [0, 360],
        rotateX: [0, 10, -10, 0],
        y: [0, -12, 0],
      }}
      transition={{
        duration: 28,
        repeat: Infinity,
        delay,
        ease: 'linear',
      }}
    >
      <svg viewBox="0 0 130 130" className="w-full h-full drop-shadow-2xl">
        <defs>
          <linearGradient id={`grinder-grad-${delay}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B7355" />
            <stop offset="50%" stopColor="#6B5635" />
            <stop offset="100%" stopColor="#4A3B25" />
          </linearGradient>
          <linearGradient id={`metal-grad-${delay}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#C0C0C0" />
            <stop offset="50%" stopColor="#808080" />
            <stop offset="100%" stopColor="#606060" />
          </linearGradient>
        </defs>
        {/* Base */}
        <rect x="35" y="90" width="60" height="30" rx="5" fill={`url(#grinder-grad-${delay})`} />
        {/* Body */}
        <rect x="45" y="40" width="40" height="55" rx="3" fill={`url(#grinder-grad-${delay})`} />
        {/* Hopper */}
        <path
          d="M 40 40 L 50 15 L 80 15 L 90 40 Z"
          fill={`url(#grinder-grad-${delay})`}
          stroke="#3D2817"
          strokeWidth="1"
        />
        {/* Handle */}
        <motion.g
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '65px 27px' }}
        >
          <circle cx="65" cy="27" r="8" fill={`url(#metal-grad-${delay})`} />
          <rect x="63" y="10" width="4" height="20" rx="2" fill={`url(#metal-grad-${delay})`} />
          <circle cx="65" cy="10" r="5" fill="#4A3B25" />
        </motion.g>
        {/* Drawer */}
        <rect x="40" y="100" width="50" height="15" rx="2" fill="#5A4530" stroke="#3D2817" strokeWidth="1" />
        <circle cx="65" cy="107" r="3" fill={`url(#metal-grad-${delay})`} />
      </svg>
    </motion.div>
  );
}

// 3D Roasting Drum SVG
function RoastingDrum3D({ delay = 0, size = 150 }: { delay?: number; size?: number }) {
  return (
    <motion.div
      className="absolute"
      style={{ width: size, height: size }}
      animate={{
        rotateY: [0, 360],
        rotateZ: [0, 5, -5, 0],
        y: [0, -8, 0],
      }}
      transition={{
        duration: 32,
        repeat: Infinity,
        delay,
        ease: 'linear',
      }}
    >
      <svg viewBox="0 0 150 150" className="w-full h-full drop-shadow-2xl">
        <defs>
          <linearGradient id={`drum-grad-${delay}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4A4A4A" />
            <stop offset="50%" stopColor="#2A2A2A" />
            <stop offset="100%" stopColor="#1A1A1A" />
          </linearGradient>
        </defs>
        {/* Drum body */}
        <ellipse cx="75" cy="75" rx="55" ry="40" fill={`url(#drum-grad-${delay})`} stroke="#555" strokeWidth="2" />
        {/* Drum details */}
        <ellipse cx="75" cy="75" rx="45" ry="32" fill="none" stroke="#333" strokeWidth="1" />
        <ellipse cx="75" cy="75" rx="35" ry="24" fill="none" stroke="#333" strokeWidth="1" />
        {/* Viewing window */}
        <ellipse cx="75" cy="75" rx="20" ry="15" fill="#1A0F0A" stroke="#666" strokeWidth="2" />
        {/* Beans inside */}
        <motion.g
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '75px 75px' }}
        >
          <circle cx="70" cy="70" r="3" fill="#6B4423" />
          <circle cx="80" cy="72" r="3" fill="#8B6F47" />
          <circle cx="75" cy="80" r="3" fill="#3D2817" />
          <circle cx="68" cy="78" r="3" fill="#6B4423" />
          <circle cx="82" cy="68" r="3" fill="#8B6F47" />
        </motion.g>
        {/* Stand */}
        <rect x="60" y="115" width="30" height="20" fill="#2A2A2A" />
        <rect x="55" y="135" width="40" height="5" rx="2" fill="#1A1A1A" />
        {/* Heat glow */}
        <motion.ellipse
          cx="75"
          cy="125"
          rx="15"
          ry="3"
          fill="#FF6600"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </svg>
    </motion.div>
  );
}

// 3D Steam Animation
function Steam3D({ delay = 0, size = 100 }: { delay?: number; size?: number }) {
  return (
    <motion.div
      className="absolute"
      style={{ width: size, height: size * 1.5 }}
      animate={{
        y: [0, -30, 0],
        opacity: [0.3, 0.6, 0.3],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        delay,
        ease: 'easeInOut',
      }}
    >
      <svg viewBox="0 0 100 150" className="w-full h-full">
        <motion.path
          d="M 50 150 Q 40 120 50 100 Q 60 80 50 60 Q 40 40 50 20"
          stroke="#FFF"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          animate={{
            d: [
              'M 50 150 Q 40 120 50 100 Q 60 80 50 60 Q 40 40 50 20',
              'M 50 150 Q 60 120 50 100 Q 40 80 50 60 Q 60 40 50 20',
              'M 50 150 Q 40 120 50 100 Q 60 80 50 60 Q 40 40 50 20',
            ],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          opacity="0.4"
        />
        <motion.path
          d="M 30 150 Q 20 125 30 105 Q 40 85 30 65"
          stroke="#FFF"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          animate={{
            d: [
              'M 30 150 Q 20 125 30 105 Q 40 85 30 65',
              'M 30 150 Q 40 125 30 105 Q 20 85 30 65',
              'M 30 150 Q 20 125 30 105 Q 40 85 30 65',
            ],
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.5,
          }}
          opacity="0.3"
        />
        <motion.path
          d="M 70 150 Q 80 125 70 105 Q 60 85 70 65"
          stroke="#FFF"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          animate={{
            d: [
              'M 70 150 Q 80 125 70 105 Q 60 85 70 65',
              'M 70 150 Q 60 125 70 105 Q 80 85 70 65',
              'M 70 150 Q 80 125 70 105 Q 60 85 70 65',
            ],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
          opacity="0.3"
        />
      </svg>
    </motion.div>
  );
}

// 3D Latte Art SVG
function LatteArt3D({ delay = 0, size = 120 }: { delay?: number; size?: number }) {
  return (
    <motion.div
      className="absolute"
      style={{ width: size, height: size }}
      animate={{
        rotateY: [0, 360],
        rotateX: [0, 15, -15, 0],
        y: [0, -10, 0],
      }}
      transition={{
        duration: 26,
        repeat: Infinity,
        delay,
        ease: 'linear',
      }}
    >
      <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-2xl">
        <defs>
          <radialGradient id={`latte-grad-${delay}`} cx="50%" cy="50%">
            <stop offset="0%" stopColor="#F5E6D3" />
            <stop offset="70%" stopColor="#D4A574" />
            <stop offset="100%" stopColor="#8B6F47" />
          </radialGradient>
        </defs>
        {/* Cup */}
        <ellipse cx="60" cy="95" rx="50" ry="10" fill="#000" opacity="0.2" />
        <circle cx="60" cy="60" r="50" fill="#FFF" stroke="#DDD" strokeWidth="2" />
        {/* Coffee */}
        <circle cx="60" cy="60" r="45" fill={`url(#latte-grad-${delay})`} />
        {/* Latte art - rosetta */}
        <motion.g
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ transformOrigin: '60px 60px' }}
        >
          <path
            d="M 60 30 Q 50 40 45 50 Q 40 60 45 70 Q 50 80 60 85 Q 70 80 75 70 Q 80 60 75 50 Q 70 40 60 30"
            fill="#FFF"
            opacity="0.9"
          />
          <path
            d="M 60 35 L 60 80"
            stroke="#D4A574"
            strokeWidth="2"
            opacity="0.6"
          />
          <path
            d="M 50 45 Q 55 50 60 45 Q 65 50 70 45"
            stroke="#D4A574"
            strokeWidth="1.5"
            fill="none"
            opacity="0.5"
          />
          <path
            d="M 48 55 Q 54 60 60 55 Q 66 60 72 55"
            stroke="#D4A574"
            strokeWidth="1.5"
            fill="none"
            opacity="0.5"
          />
          <path
            d="M 50 65 Q 55 70 60 65 Q 65 70 70 65"
            stroke="#D4A574"
            strokeWidth="1.5"
            fill="none"
            opacity="0.5"
          />
        </motion.g>
      </svg>
    </motion.div>
  );
}

export default function Animated3DBackground({ 
  variant, 
  opacity = 0.15,
  scale = 1 
}: Animated3DBackgroundProps) {
  const [positions, setPositions] = useState<Array<{ x: number; y: number; delay: number; size: number }>>([]);

  useEffect(() => {
    // Generate random positions for multiple objects
    const newPositions = Array.from({ length: 5 }, () => ({
      x: Math.random() * 80 + 10, // 10% to 90%
      y: Math.random() * 80 + 10,
      delay: Math.random() * 5,
      size: 60 + Math.random() * 80,
    }));
    setPositions(newPositions);
  }, []);

  const renderObject = (pos: typeof positions[0], index: number) => {
    const props = { delay: pos.delay + index, size: pos.size * scale };
    
    switch (variant) {
      case 'coffee-beans':
        return <CoffeeBean3D key={index} {...props} />;
      case 'coffee-cups':
        return <CoffeeCup3D key={index} {...props} />;
      case 'coffee-cherries':
        return <CoffeeCherry3D key={index} {...props} />;
      case 'pourover':
        return <Pourover3D key={index} {...props} />;
      case 'grinder':
        return <Grinder3D key={index} {...props} />;
      case 'roasting-drum':
        return <RoastingDrum3D key={index} {...props} />;
      case 'steam':
        return <Steam3D key={index} {...props} />;
      case 'latte-art':
        return <LatteArt3D key={index} {...props} />;
      default:
        return <CoffeeBean3D key={index} {...props} />;
    }
  };

  return (
    <div 
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ opacity }}
    >
      {positions.map((pos, index) => (
        <div
          key={index}
          className="absolute"
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {renderObject(pos, index)}
        </div>
      ))}
    </div>
  );
}
