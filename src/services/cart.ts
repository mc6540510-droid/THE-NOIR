import { db, type DBRecord } from './database';
import { authService } from './auth';

export interface CartItem extends DBRecord {
  userId: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  size?: '250g' | '500g' | '1kg';
  grind?: 'whole' | 'espresso' | 'drip' | 'french-press';
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  itemCount: number;
}

class CartService {
  private readonly CART_COLLECTION = 'cart_items';

  // Get user's cart
  getCart(): Cart {
    const user = authService.getCurrentUser();
    if (!user) {
      return this.emptyCart();
    }

    const items = db.find<CartItem>(this.CART_COLLECTION, item => item.userId === user.id);
    return this.calculateCart(items);
  }

  // Add item to cart
  addItem(
    productId: string,
    productName: string,
    productImage: string,
    price: number,
    quantity: number = 1,
    size: '250g' | '500g' | '1kg' = '250g',
    grind: 'whole' | 'espresso' | 'drip' | 'french-press' = 'whole'
  ): CartItem | null {
    const user = authService.getCurrentUser();
    if (!user) return null;

    // Check if item already exists with same options
    const existingItems = db.find<CartItem>(this.CART_COLLECTION, item => 
      item.userId === user.id && 
      item.productId === productId &&
      item.size === size &&
      item.grind === grind
    );

    if (existingItems.length > 0) {
      // Update quantity
      const existing = existingItems[0];
      return db.update<CartItem>(this.CART_COLLECTION, existing.id, {
        quantity: existing.quantity + quantity,
      });
    }

    // Create new cart item
    return db.create<CartItem>(this.CART_COLLECTION, {
      userId: user.id,
      productId,
      productName,
      productImage,
      price,
      quantity,
      size,
      grind,
    });
  }

  // Update item quantity
  updateQuantity(itemId: string, quantity: number): CartItem | null {
    if (quantity <= 0) {
      this.removeItem(itemId);
      return null;
    }
    return db.update<CartItem>(this.CART_COLLECTION, itemId, { quantity });
  }

  // Remove item from cart
  removeItem(itemId: string): boolean {
    return db.delete(this.CART_COLLECTION, itemId);
  }

  // Clear cart
  clearCart(): void {
    const user = authService.getCurrentUser();
    if (!user) return;

    const items = db.find<CartItem>(this.CART_COLLECTION, item => item.userId === user.id);
    items.forEach(item => db.delete(this.CART_COLLECTION, item.id));
  }

  // Calculate cart totals
  private calculateCart(items: CartItem[]): Cart {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 8.99; // Free shipping over $50
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      items,
      subtotal,
      shipping,
      tax,
      total,
      itemCount,
    };
  }

  // Empty cart object
  private emptyCart(): Cart {
    return {
      items: [],
      subtotal: 0,
      shipping: 0,
      tax: 0,
      total: 0,
      itemCount: 0,
    };
  }

  // Get cart item count
  getItemCount(): number {
    return this.getCart().itemCount;
  }

  // Check if cart has item
  hasItem(productId: string): boolean {
    const user = authService.getCurrentUser();
    if (!user) return false;

    const items = db.find<CartItem>(this.CART_COLLECTION, item => 
      item.userId === user.id && item.productId === productId
    );
    return items.length > 0;
  }
}

export const cartService = new CartService();
