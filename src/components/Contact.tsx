import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Instagram, Twitter, Facebook } from 'lucide-react';
import { useState } from 'react';
import { contactService, newsletterService } from '../services/newsletter';
import { showToast } from './Toast';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const result = contactService.submit(formData.name, formData.email, formData.message);
    
    if (result.success) {
      showToast({ type: 'success', title: 'Message sent!', message: 'We\'ll get back to you within 24 hours.' });
      setFormData({ name: '', email: '', message: '' });
    } else {
      showToast({ type: 'error', title: 'Failed to send', message: result.error });
    }

    setSubmitting(false);
  };

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = newsletterService.subscribe(newsletterEmail);
    
    if (result.success) {
      showToast({ type: 'success', title: 'Subscribed!', message: 'Welcome to the NOIR newsletter.' });
      setNewsletterEmail('');
    } else {
      showToast({ type: 'error', title: 'Subscription failed', message: result.error });
    }
  };

  return (
    <section id="contact" className="relative py-32 px-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <video autoPlay muted loop playsInline className="w-full h-full object-cover opacity-5">
          <source src="/videos/espresso-pour.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-noir-900 via-noir-900/95 to-noir-900" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <span className="text-gold-400/60 text-[10px] font-medium tracking-[0.5em] uppercase block mb-6">Get In Touch</span>
          <h2 className="font-display text-5xl md:text-7xl font-bold text-cream-100 mb-6">
            Contact <span className="text-gradient-3d">Us</span>
          </h2>
          <p className="text-cream-200/50 max-w-2xl mx-auto text-lg">
            We'd love to hear from you. Reach out for orders, partnerships, or just to say hello.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -60, rotateY: 10 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            whileHover={{ rotateY: -2, rotateX: 1, translateZ: 10 }}
            className="perspective-1500"
          >
            <form onSubmit={handleSubmit} className="glass-premium rounded-2xl p-8 space-y-6 preserve-3d">
              <div style={{ transform: 'translateZ(15px)' }}>
                <label className="text-cream-200/60 text-sm mb-2 block">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-noir-800/60 rounded-xl px-5 py-4 text-cream-100 placeholder:text-cream-200/20 border border-gold-400/10 focus:outline-none focus:border-gold-400/30 transition-all"
                  placeholder="Your name"
                  required
                />
              </div>
              <div style={{ transform: 'translateZ(15px)' }}>
                <label className="text-cream-200/60 text-sm mb-2 block">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-noir-800/60 rounded-xl px-5 py-4 text-cream-100 placeholder:text-cream-200/20 border border-gold-400/10 focus:outline-none focus:border-gold-400/30 transition-all"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div style={{ transform: 'translateZ(15px)' }}>
                <label className="text-cream-200/60 text-sm mb-2 block">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  className="w-full bg-noir-800/60 rounded-xl px-5 py-4 text-cream-100 placeholder:text-cream-200/20 border border-gold-400/10 focus:outline-none focus:border-gold-400/30 transition-all resize-none"
                  placeholder="Tell us about your coffee dreams..."
                  required
                />
              </div>
              <motion.button
                type="submit"
                disabled={submitting}
                whileTap={{ scale: 0.95 }}
                className="w-full py-5 bg-gradient-to-r from-gold-500 to-gold-600 text-noir-900 font-bold rounded-xl text-sm tracking-[0.15em] uppercase hover:from-gold-400 hover:to-gold-500 transition-all magnetic-btn flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ transform: 'translateZ(25px)' }}
              >
                {submitting ? 'Sending...' : <><Send className="w-4 h-4" /> Send Message</>}
              </motion.button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60, rotateY: -10 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6 perspective-1000"
          >
            <motion.div
              whileHover={{ translateZ: 15, rotateY: -2 }}
              className="glass-premium rounded-2xl p-8 preserve-3d"
            >
              <h3 className="font-display text-xl font-bold text-cream-100 mb-6" style={{ transform: 'translateZ(15px)' }}>Reach Us</h3>
              <div className="space-y-5" style={{ transform: 'translateZ(10px)' }}>
                {[
                  { icon: Mail, label: 'Email', value: 'hello@noircoffee.com' },
                  { icon: Phone, label: 'Phone', value: '+1 (800) NOIR-BREW' },
                  { icon: MapPin, label: 'Headquarters', value: '142 Fifth Avenue, New York, NY' },
                ].map((item) => (
                  <motion.div key={item.label} whileHover={{ translateX: 8 }} className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-gold-400/10 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-gold-400" />
                    </div>
                    <div>
                      <p className="text-cream-200/40 text-xs uppercase tracking-[0.15em]">{item.label}</p>
                      <p className="text-cream-100">{item.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              whileHover={{ translateZ: 15, rotateY: -2 }}
              className="glass-premium rounded-2xl p-8 preserve-3d"
            >
              <h3 className="font-display text-xl font-bold text-cream-100 mb-6" style={{ transform: 'translateZ(15px)' }}>Follow Us</h3>
              <div className="flex gap-4" style={{ transform: 'translateZ(20px)' }}>
                {[Instagram, Twitter, Facebook].map((Icon, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.1, rotateY: 15, translateZ: 20 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 rounded-xl glass-3d flex items-center justify-center text-cream-200/50 hover:text-gold-400 transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </motion.button>
                ))}
              </div>
            </motion.div>

            <motion.div
              whileHover={{ translateZ: 15, rotateY: -2 }}
              className="glass-premium rounded-2xl p-8 preserve-3d"
            >
              <h3 className="font-display text-xl font-bold text-cream-100 mb-3" style={{ transform: 'translateZ(15px)' }}>Newsletter</h3>
              <p className="text-cream-200/40 text-sm mb-4" style={{ transform: 'translateZ(10px)' }}>
                Get exclusive offers, brewing tips, and new arrivals.
              </p>
              <form onSubmit={handleNewsletter} className="flex gap-2" style={{ transform: 'translateZ(15px)' }}>
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 bg-noir-800/60 rounded-xl px-4 py-3.5 text-sm text-cream-100 placeholder:text-cream-200/20 border border-gold-400/10 focus:outline-none focus:border-gold-400/30"
                  required
                />
                <button type="submit" className="px-6 py-3.5 bg-gradient-to-r from-gold-500 to-gold-600 text-noir-900 rounded-xl text-sm font-bold hover:from-gold-400 hover:to-gold-500 transition-all">
                  Join
                </button>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
