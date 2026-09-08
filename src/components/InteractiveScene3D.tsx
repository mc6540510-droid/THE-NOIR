import { motion, useMotionValue, useSpring, useTransform, PanInfo } from 'framer-motion';
import { useState } from 'react';

interface DraggableObjectProps {
  id: string;
  initialX: number;
  initialY: number;
  children: React.ReactNode;
  depth: number;
}

function DraggableObject({ id, initialX, initialY, children, depth }: DraggableObjectProps) {
  const x = useMotionValue(initialX);
  const y = useMotionValue(initialY);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const scale = useSpring(1, { stiffness: 300, damping: 20 });

  const springX = useSpring(x, { stiffness: 100, damping: 15 });
  const springY = useSpring(y, { stiffness: 100, damping: 15 });
  const springRotateX = useSpring(rotateX, { stiffness: 150, damping: 20 });
  const springRotateY = useSpring(rotateY, { stiffness: 150, damping: 20 });

  const handleDrag = (_: any, info: PanInfo) => {
    const velocity = info.velocity;
    rotateY.set(velocity.x * 0.05);
    rotateX.set(-velocity.y * 0.05);
  };

  const handleDragEnd = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      drag
      dragMomentum={true}
      dragElastic={0.1}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      onDragStart={() => scale.set(1.1)}
      onDragTransitionEnd={() => scale.set(1)}
      style={{
        x: springX,
        y: springY,
        rotateX: springRotateX,
        rotateY: springRotateY,
        scale,
        position: 'absolute',
        left: `${initialX}%`,
        top: `${initialY}%`,
        cursor: 'grab',
        zIndex: depth,
        transformStyle: 'preserve-3d',
      }}
      whileHover={{ scale: 1.15, zIndex: 100 }}
      whileTap={{ cursor: 'grabbing', scale: 1.1 }}
    >
      <div className="preserve-3d">{children}</div>
    </motion.div>
  );
}

// Luxury 3D Coffee Jar
function CoffeeJar3D() {
  return (
    <div className="relative w-32 h-44 preserve-3d">
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 blur-xl rounded-full" style={{ bottom: '-20px' }} />
      <div className="relative w-full h-full preserve-3d">
        {/* Jar body */}
        <div
          className="w-full h-full rounded-b-3xl rounded-t-xl relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 40%, #1a1a1a 60%, #111 100%)',
            boxShadow: `
              inset -10px 0 20px rgba(0,0,0,0.6),
              inset 10px 0 15px rgba(255,255,255,0.05),
              0 25px 50px rgba(0,0,0,0.6),
              0 5px 15px rgba(0,0,0,0.4)
            `,
          }}
        >
          <div className="absolute top-0 left-3 w-5 h-full bg-gradient-to-b from-white/10 via-white/3 to-transparent rounded-full" />
          <div
            className="absolute top-[35%] left-0 right-0 h-[30%]"
            style={{
              background: 'linear-gradient(180deg, #8b6914 0%, #c8a96e 30%, #f5e6c8 50%, #c8a96e 70%, #8b6914 100%)',
              boxShadow: '0 2px 10px rgba(139,105,20,0.5)',
            }}
          >
            <div className="flex items-center justify-center h-full">
              <span className="text-xs font-bold tracking-[0.25em] text-noir-900 uppercase">Noir</span>
            </div>
          </div>
        </div>
        {/* Lid */}
        <div
          className="absolute -top-4 left-1/2 -translate-x-1/2 w-[80%] h-6 rounded-t-lg"
          style={{
            background: 'linear-gradient(180deg, #f5e6c8, #c8a96e, #8b6914)',
            boxShadow: '0 -2px 10px rgba(200,169,110,0.4), inset 0 1px 3px rgba(255,255,255,0.3)',
          }}
        />
        <div
          className="absolute -top-7 left-1/2 -translate-x-1/2 w-8 h-4 rounded-full"
          style={{
            background: 'linear-gradient(180deg, #f5e6c8, #c8a96e)',
            boxShadow: '0 -1px 6px rgba(200,169,110,0.5)',
          }}
        />
      </div>
    </div>
  );
}

// Luxury 3D Coffee Cup
function CoffeeCup3D() {
  return (
    <div className="relative w-36 h-32 preserve-3d">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-8 bg-black/50 rounded-[50%] blur-xl" />
      <div className="relative w-full h-full preserve-3d">
        {/* Cup body */}
        <div
          className="w-full h-full rounded-b-[40%] rounded-t-lg relative overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, #2a1a10 0%, #1a0f0a 50%, #0a0604 100%)',
            boxShadow: `
              inset -12px 0 24px rgba(0,0,0,0.4),
              inset 12px 0 18px rgba(200,169,110,0.08),
              0 25px 60px rgba(0,0,0,0.6),
              0 8px 20px rgba(0,0,0,0.4)
            `,
          }}
        >
          {/* Coffee liquid */}
          <div
            className="absolute top-6 left-5 right-5 h-14 rounded-full"
            style={{
              background: 'radial-gradient(ellipse at 30% 30%, #8b5e3c, #4a2c17, #2a1510)',
              boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.6)',
            }}
          />
          {/* Gold rim */}
          <div
            className="absolute top-0 left-0 right-0 h-4 rounded-full"
            style={{
              background: 'linear-gradient(90deg, #8b6914, #c8a96e, #f5e6c8, #c8a96e, #8b6914)',
              boxShadow: '0 2px 6px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.3)',
            }}
          />
          <div className="absolute top-8 left-4 w-6 h-24 bg-gradient-to-b from-white/6 to-transparent rounded-full" />
        </div>
        {/* Handle */}
        <div className="absolute -right-10 top-10 w-12 h-20 border-[6px] border-gold-400/40 rounded-r-full shadow-lg" />
      </div>
    </div>
  );
}

