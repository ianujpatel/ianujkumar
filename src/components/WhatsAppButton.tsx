"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function WhatsAppButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-45 flex items-center gap-3">
      {/* Tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.95 }}
            className="hidden md:block px-3.5 py-2 rounded-xl border border-white/5 bg-zinc-950/80 backdrop-blur-md text-[10px] font-mono tracking-widest uppercase text-white/80 shadow-2xl"
          >
            Chat with me
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button */}
      <motion.a
        href="https://wa.me/919284275573"
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        whileHover={{ scale: 1.08, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="relative h-12 w-12 rounded-full border border-teal-500/20 bg-teal-950/15 backdrop-blur-xl flex items-center justify-center text-teal-400 hover:text-white shadow-[0_0_20px_rgba(20,184,166,0.15)] hover:shadow-[0_0_30px_rgba(20,184,166,0.3)] transition-all duration-300 group cursor-pointer"
        aria-label="Contact on WhatsApp"
      >
        {/* Glow backdrop ring */}
        <div className="absolute inset-0 rounded-full bg-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm pointer-events-none" />
        
        {/* SVG WhatsApp Icon */}
        <svg
          className="h-5 w-5 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.62.962 3.21 1.468 4.832 1.469 5.305 0 9.622-4.312 9.625-9.615.002-2.57-1.002-4.984-2.824-6.808C16.46 2.378 14.053 1.374 11.48 1.374c-5.3 0-9.615 4.312-9.619 9.616-.002 1.702.451 3.361 1.311 4.816l-.99 3.613 3.7-.972zm10.744-6.06c-.297-.15-1.758-.868-2.031-.967-.272-.099-.47-.148-.667.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.667-1.609-.914-2.203-.24-.579-.485-.5-.667-.51-.173-.008-.371-.01-.57-.01-.197 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        </svg>
      </motion.a>
    </div>
  );
}
