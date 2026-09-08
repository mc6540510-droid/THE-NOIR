import { db, type DBRecord } from './database';
import { authService } from './auth';

export interface WishlistItem extends DBRecord {
  userId: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  addedAt: string;
}

class WishlistService {
  private readonly WISHLIST_COLLECTION = 'wishlist';

  // Get user's wishlist
  getWishlist(): WishlistItem[] {
    const user = authService.getCurrentUser();
    if (!user) return [];

    return db.find<WishlistItem>(this.WISHLIST_COLLECTION, item => item.userId === user.id)
      .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
  }

  // Add to wishlist
  addToWishlist(productId: string, productName: string, productImage: string, price: number): WishlistItem | null {
    const user = authService.getCurrentUser();
    if (!user) return null;

    // Check if already in wishlist
    const existing = db.find<WishlistItem>(this.WISHLIST_COLLECTION, 
      item => item.userId === user.id && item.productId === productId
    );
    if (existing.length > 0) return existing[0];

    return db.create<WishlistItem>(this.WISHLIST_COLLECTION, {
      userId: user.id,
      productId,
      productName,
      productImage,
      price,
      addedAt: new Date().toISOString(),
    });
  }

  // Remove from wishlist
  removeFromWishlist(productId: string): boolean {
    const user = authService.getCurrentUser();
    if (!user) return false;

    const items = db.find<WishlistItem>(this.WISHLIST_COLLECTION, 
      item => item.userId === user.id && item.productId === productId
    );
    if (items.length === 0) return false;

    return db.delete(this.WISHLIST_COLLECTION, items[0].id);
  }

  // Check if in wishlist
  isInWishlist(productId: string): boolean {
    const user = authService.getCurrentUser();
    if (!user) return false;

    const items = db.find<WishlistItem>(this.WISHLIST_COLLECTION, 
      item => item.userId === user.id && item.productId === productId
    );
    return items.length > 0;
  }

  // Get wishlist count
  getCount(): number {
    return this.getWishlist().length;
  }

  // Clear wishlist
  clearWishlist(): void {
    const user = authService.getCurrentUser();
    if (!user) return;

    const items = db.find<WishlistItem>(this.WISHLIST_COLLECTION, item => item.userId === user.id);
    items.forEach(item => db.delete(this.WISHLIST_COLLECTION, item.id));
  }
}

export const wishlistService = new WishlistService();
