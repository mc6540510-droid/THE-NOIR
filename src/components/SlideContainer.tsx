import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

interface Slide {
  id: string;
  label: string;
  component: React.ReactNode;
}

interface SlideContainerProps {
  slides: Slide[];
}

export default function SlideContainer({ slides }: SlideContainerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastWheelTime = useRef(0);
  const touchStartY = useRef(0);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning || index < 0 || index >= slides.length) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 1000);
  }, [isTransitioning, slides.length]);

  const nextSlide = useCallback(() => {
    if (currentSlide < slides.length - 1) goToSlide(currentSlide + 1);
  }, [currentSlide, slides.length, goToSlide]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) goToSlide(currentSlide - 1);
  }, [currentSlide, goToSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'Home') {
        e.preventDefault();
        goToSlide(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        goToSlide(slides.length - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, goToSlide, slides.length]);

  // Wheel navigation with debounce — checks if inner content is scrollable
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();
      
      // Check if the target or its parent is a scrollable inner container
      const target = e.target as HTMLElement;
      const scrollableParent = target.closest('.slide-scrollable');
      
      if (scrollableParent) {
        const el = scrollableParent as HTMLElement;
        const { scrollTop, scrollHeight, clientHeight } = el;
        const atTop = scrollTop <= 1;
        const atBottom = scrollTop + clientHeight >= scrollHeight - 1;

        // If scrolling down and not at bottom, let inner scroll
        if (e.deltaY > 0 && !atBottom) return;
        // If scrolling up and not at top, let inner scroll
        if (e.deltaY < 0 && !atTop) return;
      }

      // Otherwise, navigate slides
      e.preventDefault();
      if (now - lastWheelTime.current < 1100) return;
      lastWheelTime.current = now;

      if (e.deltaY > 30) nextSlide();
      else if (e.deltaY < -30) prevSlide();
    };
    const el = containerRef.current;
    if (el) {
      el.addEventListener('wheel', handleWheel, { passive: false });
      return () => el.removeEventListener('wheel', handleWheel);
    }
  }, [nextSlide, prevSlide]);

  // Touch navigation
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      const diff = touchStartY.current - e.changedTouches[0].clientY;
      
      // Check if target is in a scrollable container
      const target = e.target as HTMLElement;
      const scrollableParent = target.closest('.slide-scrollable');
      if (scrollableParent) {
        const el = scrollableParent as HTMLElement;
        const { scrollTop, scrollHeight, clientHeight } = el;
        const atTop = scrollTop <= 1;
        const atBottom = scrollTop + clientHeight >= scrollHeight - 1;
        if (diff > 0 && !atBottom) return;
        if (diff < 0 && !atTop) return;
      }

      if (Math.abs(diff) > 50) {
        if (diff > 0) nextSlide();
        else prevSlide();
      }
    };
    const el = containerRef.current;
    if (el) {
      el.addEventListener('touchstart', handleTouchStart, { passive: true });
      el.addEventListener('touchend', handleTouchEnd, { passive: true });
      return () => {
        el.removeEventListener('touchstart', handleTouchStart);
        el.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [nextSlide, prevSlide]);

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-noir-900">
      {/* Slides */}
      <motion.div
        animate={{ y: `-${currentSlide * 100}vh` }}
        transition={{ duration: 1, ease: [0.65, 0, 0.35, 1] }}
        className="w-full"
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            id={slide.id}
            className="w-full h-screen relative"
          >
            {slide.component}
          </div>
        ))}
      </motion.div>

      {/* Navigation Dots */}
      <div className="fixed right-5 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-2.5">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => goToSlide(index)}
            className="group relative flex items-center"
            aria-label={slide.label}
          >
            <motion.div
              animate={{
                width: currentSlide === index ? 3 : 3,
                height: currentSlide === index ? 20 : 3,
                backgroundColor: currentSlide === index ? '#c8a96e' : 'rgba(200, 169, 110, 0.2)',
                borderRadius: currentSlide === index ? '2px' : '50%',
              }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
