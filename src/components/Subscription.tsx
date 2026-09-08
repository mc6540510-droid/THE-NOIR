import { motion } from 'framer-motion';
import { Check, Sparkles, Crown, Diamond } from 'lucide-react';
import { useState } from 'react';
import { authService } from '../services/auth';
import { showToast } from './Toast';

const plans = [
  {
    name: 'Explorer',
    icon: Sparkles,
    price: { monthly: 29, yearly: 290 },
    description: 'Perfect for the curious coffee lover',
    features: ['2 unique blends per month', '250g per blend', 'Tasting notes card', 'Free shipping', 'Brewing guide access'],
    popular: false,
  },
  {
    name: 'Connoisseur',
    icon: Crown,
    price: { monthly: 59, yearly: 590 },
    description: 'For those who demand the extraordinary',
    features: ['4 premium blends per month', '250g per blend', 'Single-origin selections', 'Priority shipping', 'Exclusive limited editions', 'Personal sommelier consultations', 'Loyalty points 2x multiplier'],
    popular: true,
  },
  {
    name: 'Collector',
    icon: Diamond,
    price: { monthly: 99, yearly: 990 },
    description: 'The ultimate luxury coffee experience',
    features: ['6 rare blends per month', '500g per blend', 'Micro-lot & competition coffees', 'Same-day express shipping', 'Quarterly cupping events', 'Custom roast profiles', 'Dedicated concierge', 'Complimentary NOIR merchandise'],
    popular: false,
  },
];

export default function Subscription() {
  const [isYearly, setIsYearly] = useState(false);
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null);

  const handleSubscribe = (planName: string) => {
    if (!authService.isAuthenticated()) {
      showToast({ type: 'info', title: 'Sign in required', message: 'Please sign in to start a subscription.' });
      return;
    }

    const user = authService.getCurrentUser();
    if (user) {
      const planType = planName.toLowerCase() as 'explorer' | 'connoisseur' | 'collector';
      authService.updateProfile(user.id, { 
        subscriptionPlan: planType,
        subscriptionStatus: 'active'
      });
      showToast({ 
        type: 'success', 
        title: 'Subscription activated!', 
        message: `Welcome to the ${planName} plan. Enjoy your premium coffee journey.` 
      });
    }
  };

  return (
    <section id="subscription" className="relative py-32 px-6">
      {/* 3D Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="orb-3d absolute w-[500px] h-[500px] left-1/2 top-0 -translate-x-1/2 animate-orb-float opacity-20" style={{ animationDuration: '20s' }} />
      </div>

      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-gold-400/60 text-[10px] font-medium tracking-[0.5em] uppercase block mb-6">Subscribe</span>
          <h2 className="font-display text-5xl md:text-7xl font-bold text-cream-100 mb-6">
            Subscription <span className="text-gradient-3d">Plans</span>
          </h2>
          <p className="text-cream-200/50 max-w-2xl mx-auto text-lg mb-10">
            Curated coffee delivered to your door. Choose your journey.
          </p>

          {/* 3D Toggle */}
          <motion.div
            whileHover={{ translateZ: 10 }}
            className="inline-flex items-center gap-4 glass-premium rounded-full px-8 py-3 preserve-3d"
          >
            <span className={`text-sm font-medium ${!isYearly ? 'text-gold-400' : 'text-cream-200/40'}`}>Monthly</span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`w-14 h-7 rounded-full transition-all relative ${isYearly ? 'bg-gold-500' : 'bg-noir-600'}`}
            >
              <motion.div
                animate={{ x: isYearly ? 28 : 2 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="w-5 h-5 rounded-full bg-cream-100 absolute top-1 shadow-md"
              />
            </button>
            <span className={`text-sm font-medium ${isYearly ? 'text-gold-400' : 'text-cream-200/40'}`}>
              Yearly <span className="text-gold-400/60 text-xs">(Save 17%)</span>
            </span>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 60, rotateX: 15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.15 }}
              onMouseEnter={() => setHoveredPlan(index)}
              onMouseLeave={() => setHoveredPlan(null)}
              className="perspective-1500"
            >
              <motion.div
                animate={{
                  rotateX: hoveredPlan === index ? -3 : 0,
                  rotateY: hoveredPlan === index ? 5 : 0,
                  translateZ: hoveredPlan === index ? 40 : 0,
                  scale: hoveredPlan === index ? 1.03 : (plan.popular ? 1.02 : 1),
                }}
                transition={{ duration: 0.4 }}
                className={`glass-premium rounded-2xl p-8 preserve-3d h-full flex flex-col relative ${
                  plan.popular ? 'ring-1 ring-gold-400/30' : ''
                }`}
              >
                {plan.popular && (
                  <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-gradient-to-r from-gold-500 to-gold-600 text-noir-900 text-xs font-bold uppercase tracking-[0.15em] rounded-full shadow-lg shadow-gold-500/30"
                    style={{ transform: 'translateZ(50px) translateX(-50%)' }}
                  >
                    Most Popular
                  </motion.div>
                )}

                <div className="flex items-center gap-3 mb-4" style={{ transform: 'translateZ(20px)' }}>
                  <motion.div
                    whileHover={{ rotateY: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <plan.icon className="w-7 h-7 text-gold-400" />
                  </motion.div>
                  <h3 className="font-display text-2xl font-bold text-cream-100">{plan.name}</h3>
                </div>
                <p className="text-cream-200/40 text-sm mb-6">{plan.description}</p>

                <div className="mb-8" style={{ transform: 'translateZ(25px)' }}>
                  <motion.span
                    key={isYearly ? 'yearly' : 'monthly'}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-display text-5xl font-bold text-gradient-gold"
                  >
                    ${isYearly ? plan.price.yearly : plan.price.monthly}
                  </motion.span>
                  <span className="text-cream-200/40 text-sm">/{isYearly ? 'year' : 'month'}</span>
                </div>

                <ul className="space-y-3 mb-8 flex-1" style={{ transform: 'translateZ(15px)' }}>
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-gold-400 mt-0.5 shrink-0" />
                      <span className="text-cream-200/60 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSubscribe(plan.name)}
                  className={`w-full py-4 rounded-xl font-semibold text-sm tracking-[0.15em] uppercase transition-all magnetic-btn ${
                    plan.popular
                      ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-noir-900 hover:from-gold-400 hover:to-gold-500'
                      : 'border border-gold-400/20 text-gold-300 hover:bg-gold-400/10'
                  }`}
                  style={{ transform: 'translateZ(30px)' }}
                >
                  Start Subscription
                </motion.button>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
