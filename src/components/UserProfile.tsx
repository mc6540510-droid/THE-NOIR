import { motion } from 'framer-motion';
import { ArrowLeft, Package, Heart, Settings, Award, ShoppingBag, Calendar, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { authService, type User } from '../services/auth';
import { orderService, type Order } from '../services/orders';
import { wishlistService, type WishlistItem } from '../services/wishlist';
import { showToast } from './Toast';

interface UserProfileProps {
  onBack: () => void;
}

function SettingsForm({ user, onUpdate }: { user: User; onUpdate: (user: User) => void }) {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    const updated = authService.updateProfile(user.id, { firstName, lastName });
    if (updated) {
      onUpdate(updated);
      showToast({ type: 'success', title: 'Profile updated!', message: 'Your changes have been saved.' });
    } else {
      showToast({ type: 'error', title: 'Update failed', message: 'Please try again.' });
    }
    setSaving(false);
  };

  return (
    <div className="glass-premium rounded-2xl p-8">
      <h2 className="font-display text-2xl font-bold text-cream-100 mb-6">Account Settings</h2>
      <div className="space-y-6">
        <div>
          <label className="text-cream-200/60 text-sm mb-2 block">First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full bg-noir-800/50 rounded-xl px-4 py-3 text-cream-100 border border-gold-400/10 focus:outline-none focus:border-gold-400/30"
          />
        </div>
        <div>
          <label className="text-cream-200/60 text-sm mb-2 block">Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full bg-noir-800/50 rounded-xl px-4 py-3 text-cream-100 border border-gold-400/10 focus:outline-none focus:border-gold-400/30"
          />
        </div>
        <div>
          <label className="text-cream-200/60 text-sm mb-2 block">Email</label>
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full bg-noir-800/30 rounded-xl px-4 py-3 text-cream-200/40 border border-gold-400/10 cursor-not-allowed"
          />
          <p className="text-cream-200/30 text-xs mt-1">Email cannot be changed</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-noir-900 font-bold rounded-xl text-sm tracking-wider uppercase hover:from-gold-400 hover:to-gold-500 transition-all disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

export default function UserProfile({ onBack }: UserProfileProps) {
  const [user, setUser] = useState<User | null>(authService.getCurrentUser());
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'settings'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  useEffect(() => {
    if (user) {
      setOrders(orderService.getUserOrders());
      setWishlist(wishlistService.getWishlist());
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-noir-900 flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-cream-200/40 text-lg mb-4">Please sign in to view your profile</p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-noir-900 font-bold rounded-xl text-sm tracking-wider uppercase"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const orderStats = orderService.getOrderStats();

  return (
    <div className="min-h-screen bg-noir-900 py-12 px-6 overflow-y-auto scroll-thin">
      <div className="max-w-6xl mx-auto">
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-cream-200/60 hover:text-gold-400 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Shop
        </button>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-premium rounded-3xl p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-noir-900 font-bold text-3xl">
              {user.firstName[0]}{user.lastName[0]}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="font-display text-3xl font-bold text-cream-100 mb-2">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-cream-200/40 mb-4">{user.email}</p>
              
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-gold-400" />
                  <span className="text-cream-100 font-bold">{user.loyaltyPoints}</span>
                  <span className="text-cream-200/40 text-sm">Loyalty Points</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-gold-400" />
                  <span className="text-cream-100 font-bold">{orderStats.totalOrders}</span>
                  <span className="text-cream-200/40 text-sm">Orders</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-gold-400" />
                  <span className="text-cream-100 font-bold">${orderStats.totalSpent.toFixed(2)}</span>
                  <span className="text-cream-200/40 text-sm">Total Spent</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {[
            { id: 'orders', label: 'Orders', icon: Package },
            { id: 'wishlist', label: 'Wishlist', icon: Heart },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-noir-900'
                  : 'glass-3d text-cream-200/60 hover:text-gold-400'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="glass-premium rounded-2xl p-12 text-center">
                  <Package className="w-16 h-16 text-cream-200/20 mx-auto mb-4" />
                  <p className="text-cream-200/40 text-lg mb-2">No orders yet</p>
                  <p className="text-cream-200/30 text-sm">Start shopping to see your orders here</p>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="glass-premium rounded-2xl p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-display text-xl font-bold text-cream-100">
                            Order #{order.orderNumber}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              order.status === 'delivered'
                                ? 'bg-green-500/10 text-green-400'
                                : order.status === 'shipped'
                                ? 'bg-blue-500/10 text-blue-400'
                                : order.status === 'processing'
                                ? 'bg-yellow-500/10 text-yellow-400'
                                : order.status === 'cancelled'
                                ? 'bg-red-500/10 text-red-400'
                                : 'bg-gold-400/10 text-gold-400'
                            }`}
                          >
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-cream-200/40">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-gold-400 font-bold text-2xl">${order.total.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {order.items.slice(0, 4).map((item, i) => (
                        <div key={i} className="glass-3d rounded-lg p-3 flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                            <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-cream-100 text-sm font-medium truncate">{item.productName}</p>
                            <p className="text-cream-200/40 text-xs">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Wishlist Tab */}
          {activeTab === 'wishlist' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.length === 0 ? (
                <div className="col-span-full glass-premium rounded-2xl p-12 text-center">
                  <Heart className="w-16 h-16 text-cream-200/20 mx-auto mb-4" />
                  <p className="text-cream-200/40 text-lg mb-2">Your wishlist is empty</p>
                  <p className="text-cream-200/30 text-sm">Save your favorite coffees here</p>
                </div>
              ) : (
                wishlist.map((item) => (
                  <div key={item.id} className="glass-premium rounded-2xl overflow-hidden">
                    <div className="relative h-48 overflow-hidden">
                      <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-noir-900/80 to-transparent" />
                    </div>
                    <div className="p-5">
                      <h3 className="font-display text-lg font-bold text-cream-100 mb-2">{item.productName}</h3>
                      <p className="text-gold-400 font-bold text-xl mb-4">${item.price}</p>
                      <button
                        onClick={() => {
                          wishlistService.removeFromWishlist(item.productId);
                          setWishlist(wishlistService.getWishlist());
                          showToast({ type: 'info', title: 'Removed from wishlist', message: item.productName });
                        }}
                        className="w-full py-3 border border-gold-400/20 text-gold-300 rounded-xl text-sm font-medium hover:bg-gold-400/10 transition-all"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <SettingsForm user={user} onUpdate={(updatedUser) => setUser(updatedUser)} />
          )}
        </motion.div>
      </div>
    </div>
  );
}
