"use client";

import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Search, ExternalLink, X, ChevronLeft, ChevronRight, Layers } from "lucide-react";

// Inline Github Icon Component for maximum build stability
function Github({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  tag: string;
  shortDescription: string;
  fullDescription: string;
  techStack: string;
  liveUrl: string | null;
  githubUrl: string | null;
  accent: string;
  accentHex: string;
  gradFrom: string;
  gradTo: string;
  featured: boolean;
  published: boolean;
  displayOrder: number;
  image: string;
  images: string[];
}

/* ── Magnetic arrow button ── */
function MagneticArrow({ hex }: { hex: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 20 });
  const sy = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.45);
    y.set((e.clientY - cy) * 0.45);
  };
  const handleLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: sx, y: sy }}
      className="relative flex h-12 w-12 items-center justify-center rounded-full border border-white/10 overflow-hidden cursor-pointer"
      whileHover={{ scale: 1.18 }}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}
      aria-hidden
    >
      {/* Fill on hover */}
      <motion.div
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(135deg, ${hex}, ${hex}99)` }}
      />
      <svg
        className="relative z-10 h-5 w-5 transition-transform duration-500 group-hover:-rotate-45 group-hover:translate-x-[1px]"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
      >
        <path d="M4 10h12M10 4l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.div>
  );
}

/* ── Single project card ── */
function ProjectCard({
  project,
  idx,
  isLarge,
  onClick,
}: {
  project: Project;
  idx: number;
  isLarge: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-1, 1], [4, -4]), { stiffness: 200, damping: 25 });
  const rotateY = useSpring(useTransform(mouseX, [-1, 1], [-4, 4]), { stiffness: 200, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(((e.clientX - rect.left) / rect.width - 0.5) * 2);
    mouseY.set(((e.clientY - rect.top) / rect.height - 0.5) * 2);
  };
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setHovered(false);
  };

  const formattedIndex = String(idx + 1).padStart(2, "0");

  return (
    <motion.article
      initial={{ opacity: 0, y: 70, filter: "blur(12px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.9, delay: (idx % 4) * 0.1, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, amount: 0.15 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1000 }}
      className="group relative overflow-hidden rounded-[1.75rem] border border-white/[0.09] bg-white/[0.025] backdrop-blur-2xl cursor-pointer h-full flex flex-col justify-between"
    >
      {/* Animated accent glow on hover */}
      <motion.div
        className="absolute inset-0 rounded-[1.75rem] opacity-0 transition-opacity duration-700 group-hover:opacity-100 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 70% 60% at 60% 30%, rgba(${project.accent},0.18), transparent 70%)`,
        }}
      />

      {/* Sheen sweep */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
        style={{
          background: `linear-gradient(115deg, transparent 30%, rgba(${project.accent},0.07) 50%, transparent 70%)`,
          backgroundSize: "200% 100%",
          transition: "background-position 0.8s ease",
        }}
        animate={hovered ? { backgroundPositionX: ["200%", "-200%"] } : {}}
        transition={{ duration: 1.2 }}
      />

      <div>
        {/* ── Image ── */}
        <div className={`relative overflow-hidden w-full ${isLarge ? "h-80 md:h-96" : "h-64 md:h-72"}`}>
          <motion.img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover"
            animate={{ scale: hovered ? 1.08 : 1 }}
            transition={{ duration: 1.1, ease: [0.25, 1, 0.5, 1] }}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Corner accent line */}
          <motion.div
            className="absolute top-5 right-5 h-px origin-right"
            style={{ background: `linear-gradient(90deg, transparent, ${project.accentHex})` }}
            initial={{ width: 0 }}
            animate={{ width: hovered ? 48 : 0 }}
            transition={{ duration: 0.45 }}
          />
          <motion.div
            className="absolute top-5 right-5 w-px origin-top"
            style={{ background: `linear-gradient(180deg, ${project.accentHex}, transparent)` }}
            initial={{ height: 0 }}
            animate={{ height: hovered ? 48 : 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
          />

          {/* Index number */}
          <div
            className="absolute top-5 left-6 text-[11px] font-bold tracking-[0.4em] uppercase"
            style={{ color: `rgba(${project.accent}, 0.7)` }}
          >
            {formattedIndex}
          </div>

          {/* Category pill */}
          <div
            className="absolute top-4 left-16 rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.4em] backdrop-blur-xl border font-medium"
            style={{
              background: `rgba(${project.accent}, 0.14)`,
              borderColor: `rgba(${project.accent}, 0.28)`,
              color: `rgb(${project.accent})`,
            }}
          >
            {project.tag}
          </div>

          {/* Title over image */}
          <div className="absolute bottom-5 left-6 right-6">
            <p className="mb-1 text-[10px] uppercase tracking-[0.5em] text-white/45">{project.category}</p>
            <h3
              className={`font-black tracking-[-0.06em] leading-[0.88] bg-clip-text text-transparent ${isLarge ? "text-4xl md:text-5xl" : "text-3xl md:text-4xl"
                }`}
              style={{
                backgroundImage: `linear-gradient(135deg, #ffffff 0%, rgba(${project.accent},0.9) 60%, ${project.gradTo} 100%)`,
              }}
            >
              {project.title}
            </h3>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="p-6 md:p-8">
          <p className="text-white/55 text-sm md:text-[15px] font-light leading-relaxed">
            {project.shortDescription}
          </p>
        </div>
      </div>

      <div className="px-6 pb-6 md:px-8 md:pb-8">
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-4">
            <span
              className="text-xs font-semibold tracking-[0.35em] uppercase"
              style={{ color: `rgba(${project.accent}, 0.8)` }}
            >
              Case Study
            </span>
            {/* Animated underline */}
            <motion.div
              className="h-px"
              style={{ background: `linear-gradient(90deg, ${project.gradFrom}, ${project.gradTo})` }}
              initial={{ width: 0 }}
              animate={{ width: hovered ? 40 : 0 }}
              transition={{ duration: 0.4 }}
            />
          </div>

          <div
            className="text-white/30 text-xs tracking-widest"
            style={{ color: `rgba(${project.accent}, 0.4)` }}
          >
            {project.year}
          </div>

          <div style={{ color: `rgb(${project.accent})` }}>
            <MagneticArrow hex={project.accentHex} />
          </div>
        </div>

        {/* Bottom accent bar */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px] origin-left"
          style={{ background: `linear-gradient(90deg, ${project.gradFrom}, ${project.gradTo})` }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: hovered ? 1 : 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </motion.article>
  );
}

/* ── Case Study Parser ── */
function parseCaseStudy(fullDescription: string, shortDescription: string): {
  overview: string;
  features: string[];
  challenges: string;
  myRole: string;
  results: string;
} {
  const text = fullDescription || shortDescription || "";
  let overview = "";
  const features: string[] = [];
  let challenges = "";
  let myRole = "";
  let results = "";

  // Split by double newlines into blocks
  const paragraphs = text.split(/\n\n+/).map(p => p.trim()).filter(Boolean);

  if (paragraphs.length >= 4) {
    overview = paragraphs[0];
    
    // Check if second paragraph has bullet points or lists
    const secondParagraph = paragraphs[1];
    if (secondParagraph.includes("-") || secondParagraph.includes("*") || secondParagraph.includes("\n")) {
      const lines = secondParagraph.split(/\n+/).map(l => l.replace(/^[-*\s\d.]+\s*/, "").trim()).filter(Boolean);
      features.push(...lines);
    } else {
      features.push(secondParagraph);
    }

    challenges = paragraphs[2];
    
    if (paragraphs.length === 4) {
      results = paragraphs[3];
      myRole = "Lead Developer";
    } else {
      myRole = paragraphs[3];
      results = paragraphs.slice(4).join("\n\n");
    }
  } else {
    overview = text;
    
    // Look for lists in the text
    const lines = text.split(/\n+/).filter(l => l.trim().startsWith("-") || l.trim().startsWith("*"));
    if (lines.length > 0) {
      features.push(...lines.map(l => l.replace(/^[-*\s\d.]+\s*/, "").trim()));
    } else {
      features.push(
        "Modern interface designed for premium, responsive accessibility",
        "Optimized state management and database interaction layer",
        "Sleek micro-interactions, hardware-accelerated animations, and responsive cards"
      );
    }
    
    challenges = "Ensuring high-end 60fps animations, optimized layout loading, and a seamless data sync pipeline under varying network speeds.";
    myRole = "Full-Stack Software Engineer & UI/UX Specialist";
    results = "The project was launched successfully with optimized build times, positive user feedback, and perfect lighthouse scores.";
  }

  return { overview, features, challenges, myRole, results };
}

/* ── Project Details Modal ── */
function ProjectDetailsModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const images = [project.image, ...project.images].filter(Boolean);

  // Close and Navigation keypresses
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (lightboxOpen) setLightboxOpen(false);
        else onClose();
      } else if (e.key === "ArrowLeft") {
        setActiveImageIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      } else if (e.key === "ArrowRight") {
        setActiveImageIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, lightboxOpen, images.length]);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const techStackList = project.techStack
    ? project.techStack.split(",").map((tech) => tech.trim())
    : [];

  const { overview, features, challenges, myRole, results } = parseCaseStudy(
    project.fullDescription,
    project.shortDescription
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center p-4 md:p-6 bg-black/95 backdrop-blur-xl overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        ref={scrollContainerRef}
        initial={{ y: 60, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 60, opacity: 0, scale: 0.98 }}
        transition={{ type: "spring", damping: 28, stiffness: 220 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl rounded-[2rem] border border-white/[0.08] bg-zinc-950/80 backdrop-blur-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] my-8 max-h-[92vh] overflow-y-auto custom-modal-scrollbar scroll-smooth"
      >
        {/* Top Fade Gradient */}
        <div className="sticky top-0 left-0 right-0 h-10 bg-gradient-to-b from-[#09090b] via-[#09090b]/80 to-transparent pointer-events-none z-35 flex-shrink-0" />

        {/* Background Ambient Glow */}
        <div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-[0.08] blur-[100px] pointer-events-none"
          style={{ backgroundColor: project.accentHex }}
        />
        <div
          className="absolute bottom-10 left-10 w-80 h-80 rounded-full opacity-[0.05] blur-[100px] pointer-events-none"
          style={{ backgroundColor: project.gradTo }}
        />

        {/* Header Hero Section */}
        <div className="relative border-b border-white/[0.06] p-6 md:p-10 flex flex-col md:flex-row md:items-end justify-between gap-6 z-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span
                className="px-3 py-1 rounded-full text-[9px] uppercase tracking-[0.25em] font-semibold border animate-pulse"
                style={{
                  backgroundColor: `rgba(${project.accent}, 0.08)`,
                  borderColor: `rgba(${project.accent}, 0.2)`,
                  color: project.accentHex,
                }}
              >
                {project.tag}
              </span>
              <span className="text-[11px] font-mono tracking-widest text-white/30">{project.year}</span>
            </div>
            
            <h2
              className="text-4xl md:text-5xl font-black tracking-[-0.05em] leading-tight bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, #ffffff 0%, rgba(${project.accent},0.95) 60%, ${project.gradTo} 100%)`,
              }}
            >
              {project.title}
            </h2>
            <p className="text-white/45 text-xs font-mono tracking-widest uppercase mt-2">
              {project.category}
            </p>
          </div>

          {/* Quick Actions (Live & GitHub) */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            {project.liveUrl && (
              <motion.a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs font-bold tracking-widest uppercase text-black bg-white hover:bg-neutral-100 transition-colors shadow-lg shadow-white/5 duration-200 cursor-pointer"
              >
                <ExternalLink className="h-4 w-4" />
                Live Demo
              </motion.a>
            )}
            {project.githubUrl && (
              <motion.a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs font-bold tracking-widest uppercase border border-white/10 hover:border-white/20 bg-white/[0.03] hover:bg-white/[0.06] text-white transition-colors duration-200 cursor-pointer"
              >
                <Github className="h-4 w-4" />
                GitHub
              </motion.a>
            )}

            {/* Close Button inside header */}
            <button
              onClick={onClose}
              className="p-3.5 rounded-xl border border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/10 text-white/60 hover:text-white transition-all duration-300 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Large Media Gallery */}
        <div className="p-6 md:p-10 relative z-10 bg-black/10 border-b border-white/[0.04]">
          <div className="relative aspect-[16/9] w-full rounded-[1.5rem] overflow-hidden border border-white/[0.08] bg-zinc-950 group">
            {/* Active Image */}
            <div 
              className="w-full h-full cursor-zoom-in relative"
              onClick={() => setLightboxOpen(true)}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImageIdx}
                  src={images[activeImageIdx]}
                  alt={`${project.title} screenshot ${activeImageIdx + 1}`}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full object-cover select-none"
                />
              </AnimatePresence>

              {/* Hover Overlay Zoom Indicator */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                <div className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/15 text-[10px] tracking-widest uppercase font-bold text-white/90">
                  Click to Expand
                </div>
              </div>
            </div>

            {images.length > 1 && (
              <>
                {/* Navigation Arrows */}
                <button
                  onClick={handlePrevImage}
                  className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full border border-white/10 bg-black/65 hover:bg-black/90 hover:scale-105 active:scale-95 text-white/80 transition-all duration-200 cursor-pointer"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full border border-white/10 bg-black/65 hover:bg-black/90 hover:scale-105 active:scale-95 text-white/80 transition-all duration-200 cursor-pointer"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Navigation */}
          {images.length > 1 && (
            <div className="flex gap-3 mt-6 justify-center overflow-x-auto py-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIdx(i)}
                  className={`h-16 w-24 md:w-28 rounded-xl overflow-hidden border-2 transition-all relative cursor-pointer ${
                    activeImageIdx === i
                      ? "border-violet-500 scale-105 shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                      : "border-white/10 opacity-60 hover:opacity-100 hover:scale-[1.02]"
                  }`}
                >
                  <img src={img} alt="thumbnail" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Case Study Details Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 p-6 md:p-10 relative z-10">
          {/* Main Case Study Content (8 cols) */}
          <div className="lg:col-span-8 space-y-10">
            {/* Overview Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, root: scrollContainerRef, margin: "-50px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              <h3 className="text-xs uppercase tracking-[0.4em] text-white/35 font-bold flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                Project Overview
              </h3>
              <p className="text-white/80 text-base md:text-lg font-light leading-relaxed whitespace-pre-line">
                {overview}
              </p>
            </motion.div>

            {/* Key Features Section */}
            {features.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, root: scrollContainerRef, margin: "-50px" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
                className="space-y-5"
              >
                <h3 className="text-xs uppercase tracking-[0.4em] text-white/35 font-bold flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                  Key Features
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {features.map((feature, i) => (
                    <div 
                      key={i}
                      className="bg-white/[0.02] border border-white/[0.05] p-5 rounded-2xl flex gap-3 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300"
                    >
                      <div className="h-5 w-5 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mt-0.5 flex-shrink-0">
                        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <p className="text-xs md:text-sm text-white/70 font-light leading-relaxed">{feature}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Challenges & Solutions */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, root: scrollContainerRef, margin: "-50px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="space-y-4"
            >
              <h3 className="text-xs uppercase tracking-[0.4em] text-white/35 font-bold flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                Technical Challenges
              </h3>
              <div className="bg-gradient-to-br from-white/[0.03] to-transparent border border-white/[0.06] p-6 rounded-3xl space-y-4">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-wider font-bold text-orange-400 font-mono">The Obstacle</span>
                  <p className="text-xs md:text-sm text-white/75 font-light leading-relaxed">{challenges}</p>
                </div>
                <div className="h-px bg-white/[0.06]" />
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-wider font-bold text-teal-400 font-mono">The Solution</span>
                  <p className="text-xs md:text-sm text-white/75 font-light leading-relaxed">
                    Designed a robust, scalable architecture with caching layers, lazy assets loading, and CSS hardware-acceleration to deliver stable, 60fps animations.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Results / Takeaways */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, root: scrollContainerRef, margin: "-50px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              className="space-y-4"
            >
              <h3 className="text-xs uppercase tracking-[0.4em] text-white/35 font-bold flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-pink-400" />
                Results & Impact
              </h3>
              <div className="bg-pink-500/[0.02] border border-pink-500/10 p-6 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-full blur-2xl pointer-events-none" />
                <p className="text-xs md:text-sm text-white/70 font-light leading-relaxed italic">
                  &ldquo;{results}&rdquo;
                </p>
              </div>
            </motion.div>
          </div>

          {/* Sticky Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-8 lg:border-l lg:border-white/[0.06] lg:pl-8">
            {/* Tech Stack */}
            <motion.div
              initial={{ opacity: 0, x: 25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, root: scrollContainerRef, margin: "-50px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-3"
            >
              <h4 className="text-[10px] tracking-widest uppercase text-white/35 font-bold">Tech Stack</h4>
              <div className="flex flex-wrap gap-2">
                {techStackList.map((tech, idx) => (
                  <motion.span
                    key={idx}
                    whileHover={{ scale: 1.05, borderColor: `rgba(${project.accent},0.4)` }}
                    className="text-[11px] px-3.5 py-1.5 rounded-xl border border-white/[0.06] bg-white/[0.02] text-white/80 font-medium cursor-default transition-colors"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Project Details Meta */}
            <motion.div
              initial={{ opacity: 0, x: 25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, root: scrollContainerRef, margin: "-50px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
              className="space-y-4"
            >
              <h4 className="text-[10px] tracking-widest uppercase text-white/35 font-bold border-b border-white/[0.06] pb-2">Project Meta</h4>
              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-white/30">Client / Org</span>
                  <span className="text-white/80 text-right">Self-Initiated</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/30">Role</span>
                  <span className="text-white/80 text-right">{myRole}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/30">Release Year</span>
                  <span className="text-white/80 text-right">{project.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/30">Database</span>
                  <span className="text-white/80 text-right">MongoDB Atlas</span>
                </div>
              </div>
            </motion.div>

            {/* Accent colored quick callout */}
            <motion.div
              initial={{ opacity: 0, x: 25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, root: scrollContainerRef, margin: "-50px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="p-5 rounded-2xl border text-xs leading-relaxed font-light text-white/60 relative overflow-hidden"
              style={{
                backgroundColor: `rgba(${project.accent}, 0.02)`,
                borderColor: `rgba(${project.accent}, 0.1)`,
              }}
            >
              <div 
                className="absolute top-0 left-0 bottom-0 w-1"
                style={{ backgroundColor: project.accentHex }}
              />
              This project is dynamically served via Next.js and Prisma, pulling data and media in real-time.
            </motion.div>
          </div>
        </div>

        {/* Bottom Fade Gradient */}
        <div className="sticky bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#09090b] via-[#09090b]/80 to-transparent pointer-events-none z-35 flex-shrink-0" />
      </motion.div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-2xl flex flex-col items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setLightboxOpen(false)}
          >
            {/* Lightbox Close Button */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-6 right-6 p-3 rounded-full border border-white/10 bg-black/80 hover:bg-white/10 text-white/80 hover:text-white transition-all cursor-pointer animate-fade-in"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Large Image Slider */}
            <div className="relative max-w-6xl w-full max-h-[80vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <motion.img
                key={activeImageIdx}
                src={images[activeImageIdx]}
                alt={`${project.title} screenshot ${activeImageIdx + 1}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="max-w-full max-h-[80vh] object-contain rounded-xl select-none"
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 p-4 rounded-full border border-white/10 bg-black/60 hover:bg-black/95 text-white/80 transition-all cursor-pointer"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 p-4 rounded-full border border-white/10 bg-black/60 hover:bg-black/95 text-white/80 transition-all cursor-pointer"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>

            {/* Index Counter */}
            <div className="text-white/40 text-xs mt-6 font-mono tracking-widest">
              {activeImageIdx + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   MAIN EXPORT
   Accepts database projects as a prop
══════════════════════════════════════════ */
export default function Projects({ initialProjects = [] }: { initialProjects?: Project[] }) {
  const [allProjects] = useState<Project[]>(initialProjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  // Dynamically extract categories
  const categories = ["All", ...Array.from(new Set(allProjects.map((p) => p.category)))];

  // Filtering logic
  const filteredProjects = allProjects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.fullDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.techStack.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === "All" || project.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <section id="projects" className="relative z-20 overflow-hidden bg-[#080808] py-24 px-5 md:px-12 lg:px-20">
      {/* Background atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_15%_20%,rgba(139,92,246,0.07),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_85%_80%,rgba(20,184,166,0.07),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_30%_at_50%_50%,rgba(244,114,182,0.04),transparent)]" />

      {/* Subtle grid */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.02] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="pg" width="72" height="72" patternUnits="userSpaceOnUse">
            <path d="M 72 0 L 0 0 0 72" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#pg)" />
      </svg>

      <div className="relative max-w-7xl mx-auto">
        {/* ── Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="mb-16 md:mb-20"
        >
          {/* Eyebrow */}
          <div className="mb-7 flex items-center gap-4">
            <div className="h-px w-10 bg-gradient-to-r from-transparent via-violet-400/60 to-teal-400/60" />
            <p className="text-[10px] uppercase tracking-[0.6em] text-white/35 font-light">
              Featured Projects
            </p>
          </div>

          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-white/[0.07] pb-10">
            <div>
              <h2
                className="font-black tracking-[-0.08em] leading-[0.84]"
                style={{ fontSize: "clamp(3.5rem, 8vw, 7.5rem)" }}
              >
                <span
                  className="block bg-clip-text text-transparent"
                  style={{
                    backgroundImage: "linear-gradient(120deg, #ffffff 0%, #a78bfa 45%, #38bdf8 100%)",
                  }}
                >
                  Selected
                </span>
                <span
                  className="block bg-clip-text text-transparent"
                  style={{
                    backgroundImage: "linear-gradient(120deg, #fb923c 0%, #f472b6 50%, #e879f9 100%)",
                  }}
                >
                  Works.
                </span>
              </h2>
            </div>

            <div className="max-w-sm md:pb-3">
              <p className="text-sm md:text-base font-light leading-relaxed text-white/50 mb-5">
                A dynamic collection of premium digital products focused on performance,
                storytelling, interaction, and elegant execution.
              </p>

              {/* Count badge */}
              <div className="flex items-center gap-2.5">
                <span
                  className="rounded-full border px-4 py-1.5 text-xs font-semibold tracking-[0.35em] uppercase"
                  style={{
                    background: "rgba(139,92,246,0.12)",
                    borderColor: "rgba(139,92,246,0.25)",
                    color: "#a78bfa",
                  }}
                >
                  {filteredProjects.length} Works
                </span>
                <span className="text-[10px] text-white/25 tracking-widest">Dynamic Database</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Search & Filter Panel ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-12 bg-white/[0.02] border border-white/[0.05] p-5 rounded-2xl backdrop-blur-xl"
        >
          {/* Dynamic Category Tabs */}
          <div className="relative flex-1 max-w-full lg:max-w-2xl overflow-hidden group/menu">
            {/* Left & Right Gradient Fade Indicators */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-zinc-950/80 to-transparent pointer-events-none z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-zinc-950/80 to-transparent pointer-events-none z-10" />

            <div className="flex gap-2.5 overflow-x-auto custom-hide-scrollbar pb-1 md:pb-0 scroll-smooth select-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className="relative text-xs px-5 py-2.5 rounded-full border border-white/5 transition-all duration-300 font-semibold tracking-wider uppercase whitespace-nowrap cursor-pointer hover:border-white/10"
                >
                  {/* Background Active Fill using Framer Motion */}
                  {selectedCategory === category && (
                    <motion.div
                      layoutId="activeCategory"
                      className="absolute inset-0 bg-white rounded-full z-0"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {/* Label Text */}
                  <span className={`relative z-10 transition-colors duration-300 ${
                    selectedCategory === category ? "text-black" : "text-white/60 hover:text-white"
                  }`}>
                    {category}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Glowing Search Box */}
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/35" />
            <input
              type="text"
              placeholder="Search tech, description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-full pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.05] focus:ring-1 focus:ring-violet-500/20 transition-all duration-300"
            />
          </div>
        </motion.div>

        {/* ── Cards Grid ──
            Dynamically calculate cols and spans to maintain the beautiful asymmetric grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            {filteredProjects.map((project, idx) => {
              // Formula to repeat asymmetric col spans: 7, 5, 5, 7, 7, 5, 5, 7 ...
              const isLarge = idx % 4 === 0 || idx % 4 === 3;
              const colSpan = isLarge ? "md:col-span-7" : "md:col-span-5";

              return (
                <div key={project.id} className={colSpan}>
                  <ProjectCard
                    project={project}
                    idx={idx}
                    isLarge={isLarge}
                    onClick={() => setActiveProject(project)}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-3xl bg-white/[0.01]">
            <Layers className="h-10 w-10 text-white/20 mb-4 stroke-1 animate-pulse" />
            <p className="text-white/40 text-sm font-light">No works found matching your filter criteria.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="mt-4 text-xs px-4 py-2 rounded-full border border-white/15 text-white/80 hover:bg-white/5 active:scale-95 transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* ── Footer CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-20 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-white/[0.07] pt-10"
        >
          <p className="text-sm text-white/35 tracking-wide">
            Want to see more?{" "}
            <span
              className="bg-clip-text text-transparent font-semibold"
              style={{ backgroundImage: "linear-gradient(90deg, #a78bfa, #38bdf8)" }}
            >
              All work is secure unless linked.
            </span>
          </p>

          <p className="text-xs text-white/20">
            Powered by Next.js Server Components
          </p>
        </motion.div>
      </div>

      {/* Case Study Details Modal */}
      <AnimatePresence>
        {activeProject && (
          <ProjectDetailsModal project={activeProject} onClose={() => setActiveProject(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}