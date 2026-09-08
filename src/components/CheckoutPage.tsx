import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Truck, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { cartService } from '../services/cart';
import { orderService } from '../services/orders';
import { authService } from '../services/auth';
import { showToast } from './Toast';

interface CheckoutPageProps {
  onBack: () => void;
  onComplete: () => void;
}

export default function CheckoutPage({ onBack, onComplete }: CheckoutPageProps) {
  const [step, setStep] = useState<'shipping' | 'payment' | 'review' | 'complete'>('shipping');
  const [cart] = useState(cartService.getCart());
  const [orderNumber, setOrderNumber] = useState('');

  const [shippingData, setShippingData] = useState({
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });

  const [paymentData, setPaymentData] = useState({
    method: 'card' as 'card' | 'paypal' | 'apple-pay',
  });

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('review');
  };

  const handlePlaceOrder = () => {
    const order = orderService.createOrder(
      shippingData,
      paymentData.method,
      undefined,
      undefined
    );

    if (order) {
      setOrderNumber(order.orderNumber);
      setStep('complete');
      showToast({ 
        type: 'success', 
        title: 'Order placed successfully!', 
        message: `Order #${order.orderNumber} - ${order.items.length} items`,
        duration: 6000
      });
    } else {
      showToast({ type: 'error', title: 'Failed to place order', message: 'Please try again.' });
    }
  };

  if (step === 'complete') {
    return (
      <div className="min-h-screen bg-noir-900 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full glass-premium rounded-3xl p-10 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 mb-6"
          >
            <CheckCircle className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="font-display text-3xl font-bold text-cream-100 mb-3">Order Confirmed!</h1>
          <p className="text-cream-200/60 mb-6">
            Thank you for your order. Your premium coffee is on its way.
          </p>

          <div className="glass-3d rounded-xl p-4 mb-6">
            <p className="text-cream-200/40 text-sm mb-1">Order Number</p>
            <p className="text-gold-400 font-bold text-lg">{orderNumber}</p>
          </div>

          <p className="text-cream-200/50 text-sm mb-8">
            You'll receive a confirmation email shortly with tracking details.
          </p>

          <button
            onClick={onComplete}
            className="w-full py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-noir-900 font-bold rounded-xl text-sm tracking-wider uppercase hover:from-gold-400 hover:to-gold-500 transition-all"
          >
            Continue Shopping
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-noir-900 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-cream-200/60 hover:text-gold-400 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Cart
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-10">
              {['Shipping', 'Payment', 'Review'].map((label, index) => {
                const stepIndex = ['shipping', 'payment', 'review'].indexOf(step);
                const isActive = index <= stepIndex;
                const isCurrent = index === stepIndex;

                return (
                  <div key={label} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                          isActive
                            ? 'bg-gradient-to-br from-gold-400 to-gold-600 text-noir-900'
                            : 'bg-noir-700 text-cream-200/40'
                        } ${isCurrent ? 'ring-4 ring-gold-400/20' : ''}`}
                      >
                        {index + 1}
                      </div>
                      <span className={`mt-2 text-xs ${isActive ? 'text-gold-400' : 'text-cream-200/40'}`}>
                        {label}
                      </span>
                    </div>
                    {index < 2 && (
                      <div className={`flex-1 h-0.5 mx-4 ${isActive ? 'bg-gold-400' : 'bg-noir-700'}`} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Shipping Form */}
            {step === 'shipping' && (
              <motion.form
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleShippingSubmit}
                className="glass-premium rounded-2xl p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Truck className="w-6 h-6 text-gold-400" />
                  <h2 className="font-display text-2xl font-bold text-cream-100">Shipping Address</h2>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-cream-200/60 text-sm mb-2 block">First Name</label>
                      <input
                        type="text"
                        value={shippingData.firstName}
                        onChange={(e) => setShippingData({ ...shippingData, firstName: e.target.value })}
                        className="w-full bg-noir-800/50 rounded-xl px-4 py-3 text-cream-100 border border-gold-400/10 focus:outline-none focus:border-gold-400/30"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-cream-200/60 text-sm mb-2 block">Last Name</label>
                      <input
                        type="text"
                        value={shippingData.lastName}
                        onChange={(e) => setShippingData({ ...shippingData, lastName: e.target.value })}
                        className="w-full bg-noir-800/50 rounded-xl px-4 py-3 text-cream-100 border border-gold-400/10 focus:outline-none focus:border-gold-400/30"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-cream-200/60 text-sm mb-2 block">Street Address</label>
                    <input
                      type="text"
                      value={shippingData.street}
                      onChange={(e) => setShippingData({ ...shippingData, street: e.target.value })}
                      className="w-full bg-noir-800/50 rounded-xl px-4 py-3 text-cream-100 border border-gold-400/10 focus:outline-none focus:border-gold-400/30"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-cream-200/60 text-sm mb-2 block">City</label>
                      <input
                        type="text"
                        value={shippingData.city}
                        onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                        className="w-full bg-noir-800/50 rounded-xl px-4 py-3 text-cream-100 border border-gold-400/10 focus:outline-none focus:border-gold-400/30"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-cream-200/60 text-sm mb-2 block">State</label>
                      <input
                        type="text"
                        value={shippingData.state}
                        onChange={(e) => setShippingData({ ...shippingData, state: e.target.value })}
                        className="w-full bg-noir-800/50 rounded-xl px-4 py-3 text-cream-100 border border-gold-400/10 focus:outline-none focus:border-gold-400/30"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-cream-200/60 text-sm mb-2 block">ZIP Code</label>
                      <input
                        type="text"
                        value={shippingData.zipCode}
                        onChange={(e) => setShippingData({ ...shippingData, zipCode: e.target.value })}
                        className="w-full bg-noir-800/50 rounded-xl px-4 py-3 text-cream-100 border border-gold-400/10 focus:outline-none focus:border-gold-400/30"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-cream-200/60 text-sm mb-2 block">Country</label>
                      <input
                        type="text"
                        value={shippingData.country}
                        onChange={(e) => setShippingData({ ...shippingData, country: e.target.value })}
                        className="w-full bg-noir-800/50 rounded-xl px-4 py-3 text-cream-100 border border-gold-400/10 focus:outline-none focus:border-gold-400/30"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-noir-900 font-bold rounded-xl text-sm tracking-wider uppercase hover:from-gold-400 hover:to-gold-500 transition-all mt-6"
                  >
                    Continue to Payment
                  </button>
                </div>
              </motion.form>
            )}

            {/* Payment Form */}
            {step === 'payment' && (
              <motion.form
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handlePaymentSubmit}
                className="glass-premium rounded-2xl p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard className="w-6 h-6 text-gold-400" />
                  <h2 className="font-display text-2xl font-bold text-cream-100">Payment Method</h2>
                </div>

                <div className="space-y-3 mb-6">
                  {[
                    { id: 'card', label: 'Credit Card', icon: '💳' },
                    { id: 'paypal', label: 'PayPal', icon: '🅿️' },
                    { id: 'apple-pay', label: 'Apple Pay', icon: '🍎' },
                  ].map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                        paymentData.method === method.id
                          ? 'border-gold-400 bg-gold-400/5'
                          : 'border-gold-400/10 hover:border-gold-400/30'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={paymentData.method === method.id}
                        onChange={(e) => setPaymentData({ method: e.target.value as any })}
                        className="sr-only"
                      />
                      <span className="text-2xl">{method.icon}</span>
                      <span className="text-cream-100 font-medium">{method.label}</span>
                      {paymentData.method === method.id && (
                        <CheckCircle className="w-5 h-5 text-gold-400 ml-auto" />
                      )}
                    </label>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep('shipping')}
                    className="flex-1 py-4 border border-gold-400/20 text-gold-300 font-bold rounded-xl text-sm tracking-wider uppercase hover:bg-gold-400/10 transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-noir-900 font-bold rounded-xl text-sm tracking-wider uppercase hover:from-gold-400 hover:to-gold-500 transition-all"
                  >
                    Review Order
                  </button>
                </div>
              </motion.form>
            )}

            {/* Review */}
            {step === 'review' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-premium rounded-2xl p-8"
              >
                <h2 className="font-display text-2xl font-bold text-cream-100 mb-6">Review Your Order</h2>

                <div className="space-y-4 mb-6">
                  <div className="glass-3d rounded-xl p-4">
                    <h3 className="text-cream-200/40 text-sm mb-2">Shipping Address</h3>
                    <p className="text-cream-100">
                      {shippingData.firstName} {shippingData.lastName}<br />
                      {shippingData.street}<br />
                      {shippingData.city}, {shippingData.state} {shippingData.zipCode}<br />
                      {shippingData.country}
                    </p>
                  </div>

                  <div className="glass-3d rounded-xl p-4">
                    <h3 className="text-cream-200/40 text-sm mb-2">Payment Method</h3>
                    <p className="text-cream-100 capitalize">{paymentData.method.replace('-', ' ')}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep('payment')}
                    className="flex-1 py-4 border border-gold-400/20 text-gold-300 font-bold rounded-xl text-sm tracking-wider uppercase hover:bg-gold-400/10 transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    className="flex-1 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-noir-900 font-bold rounded-xl text-sm tracking-wider uppercase hover:from-gold-400 hover:to-gold-500 transition-all"
                  >
                    Place Order
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="glass-premium rounded-2xl p-6 sticky top-24">
              <h3 className="font-display text-xl font-bold text-cream-100 mb-4">Order Summary</h3>

              <div className="space-y-3 mb-6">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-cream-100 text-sm font-medium truncate">{item.productName}</p>
                      <p className="text-cream-200/40 text-xs">Qty: {item.quantity}</p>
                      <p className="text-gold-400 text-sm font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-4 border-t border-gold-400/10">
                <div className="flex justify-between text-sm">
                  <span className="text-cream-200/60">Subtotal</span>
                  <span className="text-cream-100">${cart.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-cream-200/60">Shipping</span>
                  <span className="text-cream-100">{cart.shipping === 0 ? 'Free' : `$${cart.shipping.toFixed(2)}`}</span>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
