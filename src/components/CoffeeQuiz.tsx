import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronRight, Sparkles, RotateCcw } from 'lucide-react';
import { useStore, coffeeProducts } from '../lib/store';

const questions = [
  {
    id: 'intensity',
    question: 'How bold do you like your coffee?',
    options: [
      { label: 'Light & Delicate', value: 'light', emoji: '☕' },
      { label: 'Balanced & Smooth', value: 'medium', emoji: '🫖' },
      { label: 'Bold & Intense', value: 'bold', emoji: '⚡' },
      { label: 'Maximum Power', value: 'max', emoji: '🔥' },
    ],
  },
  {
    id: 'flavor',
    question: 'Which flavor profile speaks to you?',
    options: [
      { label: 'Fruity & Bright', value: 'fruity', emoji: '🫐' },
      { label: 'Sweet & Caramel', value: 'sweet', emoji: '🍯' },
      { label: 'Dark & Chocolatey', value: 'dark', emoji: '🍫' },
      { label: 'Earthy & Complex', value: 'earthy', emoji: '🌿' },
    ],
  },
  {
    id: 'time',
    question: 'When do you usually enjoy coffee?',
    options: [
      { label: 'Morning Ritual', value: 'morning', emoji: '🌅' },
      { label: 'Afternoon Pick-me-up', value: 'afternoon', emoji: '☀️' },
      { label: 'Evening Unwind', value: 'evening', emoji: '🌙' },
      { label: 'Anytime, Anywhere', value: 'anytime', emoji: '✨' },
    ],
  },
];

function getRecommendation(answers: Record<string, string>) {
  const intensity = answers.intensity;
  const flavor = answers.flavor;
  if (intensity === 'max' || (intensity === 'bold' && flavor === 'dark')) return coffeeProducts.find(p => p.id === 3)!;
  if (intensity === 'light' && flavor === 'fruity') return coffeeProducts.find(p => p.id === 4)!;
  if (flavor === 'sweet') return coffeeProducts.find(p => p.id === 2)!;
  if (flavor === 'earthy') return coffeeProducts.find(p => p.id === 5)!;
  return coffeeProducts.find(p => p.id === 6)!;
}

export default function CoffeeQuiz() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const { quizAnswers, setQuizAnswer, quizResult, setQuizResult } = useStore();

  const handleAnswer = (key: string, value: string) => {
    setQuizAnswer(key, value);
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      const answers = { ...quizAnswers, [key]: value };
      const recommendation = getRecommendation(answers);
      setQuizResult(recommendation.name);
    }
  };

  const reset = () => {
    setCurrentQ(0);
    setQuizResult(null);
  };

  const recommendedProduct = quizResult ? coffeeProducts.find(p => p.name === quizResult) : null;

  return (
    <>
      {/* 3D Floating trigger */}
      <motion.button
        initial={{ scale: 0, rotateZ: -180 }}
        animate={{ scale: 1, rotateZ: 0 }}
        transition={{ delay: 2, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.15, rotateY: 15 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-28 right-8 z-40 w-14 h-14 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center shadow-2xl shadow-gold-500/40 animate-pulse-gold"
      >
        <Sparkles className="w-7 h-7 text-noir-900" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-noir-900/85 backdrop-blur-xl" onClick={() => setIsOpen(false)} />

            <motion.div
              initial={{ scale: 0.7, y: 60, rotateX: 20 }}
              animate={{ scale: 1, y: 0, rotateX: 0 }}
              exit={{ scale: 0.7, y: 60, rotateX: -20 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="relative w-full max-w-lg glass-premium rounded-3xl p-8 preserve-3d perspective-1000"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-cream-200/40 hover:text-cream-100 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gold-400/10 transition-all"
              >
                ×
              </button>

              <div className="text-center mb-8" style={{ transform: 'translateZ(20px)' }}>
                <motion.div
                  animate={{ rotateY: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  className="inline-block"
                >
                  <Sparkles className="w-10 h-10 text-gold-400 mx-auto mb-3" />
                </motion.div>
                <h3 className="font-display text-2xl font-bold text-cream-100">AI Coffee Recommender</h3>
                <p className="text-cream-200/40 text-sm mt-1">Find your perfect blend in 3 questions</p>
              </div>

              {!quizResult ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQ}
                    initial={{ opacity: 0, x: 30, rotateY: 10 }}
                    animate={{ opacity: 1, x: 0, rotateY: 0 }}
                    exit={{ opacity: 0, x: -30, rotateY: -10 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="flex gap-2 mb-6">
                      {questions.map((_, i) => (
                        <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= currentQ ? 'bg-gradient-to-r from-gold-400 to-gold-600' : 'bg-noir-600'}`} />
                      ))}
                    </div>

                    <p className="font-display text-lg text-cream-100 mb-6">{questions[currentQ].question}</p>

                    <div className="grid grid-cols-1 gap-3">
                      {questions[currentQ].options.map((option) => (
                        <motion.button
                          key={option.value}
                          whileHover={{ translateX: 8, translateZ: 15, scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleAnswer(questions[currentQ].id, option.value)}
                          className="flex items-center gap-3 p-4 rounded-xl border border-gold-400/10 hover:border-gold-400/30 hover:bg-gold-400/5 transition-all text-left"
                        >
                          <span className="text-2xl">{option.emoji}</span>
                          <span className="text-cream-200/70">{option.label}</span>
                          <ChevronRight className="w-4 h-4 text-cream-200/20 ml-auto" />
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotateX: 15 }}
                  animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                  className="text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="text-6xl mb-4"
                  >
                    🎉
                  </motion.div>
                  <h4 className="font-display text-xl font-bold text-gold-400 mb-2">We recommend</h4>
                  <p className="font-display text-3xl font-bold text-cream-100 mb-4">{quizResult}</p>
                  {recommendedProduct && (
                    <p className="text-cream-200/50 text-sm mb-8">{recommendedProduct.description}</p>
                  )}
                  <div className="flex gap-3 justify-center">
                    <button onClick={reset} className="px-6 py-3 border border-gold-400/20 rounded-xl text-gold-300 text-sm flex items-center gap-2 hover:bg-gold-400/10 transition-colors">
                      <RotateCcw className="w-4 h-4" /> Retake
                    </button>
                    <button onClick={() => setIsOpen(false)} className="px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-noir-900 rounded-xl text-sm font-bold hover:from-gold-400 hover:to-gold-500 transition-all">
                      Shop Now
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
