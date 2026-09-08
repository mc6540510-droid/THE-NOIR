import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';

interface VideoSectionProps {
  videoSrc: string;
  title: string;
  subtitle: string;
  height?: string;
}

export default function VideoSection({ videoSrc, title, subtitle, height = 'h-[70vh]' }: VideoSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Smooth spring-based parallax
  const videoY = useSpring(useTransform(scrollYProgress, [0, 1], ['-15%', '15%']), { stiffness: 40, damping: 20 });
  const textY = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], ['40%', '0%', '-40%']), { stiffness: 40, damping: 20 });
  const textOpacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0]);
  const videoScale = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1, 1.15]), { stiffness: 40, damping: 20 });

  return (
    <section ref={sectionRef} className={`relative ${height} overflow-hidden`}>
      {/* 3D Video Background with smooth parallax */}
      <motion.div
        style={{ y: videoY, scale: videoScale }}
        className="absolute inset-0 will-change-transform"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-[120%] object-cover"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      </motion.div>

      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-noir-900 via-noir-900/40 to-noir-900" />
      <div className="absolute inset-0 bg-gradient-to-r from-noir-900/50 via-transparent to-noir-900/50" />

      {/* 3D floating decoration */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="ring-3d w-[400px] h-[400px] animate-spin-slow opacity-10" style={{ animationDuration: '40s' }} />
      </div>

      {/* Content with smooth 3D parallax */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 scene-3d will-change-transform"
      >
        <motion.p
          initial={{ opacity: 0, rotateX: 20 }}
          whileInView={{ opacity: 1, rotateX: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-gold-400/70 text-[10px] font-medium tracking-[0.5em] uppercase mb-5 preserve-3d"
        >
          {subtitle}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 40, rotateX: 15 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.1, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-cream-100 max-w-3xl"
        >
          {title}
        </motion.h2>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mt-8 w-24 h-[2px] bg-gradient-to-r from-transparent via-gold-400 to-transparent"
        />
      </motion.div>
    </section>
  );
}
