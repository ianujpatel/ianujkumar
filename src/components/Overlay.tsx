"use client";

import { motion, MotionValue, useTransform, useSpring, useMotionValueEvent } from "framer-motion";
import { useEffect, useState } from "react";

interface OverlayProps {
  scrollYProgress: MotionValue<number>;
}

/* ── Animated noise/grain texture via canvas ── */
function GrainCanvas() {
  useEffect(() => {
    const canvas = document.getElementById("grain") as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let frame = 0;

    const render = () => {
      const { width, height } = canvas;
      const imageData = ctx.createImageData(width, height);
      for (let i = 0; i < imageData.data.length; i += 4) {
        const v = Math.random() * 255;
        imageData.data[i] = v;
        imageData.data[i + 1] = v;
        imageData.data[i + 2] = v;
        imageData.data[i + 3] = 18; // very subtle
      }
      ctx.putImageData(imageData, 0, 0);
      frame = requestAnimationFrame(render);
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    render();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      id="grain"
      className="absolute inset-0 z-10 pointer-events-none mix-blend-overlay opacity-40"
    />
  );
}

/* ── Floating orbs that drift slowly ── */
function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Primary violet orb */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: "42vw",
          height: "42vw",
          top: "8%",
          left: "-10%",
          background:
            "radial-gradient(circle at 40% 40%, rgba(139,92,246,0.28) 0%, rgba(109,40,217,0.08) 50%, transparent 70%)",
          filter: "blur(80px)",
        }}
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.08, 0.95, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Cyan/teal orb */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: "35vw",
          height: "35vw",
          bottom: "5%",
          right: "-8%",
          background:
            "radial-gradient(circle at 60% 60%, rgba(20,184,166,0.22) 0%, rgba(6,182,212,0.08) 50%, transparent 70%)",
          filter: "blur(90px)",
        }}
        animate={{
          x: [0, -50, 30, 0],
          y: [0, 40, -25, 0],
          scale: [1, 1.1, 0.92, 1],
        }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      />

      {/* Rose/pink orb */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: "28vw",
          height: "28vw",
          top: "40%",
          right: "15%",
          background:
            "radial-gradient(circle at 50% 50%, rgba(244,63,94,0.18) 0%, rgba(236,72,153,0.06) 50%, transparent 70%)",
          filter: "blur(70px)",
        }}
        animate={{
          x: [0, 30, -40, 0],
          y: [0, -45, 20, 0],
          scale: [1, 0.9, 1.12, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 9 }}
      />

      {/* Amber accent orb */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: "20vw",
          height: "20vw",
          top: "60%",
          left: "20%",
          background:
            "radial-gradient(circle at 50% 50%, rgba(251,191,36,0.14) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{
          x: [0, -30, 50, 0],
          y: [0, 30, -20, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
    </div>
  );
}

/* ── Animated SVG grid lines ── */
function GridLines() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.06]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
          <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
}

/* ── Stat pill ── */
function StatPill({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div
      className="flex items-center gap-2.5 rounded-full px-4 py-2 backdrop-blur-xl border"
      style={{
        background: `rgba(${color},0.12)`,
        borderColor: `rgba(${color},0.25)`,
      }}
    >
      <span
        className="text-sm font-bold tabular-nums"
        style={{ color: `rgb(${color})` }}
      >
        {value}
      </span>
      <span className="text-[11px] uppercase tracking-[0.4em] text-white/50">{label}</span>
    </div>
  );
}

