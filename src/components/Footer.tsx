import { Coffee } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="relative py-16 px-6 border-t border-gold-400/10">
      {/* Subtle 3D background */}
      <div className="absolute inset-0 bg-gradient-to-b from-noir-900 to-noir-800/50 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-1">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 mb-5"
            >
              <Coffee className="w-7 h-7 text-gold-400" />
              <span className="font-display text-2xl font-bold text-gradient-3d">NOIR</span>
            </motion.div>
            <p className="text-cream-200/40 text-sm leading-relaxed">
              Premium artisan coffee, crafted for those who demand extraordinary experiences in every cup.
            </p>
          </div>

          {[
            { title: 'Shop', items: ['All Coffee', 'Single Origin', 'Blends', 'Limited Edition', 'Gift Sets'] },
            { title: 'Company', items: ['Our Story', 'Sustainability', 'Careers', 'Press', 'Partners'] },
            { title: 'Support', items: ['Help Center', 'Shipping', 'Returns', 'Brewing Guide', 'Contact'] },
          ].map((section) => (
            <div key={section.title}>
              <h4 className="text-cream-100 font-medium mb-4 text-sm uppercase tracking-[0.2em]">{section.title}</h4>
              <ul className="space-y-2.5">
                {section.items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-cream-200/40 text-sm hover:text-gold-400 transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-gold-400/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-cream-200/30 text-xs">© 2024 NOIR Coffee. All rights reserved. Crafted with passion.</p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Cookies'].map((item) => (
              <a key={item} href="#" className="text-cream-200/30 text-xs hover:text-gold-400 transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
