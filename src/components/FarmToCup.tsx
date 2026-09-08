import { motion, useScroll, useTransform } from 'framer-motion';
import { Leaf, Sun, Flame, Coffee, CupSoda } from 'lucide-react';
import { useRef } from 'react';

const steps = [
  {
    icon: Leaf,
    title: 'Sourcing',
    description: 'We partner with elite farms across 50+ origins, selecting only the top 1% of beans at peak ripeness.',
    image: '/images/coffee-farm.jpg',
  },
  {
    icon: Sun,
    title: 'Processing',
    description: 'Natural sun-drying and meticulous wet processing preserve each bean\'s unique terroir character.',
    image: '/images/coffee-beans.jpg',
  },
  {
    icon: Flame,
    title: 'Roasting',
    description: 'Our master roasters use precision temperature curves to unlock hidden flavor dimensions in every batch.',
    image: '/images/barista.jpg',
  },
  {
    icon: Coffee,
    title: 'Crafting',
    description: 'Each blend is composed by our sommelier-trained team, balancing intensity, aroma, and finish.',
    image: '/images/brewing.jpg',
  },
  {
    icon: CupSoda,
    title: 'Delivering',
    description: 'Nitrogen-flushed packaging ensures your coffee arrives as fresh as the moment it was roasted.',
    image: '/images/espresso.jpg',
  },
];

function StepCard({ step, index }: { step: typeof steps[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, x: isEven ? -60 : 60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`flex flex-col lg:flex-row items-center gap-12 ${
        isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
      }`}
    >
      {/* Content */}
      <div className="flex-1 text-center lg:text-left">
        <motion.div
          whileHover={{ rotateY: 360, scale: 1.05 }}
          transition={{ duration: 0.8 }}
          className="w-14 h-14 rounded-2xl glass-3d flex items-center justify-center mb-6 mx-auto lg:mx-0"
        >
          <step.icon className="w-6 h-6 text-gold-400" />
        </motion.div>
        <h3 className="font-display text-3xl md:text-4xl font-bold text-cream-100 mb-4">
          {step.title}
        </h3>
        <p className="text-cream-200/50 text-lg leading-relaxed max-w-md mx-auto lg:mx-0">
          {step.description}
        </p>
      </div>

      {/* Image Card */}
      <div className="flex-1 perspective-1000">
        <motion.div
          whileHover={{
            rotateY: isEven ? 5 : -5,
            rotateX: -3,
            scale: 1.02,
          }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative rounded-3xl overflow-hidden aspect-[4/3] glass-premium"
        >
          <motion.div style={{ y: imageY }} className="absolute inset-0">
            <img
              src={step.image}
              alt={step.title}
              className="w-full h-[120%] object-cover"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-noir-900/60 via-transparent to-transparent" />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function FarmToCup() {
  return (
    <section id="journey" className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="orb-3d absolute w-[500px] h-[500px] left-1/2 top-1/4 -translate-x-1/2 animate-orb-float opacity-20" style={{ animationDuration: '25s' }} />
      </div>

      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-28"
        >
          <span className="text-gold-400/80 text-xs font-medium tracking-[0.4em] uppercase block mb-6">
            The Process
          </span>
          <h2 className="font-display text-5xl md:text-7xl font-bold text-cream-100 mb-6">
            From Farm <span className="text-gradient-3d">To Cup</span>
          </h2>
          <p className="text-cream-200/50 max-w-xl mx-auto text-lg leading-relaxed">
            A meticulous journey that transforms the world's finest
            green beans into your perfect cup.
          </p>
        </motion.div>

        <div className="space-y-28 lg:space-y-36">
          {steps.map((step, index) => (
            <StepCard key={step.title} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
