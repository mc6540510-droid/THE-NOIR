import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ArrowRight, X, BookOpen, Coffee, Thermometer, Scale, Timer, Leaf, MapPin, Users, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  image: string;
  date: string;
  author: string;
  fullContent: {
    intro: string;
    sections: {
      heading: string;
      content: string;
      tips?: string[];
    }[];
    conclusion: string;
  };
}

const posts: BlogPost[] = [
  {
    id: 1,
    title: 'The Science of Coffee Extraction',
    excerpt: 'Understanding how water temperature, grind size, and time create the perfect balance of flavors in your cup.',
    category: 'Education',
    readTime: '8 min',
    image: '/images/brewing.jpg',
    date: 'Dec 15, 2024',
    author: 'Dr. Marcus Chen',
    fullContent: {
      intro: 'Coffee extraction is a complex chemical process that transforms ground beans into the beverage we love. Understanding the science behind extraction allows you to unlock the full potential of every bean, creating a cup that balances sweetness, acidity, and bitterness in perfect harmony.',
      sections: [
        {
          heading: 'The Chemistry of Extraction',
          content: 'When hot water meets coffee grounds, over 1,000 aromatic compounds begin dissolving at different rates. First come the bright, fruity acids (citric, malic, and acetic), followed by sugars and caramelized compounds, and finally the bitter, astringent molecules. The goal is to extract the desirable compounds while leaving behind the harsh elements.',
          tips: [
            'Under-extraction tastes sour and thin — increase grind time or temperature',
            'Over-extraction tastes bitter and hollow — reduce contact time',
            'Perfect extraction is sweet, balanced, and complex'
          ]
        },
        {
          heading: 'Water Temperature Matters',
          content: 'Temperature is perhaps the most critical variable in extraction. Water that\'s too cool won\'t dissolve enough compounds, while water that\'s too hot will extract harsh, bitter flavors. The ideal range is 195-205°F (90-96°C) for most brewing methods.',
          tips: [
            'Light roasts benefit from higher temperatures (200-205°F)',
            'Dark roasts prefer slightly cooler water (195-200°F)',
            'Use a thermometer for precision — guesswork leads to inconsistency'
          ]
        },
        {
          heading: 'Grind Size & Surface Area',
          content: 'Grind size determines how quickly water can access the coffee\'s soluble compounds. Finer grinds have more surface area and extract faster, while coarser grinds extract more slowly. This is why espresso uses a fine grind (25-30 second extraction) while French press uses a coarse grind (4 minute extraction).',
          tips: [
            'Espresso: Fine grind, like table salt',
            'Pour-over: Medium grind, like sand',
            'French press: Coarse grind, like sea salt'
          ]
        },
        {
          heading: 'The Golden Ratio',
          content: 'The coffee-to-water ratio is your foundation. The Specialty Coffee Association recommends 55g of coffee per liter of water (1:18 ratio). This creates a balanced strength that allows flavors to shine without being overpowering.',
          tips: [
            'Start with 1:16 for a stronger cup',
            'Try 1:18 for a lighter, more tea-like body',
            'Adjust based on your personal preference and roast level'
          ]
        }
      ],
      conclusion: 'Mastering extraction is a journey of experimentation and refinement. Start with these fundamentals, then adjust variables one at a time to discover what works best for your palate. Remember: great coffee is not about following rules rigidly, but understanding the principles well enough to break them creatively.'
    }
  },
  {
    id: 2,
    title: 'Ethiopia: Birthplace of Coffee',
    excerpt: 'A journey through the ancient forests where coffee was first discovered, and the farmers keeping tradition alive.',
    category: 'Origins',
    readTime: '12 min',
    image: '/images/coffee-farm.jpg',
    date: 'Dec 8, 2024',
    author: 'Sofia Ramirez',
    fullContent: {
      intro: 'Long before coffee became a global commodity, it grew wild in the misty highlands of Ethiopia. Legend tells of Kaldi, a goatherd who noticed his animals dancing with energy after eating red berries from a certain tree. Whether myth or history, Ethiopia remains the spiritual and genetic homeland of Coffea arabica.',
      sections: [
        {
          heading: 'The Legend of Kaldi',
          content: 'In the 9th century, a young Ethiopian goatherd named Kaldi observed his goats becoming unusually energetic after eating berries from a particular shrub. Curious, he tried the berries himself and experienced a similar burst of vitality. He brought them to a local monastery, where monks discovered that brewing the berries helped them stay alert during long evening prayers.',
          tips: [
            'Ethiopia is home to over 6,000 indigenous coffee varieties',
            'Many Ethiopian coffees are still grown in semi-wild forest gardens',
            'The word "coffee" may derive from "Kaffa," an Ethiopian region'
          ]
        },
        {
          heading: 'Yirgacheffe: The Jewel of Ethiopian Coffee',
          content: 'Yirgacheffe, a small region in southern Ethiopia, produces some of the world\'s most distinctive coffees. Grown at elevations between 1,700 and 2,200 meters, these beans develop slowly in cool mountain air, building complex sugars and bright acidity. The result is a cup with floral aromatics (jasmine, bergamot), citrus notes (lemon, orange), and a clean, tea-like body.',
          tips: [
            'Washed Yirgacheffe: Bright, floral, and clean',
            'Natural Yirgacheffe: Fruity, wine-like, and complex',
            'Best brewed as pour-over to highlight delicate flavors'
          ]
        },
        {
          heading: 'The Coffee Ceremony',
          content: 'In Ethiopia, coffee is not just a beverage — it\'s a sacred social ritual. The traditional coffee ceremony (Buna) involves roasting green beans over charcoal, grinding them by hand, and brewing in a clay pot called a jebena. The ceremony can last hours and is a time for community, conversation, and connection.',
          tips: [
            'Three rounds are served: Abol (first), Tona (second), and Baraka (blessing)',
            'Incense is burned to honor the spirits',
            'Popcorn or snacks are often served alongside'
          ]
        },
        {
          heading: 'Modern Ethiopian Coffee Farming',
          content: 'Today, over 15 million Ethiopians depend on coffee for their livelihood. Most are smallholder farmers cultivating gardens of less than 2 hectares. These farmers are guardians of genetic diversity, growing heirloom varieties that exist nowhere else on Earth. NOIR partners directly with cooperatives in Sidamo, Guji, and Harrar to ensure fair prices and sustainable practices.',
          tips: [
            'Direct trade ensures farmers receive 30-50% more than commodity prices',
            'Shade-grown Ethiopian coffee supports biodiversity',
            'Look for "single origin" to taste the terroir of specific regions'
          ]
        }
      ],
      conclusion: 'Ethiopia is not just where coffee began — it\'s where coffee continues to inspire. Every cup of Ethiopian coffee is a bridge across centuries, connecting us to the forests, farmers, and traditions that make this beverage so extraordinary. When you drink NOIR\'s Midnight Velvet (sourced from Yirgacheffe), you\'re tasting history itself.'
    }
  },
  {
    id: 3,
    title: 'The Art of Latte Mastery',
    excerpt: 'From basic hearts to intricate rosettas — a comprehensive guide to elevating your milk art game.',
    category: 'Technique',
    readTime: '6 min',
    image: '/images/barista.jpg',
    date: 'Nov 29, 2024',
    author: 'James Blackwell',
    fullContent: {
      intro: 'Latte art is where science meets creativity. It transforms a simple coffee into a canvas, requiring precise milk texture, confident pouring technique, and an artist\'s eye. Whether you\'re a beginner or looking to refine your skills, this guide will help you master the fundamentals and beyond.',
      sections: [
        {
          heading: 'Perfect Milk Texture',
          content: 'The foundation of latte art is properly steamed milk. You\'re aiming for microfoam — milk with tiny, uniform bubbles that create a glossy, paint-like texture. Over-aerated milk (large bubbles) will not flow smoothly, while under-aerated milk won\'t hold patterns.',
          tips: [
            'Start with cold milk (38°F / 3°C) for best results',
            'Steam to 140-150°F (60-65°C) — never exceed 160°F',
            'Tap and swirl the pitcher to eliminate large bubbles',
            'The milk should look like wet paint, not whipped cream'
          ]
        },
        {
          heading: 'The Heart Pattern',
          content: 'The heart is the gateway to latte art. It teaches you control over flow rate, pitcher height, and wrist movement. Start by pouring milk into the center of the espresso from a height of 2-3 inches. As the cup fills, lower the pitcher close to the surface and increase flow. Wiggle gently side to side, then pull through the center to create the heart\'s point.',
          tips: [
            'High pour = milk sinks beneath crema (white base)',
            'Low pour = milk floats on top (pattern forms)',
            'Practice the "wiggle and pull" motion slowly at first'
          ]
        },
        {
          heading: 'The Rosetta (Fern)',
          content: 'The rosetta is a classic pattern that resembles a fern leaf. It requires a rhythmic side-to-side motion while slowly pulling the pitcher back through the cup. Start at the far edge, wiggle as you pull toward you, then finish with a straight line through the center to create the stem.',
          tips: [
            'Keep the pitcher spout close to the surface throughout',
            'Move your wrist, not your arm, for the wiggle',
            'Speed and consistency are key — practice the rhythm'
          ]
        },
        {
          heading: 'Advanced Techniques',
          content: 'Once you\'ve mastered hearts and rosettas, explore tulips (stacked hearts), swans, and etching (using a tool to draw on the surface). Advanced baristas combine free-pour patterns with etching to create intricate designs like animals, flowers, and even portraits.',
          tips: [
            'Tulips: Pour multiple small hearts in a stack',
            'Swan: Combine a heart body with a curved neck',
            'Etching: Use a latte art pen or toothpick for fine details',
            'Practice daily — muscle memory is everything'
          ]
        }
      ],
      conclusion: 'Latte art is a skill that rewards patience and practice. Don\'t be discouraged by early failures — even professional baristas poured hundreds of imperfect cups before mastering their craft. Focus on milk texture first, then build your pouring confidence. Soon, every cup you make will be a work of art.'
    }
  }
];

