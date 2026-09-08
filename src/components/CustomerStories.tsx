import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useState } from 'react';

const testimonials = [
  { name: 'Alexandra Chen', role: 'Executive Chef, Michelin Star', text: 'NOIR has redefined what I expect from coffee. The Midnight Velvet is like drinking liquid art — complex, bold, and utterly unforgettable.', rating: 5, avatar: 'AC' },
  { name: 'Marcus Williams', role: 'Creative Director', text: "I've traveled the world tasting coffee. NOIR's Obsidian Reserve rivals the best I've had in Milan, Tokyo, and Melbourne. Pure excellence.", rating: 5, avatar: 'MW' },
  { name: 'Sofia Ramirez', role: 'Sommelier & Writer', text: 'The flavor profiles are extraordinary. Each cup tells a story of its origin — you can taste the altitude, the soil, the care in every sip.', rating: 5, avatar: 'SR' },
  { name: 'James Blackwell', role: 'Tech Entrepreneur', text: 'My morning ritual has been transformed. The subscription service delivers consistently exceptional coffee that keeps me at my peak.', rating: 5, avatar: 'JB' },
];

export default function CustomerStories() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="relative py-32 px-6">
      <div className="absolute inset-0 pointer-events-none">
        <div className="orb-3d absolute w-[400px] h-[400px] -left-32 top-1/3 animate-orb-float" style={{ animationDuration: '18s' }} />
      </div>

      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <span className="text-gold-400/60 text-[10px] font-medium tracking-[0.5em] uppercase block mb-6">Testimonials</span>
          <h2 className="font-display text-5xl md:text-7xl font-bold text-cream-100 mb-6">
            Customer <span className="text-gradient-3d">Stories</span>
          </h2>
          <p className="text-cream-200/50 max-w-2xl mx-auto text-lg">
            Hear from the discerning palates who've made NOIR their daily ritual.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 50, rotateX: 10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.15 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="perspective-1500"
            >
              <motion.div
                animate={{
                  rotateX: hoveredIndex === index ? -3 : 0,
                  rotateY: hoveredIndex === index ? 5 : 0,
                  translateZ: hoveredIndex === index ? 30 : 0,
                  scale: hoveredIndex === index ? 1.02 : 1,
                }}
                transition={{ duration: 0.4 }}
                className="glass-premium rounded-2xl p-8 relative preserve-3d"
              >
                {/* 3D Quote icon */}
                <div className="absolute top-6 right-6" style={{ transform: 'translateZ(40px)' }}>
                  <Quote className="w-10 h-10 text-gold-400/10" />
                </div>

                {/* Avatar with 3D */}
                <div className="flex items-center gap-4 mb-6" style={{ transform: 'translateZ(25px)' }}>
                  <motion.div
                    whileHover={{ rotateY: 360 }}
                    transition={{ duration: 0.8 }}
                    className="w-14 h-14 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center text-noir-900 font-bold text-lg shadow-lg shadow-gold-500/20"
                  >
                    {testimonial.avatar}
                  </motion.div>
                  <div>
                    <h4 className="font-display text-lg font-bold text-cream-100">{testimonial.name}</h4>
                    <p className="text-cream-200/40 text-sm">{testimonial.role}</p>
                  </div>
                </div>

                {/* Stars with 3D */}
                <div className="flex gap-1 mb-4" style={{ transform: 'translateZ(20px)' }}>
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, rotateZ: -180 }}
                      whileInView={{ scale: 1, rotateZ: 0 }}
                      viewport={{ once: true }}
                      transition={{ type: 'spring', delay: 0.5 + i * 0.1 }}
                    >
                      <Star className="w-4 h-4 fill-gold-400 text-gold-400" />
                    </motion.div>
                  ))}
                </div>

                {/* Quote text */}
                <p className="text-cream-200/60 leading-relaxed italic text-lg" style={{ transform: 'translateZ(15px)' }}>
                  "{testimonial.text}"
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
