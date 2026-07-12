"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const educationDetails = [
  {
    degree: "B.Tech in Computer Science",
    institution: "GLA University",
    period: "2022 — 2026",
    description: "Pursuing a Bachelor of Technology with a focus on modern software development, computer science fundamentals, and advanced web technologies.",
    accent: "139,92,246", // violet
  },
  {
    degree: "Intermediate",
    institution: "ABS College",
    period: "Completed",
    description: "Completed higher secondary education with a strong foundation in mathematics and sciences, preparing for a rigorous technical career.",
    accent: "20,184,166", // teal
  },
  {
    degree: "10th Standard",
    institution: "St. Michael's School",
    period: "Completed",
    description: "Completed primary and secondary education with excellent academic standing, building strong analytical and problem-solving skills.",
    accent: "244,114,182", // pink
  },
];

export default function Education() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const lineProgress = useTransform(scrollYProgress, [0.2, 0.8], ["0%", "100%"]);

  return (
    <section id="education" ref={containerRef} className="relative z-20 overflow-hidden bg-[#0a0a0a] py-32 px-5 md:px-12 lg:px-20 border-t border-white/[0.05]">
      {/* Background Orbs */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_40%,rgba(139,92,246,0.05),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_20%_60%,rgba(244,114,182,0.05),transparent)] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="mb-20 text-center"
        >
          <div className="mb-6 flex items-center justify-center gap-3">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-violet-400/50" />
            <p className="text-[10px] uppercase tracking-[0.5em] text-white/40 font-light">
              Academic Background
            </p>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-pink-400/50" />
          </div>
          
          <h2
            className="font-black tracking-[-0.06em] leading-tight"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
          >
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(135deg, #ffffff 0%, #a78bfa 50%, #f472b6 100%)",
              }}
            >
              Education
            </span>
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-white/[0.05] -translate-x-1/2" />
          
          {/* Animated Line Progress */}
          <motion.div 
            className="absolute left-4 md:left-1/2 top-0 w-[2px] -translate-x-1/2 origin-top"
            style={{ 
              height: lineProgress,
              background: "linear-gradient(180deg, #8b5cf6, #14b8a6, #f472b6)"
            }}
          />

          <div className="space-y-16 md:space-y-24">
            {educationDetails.map((edu, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                viewport={{ once: true, amount: 0.1 }}
                className={`relative flex flex-col md:flex-row gap-8 md:gap-16 items-start ${
                  idx % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-4 md:left-1/2 top-2 -translate-x-1/2 flex items-center justify-center">
                  <div className="h-4 w-4 rounded-full bg-[#0a0a0a] border-2 border-white/20 z-10" />
                  <motion.div
                    className="absolute h-4 w-4 rounded-full opacity-50 blur-[4px]"
                    style={{ background: `rgb(${edu.accent})` }}
                  />
                </div>

                {/* Content Side */}
                <div className="w-full md:w-1/2 pl-12 md:pl-0 flex flex-col">
                  <div className={`p-6 md:p-8 rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl ${
                    idx % 2 === 0 ? "md:ml-12" : "md:mr-12"
                  } relative overflow-hidden group hover:bg-white/[0.04] transition-colors duration-500`}>
                    
                    {/* Hover Glow */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at ${idx % 2 === 0 ? '0%' : '100%'} 0%, rgba(${edu.accent},0.15), transparent 70%)`
                      }}
                    />

                    <div className="relative z-10">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                        <div>
                          <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white/90">
                            {edu.degree}
                          </h3>
                          <p className="text-sm font-medium tracking-wide mt-1" style={{ color: `rgb(${edu.accent})` }}>
                            {edu.institution}
                          </p>
                        </div>
                        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs tracking-widest text-white/50 w-fit">
                          {edu.period}
                        </span>
                      </div>
                      <p className="text-sm md:text-base text-white/60 leading-relaxed font-light">
                        {edu.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Empty side for layout */}
                <div className="hidden md:block md:w-1/2" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
