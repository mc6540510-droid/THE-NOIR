import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ShoppingCart, Minus, Plus, Star } from 'lucide-react';
import { useState } from 'react';
import { coffeeProducts } from '../lib/store';
import { cartService } from '../services/cart';
import { wishlistService } from '../services/wishlist';
import { authService } from '../services/auth';
import { showToast } from './Toast';
import ProductSlider from './ProductSlider';

interface ProductDetailModalProps {
  productId: number | null;
  onClose: () => void;
  onAuthRequired: () => void;
}

const sizeOptions = [
  { value: '250g' as const, label: '250g', priceMultiplier: 1 },
  { value: '500g' as const, label: '500g', priceMultiplier: 1.8 },
  { value: '1kg' as const, label: '1kg', priceMultiplier: 3.2 },
];

const grindOptions = [
  { value: 'whole' as const, label: 'Whole Bean' },
  { value: 'espresso' as const, label: 'Espresso' },
  { value: 'drip' as const, label: 'Drip / Pour Over' },
  { value: 'french-press' as const, label: 'French Press' },
];

export default function ProductDetailModal({ productId, onClose, onAuthRequired }: ProductDetailModalProps) {
  const product = coffeeProducts.find(p => p.id === productId);
  const [selectedSize, setSelectedSize] = useState<typeof sizeOptions[0]>(sizeOptions[0]);
  const [selectedGrind, setSelectedGrind] = useState<typeof grindOptions[0]>(grindOptions[0]);
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const currentPrice = Math.round(product.price * selectedSize.priceMultiplier);
  const inWishlist = authService.isAuthenticated() && wishlistService.isInWishlist(product.id.toString());

  const handleAddToCart = () => {
    if (!authService.isAuthenticated()) {
      onClose();
      onAuthRequired();
      showToast({ type: 'info', title: 'Sign in required', message: 'Please sign in to add items to your cart.' });
      return;
    }

    cartService.addItem(
      product.id.toString(),
      product.name,
      product.image,
      currentPrice,
      quantity,
      selectedSize.value,
      selectedGrind.value
    );

    showToast({
      type: 'success',
      title: 'Added to cart!',
      message: `${quantity}x ${product.name} (${selectedSize.label}, ${selectedGrind.label})`,
    });
    onClose();
  };

  const handleToggleWishlist = () => {
    if (!authService.isAuthenticated()) {
      onClose();
      onAuthRequired();
      return;
    }

    if (inWishlist) {
      wishlistService.removeFromWishlist(product.id.toString());
      showToast({ type: 'info', title: 'Removed from wishlist', message: product.name });
    } else {
      wishlistService.addToWishlist(product.id.toString(), product.name, product.image, product.price);
      showToast({ type: 'success', title: 'Added to wishlist!', message: product.name });
    }
  };

  return (
    <AnimatePresence>
      {productId !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-noir-900/90 backdrop-blur-xl" />

          <motion.div
            initial={{ scale: 0.85, y: 60, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.85, y: 60, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto scroll-thin glass-premium rounded-3xl"
          >
            <button
              onClick={onClose}
              className="absolute top-5 right-5 z-10 w-10 h-10 glass-3d rounded-full flex items-center justify-center text-cream-200/60 hover:text-gold-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Left: 3D Product Display */}
              <div className="relative h-80 md:h-full min-h-[350px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-noir-800/30 via-noir-900/20 to-noir-900/50" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,169,110,0.08)_0%,transparent_60%)]" />
                <div className="relative z-10 w-full h-full">
                  <ProductSlider productId={product.id} />
                </div>

                {/* Roast badge */}
                <div className="absolute top-5 left-5 px-4 py-1.5 glass-3d rounded-full text-xs text-gold-300 font-semibold tracking-wider uppercase">
                  {product.roast} Roast
                </div>
              </div>

              {/* Right: Product Info */}
              <div className="p-8 md:p-10">
                <div className="mb-1">
                  <p className="text-cream-200/40 text-sm">{product.origin}</p>
                </div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-cream-100 mb-2">
                  {product.name}
                </h2>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className={`w-4 h-4 ${s <= 4 ? 'fill-gold-400 text-gold-400' : 'text-cream-200/20'}`} />
                    ))}
                  </div>
                  <span className="text-cream-200/40 text-sm">4.8 (124 reviews)</span>
                </div>

                <p className="text-cream-200/55 leading-relaxed mb-6">
                  {product.description}
                </p>

                {/* Flavor tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {product.flavor.map(f => (
                    <span key={f} className="px-3 py-1 glass-3d rounded-full text-xs text-cream-200/60">{f}</span>
                  ))}
                </div>

                {/* Intensity */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-xs text-cream-200/40 uppercase tracking-wider">Intensity</span>
                  <div className="flex gap-1">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className={`w-2 h-4 rounded-sm ${i < product.intensity ? 'bg-gradient-to-t from-gold-600 to-gold-400' : 'bg-noir-600/50'}`} />
                    ))}
                  </div>
                  <span className="text-gold-400 text-sm font-bold">{product.intensity}/10</span>
                </div>

                {/* Size Selection */}
                <div className="mb-5">
                  <label className="text-cream-200/60 text-sm mb-2 block">Size</label>
                  <div className="flex gap-2">
                    {sizeOptions.map(size => (
                      <button
                        key={size.value}
                        onClick={() => setSelectedSize(size)}
                        className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                          selectedSize.value === size.value
                            ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-noir-900'
                            : 'glass-3d text-cream-200/60 hover:text-gold-400'
                        }`}
                      >
                        {size.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grind Selection */}
                <div className="mb-6">
                  <label className="text-cream-200/60 text-sm mb-2 block">Grind</label>
                  <div className="grid grid-cols-2 gap-2">
                    {grindOptions.map(grind => (
                      <button
                        key={grind.value}
                        onClick={() => setSelectedGrind(grind)}
                        className={`py-2.5 rounded-xl text-xs font-medium transition-all ${
                          selectedGrind.value === grind.value
                            ? 'bg-gradient-to-r from-gold-500/20 to-gold-600/20 text-gold-400 border border-gold-400/30'
                            : 'glass-3d text-cream-200/50 hover:text-gold-400'
                        }`}
                      >
                        {grind.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-4 mb-6">
                  <label className="text-cream-200/60 text-sm">Quantity</label>
                  <div className="flex items-center gap-3 glass-3d rounded-xl px-2 py-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-cream-200/60 hover:text-gold-400 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-cream-100 font-bold w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-cream-200/60 hover:text-gold-400 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Price & Actions */}
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <span className="text-gold-400 font-display text-3xl font-bold">${(currentPrice * quantity).toFixed(2)}</span>
                    {quantity > 1 && <span className="text-cream-200/30 text-sm ml-2">(${currentPrice} each)</span>}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-noir-900 font-bold rounded-xl text-sm tracking-wider uppercase hover:from-gold-400 hover:to-gold-500 transition-all magnetic-btn flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                  <button
                    onClick={handleToggleWishlist}
                    className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${
                      inWishlist
                        ? 'bg-gold-400/10 border border-gold-400/30'
                        : 'glass-3d'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${inWishlist ? 'fill-gold-400 text-gold-400' : 'text-cream-200/50'}`} />
                  </button>
                </div>

                {/* Shipping info */}
                <div className="mt-5 p-4 glass-3d rounded-xl">
                  <div className="flex items-center gap-2 text-sm text-cream-200/50">
                    <span className="text-gold-400">✦</span>
                    Free shipping on orders over $50
                  </div>
                  <div className="flex items-center gap-2 text-sm text-cream-200/50 mt-1">
                    <span className="text-gold-400">✦</span>
                    Freshly roasted and shipped within 24 hours
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
