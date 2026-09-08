import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cartService, type Cart } from '../services/cart';
import { authService } from '../services/auth';
import { showToast } from './Toast';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
  onLoginRequired: () => void;
}

export default function CartDrawer({ isOpen, onClose, onCheckout, onLoginRequired }: CartDrawerProps) {
  const [cart, setCart] = useState<Cart>(cartService.getCart());

  useEffect(() => {
    if (isOpen) {
      setCart(cartService.getCart());
    }
  }, [isOpen]);

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    cartService.updateQuantity(itemId, newQuantity);
    setCart(cartService.getCart());
  };

  const handleRemoveItem = (itemId: string) => {
    const item = cart.items.find(i => i.id === itemId);
    cartService.removeItem(itemId);
    setCart(cartService.getCart());
    if (item) {
      showToast({ type: 'info', title: 'Removed from cart', message: item.productName });
    }
  };

  const handleCheckout = () => {
    if (!authService.isAuthenticated()) {
      onClose();
      onLoginRequired();
      return;
    }
    onClose();
    onCheckout();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-noir-900/80 backdrop-blur-sm z-[90]"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-noir-900 border-l border-gold-400/10 z-[91] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gold-400/10">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-gold-400" />
                <h2 className="font-display text-2xl font-bold text-cream-100">Your Cart</h2>
                <span className="px-2 py-0.5 bg-gold-400/10 text-gold-400 text-xs rounded-full">
                  {cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'}
                </span>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 glass-3d rounded-full flex items-center justify-center text-cream-200/60 hover:text-gold-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scroll-thin">
              {cart.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-16 h-16 text-cream-200/20 mb-4" />
                  <p className="text-cream-200/40 text-lg mb-2">Your cart is empty</p>
                  <p className="text-cream-200/30 text-sm">Add some premium coffee to get started</p>
                </div>
              ) : (
                <AnimatePresence>
                  {cart.items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="glass-3d rounded-xl p-4 flex gap-4"
                    >
                      {/* Product Image */}
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-base font-bold text-cream-100 mb-1 truncate">
                          {item.productName}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-cream-200/40 mb-2">
                          <span className="capitalize">{item.size}</span>
                          <span>•</span>
                          <span className="capitalize">{item.grind?.replace('-', ' ')}</span>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 glass-3d rounded-lg flex items-center justify-center text-cream-200/60 hover:text-gold-400 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-cream-100 font-medium w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 glass-3d rounded-lg flex items-center justify-center text-cream-200/60 hover:text-gold-400 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-gold-400 font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-cream-200/30 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {cart.items.length > 0 && (
              <div className="border-t border-gold-400/10 p-6 space-y-4">
                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-cream-200/60">Subtotal</span>
                    <span className="text-cream-100">${cart.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-cream-200/60">Shipping</span>
                    <span className="text-cream-100">
                      {cart.shipping === 0 ? 'Free' : `$${cart.shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-cream-200/60">Tax</span>
                    <span className="text-cream-100">${cart.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-gold-400/10">
                    <span className="text-cream-100">Total</span>
                    <span className="text-gold-400">${cart.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Free shipping message */}
                {cart.subtotal < 50 && (
                  <div className="p-3 bg-gold-400/5 border border-gold-400/10 rounded-xl text-center">
                    <p className="text-cream-200/60 text-xs">
                      Add <span className="text-gold-400 font-bold">${(50 - cart.subtotal).toFixed(2)}</span> more for free shipping
                    </p>
                  </div>
                )}

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className="w-full py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-noir-900 font-bold rounded-xl text-sm tracking-wider uppercase hover:from-gold-400 hover:to-gold-500 transition-all flex items-center justify-center gap-2"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