function ArticleModal({ post, onClose }: { post: BlogPost; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-noir-900/90 backdrop-blur-xl" />

      {/* Modal Content */}
      <motion.div
        initial={{ scale: 0.9, y: 50, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 50, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-premium rounded-3xl preserve-3d"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 w-10 h-10 glass-3d rounded-full flex items-center justify-center text-cream-200/60 hover:text-gold-400 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image */}
        <div className="relative h-64 md:h-80 overflow-hidden rounded-t-3xl">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-noir-900 via-noir-900/50 to-transparent" />
          
          {/* Category badge */}
          <div className="absolute top-6 left-6 px-4 py-2 glass-3d rounded-full text-xs text-gold-300 font-semibold tracking-wider uppercase">
            {post.category}
          </div>
        </div>

        {/* Article Content */}
        <div className="p-8 md:p-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-3xl md:text-5xl font-bold text-cream-100 mb-4">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-cream-200/40 text-sm">
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-gold-400" />
                {post.author}
              </span>
              <span>{post.date}</span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readTime} read
              </span>
            </div>
          </div>

          {/* Introduction */}
          <div className="mb-10">
            <p className="text-cream-200/70 text-lg leading-relaxed font-light italic border-l-4 border-gold-400/30 pl-6">
              {post.fullContent.intro}
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-10">
            {post.fullContent.sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className="glass-3d rounded-2xl p-6 md:p-8"
              >
                <h2 className="font-display text-2xl md:text-3xl font-bold text-cream-100 mb-4 flex items-center gap-3">
                  <ChevronRight className="w-6 h-6 text-gold-400" />
                  {section.heading}
                </h2>
                <p className="text-cream-200/60 leading-relaxed mb-6">
                  {section.content}
                </p>
                
                {/* Tips */}
                {section.tips && section.tips.length > 0 && (
                  <div className="bg-noir-800/50 rounded-xl p-5 border border-gold-400/10">
                    <h3 className="text-gold-400 text-sm font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Coffee className="w-4 h-4" />
                      Pro Tips
                    </h3>
                    <ul className="space-y-2">
                      {section.tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-3 text-cream-200/60 text-sm">
                          <span className="text-gold-400 mt-0.5">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Conclusion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-10 glass-3d rounded-2xl p-6 md:p-8 border-l-4 border-gold-400"
          >
            <h3 className="font-display text-xl font-bold text-gold-400 mb-3">Conclusion</h3>
            <p className="text-cream-200/70 leading-relaxed">
              {post.fullContent.conclusion}
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-10 text-center"
          >
            <p className="text-cream-200/40 text-sm mb-4">Ready to experience these flavors yourself?</p>
            <button
              onClick={() => {
                onClose();
                setTimeout(() => {
                  const element = document.querySelector('#collection');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }, 300);
              }}
              className="px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-noir-900 font-bold rounded-full text-sm tracking-wider uppercase hover:from-gold-400 hover:to-gold-500 transition-all magnetic-btn"
            >
              Explore Our Collection
            </button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Blog() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  return (
    <>
      <section className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-24"
          >
            <span className="text-gold-400 text-sm font-medium tracking-[0.4em] uppercase block mb-5">Journal</span>
            <h2 className="font-display text-5xl md:text-7xl font-bold text-cream-100 mb-6">
              Coffee <span className="text-gradient-3d">Blog</span>
            </h2>
            <p className="text-cream-200/50 max-w-2xl mx-auto text-lg">
              Stories, guides, and insights from the world of premium coffee.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 50, rotateX: 10 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.15 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => setSelectedPost(post)}
                className="perspective-1500 cursor-pointer"
              >
                <motion.div
                  animate={{
                    rotateX: hoveredIndex === index ? -5 : 0,
                    rotateY: hoveredIndex === index ? 8 : 0,
                    translateZ: hoveredIndex === index ? 30 : 0,
                    scale: hoveredIndex === index ? 1.03 : 1,
                  }}
                  transition={{ duration: 0.4 }}
                  className="glass-premium rounded-2xl overflow-hidden preserve-3d"
                >
                  <div className="relative h-52 overflow-hidden" style={{ transform: 'translateZ(10px)' }}>
                    <motion.img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                      animate={{ scale: hoveredIndex === index ? 1.15 : 1 }}
                      transition={{ duration: 0.7 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-noir-900/80 via-noir-900/20 to-transparent" />
                    <motion.span
                      className="absolute top-4 left-4 px-4 py-1.5 glass-3d rounded-full text-xs text-gold-300 font-medium"
                      style={{ transform: 'translateZ(40px)' }}
                    >
                      {post.category}
                    </motion.span>
                  </div>

                  <div className="p-7 preserve-3d">
                    <div className="flex items-center gap-4 text-cream-200/30 text-xs mb-3" style={{ transform: 'translateZ(15px)' }}>
                      <span>{post.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-cream-100 mb-3 transition-colors" style={{ transform: 'translateZ(20px)' }}>
                      {post.title}
                    </h3>
                    <p className="text-cream-200/50 text-sm leading-relaxed mb-5" style={{ transform: 'translateZ(15px)' }}>
                      {post.excerpt}
                    </p>
                    <motion.button
                      className="inline-flex items-center gap-2 text-gold-400 text-sm font-medium"
                      animate={{ gap: hoveredIndex === index ? 12 : 8 }}
                      style={{ transform: 'translateZ(25px)' }}
                    >
                      Read Full Article <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Article Modal */}
      <AnimatePresence>
        {selectedPost && (
          <ArticleModal post={selectedPost} onClose={() => setSelectedPost(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
