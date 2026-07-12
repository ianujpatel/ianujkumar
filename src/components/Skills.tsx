"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const skillCategories = [
  {
    title: "Frontend Development",
    accent: "139,92,246", // violet
    skills: [
      "HTML5", "CSS3", "JavaScript", "TypeScript", 
      "React.js", "Next.js", "Tailwind CSS", "Responsive Design"
    ]
  },
  {
    title: "Backend Development",
    accent: "20,184,166", // teal
    skills: [
      "Node.js", "Express.js", "REST APIs", "Authentication"
    ]
  },
  {
    title: "Programming Languages",
    accent: "244,114,182", // pink
    skills: [
      "JavaScript", "TypeScript", "Python", "Java", "C++"
    ]
  },
  {
    title: "Database & Tools",
    accent: "251,146,60", // orange
    skills: [
      "MongoDB", "MySQL", "Git", "GitHub", "VS Code", "Postman"
    ]
  },
  {
    title: "UI / Design",
    accent: "56,189,248", // sky blue
    skills: [
      "Figma", "UI/UX Basics", "Modern Web Design", "Animation Libraries"
    ]
  },
  {
    title: "Other Skills",
    accent: "99,102,241", // indigo
    skills: [
      "Problem Solving", "Debugging", "SEO Basics", "Performance Optimization", "Freelancing / Client Communication"
    ]
  }
];

export default function Skills() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section id="skills" ref={containerRef} className="relative z-20 overflow-hidden bg-[#0a0a0a] py-32 px-5 md:px-12 lg:px-20 border-t border-white/[0.05]">
      {/* Background Atmosphere */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{ y: backgroundY }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_80%_20%,rgba(139,92,246,0.06),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_20%_80%,rgba(20,184,166,0.06),transparent)]" />
      </motion.div>

      <div className="relative max-w-7xl mx-auto">
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
              Expertise
            </p>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-teal-400/50" />
          </div>
          
          <h2
            className="font-black tracking-[-0.06em] leading-tight"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
          >
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(135deg, #ffffff 0%, #a78bfa 50%, #38bdf8 100%)",
              }}
            >
              Technical Arsenal
            </span>
          </h2>
          <p className="mt-6 text-sm md:text-base font-light text-white/50 max-w-2xl mx-auto">
            A comprehensive overview of my technical skills, tools, and technologies 
            I use to build premium digital experiences.
          </p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {skillCategories.map((category, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, amount: 0.1 }}
              className="group relative flex flex-col p-8 rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl overflow-hidden hover:bg-white/[0.04] transition-colors duration-500"
            >
              {/* Hover Glow */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 50% 0%, rgba(${category.accent},0.15), transparent 70%)`
                }}
              />
              
              {/* Top Accent Line */}
              <div 
                className="absolute top-0 left-0 w-full h-[2px] opacity-40 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(90deg, transparent, rgb(${category.accent}), transparent)`
                }}
              />

              <div className="relative z-10 flex-grow">
                <h3 className="text-xl font-bold tracking-tight text-white/90 mb-6 flex items-center gap-3">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ 
                      backgroundColor: `rgb(${category.accent})`,
                      boxShadow: `0 0 10px rgba(${category.accent}, 0.8)` 
                    }} 
                  />
                  {category.title}
                </h3>
                
                <div className="flex flex-wrap gap-2.5">
                  {category.skills.map((skill, skillIdx) => (
                    <motion.span
                      key={skillIdx}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium tracking-wide text-white/70 hover:text-white transition-colors cursor-default"
                      style={{
                        boxShadow: `inset 0 0 0 1px rgba(${category.accent}, 0)`
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = `rgba(${category.accent}, 0.5)`;
                        e.currentTarget.style.backgroundColor = `rgba(${category.accent}, 0.1)`;
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                        e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                      }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
