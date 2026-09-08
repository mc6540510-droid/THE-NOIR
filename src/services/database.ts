// LocalStorage-based database service
// In production, replace with Supabase/Firebase API calls

export interface DBRecord {
  id: string;
  createdAt: string;
  updatedAt: string;
}

class Database {
  private getCollection<T extends DBRecord>(collection: string): T[] {
    const data = localStorage.getItem(`noir_${collection}`);
    return data ? JSON.parse(data) : [];
  }

  private setCollection<T extends DBRecord>(collection: string, records: T[]): void {
    localStorage.setItem(`noir_${collection}`, JSON.stringify(records));
  }

  // Create
  create<T extends DBRecord>(collection: string, record: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): T {
    const records = this.getCollection<T>(collection);
    const newRecord = {
      ...record,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as T;
    records.push(newRecord);
    this.setCollection(collection, records);
    return newRecord;
  }

  // Read all
  findAll<T extends DBRecord>(collection: string): T[] {
    return this.getCollection<T>(collection);
  }

  // Read by ID
  findById<T extends DBRecord>(collection: string, id: string): T | null {
    const records = this.getCollection<T>(collection);
    return records.find(r => r.id === id) || null;
  }

  // Read with filter
  find<T extends DBRecord>(collection: string, predicate: (record: T) => boolean): T[] {
    const records = this.getCollection<T>(collection);
    return records.filter(predicate);
  }

  // Update
  update<T extends DBRecord>(collection: string, id: string, updates: Partial<Omit<T, keyof DBRecord>>): T | null {
    const records = this.getCollection<T>(collection);
    const index = records.findIndex(r => r.id === id);
    if (index === -1) return null;
    
    records[index] = {
      ...records[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.setCollection(collection, records);
    return records[index];
  }

  // Delete
  delete(collection: string, id: string): boolean {
    const records = this.getCollection<DBRecord>(collection);
    const filtered = records.filter(r => r.id !== id);
    if (filtered.length === records.length) return false;
    this.setCollection(collection, filtered);
    return true;
  }

  // Clear collection
  clear(collection: string): void {
    localStorage.removeItem(`noir_${collection}`);
  }

  // Generate unique ID
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Seed initial data
  seed(): void {
    // Seed products if empty
    if (this.findAll('products').length === 0) {
      const products = [
        {
          name: 'Midnight Velvet',
          description: 'A bold, full-bodied espresso with notes of dark chocolate and wild blackberry, finished with a whisper of smoke.',
          price: 42,
          origin: 'Ethiopia Yirgacheffe',
          roast: 'Dark',
          intensity: 9,
          flavors: ['Dark Chocolate', 'Blackberry', 'Smoky'],
          image: '/images/coffee-beans.jpg',
          inStock: true,
        },
        {
          name: 'Golden Sunrise',
          description: 'A radiant medium roast that captures the warmth of a Colombian morning with caramel sweetness and citrus brightness.',
          price: 38,
          origin: 'Colombia Huila',
          roast: 'Medium',
          intensity: 6,
          flavors: ['Caramel', 'Citrus', 'Honey'],
          image: '/images/espresso.jpg',
          inStock: true,
        },
        {
          name: 'Obsidian Reserve',
          description: 'Our most intense blend, aged in oak barrels for 30 days. A complex symphony of tobacco, cocoa, and aged cedar.',
          price: 56,
          origin: 'Sumatra Mandheling',
          roast: 'Extra Dark',
          intensity: 10,
          flavors: ['Tobacco', 'Dark Cocoa', 'Cedar'],
          image: '/images/coffee-jar.jpg',
          inStock: true,
        },
        {
          name: 'Silk Route',
          description: 'A delicate light roast with floral jasmine aromatics, ripe peach sweetness, and a silky vanilla finish.',
          price: 45,
          origin: 'India Malabar',
          roast: 'Light',
          intensity: 4,
          flavors: ['Jasmine', 'Peach', 'Vanilla'],
          image: '/images/brewing.jpg',
          inStock: true,
        },
        {
          name: 'Ember Glow',
          description: 'Volcanic soil gives this coffee its distinctive warmth — toasted almonds, rich molasses, and a lingering spice.',
          price: 40,
          origin: 'Guatemala Antigua',
          roast: 'Medium-Dark',
          intensity: 7,
          flavors: ['Toasted Almond', 'Molasses', 'Spice'],
          image: '/images/coffee-beans.jpg',
          inStock: true,
        },
        {
          name: 'Arctic Noir',
          description: 'A wine-like complexity with bold blackcurrant and bright grapefruit acidity. The pinnacle of Kenyan excellence.',
          price: 52,
          origin: 'Kenya AA',
          roast: 'Dark',
          intensity: 8,
          flavors: ['Wine', 'Blackcurrant', 'Grapefruit'],
          image: '/images/espresso.jpg',
          inStock: true,
        },
      ];
      products.forEach(p => this.create('products', p));
    }
  }
}

export const db = new Database();