// Luxury 3D Coffee Beans
function CoffeeBeans3D() {
  return (
    <div className="relative w-28 h-28 preserve-3d">
      <div className="absolute inset-0 flex items-center justify-center gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="relative"
            style={{
              transform: `rotate(${i * 30 - 30}deg) translateY(${i * 5}px)`,
            }}
          >
            <div
              className="w-10 h-14 rounded-[50%] relative"
              style={{
                background: 'linear-gradient(135deg, #6b4226, #3a2518)',
                boxShadow: `
                  inset -4px -4px 8px rgba(0,0,0,0.5),
                  inset 4px 4px 8px rgba(139,105,20,0.3),
                  0 8px 16px rgba(0,0,0,0.4)
                `,
              }}
            >
              <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-1 h-[40%] bg-black/60 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Luxury 3D Gold Coin
function GoldCoin3D() {
  return (
    <div className="relative w-24 h-24 preserve-3d">
      <div className="absolute inset-0 bg-black/40 blur-xl rounded-full" />
      <div
        className="relative w-full h-full rounded-full flex items-center justify-center"
        style={{
          background: 'radial-gradient(circle at 30% 30%, #f5e6c8, #c8a96e, #8b6914)',
          boxShadow: `
            inset -6px -6px 12px rgba(0,0,0,0.3),
            inset 6px 6px 12px rgba(255,255,255,0.2),
            0 15px 35px rgba(139,105,20,0.4),
            0 5px 15px rgba(0,0,0,0.3)
          `,
        }}
      >
        <div className="absolute inset-2 rounded-full border-2 border-gold-600/40" />
        <span className="text-2xl font-bold text-noir-900">N</span>
      </div>
    </div>
  );
}

export default function InteractiveScene3D() {
  const [hint, setHint] = useState(true);

  return (
    <section className="relative py-32 px-6 overflow-hidden min-h-[80vh]">
      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <span className="text-gold-400/60 text-[10px] font-medium tracking-[0.5em] uppercase block mb-6">
            Interactive Experience
          </span>
          <h2 className="font-display text-5xl md:text-7xl font-bold text-cream-100 mb-6">
            Play With <span className="text-gradient-3d">Luxury</span>
          </h2>
          <p className="text-cream-200/50 max-w-2xl mx-auto text-lg">
            Drag and interact with our premium 3D objects. Experience the craftsmanship up close.
          </p>
        </motion.div>

        {/* Interactive Canvas */}
        <div
          className="relative w-full h-[600px] glass-premium rounded-3xl overflow-hidden perspective-[2000px]"
          onMouseEnter={() => setHint(false)}
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-noir-800/30 via-noir-900/50 to-noir-800/30" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,169,110,0.08)_0%,transparent_70%)]" />

          {/* Draggable Objects */}
          <DraggableObject id="jar" initialX={15} initialY={20} depth={10}>
            <CoffeeJar3D />
          </DraggableObject>

          <DraggableObject id="cup" initialX={55} initialY={30} depth={10}>
            <CoffeeCup3D />
          </DraggableObject>

          <DraggableObject id="beans" initialX={75} initialY={60} depth={10}>
            <CoffeeBeans3D />
          </DraggableObject>

          <DraggableObject id="coin1" initialX={25} initialY={65} depth={10}>
            <GoldCoin3D />
          </DraggableObject>

          <DraggableObject id="coin2" initialX={45} initialY={70} depth={10}>
            <GoldCoin3D />
          </DraggableObject>

          {/* Hint overlay */}
          {hint && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
            >
              <div className="glass-3d rounded-2xl px-8 py-4 text-center">
                <p className="text-gold-300 text-sm font-medium">👆 Drag objects to interact</p>
              </div>
            </motion.div>
          )}

          {/* Corner decorations */}
          <div className="absolute top-6 left-6 w-12 h-12 border-l-2 border-t-2 border-gold-400/20 rounded-tl-lg" />
          <div className="absolute top-6 right-6 w-12 h-12 border-r-2 border-t-2 border-gold-400/20 rounded-tr-lg" />
          <div className="absolute bottom-6 left-6 w-12 h-12 border-l-2 border-b-2 border-gold-400/20 rounded-bl-lg" />
          <div className="absolute bottom-6 right-6 w-12 h-12 border-r-2 border-b-2 border-gold-400/20 rounded-br-lg" />
        </div>
      </div>
    </section>
  );
}
