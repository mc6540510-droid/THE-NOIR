import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Mic, MicOff, Send, Volume2, VolumeX, Sparkles, Coffee, RotateCcw } from 'lucide-react';
import { coffeeProducts } from '../lib/store';
import { cartService } from '../services/cart';
import { authService } from '../services/auth';
import { showToast } from './Toast';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isTyping?: boolean;
}

// AI personality and conversation engine
class NoirAI {
  private history: Message[] = [];
  private userName: string | null = null;
  private preferences: string[] = [];
  private brewMethod: string | null = null;

  constructor() {
    const saved = localStorage.getItem('noir_ai_history');
    if (saved) {
      try { this.history = JSON.parse(saved); } catch {}
    }
    const name = localStorage.getItem('noir_ai_name');
    if (name) this.userName = name;
  }

  getHistory(): Message[] { return this.history; }
  getUserName(): string | null { return this.userName; }

  clearHistory() {
    this.history = [];
    this.userName = null;
    this.preferences = [];
    this.brewMethod = null;
    localStorage.removeItem('noir_ai_history');
    localStorage.removeItem('noir_ai_name');
  }

  private save() {
    localStorage.setItem('noir_ai_history', JSON.stringify(this.history.slice(-50)));
    if (this.userName) localStorage.setItem('noir_ai_name', this.userName);
  }

