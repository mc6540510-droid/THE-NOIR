import { motion } from 'framer-motion';
import { TreePine, Recycle, Heart, Globe, Droplets, Users } from 'lucide-react';

const initiatives = [
  { icon: TreePine, title: 'Carbon Neutral', value: '100%', description: 'Every bag of NOIR coffee is carbon neutral from farm to cup.' },
  { icon: Droplets, title: 'Water Conservation', value: '60%', description: 'Reduced water usage in processing through innovative methods.' },
  { icon: Users, title: 'Fair Trade Farmers', value: '2,400+', description: 'Direct partnerships ensuring fair wages and community growth.' },
  { icon: Recycle, title: 'Zero Waste', value: '95%', description: 'Our packaging is fully compostable or infinitely recyclable.' },
  { icon: Globe, title: 'Reforestation', value: '1M+', description: 'Trees planted in coffee-growing regions since 2018.' },
  { icon: Heart, title: 'Community Impact', value: '$4.2M', description: 'Invested in education and healthcare for farming communities.' },
];

export default function Sustainability() {
  return (
    <section id="sustainability" className="relative py-32 px-6">
      {/* 3D Video Background */}
      <div className="absolute inset-0 overflow-hidden">
        <video autoPlay muted loop playsInline className="w-full h-full object-cover opacity-15">
          <source src="/videos/coffee-steam.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-noir-900 via-noir-900/90 to-noir-900" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <span className="text-gold-400/60 text-[10px] font-medium tracking-[0.5em] uppercase block mb-6">Our Promise</span>
          <h2 className="font-display text-5xl md:text-7xl font-bold text-cream-100 mb-6">
            Sustainability <span className="text-gradient-3d">Mission</span>
          </h2>
          <p className="text-cream-200/50 max-w-2xl mx-auto text-lg">
            Great coffee shouldn't cost the earth. We're committed to leaving
            every part of our supply chain better than we found it.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {initiatives.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 50, rotateX: 15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              whileHover={{
                translateZ: 30,
                rotateX: -5,
                rotateY: 5,
                scale: 1.03,
              }}
              className="glass-premium rounded-2xl p-8 preserve-3d perspective-1000 cursor-default"
            >
              <div className="flex items-center gap-4 mb-5" style={{ transform: 'translateZ(25px)' }}>
                <motion.div
                  whileHover={{ rotateY: 360 }}
                  transition={{ duration: 0.8 }}
                  className="w-14 h-14 rounded-2xl bg-gold-400/10 flex items-center justify-center preserve-3d"
                >
                  <item.icon className="w-6 h-6 text-gold-400" />
                </motion.div>
                <motion.span
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', delay: 0.3 + index * 0.1 }}
                  className="font-display text-4xl font-bold text-gradient-gold"
                >
                  {item.value}
                </motion.span>
              </div>
              <h3 className="font-display text-xl font-bold text-cream-100 mb-2" style={{ transform: 'translateZ(15px)' }}>
                {item.title}
              </h3>
              <p className="text-cream-200/50 text-sm leading-relaxed" style={{ transform: 'translateZ(10px)' }}>
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* 3D CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 text-center perspective-1000"
        >
          <motion.div
            whileHover={{ translateZ: 20, rotateX: -2 }}
            className="glass-premium rounded-3xl p-12 max-w-3xl mx-auto preserve-3d"
          >
            <h3 className="font-display text-2xl md:text-3xl font-bold text-cream-100 mb-4" style={{ transform: 'translateZ(20px)' }}>
              Join Our Green Initiative
            </h3>
            <p className="text-cream-200/50 mb-8" style={{ transform: 'translateZ(15px)' }}>
              For every subscription, we plant 10 trees in coffee-growing regions.
            </p>
            <button
              onClick={() => {
                const element = document.querySelector('#subscription');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="magnetic-btn px-10 py-5 bg-gradient-to-r from-gold-500 to-gold-600 text-noir-900 font-bold rounded-full text-sm tracking-[0.2em] uppercase"
              style={{ transform: 'translateZ(30px)' }}
            >
              Subscribe & Plant Trees
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
