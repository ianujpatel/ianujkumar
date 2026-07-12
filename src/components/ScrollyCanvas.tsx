"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useScroll, useSpring, motion, AnimatePresence } from "framer-motion";
import Overlay from "./Overlay";

const FRAME_COUNT = 80;
const BG = "#080808";

/* ── Animated loader digits ── */
function LoadingScreen({ progress }: { progress: number }) {
  return (
    <motion.div
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#080808]"
      exit={{ opacity: 0, scale: 1.04, filter: "blur(18px)" }}
      transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* Grain overlay */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_50%,rgba(139,92,246,0.08),transparent)]" />

      <div className="relative flex flex-col items-center gap-10">
        {/* Logo / name mark */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-3"
        >
          {/* Animated SVG monogram */}
          <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
            <motion.path
              d="M6 46 L26 6 L46 46"
              stroke="url(#lg1)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />
            <motion.path
              d="M13 32 L39 32"
              stroke="url(#lg2)"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.9, ease: "easeInOut" }}
            />
            <defs>
              <linearGradient id="lg1" x1="6" y1="46" x2="46" y2="46" gradientUnits="userSpaceOnUse">
                <stop stopColor="#8b5cf6" />
                <stop offset="1" stopColor="#06b6d4" />
              </linearGradient>
              <linearGradient id="lg2" x1="13" y1="32" x2="39" y2="32" gradientUnits="userSpaceOnUse">
                <stop stopColor="#f472b6" />
                <stop offset="1" stopColor="#fb923c" />
              </linearGradient>
            </defs>
          </svg>

          <motion.p
            className="text-[10px] uppercase tracking-[0.7em] text-white/30 font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Anuj Kumar
          </motion.p>
        </motion.div>

        {/* Progress counter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center gap-4"
        >
          {/* Big number */}
          <div className="relative tabular-nums font-black tracking-[-0.06em] leading-none select-none"
            style={{ fontSize: "clamp(5rem, 18vw, 9rem)" }}>
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(135deg, #ffffff 0%, rgba(139,92,246,0.9) 50%, rgba(20,184,166,0.9) 100%)",
              }}
            >
              {String(Math.floor(progress)).padStart(2, "0")}
            </span>
            <span className="absolute bottom-3 right-0 translate-x-full text-[1.2rem] text-white/20 font-light tracking-normal pl-1">%</span>
          </div>

          {/* Progress bar */}
          <div className="relative w-48 h-px bg-white/10 overflow-hidden rounded-full">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #7c3aed, #06b6d4, #f472b6)",
              }}
              transition={{ ease: "linear" }}
            />
            {/* Shimmer */}
            <motion.div
              className="absolute inset-y-0 w-16 rounded-full"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                left: `${progress - 20}%`,
              }}
            />
          </div>

          <p className="text-[10px] uppercase tracking-[0.55em] text-white/25 font-light">
            Loading Experience
          </p>
        </motion.div>

        {/* Decorative dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-1 w-1 rounded-full"
              style={{ background: i === 0 ? "#8b5cf6" : i === 1 ? "#06b6d4" : "#f472b6" }}
              animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Scroll hint arrow ── */
function ScrollHint({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 pointer-events-none"
        >
          <p className="text-[9px] uppercase tracking-[0.6em] text-white/30">Scroll</p>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg width="16" height="22" viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="1" width="14" height="20" rx="7" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              <motion.circle
                cx="8" cy="6" r="2"
                fill="rgba(139,92,246,0.8)"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              />
            </svg>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Frame progress indicator (top bar) ── */
function TopProgressBar({ progress }: { progress: number }) {
  return (
    <div className="absolute top-0 left-0 right-0 z-30 h-[2px] pointer-events-none">
      <motion.div
        className="h-full origin-left"
        style={{
          scaleX: progress / 100,
          background: "linear-gradient(90deg, #7c3aed 0%, #06b6d4 40%, #f472b6 70%, #fb923c 100%)",
        }}
      />
    </div>
  );
}

/* ── Corner frame counter ── */
function FrameCounter({ frame, total }: { frame: number; total: number }) {
  return (
    <div className="absolute top-5 right-6 z-30 flex items-center gap-2 pointer-events-none select-none">
      <span className="text-[10px] tabular-nums font-bold tracking-[0.3em]"
        style={{ color: "rgba(139,92,246,0.7)" }}>
        {String(frame + 1).padStart(2, "0")}
      </span>
      <div className="h-px w-6 bg-white/15" />
      <span className="text-[10px] tabular-nums tracking-[0.3em] text-white/20">
        {String(total).padStart(2, "0")}
      </span>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export default function ScrollyCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [currentFrame, setCurrentFrame] = useState(0);

  const animationRef = useRef<number>();
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const lastFrame = useRef(-1);

  /* ── Scroll progress ── */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.25,
  });

  /* ── PRELOAD with progress tracking ── */
  useEffect(() => {
    let loaded = 0;

    const frameImages = Array.from({ length: FRAME_COUNT }, (_, i) => {
      const img = new Image();
      img.decoding = "async";
      const index = i.toString().padStart(2, "0");
      img.src = `/sequence/frame_${index}_delay-0.062s.png`;

      img.onload = () => {
        loaded += 1;
        setLoadProgress(Math.round((loaded / FRAME_COUNT) * 100));
        if (loaded === FRAME_COUNT) {
          setIsLoaded(true);
          /* Small delay so the 100% state is visible before exit */
          setTimeout(() => setShowLoader(false), 650);
        }
      };

      img.onerror = () => {
        loaded += 1;
        setLoadProgress(Math.round((loaded / FRAME_COUNT) * 100));
        if (loaded === FRAME_COUNT) {
          setIsLoaded(true);
          setTimeout(() => setShowLoader(false), 650);
        }
      };

      return img;
    });

    setImages(frameImages);
  }, []);

  /* ── CANVAS SETUP ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
    if (!ctx) return;
    contextRef.current = ctx;

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      lastFrame.current = -1;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  /* ── DRAW ── */
  const drawCover = useCallback(
    (ctx: CanvasRenderingContext2D, img: HTMLImageElement, w: number, h: number) => {
      const scale = Math.max(w / img.width, h / img.height);
      const rw = img.width * scale;
      const rh = img.height * scale;
      ctx.drawImage(img, (w - rw) / 2, (h - rh) / 2, rw, rh);
    },
    []
  );

  const drawFrame = useCallback(
    (index: number) => {
      const canvas = canvasRef.current;
      const ctx = contextRef.current;
      const img = images[index];
      if (!canvas || !ctx || !img?.complete) return;

      const vw = window.innerWidth;
      const vh = window.innerHeight;

      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, vw, vh);
      drawCover(ctx, img, vw, vh);
    },
    [images, drawCover]
  );

  /* ── RENDER LOOP ── */
  useEffect(() => {
    if (!isLoaded || images.length === 0) return;

    const unsubscribe = smoothProgress.on("change", (progress) => {
      const frame = Math.min(
        FRAME_COUNT - 1,
        Math.max(0, Math.round(progress * (FRAME_COUNT - 1)))
      );

      if (frame === lastFrame.current) return;

      cancelAnimationFrame(animationRef.current!);
      animationRef.current = requestAnimationFrame(() => {
        drawFrame(frame);
        lastFrame.current = frame;
        setCurrentFrame(frame);
      });
    });

    drawFrame(0);

    return () => {
      unsubscribe();
      cancelAnimationFrame(animationRef.current!);
    };
  }, [images, isLoaded, smoothProgress, drawFrame]);

  return (
    <section
      ref={containerRef}
      className="relative h-[500vh] w-full"
      style={{ background: BG }}
    >
      <div id="about" className="absolute left-0 w-full pointer-events-none" style={{ top: "120vh", height: "128vh" }} />
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* ── Canvas ── */}
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        {/* ── Layered atmospheric overlays ── */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/55 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/15 pointer-events-none" />

        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 55%, rgba(0,0,0,0.65) 100%)",
          }}
        />

        {/* ── Top progress bar ── */}
        {!showLoader && (
          <TopProgressBar progress={loadProgress} />
        )}

        {/* ── Frame counter ── */}
        {!showLoader && (
          <FrameCounter frame={currentFrame} total={FRAME_COUNT} />
        )}

        {/* ── Scroll hint (only at top) ── */}
        <ScrollHint visible={!showLoader && currentFrame < 3} />

        {/* ── Cinematic loading screen ── */}
        <AnimatePresence>
          {showLoader && <LoadingScreen progress={loadProgress} />}
        </AnimatePresence>

        {/* ── Text Overlay ── */}
        {!showLoader && <Overlay scrollYProgress={smoothProgress} />}
      </div>
    </section>
  );
}