  async respond(userMessage: string): Promise<string> {
    const msg = userMessage.toLowerCase().trim();

    this.history.push({
      id: Date.now().toString(),
      text: userMessage,
      sender: 'user',
      timestamp: new Date(),
    });

    let response = '';

    // Greetings
    if (msg.match(/^(hi|hello|hey|greetings|good morning|good afternoon|good evening|howdy|sup|what'?s up)/)) {
      response = this.greet();
    }
    // Name introduction
    else if (msg.match(/my name is|call me|i'm |i am /)) {
      const nameMatch = userMessage.match(/(?:my name is|call me|i'm |i am )(\w+)/i);
      if (nameMatch) {
        this.userName = nameMatch[1];
        response = `Wonderful to meet you, ${this.userName}! ✨ I'm Noir, your personal coffee concierge. I'm here to help you discover extraordinary coffees, learn about brewing, and make your coffee journey truly special. What can I help you with today?`;
      } else {
        response = `I'd love to know your name! Could you tell me what to call you?`;
      }
    }
    // How are you
    else if (msg.match(/how are you|how do you feel|how('?s| is) it going/)) {
      response = `I'm absolutely wonderful, thank you for asking! ${this.userName ? `${this.userName}, you` : 'You'} just made my day. I'm ready to help you find the perfect coffee. What are you in the mood for today?`;
    }
    // Recommendations
    else if (msg.match(/recommend|suggest|what should i|which coffee|help me choose|best coffee|what('?s| is) good|what do you recommend/)) {
      response = this.recommend(msg);
    }
    // Roast preferences
    else if (msg.match(/i (like|love|prefer|want|enjoy) (light|medium|dark|extra dark)/)) {
      const roastMatch = msg.match(/(light|medium|dark|extra dark)/);
      if (roastMatch) {
        this.preferences.push(roastMatch[1]);
        response = this.roastRec(roastMatch[1]);
      }
    }
    // Flavor preferences
    else if (msg.match(/(like|love|prefer|want|enjoy) (chocolate|fruity|nutty|caramel|citrus|floral|spicy|sweet|berry|vanilla|honey)/)) {
      response = this.flavorRec(msg);
    }
    // Brewing methods
    else if (msg.match(/brew|espresso|pour over|french press|drip|how to make|preparation|chemex|aeropress|moka/)) {
      this.brewMethod = this.extractBrew(msg);
      response = this.brewAdvice(msg);
    }
    // Specific product info
    else if (msg.match(/tell me about|what is|describe|info about|what('?s| is) /)) {
      response = this.productInfo(msg);
    }
    // Price and ordering
    else if (msg.match(/price|cost|how much|buy|order|purchase|add to cart/)) {
      response = this.pricingInfo(msg);
    }
    // Origin
    else if (msg.match(/origin|where from|sourcing|farm|country|region|ethiopia|colombia|sumatra|india|guatemala|kenya/)) {
      response = this.originInfo(msg);
    }
    // Subscription
    else if (msg.match(/subscription|subscribe|monthly|plan|membership/)) {
      response = this.subscriptionInfo();
    }
    // Morning coffee
    else if (msg.match(/morning|wake up|breakfast|start my day/)) {
      response = `${this.userName ? `${this.userName}, f` : 'F'}or a perfect morning cup, I recommend **Golden Sunrise** from Colombia. Its balanced caramel sweetness with bright citrus notes is like a warm sunrise in a cup. Medium roast, smooth, and energizing without being overwhelming. Would you like me to help you add it to your cart?`;
    }
    // Gift
    else if (msg.match(/gift|present|someone|friend|family|birthday|christmas|holiday/)) {
      response = `What a thoughtful idea! ☕ For gifts, I'd recommend:\n\n• **Obsidian Reserve** ($56) — Our most premium, oak-barrel aged. Perfect for the serious coffee lover.\n• **Midnight Velvet** ($42) — Bold and luxurious, universally loved.\n• **Silk Route** ($45) — Elegant and unique, great for someone who appreciates delicate flavors.\n\nAll come in beautiful packaging. Would you like me to help you choose?`;
    }
    // Caffeine
    else if (msg.match(/caffeine|energy|strong|kick|awake|tired/)) {
      response = `For maximum energy, I'd suggest **Midnight Velvet** or **Obsidian Reserve** — both are dark roasts with bold intensity (9/10 and 10/10). Dark roasts actually have slightly less caffeine than light roasts by volume, but they deliver a more intense flavor experience. If caffeine content is your priority, **Silk Route** (light roast) actually has the most caffeine per scoop! Would you like to know more?`;
    }
    // Decaf
    else if (msg.match(/decaf|decaffeinated|evening|night|before bed/)) {
      response = `While we don't currently offer decaf, for evening enjoyment I'd suggest **Silk Route** — it's our lightest roast (intensity 4/10) with beautiful jasmine and vanilla notes. It's gentle enough for later in the day while still being incredibly flavorful. Would you like to explore it?`;
    }
    // Thank you
    else if (msg.match(/thank|thanks|appreciate|grateful/)) {
      response = this.userName
        ? `You're so welcome, ${this.userName}! 💛 It truly makes me happy to help. Is there anything else I can do for you?`
        : `You're most welcome! It's my pleasure to help. Is there anything else I can assist you with?`;
    }
    // Goodbye
    else if (msg.match(/bye|goodbye|see you|later|gotta go|talk later/)) {
      response = this.userName
        ? `Goodbye, ${this.userName}! 🌟 May your cups always be filled with extraordinary coffee. I'll be here whenever you need me. Until next time!`
        : `Goodbye! Remember, I'm always here to help you find your perfect cup. Enjoy your coffee journey! ☕`;
    }
    // Joke / fun
    else if (msg.match(/joke|funny|make me laugh/)) {
      const jokes = [
        `How does a coffee say hello? "Espresso yourself!" ☕😄`,
        `Why did the coffee file a police report? It got mugged! 😂`,
        `What do you call sad coffee? Despresso. 😅 But don't worry, at NOIR we only serve happiness!`,
      ];
      response = jokes[Math.floor(Math.random() * jokes.length)];
    }
    // Who are you
    else if (msg.match(/who are you|what are you|your name|about you/)) {
      response = `I'm **Noir AI** ✨ — your personal coffee concierge! I was created to help you discover extraordinary coffees, learn about brewing techniques, explore our origins, and make your coffee journey truly special. Think of me as your knowledgeable friend who happens to be obsessed with great coffee. What would you like to explore?`;
    }
    // Help
    else if (msg.match(/help|what can you do|capabilities|features/)) {
      response = `I'm here to make your coffee experience amazing! Here's what I can help with:\n\n☕ **Recommendations** — Tell me your taste and I'll find your perfect coffee\n🫖 **Brewing Guides** — Expert tips for any method\n🌍 **Origin Stories** — Learn where your coffee comes from\n💰 **Pricing & Orders** — Help with purchasing decisions\n📦 **Subscriptions** — Find the right plan for you\n🎁 **Gift Ideas** — Perfect picks for coffee lovers\n\nJust ask me anything! What interests you?`;
    }
    // Default
    else {
      response = this.defaultResponse();
    }

    this.history.push({
      id: (Date.now() + 1).toString(),
      text: response,
      sender: 'ai',
      timestamp: new Date(),
    });

    this.save();
    return response;
  }

  private greet(): string {
    const hour = new Date().getHours();
    const time = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
    
    if (this.userName) {
      return `Good ${time}, ${this.userName}! ☀️ So lovely to see you again. What can I help you discover today? Whether you're craving a bold espresso or a delicate pour-over, I'm here for you.`;
    }
    return `Good ${time}! Welcome to NOIR. ✨ I'm Noir, your personal coffee concierge. I'm here to help you discover extraordinary coffees tailored perfectly to your taste. Tell me — what kind of coffee experience are you looking for today?`;
  }

  private recommend(msg: string): string {
    if (msg.match(/bold|strong|intense|powerful/)) {
      return `For bold intensity, I highly recommend **Obsidian Reserve** from Sumatra. 🏆 It's our most powerful blend — aged in oak barrels for 30 days with deep tobacco, dark cocoa, and cedar notes. Intensity 10/10. It's an unforgettable experience. Would you like me to help you add it to your cart?`;
    }
    if (msg.match(/smooth|balanced|easy|everyday/)) {
      return `For a smooth, everyday cup, **Golden Sunrise** from Colombia is exceptional. ☀️ Beautiful caramel sweetness with bright citrus and honey notes. Medium roast, intensity 6/10. It's the kind of coffee that makes every morning special. Shall I tell you more?`;
    }
    if (msg.match(/light|delicate|gentle|subtle/)) {
      return `I'd suggest our **Silk Route** from India Malabar. 🌸 A delicate light roast with enchanting jasmine aromatics, ripe peach sweetness, and a silky vanilla finish. Intensity just 4/10 — pure elegance in a cup. Would you like to explore it?`;
    }
    if (msg.match(/unique|special|different|unusual/)) {
      return `For something truly unique, try **Arctic Noir** from Kenya AA. 🍷 It has a wine-like complexity with bold blackcurrant and bright grapefruit acidity. Unlike anything you've tasted before. Or **Obsidian Reserve** — oak barrel aged for 30 days. Which intrigues you more?`;
    }
    return `I'd love to find your perfect coffee! ☕ To give you the best recommendation, tell me:\n\n• Do you prefer **light**, **medium**, or **dark** roasts?\n• What flavors do you enjoy? (chocolate, fruity, nutty, floral)\n• How do you usually brew? (espresso, pour over, French press)\n\nOr just describe your ideal cup and I'll find it for you!`;
  }

  private roastRec(roast: string): string {
    const recs: Record<string, string> = {
      'light': `Excellent taste! For light roasts, **Silk Route** from India is magical — jasmine florals, sweet peach, and silky vanilla. Light roasts preserve the bean's natural complexity beautifully. ☕ Would you like to try it?`,
      'medium': `Wonderful choice! **Golden Sunrise** from Colombia is a perfect medium roast — caramel sweetness, bright citrus, and honey. It's balanced and beautiful. **Ember Glow** from Guatemala is also medium-dark with toasted almond and spice. Which sounds better?`,
      'dark': `Bold choice! 🔥 **Midnight Velvet** from Ethiopia delivers intense dark chocolate and blackberry with a smoky finish. **Arctic Noir** from Kenya offers wine-like complexity with blackcurrant. Both are exceptional dark roasts. Which calls to you?`,
      'extra dark': `For ultimate intensity, **Obsidian Reserve** is unmatched. 🏆 Aged in oak barrels for 30 days — deep tobacco, dark cocoa, and cedar. Intensity 10/10. This is coffee at its most powerful. Ready to experience it?`,
    };
    return recs[roast] || `Let me help you find the perfect roast!`;
  }

  private flavorRec(msg: string): string {
    if (msg.match(/chocolate|cocoa/)) return `Chocolate lovers rejoice! 🍫 **Midnight Velvet** has rich dark chocolate notes, while **Obsidian Reserve** offers deep dark cocoa. Both are exceptional. Which intensity level do you prefer — bold (Midnight Velvet) or extreme (Obsidian Reserve)?`;
    if (msg.match(/fruit|berry/)) return `For fruity profiles, **Midnight Velvet** offers wild blackberry notes, while **Arctic Noir** features bold blackcurrant and grapefruit. 🫐 Both are stunning! Do you prefer dark and rich, or bright and wine-like?`;
    if (msg.match(/nut|almond/)) return `**Ember Glow** from Guatemala is perfect for you! 🌰 Toasted almond and molasses with warm spice notes. The volcanic soil creates incredible nutty complexity. Medium-dark roast, intensity 7/10. Shall I tell you more?`;
    if (msg.match(/caramel|sweet|honey/)) return `You'll adore **Golden Sunrise** from Colombia! 🍯 Beautiful caramel sweetness with honey notes and bright citrus. It's like liquid sunshine. Medium roast, intensity 6/10. Want to try it?`;
    if (msg.match(/floral|jasmine/)) return `**Silk Route** is your perfect match! 🌸 Enchanting jasmine aromatics with peach and vanilla. It's like drinking a bouquet — delicate and unforgettable. Light roast, intensity 4/10. Interested?`;
    if (msg.match(/spic/)) return `**Ember Glow** from Guatemala has beautiful warm spice notes alongside toasted almond and molasses. 🌶️ The volcanic Antigua soil creates this unique spicy complexity. Medium-dark roast. Would you like to explore it?`;
    return `I can help you find coffees with those flavor notes! Could you tell me more about what you're looking for?`;
  }

  private extractBrew(msg: string): string | null {
    if (msg.includes('espresso')) return 'espresso';
    if (msg.includes('pour over') || msg.includes('pourover') || msg.includes('chemex')) return 'pourover';
    if (msg.includes('french press') || msg.includes('press')) return 'frenchpress';
    if (msg.includes('drip') || msg.includes('machine')) return 'drip';
    if (msg.includes('aeropress')) return 'aeropress';
    if (msg.includes('moka')) return 'moka';
    return null;
  }

  private brewAdvice(msg: string): string {
    if (msg.includes('espresso')) {
      return `For espresso, I recommend **Midnight Velvet** or **Obsidian Reserve**. ☕\n\n**Perfect Espresso Recipe:**\n• Dose: 18-20g finely ground\n• Yield: 36-40g liquid\n• Time: 25-30 seconds\n• Temperature: 93°C\n• Pressure: 9 bars\n\nThe dark roasts produce rich, syrupy shots with beautiful crema. Would you like me to help you choose a coffee?`;
    }
    if (msg.includes('pour over') || msg.includes('pourover') || msg.includes('chemex')) {
      return `Pour over is perfect for showcasing delicate flavors! 🫖\n\n**Perfect Pour Over:**\n• Ratio: 1:16 (coffee to water)\n• Grind: Medium (like sand)\n• Water: 96°C\n• Time: 3-4 minutes\n• Technique: Slow, circular pours\n\nBest coffees: **Silk Route** or **Golden Sunrise**. The clarity of pour over highlights their beautiful florals and sweetness.`;
    }
    if (msg.includes('french press')) {
      return `French press creates beautiful full-bodied cups! ☕\n\n**Perfect French Press:**\n• Ratio: 1:15\n• Grind: Coarse (like sea salt)\n• Water: 93°C\n• Steep: 4 minutes\n• Press: Slowly and evenly\n\nBest coffees: **Ember Glow** or **Midnight Velvet**. The full immersion extracts rich, complex flavors.`;
    }
    if (msg.includes('drip')) {
      return `Drip coffee is great for consistent, everyday brewing! ☕\n\n**Perfect Drip:**\n• Ratio: 1:16\n• Grind: Medium\n• Water: 92-96°C\n• Use filtered water for best results\n\nBest coffees: **Golden Sunrise** or **Ember Glow**. Both shine in automatic brewers.`;
    }
    return `I'd love to help with brewing! What method do you use?\n\n☕ **Espresso** — Rich, concentrated\n🫖 **Pour Over** — Clean, nuanced\n🍵 **French Press** — Full-bodied, rich\n⚙️ **Drip Machine** — Consistent, easy\n\nTell me your method and I'll give you specific tips and coffee recommendations!`;
  }

  private productInfo(msg: string): string {
    for (const product of coffeeProducts) {
      if (msg.includes(product.name.toLowerCase())) {
        return `**${product.name}** — ${product.origin}\n\n${product.description}\n\n• **Roast:** ${product.roast}\n• **Flavors:** ${product.flavor.join(', ')}\n• **Intensity:** ${product.intensity}/10\n• **Price:** $${product.price}\n\n${product.intensity >= 8 ? 'Best for: Espresso, French Press, Moka Pot' : product.intensity >= 5 ? 'Best for: Drip, Pour Over, Espresso' : 'Best for: Pour Over, Chemex, Drip'}\n\nWould you like me to help you add it to your cart?`;
      }
    }
    return `I'd be happy to tell you about our coffees! We have six exceptional offerings:\n\n• **Midnight Velvet** — Ethiopia, Dark, $42\n• **Golden Sunrise** — Colombia, Medium, $38\n• **Obsidian Reserve** — Sumatra, Extra Dark, $56\n• **Silk Route** — India, Light, $45\n• **Ember Glow** — Guatemala, Medium-Dark, $40\n• **Arctic Noir** — Kenya, Dark, $52\n\nWhich one interests you? Just ask "Tell me about [name]"!`;
  }

  private pricingInfo(msg: string): string {
    if (msg.includes('add to cart') || msg.includes('buy') || msg.includes('order')) {
      if (!authService.isAuthenticated()) {
        return `I'd love to help you add items to your cart! You'll need to sign in first. Click the user icon in the top right to create an account or log in. Once you're signed in, I can help you shop! 🔐`;
      }
      return `Great! You can add any coffee to your cart by clicking "Add to Cart" on the product cards. Here are our prices:\n\n• Golden Sunrise — $38\n• Ember Glow — $40\n• Midnight Velvet — $42\n• Silk Route — $45\n• Arctic Noir — $52\n• Obsidian Reserve — $56\n\nFree shipping on orders over $50! Would you like a recommendation?`;
    }
    return `Our premium coffees range from $38 to $56:\n\n• **Golden Sunrise** — $38 (best value!)\n• **Ember Glow** — $40\n• **Midnight Velvet** — $42\n• **Silk Route** — $45\n• **Arctic Noir** — $52\n• **Obsidian Reserve** — $56 (premium)\n\n🚚 Free shipping on orders over $50\n📦 Subscription plans save 15-20%\n\nWould you like to explore subscriptions or need help choosing?`;
  }

  private originInfo(msg: string): string {
    if (msg.includes('ethiopia')) return `**Ethiopia Yirgacheffe** 🇪🇹\n\nThe birthplace of coffee! Our **Midnight Velvet** comes from this legendary region. Grown at 1,700-2,200m altitude, Ethiopian coffees are known for complex florals, bright acidity, and wine-like qualities. The ancient heirloom varieties produce flavors found nowhere else on Earth.`;
    if (msg.includes('colombia')) return `**Colombia Huila** 🇨🇴\n\nOur **Golden Sunrise** comes from Huila, Colombia's most prestigious growing region. Volcanic soil, perfect altitude (1,500-1,800m), and ideal climate create coffees with beautiful caramel sweetness, bright citrus, and clean finish.`;
    if (msg.includes('sumatra')) return `**Sumatra Mandheling** 🇮🇩\n\nOur **Obsidian Reserve** hails from Sumatra's ancient coffee forests. The wet-hulling process creates the distinctive earthy, full-bodied profile. Aged in oak barrels for 30 days, it develops unparalleled complexity with tobacco, cocoa, and cedar.`;
    if (msg.includes('india')) return `**India Malabar** 🇮🇳\n\nOur **Silk Route** uses beans from India's Malabar coast. The unique monsooning process exposes beans to moisture-laden winds, creating a smooth, mellow cup with low acidity and beautiful floral notes.`;
    if (msg.includes('guatemala')) return `**Guatemala Antigua** 🇬🇹\n\nOur **Ember Glow** grows in Antigua's volcanic soil between three volcanoes. This mineral-rich earth creates coffees with distinctive warmth — toasted almonds, molasses, and warm spice. Truly special terroir.`;
    if (msg.includes('kenya')) return `**Kenya AA** 🇰🇪\n\nOur **Arctic Noir** uses Kenya's finest AA-grade beans. Grown at 1,500-2,100m on red volcanic soil, Kenyan coffees are famous for wine-like complexity, bold fruit notes, and bright acidity. The SL-28 and SL-34 varieties produce blackcurrant and grapefruit flavors.`;
    return `We source from the world's finest coffee regions:\n\n🇪🇹 **Ethiopia** — Birthplace of coffee, complex florals\n🇨🇴 **Colombia** — Balanced, sweet, bright\n🇮🇩 **Sumatra** — Earthy, full-bodied, bold\n🇮🇳 **India** — Smooth, mellow, floral\n🇬🇹 **Guatemala** — Volcanic warmth, spicy\n🇰🇪 **Kenya** — Wine-like, bold fruit\n\nWhich origin would you like to explore?`;
  }

  private subscriptionInfo(): string {
    return `Our subscription plans deliver exceptional coffee to your door:\n\n**Explorer** — $29/month\n• 2 unique blends monthly\n• Perfect for discovery\n\n**Connoisseur** — $59/month ⭐ Most Popular\n• 4 premium selections\n• Exclusive limited editions\n• Personal sommelier consultations\n\n**Collector** — $99/month\n• 6 rare and exclusive coffees\n• Micro-lot & competition coffees\n• Dedicated concierge\n\nAll plans include free shipping, and you can pause or cancel anytime. Subscribers also earn 2x loyalty points! Which plan sounds right for you?`;
  }

  private defaultResponse(): string {
    const responses = [
      `I'm here to help you discover extraordinary coffee! ☕ You can ask me about:\n\n• Coffee recommendations\n• Brewing methods\n• Our origins and stories\n• Pricing and subscriptions\n• Gift ideas\n\nWhat would you like to explore?`,
      `I'd love to help! Try asking me something like:\n\n• "Recommend a bold coffee"\n• "What's good for espresso?"\n• "Tell me about Ethiopian coffee"\n• "I like chocolate notes"\n• "Help me choose a gift"\n\nWhat interests you?`,
      `I'm your personal coffee guide! ✨ Whether you're looking for the perfect morning cup, a special gift, or want to learn about coffee origins, I'm here to help. What's on your mind?`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
}

// Voice engine
class VoiceEngine {
  private synth: SpeechSynthesis;
  private recognition: any = null;
  private _isSpeaking = false;

  constructor() {
    this.synth = window.speechSynthesis;
    this.initRecognition();
  }

  private initRecognition() {
    try {
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SR) {
        this.recognition = new SR();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';
      }
    } catch {}
  }

  speak(text: string, onEnd?: () => void) {
    this.synth.cancel();
    // Remove markdown bold and special chars for speech
    const cleanText = text.replace(/\*\*/g, '').replace(/[•✨☕🏆🔥🌸🍫🫐🌰🍯🌶️☀️🍷🫖🍵⚙️🇪🇹🇨🇴🇮🇩🇮🇳🇬🇹🇰🇪💛🌟⭐🚚📦🎁🔐]/g, '').replace(/\n/g, '. ');
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.92;
    utterance.pitch = 1.05;
    utterance.volume = 1.0;

    const voices = this.synth.getVoices();
    const preferred = voices.find(v =>
      v.name.includes('Samantha') ||
      v.name.includes('Google UK English Female') ||
      v.name.includes('Karen') ||
      (v.name.includes('Female') && v.lang.startsWith('en'))
    );
    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => { this._isSpeaking = true; };
    utterance.onend = () => { this._isSpeaking = false; onEnd?.(); };
    utterance.onerror = () => { this._isSpeaking = false; onEnd?.(); };

    this.synth.speak(utterance);
  }

  stop() {
    this.synth.cancel();
    this._isSpeaking = false;
  }

  listen(onResult: (text: string) => void, onError?: (error: string) => void) {
    if (!this.recognition) {
      onError?.('Speech recognition not supported');
      return;
    }
    this.recognition.onresult = (event: any) => {
      onResult(event.results[0][0].transcript);
    };
    this.recognition.onerror = (event: any) => {
      onError?.(event.error);
    };
    this.recognition.start();
  }

  isSupported(): boolean { return this.recognition !== null; }
}

// Suggestion chips
const suggestionChips = [
  "Recommend a coffee for me",
  "What's good for espresso?",
  "Tell me about your origins",
  "I like chocolate flavors",
  "Help me choose a gift",
  "What are your subscriptions?",
  "Tell me a coffee joke",
];

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIAssistant({ isOpen, onClose }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const ai = useRef(new NoirAI());
  const voice = useRef(new VoiceEngine());

  useEffect(() => {
    setMessages(ai.current.getHistory());
    // Load voices
    window.speechSynthesis?.getVoices();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = useCallback(async (text?: string) => {
    const message = (text || inputText).trim();
    if (!message) return;

    setInputText('');

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);

    // Show typing indicator
    setIsTyping(true);

    // Simulate thinking delay
    await new Promise(r => setTimeout(r, 600 + Math.random() * 800));

    // Get AI response
    const response = await ai.current.respond(message);

    setIsTyping(false);

    // Add AI message
    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      text: response,
      sender: 'ai',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, aiMsg]);

    // Speak response
    if (voiceEnabled) {
      setIsSpeaking(true);
      voice.current.speak(response, () => setIsSpeaking(false));
    }
  }, [inputText, voiceEnabled]);

  const handleVoiceInput = () => {
    if (isListening) return;
    setIsListening(true);
    voice.current.listen(
      (text) => {
        setInputText(text);
        setIsListening(false);
        // Auto-send voice input
        setTimeout(() => handleSend(text), 100);
      },
      () => {
        setIsListening(false);
        showToast({ type: 'error', title: 'Voice input failed', message: 'Please try again or type your message.' });
      }
    );
  };

  const toggleVoice = () => {
    if (isSpeaking) {
      voice.current.stop();
      setIsSpeaking(false);
    }
    setVoiceEnabled(!voiceEnabled);
  };

  const clearChat = () => {
    ai.current.clearHistory();
    voice.current.stop();
    setIsSpeaking(false);
    setMessages([]);
    showToast({ type: 'info', title: 'Chat cleared', message: 'Starting a fresh conversation.' });
  };

  // Format message text with simple markdown-like bold
  const formatText = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-gold-400 font-semibold">{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
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
            onClick={() => { onClose(); voice.current.stop(); setIsSpeaking(false); }}
            className="fixed inset-0 bg-noir-900/80 backdrop-blur-sm z-[998]"
          />

            {/* Chat Panel */}
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-gradient-to-b from-noir-900 via-noir-800 to-noir-900 z-[999] flex flex-col shadow-2xl border-l border-gold-400/10"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-gold-400/15 bg-noir-900/80 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/20">
                      <Coffee className="w-6 h-6 text-noir-900" />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-noir-900" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-cream-100">Noir AI</h3>
                    <p className="text-[10px] text-gold-400 tracking-wider uppercase">Your Coffee Concierge</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={toggleVoice}
                    className="p-2.5 rounded-xl glass-3d text-cream-200/50 hover:text-gold-400 transition-colors"
                    title={voiceEnabled ? 'Mute voice' : 'Enable voice'}
                  >
                    {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={clearChat}
                    className="p-2.5 rounded-xl glass-3d text-cream-200/50 hover:text-gold-400 transition-colors"
                    title="Clear chat"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => { onClose(); voice.current.stop(); setIsSpeaking(false); }}
                    className="p-2.5 rounded-xl glass-3d text-cream-200/50 hover:text-gold-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {messages.length === 0 && (
                  <div className="text-center py-10">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.2 }}
                      className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-gold-400/20 to-gold-600/20 flex items-center justify-center"
                    >
                      <Sparkles className="w-10 h-10 text-gold-400" />
                    </motion.div>
                    <h4 className="font-display text-xl font-bold text-cream-100 mb-2">Welcome to Noir AI</h4>
                    <p className="text-sm text-cream-200/50 max-w-xs mx-auto mb-6 leading-relaxed">
                      I'm your personal coffee concierge. Ask me anything about our coffees, brewing methods, or let me help you find your perfect cup!
                    </p>

                    {/* Suggestion chips */}
                    <div className="flex flex-wrap gap-2 justify-center">
                      {suggestionChips.slice(0, 4).map((chip) => (
                        <button
                          key={chip}
                          onClick={() => handleSend(chip)}
                          className="px-3 py-2 glass-3d rounded-full text-xs text-cream-200/60 hover:text-gold-400 hover:border-gold-400/30 transition-all"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-br from-gold-500 to-gold-600 text-noir-900 rounded-br-sm'
                          : 'glass-premium text-cream-100 rounded-bl-sm border border-gold-400/10'
                      }`}
                    >
                      <div className="text-sm whitespace-pre-line leading-relaxed">
                        {formatText(msg.text)}
                      </div>
                      <p className={`text-[10px] mt-1.5 ${msg.sender === 'user' ? 'text-noir-900/50' : 'text-cream-200/30'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="glass-premium rounded-2xl rounded-bl-sm px-4 py-3 border border-gold-400/10">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1.5">
                          <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} className="w-2 h-2 bg-gold-400 rounded-full" />
                          <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }} className="w-2 h-2 bg-gold-400 rounded-full" />
                          <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }} className="w-2 h-2 bg-gold-400 rounded-full" />
                        </div>
                        <span className="text-xs text-cream-200/40">Noir is thinking...</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Speaking indicator */}
                {isSpeaking && !isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="glass-3d rounded-2xl px-4 py-2">
                      <div className="flex items-center gap-2">
                        <Volume2 className="w-4 h-4 text-gold-400" />
                        <div className="flex gap-1">
                          {[0, 1, 2, 3, 4].map(i => (
                            <motion.div
                              key={i}
                              animate={{ height: [4, 12, 4] }}
                              transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                              className="w-1 bg-gold-400 rounded-full"
                            />
                          ))}
                        </div>
                        <span className="text-xs text-cream-200/40">Speaking...</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick suggestions (when there are messages) */}
              {messages.length > 0 && messages.length < 6 && (
                <div className="px-5 pb-2">
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {suggestionChips.slice(0, 3).map((chip) => (
                      <button
                        key={chip}
                        onClick={() => handleSend(chip)}
                        className="px-3 py-1.5 glass-3d rounded-full text-[10px] text-cream-200/50 hover:text-gold-400 whitespace-nowrap transition-all flex-shrink-0"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t border-gold-400/15 bg-noir-900/80 backdrop-blur-xl">
                <div className="flex gap-2">
                  {voice.current.isSupported() && (
                    <button
                      onClick={handleVoiceInput}
                      disabled={isListening}
                      className={`p-3 rounded-xl transition-all flex-shrink-0 ${
                        isListening
                          ? 'bg-red-500 text-white animate-pulse'
                          : 'glass-3d text-cream-200/50 hover:text-gold-400'
                      }`}
                      title={isListening ? 'Listening...' : 'Voice input'}
                    >
                      {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>
                  )}
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={isListening ? 'Listening...' : 'Ask me about coffee...'}
                    disabled={isListening}
                    className="flex-1 bg-noir-800/50 rounded-xl px-4 py-3 text-sm text-cream-100 placeholder:text-cream-200/25 border border-gold-400/10 focus:outline-none focus:border-gold-400/30 transition-all disabled:opacity-50"
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={!inputText.trim() || isListening}
                    className="p-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-noir-900 hover:from-gold-400 hover:to-gold-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                {isListening && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-gold-400 mt-2 text-center"
                  >
                    🎙️ Listening... speak now
                  </motion.p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
  );
}