export default function Overlay({ scrollYProgress }: OverlayProps) {
  /* ── Section opacity/transform ── */
  const heroOpacity = useTransform(scrollYProgress, [0, 0.14, 0.22, 0.28], [1, 1, 0.2, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.28], [0, -80]);
  const heroScale = useTransform(scrollYProgress, [0, 0.28], [1, 0.94]);

  const secondOpacity = useTransform(scrollYProgress, [0.30, 0.38, 0.50, 0.58], [0, 1, 1, 0]);
  const secondY = useTransform(scrollYProgress, [0.3, 0.58], [80, -80]);

  const thirdOpacity = useTransform(scrollYProgress, [0.62, 0.70, 0.84, 0.94], [0, 1, 1, 0]);
  const thirdY = useTransform(scrollYProgress, [0.62, 0.94], [80, -80]);

  const [activeSection, setActiveSection] = useState(1);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    let target = 1;
    if (latest >= 0.30 && latest < 0.62) {
      target = 2;
    } else if (latest >= 0.62) {
      target = 3;
    }
    setActiveSection((prev) => {
      if (prev !== target) {
        return target;
      }
      return prev;
    });
  });

  /* ── Parallax orb driven by scroll ── */
  const orbX = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const smoothOrbX = useSpring(orbX, { stiffness: 60, damping: 20 });

  /* ── Stagger entrance items ── */
  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 32, filter: "blur(12px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const } },
  };

  return (
    <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
      {/* ── Layered atmospheric overlays ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/15 to-black/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/25" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(139,92,246,0.12),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_100%,rgba(20,184,166,0.10),transparent)]" />

      {/* ── Grid + grain ── */}
      <GridLines />
      <GrainCanvas />

      {/* ── Floating orbs ── */}
      <FloatingOrbs />

      {/* ── Scroll-reactive light sweep ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(255,255,255,0.04), transparent)",
          x: smoothOrbX,
        }}
      />

      {/* ══════════════ HERO SECTION ══════════════ */}
      <motion.section
        style={{ opacity: heroOpacity, y: heroY, scale: heroScale }}
        className="absolute inset-0 flex items-center justify-center px-6"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="w-full max-w-6xl text-center"
        >
          {/* Eyebrow */}
          <motion.div variants={itemVariants} className="mb-6 flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-violet-400/70" />
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.6em] text-white/40 font-light">
              Premium Portfolio&nbsp;&nbsp;•&nbsp;&nbsp;Creative Developer
            </p>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-teal-400/70" />
          </motion.div>

          {/* Main headline — multi-colour gradient */}
          <motion.h1
            variants={itemVariants}
            className="mx-auto max-w-5xl font-black tracking-[-0.08em] leading-[0.85]"
            style={{ fontSize: "clamp(3.4rem, 12vw, 9rem)" }}
          >
            {/* "Anuj" — violet to cyan */}
            <span
              className="inline-block bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #a78bfa 0%, #818cf8 30%, #38bdf8 60%, #34d399 100%)",
              }}
            >
              Anuj
            </span>
            {/* space */}{" "}
            {/* "Kumar" — warm rose to amber */}
            <span
              className="inline-block bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #fb923c 0%, #f472b6 45%, #e879f9 80%, #c084fc 100%)",
              }}
            >
              Kumar
            </span>
          </motion.h1>

          {/* Animated role line */}
          <motion.p
            variants={itemVariants}
            className="mx-auto mt-7 max-w-2xl text-lg md:text-xl lg:text-2xl leading-relaxed font-light"
            style={{ color: "rgba(255,255,255,0.68)" }}
          >
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, rgba(255,255,255,0.9) 0%, rgba(167,139,250,0.9) 40%, rgba(94,234,212,0.9) 70%, rgba(255,255,255,0.9) 100%)",
              }}
            >
              I build luxury digital experiences with motion, clarity,
              performance &amp; modern visual storytelling.
            </span>
          </motion.p>

          {/* Tech badges */}
          <motion.div variants={itemVariants} className="mt-9 flex flex-wrap justify-center gap-2.5">
            {[
              { label: "Next.js", color: "255,255,255" },
              { label: "Framer Motion", color: "167,139,250" },
              { label: "UI Engineer", color: "94,234,212" },
              { label: "TypeScript", color: "251,191,36" },
            ].map(({ label, color }) => (
              <span
                key={label}
                className="rounded-full px-5 py-2 text-xs tracking-widest uppercase backdrop-blur-xl border font-medium"
                style={{
                  background: `rgba(${color},0.10)`,
                  borderColor: `rgba(${color},0.22)`,
                  color: `rgb(${color})`,
                  boxShadow: `0 0 24px rgba(${color},0.06)`,
                }}
              >
                {label}
              </span>
            ))}
          </motion.div>

          {/* Stats row */}
          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-wrap justify-center gap-3"
          >
            <StatPill value="10+ Projects" label="" color="167,139,250" />
            <StatPill value="Full Stack Engineer" label="" color="94,234,212" />
            <StatPill value="Freelance Ready" label="" color="251,191,36" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ══════════════ SECTION 2 ══════════════ */}
      <motion.section
        style={{ opacity: secondOpacity, y: secondY }}
        className="absolute inset-0 flex items-center justify-start px-6 md:px-16 lg:px-28"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={activeSection === 2 ? "show" : "hidden"}
          className="max-w-xl"
        >
          {/* Decorative number */}
          <motion.p
            variants={itemVariants}
            className="mb-3 text-[10px] uppercase tracking-[0.55em] font-light"
            style={{ color: "rgba(167,139,250,0.6)" }}
          >
            02&nbsp;&nbsp;/&nbsp;&nbsp;What I Create
          </motion.p>

          {/* Heading with split colours */}
          <motion.h2
            variants={itemVariants}
            className="font-black tracking-[-0.07em] leading-[0.88]"
            style={{ fontSize: "clamp(3rem, 9vw, 7.5rem)" }}
          >
            <span
              className="block bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(130deg, #f0abfc 0%, #818cf8 50%, #38bdf8 100%)",
              }}
            >
              Scroll-driven
            </span>
            <span
              className="block bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(130deg, #34d399 0%, #22d3ee 60%, #818cf8 100%)",
              }}
            >
              experiences.
            </span>
          </motion.h2>

          {/* Body */}
          <motion.p
            variants={itemVariants}
            className="mt-6 text-base md:text-lg leading-relaxed font-light text-white/60 max-w-md"
          >
            Premium websites with cinematic motion, elegant interfaces, and{" "}
            <span className="text-violet-300/90">unforgettable interactions</span>{" "}
            built for scale.
          </motion.p>

          {/* Feature list */}
          <motion.ul
            variants={itemVariants}
            className="mt-8 space-y-3"
          >
            {[
              { text: "Scroll-driven animations & parallax", accent: "167,139,250" },
              { text: "Micro-interactions & gesture UX", accent: "94,234,212" },
              { text: "60fps performant transitions", accent: "251,191,36" },
            ].map(({ text, accent }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-white/55">
                <span
                  className="h-1 w-6 rounded-full flex-shrink-0"
                  style={{ background: `rgb(${accent})` }}
                />
                {text}
              </li>
            ))}
          </motion.ul>
        </motion.div>
      </motion.section>

      {/* ══════════════ SECTION 3 ══════════════ */}
      <motion.section
        style={{ opacity: thirdOpacity, y: thirdY }}
        className="absolute inset-0 flex items-center justify-end px-6 md:px-16 lg:px-28"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={activeSection === 3 ? "show" : "hidden"}
          className="max-w-xl text-right"
        >
          {/* Decorative number */}
          <motion.p
            variants={itemVariants}
            className="mb-3 text-[10px] uppercase tracking-[0.55em] font-light"
            style={{ color: "rgba(94,234,212,0.6)" }}
          >
            03&nbsp;&nbsp;/&nbsp;&nbsp;Why Hire Me
          </motion.p>

          {/* Heading */}
          <motion.h2
            variants={itemVariants}
            className="font-black tracking-[-0.07em] leading-[0.88]"
            style={{ fontSize: "clamp(3rem, 9vw, 7.5rem)" }}
          >
            <span
              className="block bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(130deg, #fb923c 0%, #f472b6 50%, #e879f9 100%)",
              }}
            >
              Design +
            </span>
            <span
              className="block bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(130deg, #fbbf24 0%, #f87171 50%, #c084fc 100%)",
              }}
            >
              Engineering.
            </span>
          </motion.h2>

          {/* Body */}
          <motion.p
            variants={itemVariants}
            className="mt-6 ml-auto text-base md:text-lg leading-relaxed font-light text-white/60 max-w-md"
          >
            Fast, scalable, beautiful products crafted with clean code,{" "}
            <span className="text-teal-300/90">premium detail</span>, and
            senior-level execution that ships on time.
          </motion.p>

          {/* Highlights right-aligned */}
          <motion.ul
            variants={itemVariants}
            className="mt-8 space-y-3"
          >
            {[
              { text: "Clean, maintainable architecture", accent: "251,191,36" },
              { text: "Design system & component libraries", accent: "248,113,113" },
              { text: "Performance-first engineering", accent: "192,132,252" },
            ].map(({ text, accent }) => (
              <li key={text} className="flex items-center justify-end gap-3 text-sm text-white/55">
                {text}
                <span
                  className="h-1 w-6 rounded-full flex-shrink-0"
                  style={{ background: `rgb(${accent})` }}
                />
              </li>
            ))}
          </motion.ul>

          {/* CTA hint wrapper for stagger */}
          <motion.div variants={itemVariants} className="mt-10">
            <motion.div
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 backdrop-blur-xl border text-sm font-medium"
              style={{
                background: "rgba(251,191,36,0.10)",
                borderColor: "rgba(251,191,36,0.25)",
                color: "rgb(251,191,36)",
              }}
              animate={{ boxShadow: ["0 0 0px rgba(251,191,36,0)", "0 0 24px rgba(251,191,36,0.18)", "0 0 0px rgba(251,191,36,0)"] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              <span>Available for projects</span>
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ── Bottom progress bar ── */}
      <motion.div
        className="absolute bottom-0 left-0 w-full h-[2px] origin-left"
        style={{
          scaleX: scrollYProgress,
          background: "linear-gradient(90deg, #7c3aed, #06b6d4, #f43f5e, #fbbf24)",
        }}
      />
    </div>
  );
}