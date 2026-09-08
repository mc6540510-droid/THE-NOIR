import { create } from 'zustand';

interface CoffeeProduct {
  id: number;
  name: string;
  origin: string;
  roast: string;
  flavor: string[];
  price: number;
  image: string;
  intensity: number;
  description: string;
}

interface WishlistItem {
  productId: number;
  addedAt: Date;
}

interface StoreState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  wishlist: WishlistItem[];
  addToWishlist: (productId: number) => void;
  removeFromWishlist: (productId: number) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  quizAnswers: Record<string, string>;
  setQuizAnswer: (key: string, value: string) => void;
  quizResult: string | null;
  setQuizResult: (result: string | null) => void;
  loyaltyPoints: number;
  addLoyaltyPoints: (points: number) => void;
}

export const useStore = create<StoreState>((set) => ({
  isDarkMode: true,
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  wishlist: [],
  addToWishlist: (productId) =>
    set((state) => ({
      wishlist: [...state.wishlist, { productId, addedAt: new Date() }],
    })),
  removeFromWishlist: (productId) =>
    set((state) => ({
      wishlist: state.wishlist.filter((item) => item.productId !== productId),
    })),
  activeSection: 'hero',
  setActiveSection: (section) => set({ activeSection: section }),
  quizAnswers: {},
  setQuizAnswer: (key, value) =>
    set((state) => ({ quizAnswers: { ...state.quizAnswers, [key]: value } })),
  quizResult: null,
  setQuizResult: (result) => set({ quizResult: result }),
  loyaltyPoints: 250,
  addLoyaltyPoints: (points) =>
    set((state) => ({ loyaltyPoints: state.loyaltyPoints + points })),
}));

export const coffeeProducts: CoffeeProduct[] = [
  {
    id: 1,
    name: "Midnight Velvet",
    origin: "Ethiopia Yirgacheffe",
    roast: "Dark",
    flavor: ["Dark Chocolate", "Blackberry", "Smoky"],
    price: 42,
    image: "/images/product-1.png",
    intensity: 9,
    description: "A bold, full-bodied espresso with notes of dark chocolate and wild blackberry, finished with a whisper of smoke."
  },
  {
    id: 2,
    name: "Golden Sunrise",
    origin: "Colombia Huila",
    roast: "Medium",
    flavor: ["Caramel", "Citrus", "Honey"],
    price: 38,
    image: "/images/product-2.png",
    intensity: 6,
    description: "A radiant medium roast that captures the warmth of a Colombian morning with caramel sweetness and citrus brightness."
  },
  {
    id: 3,
    name: "Obsidian Reserve",
    origin: "Sumatra Mandheling",
    roast: "Extra Dark",
    flavor: ["Tobacco", "Dark Cocoa", "Cedar"],
    price: 56,
    image: "/images/product-3.png",
    intensity: 10,
    description: "Our most intense blend, aged in oak barrels for 30 days. A complex symphony of tobacco, cocoa, and aged cedar."
  },
  {
    id: 4,
    name: "Silk Route",
    origin: "India Malabar",
    roast: "Light",
    flavor: ["Jasmine", "Peach", "Vanilla"],
    price: 45,
    image: "/images/product-4.png",
    intensity: 4,
    description: "A delicate light roast with floral jasmine aromatics, ripe peach sweetness, and a silky vanilla finish."
  },
  {
    id: 5,
    name: "Ember Glow",
    origin: "Guatemala Antigua",
    roast: "Medium-Dark",
    flavor: ["Toasted Almond", "Molasses", "Spice"],
    price: 40,
    image: "/images/product-5.png",
    intensity: 7,
    description: "Volcanic soil gives this coffee its distinctive warmth — toasted almonds, rich molasses, and a lingering spice."
  },
  {
    id: 6,
    name: "Arctic Noir",
    origin: "Kenya AA",
    roast: "Dark",
    flavor: ["Wine", "Blackcurrant", "Grapefruit"],
    price: 52,
    image: "/images/product-6.png",
    intensity: 8,
    description: "A wine-like complexity with bold blackcurrant and bright grapefruit acidity. The pinnacle of Kenyan excellence."
  },
];
