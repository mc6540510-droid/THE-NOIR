import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import { coffeeProducts } from '../lib/store';
import { useState, useRef, useEffect } from 'react';
import ProductSlider from './ProductSlider';
import { cartService } from '../services/cart';
import { wishlistService } from '../services/wishlist';
import { authService } from '../services/auth';
import { showToast } from './Toast';

function IntensityBar({ level }: { level: number }) {
  return (
    <div className="flex gap-[3px]">
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.04, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className={`w-[6px] h-4 rounded-sm origin-bottom ${
            i < level ? 'bg-gradient-to-t from-gold-600 to-gold-400' : 'bg-noir-600/50'
          }`}
        />
      ))}
    </div>
  );
}

function ProductCard3D({
  product,
  index,
  onAuthRequired,
  onViewDetail,
}: {
  product: typeof coffeeProducts[0];
  index: number;
  onAuthRequired: () => void;
  onViewDetail: (id: number) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (authService.isAuthenticated()) {
      setInWishlist(wishlistService.isInWishlist(product.id.toString()));
    }
  }, [product.id]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!authService.isAuthenticated()) {
      onAuthRequired();
      showToast({ type: 'info', title: 'Sign in required', message: 'Please sign in to add items to your cart.' });
      return;
    }

    cartService.addItem(product.id.toString(), product.name, product.image, product.price, 1, '250g', 'whole');
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
    showToast({ type: 'success', title: 'Added to cart!', message: `${product.name} — $${product.price}` });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!authService.isAuthenticated()) {
      onAuthRequired();
      showToast({ type: 'info', title: 'Sign in required', message: 'Please sign in to use your wishlist.' });
      return;
    }

    if (inWishlist) {
      wishlistService.removeFromWishlist(product.id.toString());
      setInWishlist(false);
      showToast({ type: 'info', title: 'Removed from wishlist', message: product.name });
    } else {
      wishlistService.addToWishlist(product.id.toString(), product.name, product.image, product.price);
      setInWishlist(true);
      showToast({ type: 'success', title: 'Added to wishlist!', message: product.name });
    }
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.9, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => onViewDetail(product.id)}
      className="perspective-[1500px] cursor-pointer"
    >
      <motion.div
        style={{ rotateX, rotateY }}
        className="relative preserve-3d will-change-transform"
      >
        <motion.div
          animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
          transition={{ duration: 0.5 }}
          className="absolute -inset-6 rounded-3xl bg-gradient-to-b from-gold-400/8 to-transparent blur-2xl pointer-events-none"
        />

        <div className="glass-premium rounded-3xl overflow-hidden relative">
          {/* 3D Product Object Display */}
          <div className="relative h-64 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-noir-800/50 via-noir-900/20 to-noir-900" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,169,110,0.06)_0%,transparent_70%)]" />

            <div className="absolute inset-0 flex items-center justify-center" style={{ transform: 'translateZ(30px)' }}>
              <ProductSlider productId={product.id} />
            </div>

            {/* View detail button on hover */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2"
              style={{ transform: 'translateZ(50px)' }}
            >
              <span className="px-4 py-2 glass-3d rounded-full text-xs text-gold-300 font-medium flex items-center gap-1.5">
                <Eye className="w-3 h-3" /> View Details
              </span>
            </motion.div>

            <motion.div
              animate={{ y: isHovered ? -2 : 0 }}
              transition={{ duration: 0.4 }}
              className="absolute top-4 left-4 px-4 py-1.5 glass-3d rounded-full text-[10px] text-gold-300 font-semibold tracking-[0.2em] uppercase"
              style={{ transform: 'translateZ(60px)' }}
            >
              {product.roast}
            </motion.div>

            <motion.button
              onClick={handleToggleWishlist}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className="absolute top-4 right-4 p-2.5 glass-3d rounded-full"
              style={{ transform: 'translateZ(60px)' }}
            >
              <Heart className={`w-4 h-4 transition-colors duration-300 ${inWishlist ? 'fill-gold-400 text-gold-400' : 'text-cream-200/50'}`} />
            </motion.button>
          </div>

          {/* Content */}
          <div className="p-7 preserve-3d">
            <div className="flex items-start justify-between mb-2" style={{ transform: 'translateZ(20px)' }}>
              <div>
                <h3 className="font-display text-xl font-bold text-cream-100 transition-colors duration-500">
                  {product.name}
                </h3>
                <p className="text-cream-200/35 text-sm mt-0.5">{product.origin}</p>
              </div>
              <span className="text-gold-400 font-display text-2xl font-bold">${product.price}</span>
            </div>

            <p className="text-cream-200/45 text-sm mb-5 line-clamp-2 leading-relaxed" style={{ transform: 'translateZ(12px)' }}>
              {product.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-5" style={{ transform: 'translateZ(18px)' }}>
              {product.flavor.map((f) => (
                <span key={f} className="px-3 py-1 glass-3d rounded-full text-[11px] text-cream-200/60">{f}</span>
              ))}
            </div>

            <div className="flex items-center gap-3 mb-6" style={{ transform: 'translateZ(10px)' }}>
              <span className="text-[10px] text-cream-200/35 uppercase tracking-[0.2em]">Intensity</span>
              <IntensityBar level={product.intensity} />
            </div>

            <motion.button
              onClick={handleAddToCart}
              whileTap={{ scale: 0.96 }}
              className={`w-full py-4 rounded-xl font-semibold text-[11px] tracking-[0.2em] uppercase flex items-center justify-center gap-2.5 magnetic-btn transition-all duration-500 ${
                addedToCart
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                  : isHovered
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-noir-900 shadow-lg shadow-gold-500/20'
                  : 'bg-noir-700/40 text-cream-200/50 border border-gold-400/10'
              }`}
              style={{ transform: 'translateZ(30px)' }}
            >
              <ShoppingCart className="w-4 h-4" />
              {addedToCart ? '✓ Added!' : 'Add to Cart'}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function CoffeeCollection({
  onAuthRequired,
  onViewDetail,
}: {
  onAuthRequired: () => void;
  onViewDetail: (id: number) => void;
}) {
  return (
    <section id="collection" className="relative py-36 px-6">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="orb-3d absolute w-[500px] h-[500px] -left-40 top-20 animate-orb-float" style={{ animationDuration: '20s' }} />
        <div className="orb-3d absolute w-[350px] h-[350px] -right-20 bottom-40 animate-orb-float" style={{ animationDuration: '25s', animationDelay: '5s' }} />
      </div>

      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-28"
        >
          <motion.span
            initial={{ opacity: 0, letterSpacing: '0.8em' }}
            whileInView={{ opacity: 1, letterSpacing: '0.4em' }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="text-gold-400/60 text-[10px] font-medium tracking-[0.5em] uppercase block mb-6"
          >
            Our Signature
          </motion.span>
          <h2 className="font-display text-5xl md:text-7xl font-bold text-cream-100 mb-6">
            Coffee <span className="text-gradient-3d">Collection</span>
          </h2>
          <p className="text-cream-200/45 max-w-2xl mx-auto text-lg leading-relaxed">
            Hand-selected from the world's most prestigious growing regions,
            each blend is a masterpiece of flavor and craftsmanship.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {coffeeProducts.map((product, index) => (
            <ProductCard3D
              key={product.id}
              product={product}
              index={index}
              onAuthRequired={onAuthRequired}
              onViewDetail={onViewDetail}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
