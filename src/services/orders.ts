import { db, type DBRecord } from './database';
import { authService } from './auth';
import { cartService, type CartItem } from './cart';

export interface Order extends DBRecord {
  userId: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  billingAddress?: {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: 'card' | 'paypal' | 'apple-pay';
  trackingNumber?: string;
  estimatedDelivery?: string;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  size?: string;
  grind?: string;
}

class OrderService {
  private readonly ORDERS_COLLECTION = 'orders';

  // Generate order number
  private generateOrderNumber(): string {
    const prefix = 'NOIR';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }

  // Create order from cart
  createOrder(
    shippingAddress: Order['shippingAddress'],
    paymentMethod: Order['paymentMethod'],
    billingAddress?: Order['billingAddress'],
    notes?: string
  ): Order | null {
    const user = authService.getCurrentUser();
    if (!user) return null;

    const cart = cartService.getCart();
    if (cart.items.length === 0) return null;

    // Convert cart items to order items
    const orderItems: OrderItem[] = cart.items.map(item => ({
      productId: item.productId,
      productName: item.productName,
      productImage: item.productImage,
      price: item.price,
      quantity: item.quantity,
      size: item.size,
      grind: item.grind,
    }));

    // Calculate estimated delivery (5-7 business days)
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

    // Create order
    const order = db.create<Order>(this.ORDERS_COLLECTION, {
      userId: user.id,
      orderNumber: this.generateOrderNumber(),
      items: orderItems,
      subtotal: cart.subtotal,
      shipping: cart.shipping,
      tax: cart.tax,
      total: cart.total,
      status: 'pending',
      shippingAddress,
      billingAddress,
      paymentMethod,
      estimatedDelivery: estimatedDelivery.toISOString(),
      notes,
    });

    // Clear cart after order
    cartService.clearCart();

    // Add loyalty points (1 point per $1 spent)
    const pointsEarned = Math.floor(order.total);
    authService.addLoyaltyPoints(user.id, pointsEarned);

    return order;
  }

  // Get user's orders
  getUserOrders(): Order[] {
    const user = authService.getCurrentUser();
    if (!user) return [];

    return db.find<Order>(this.ORDERS_COLLECTION, order => order.userId === user.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Get order by ID
  getOrder(orderId: string): Order | null {
    const user = authService.getCurrentUser();
    if (!user) return null;

    const order = db.findById<Order>(this.ORDERS_COLLECTION, orderId);
    if (!order || order.userId !== user.id) return null;

    return order;
  }

  // Get order by order number
  getOrderByNumber(orderNumber: string): Order | null {
    const user = authService.getCurrentUser();
    if (!user) return null;

    const orders = db.find<Order>(this.ORDERS_COLLECTION, 
      order => order.orderNumber === orderNumber && order.userId === user.id
    );
    return orders.length > 0 ? orders[0] : null;
  }

  // Cancel order (only if pending or processing)
  cancelOrder(orderId: string): boolean {
    const order = this.getOrder(orderId);
    if (!order) return false;

    if (order.status !== 'pending' && order.status !== 'processing') {
      return false;
    }

    db.update(this.ORDERS_COLLECTION, orderId, { status: 'cancelled' });

    // Refund loyalty points
    const user = authService.getCurrentUser();
    if (user) {
      const pointsToRefund = Math.floor(order.total);
      authService.addLoyaltyPoints(user.id, -pointsToRefund);
    }

    return true;
  }

  // Get order status timeline
  getOrderTimeline(order: Order): { status: string; date: string; description: string }[] {
    const timeline = [
      {
        status: 'Order Placed',
        date: order.createdAt,
        description: 'Your order has been received and is being prepared.',
      },
    ];

    if (order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered') {
      timeline.push({
        status: 'Processing',
        date: order.updatedAt,
        description: 'Your coffee is being freshly roasted and packaged.',
      });
    }

    if (order.status === 'shipped' || order.status === 'delivered') {
      timeline.push({
        status: 'Shipped',
        date: order.updatedAt,
        description: `Your order is on its way. Tracking: ${order.trackingNumber || 'N/A'}`,
      });
    }

    if (order.status === 'delivered') {
      timeline.push({
        status: 'Delivered',
        date: order.updatedAt,
        description: 'Your order has been delivered. Enjoy your coffee!',
      });
    }

    if (order.status === 'cancelled') {
      timeline.push({
        status: 'Cancelled',
        date: order.updatedAt,
        description: 'Your order has been cancelled.',
      });
    }

    return timeline;
  }

  // Get order statistics
  getOrderStats(): { totalOrders: number; totalSpent: number; averageOrderValue: number } {
    const orders = this.getUserOrders();
    const completedOrders = orders.filter(o => o.status !== 'cancelled');
    
    const totalSpent = completedOrders.reduce((sum, order) => sum + order.total, 0);
    const averageOrderValue = completedOrders.length > 0 ? totalSpent / completedOrders.length : 0;

    return {
      totalOrders: completedOrders.length,
      totalSpent,
      averageOrderValue,
    };
  }
}

export const orderService = new OrderService();
