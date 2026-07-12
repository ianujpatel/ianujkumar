"use client";

import { motion } from "framer-motion";
import { Mail, MessageCircle, Phone } from "lucide-react";

export default function Footer() {
  const emailMessage = "Hi Anuj, I saw your portfolio and would like to discuss an opportunity.";
  const whatsappMessage = "Hi Anuj, I saw your portfolio and would like to discuss an opportunity.";
  
  return (
    <footer id="contact" className="relative z-20 overflow-hidden bg-[#050505] pt-32 pb-10 px-5 md:px-12 lg:px-20 border-t border-white/[0.05]">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(ellipse_50%_80%_at_100%_0%,rgba(139,92,246,0.03),transparent)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/2 h-full bg-[radial-gradient(ellipse_50%_80%_at_0%_100%,rgba(20,184,166,0.03),transparent)] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto flex flex-col items-center">
        
        {/* Signature Area */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2
            className="font-black tracking-[-0.04em] leading-tight mb-4"
            style={{ fontSize: "clamp(3rem, 6vw, 4.5rem)" }}
          >
            <span
              className="bg-clip-text text-transparent block pb-2"
              style={{
                backgroundImage: "linear-gradient(135deg, #ffffff 0%, #a78bfa 50%, #38bdf8 100%)",
                filter: "drop-shadow(0 0 30px rgba(167, 139, 250, 0.2))",
              }}
            >
              Anuj Kumar
            </span>
          </h2>
          <p className="text-white/60 font-medium tracking-widest uppercase text-sm md:text-base flex items-center justify-center gap-3">
            Creative Developer <span className="text-purple-500">•</span> Frontend Engineer
          </p>
        </motion.div>

        {/* Contact Details & Socials Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-b border-white/[0.05] py-12 mb-12">
          
          {/* Direct Contact */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col items-center md:items-start gap-6"
          >
            <h3 className="text-white/80 font-semibold text-lg uppercase tracking-wider mb-2">Get in Touch</h3>
            
            <a 
              href="tel:+919284275573" 
              className="group flex items-center gap-4 text-white/50 hover:text-white transition-colors"
            >
              <div className="w-12 h-12 rounded-full border border-white/10 bg-white/[0.02] flex items-center justify-center group-hover:bg-white/[0.05] group-hover:border-white/20 transition-all">
                <Phone className="w-5 h-5" />
              </div>
              <span className="text-lg tracking-wide">+91 9284275573</span>
            </a>
            
            <a 
              href={`mailto:ianujkumar004@gmail.com?subject=Hiring%20Opportunity&body=${encodeURIComponent(emailMessage)}`}
              className="group flex items-center gap-4 text-white/50 hover:text-white transition-colors"
            >
              <div className="w-12 h-12 rounded-full border border-white/10 bg-white/[0.02] flex items-center justify-center group-hover:bg-white/[0.05] group-hover:border-white/20 transition-all">
                <Mail className="w-5 h-5" />
              </div>
              <span className="text-lg tracking-wide">ianujkumar004@gmail.com</span>
            </a>
          </motion.div>

          {/* Social Links */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex flex-col items-center md:items-end gap-6"
          >
            <h3 className="text-white/80 font-semibold text-lg uppercase tracking-wider mb-2">Connect</h3>
            
            <div className="flex flex-wrap justify-center md:justify-end gap-4">
              <SocialIcon 
                href="https://github.com" 
                icon={<GithubIcon className="w-5 h-5" />} 
                hoverColor="hover:text-white hover:border-white/40 hover:bg-white/10" 
              />
              <SocialIcon 
                href={`mailto:ianujkumar004@gmail.com?subject=Hiring%20Opportunity&body=${encodeURIComponent(emailMessage)}`} 
                icon={<Mail className="w-5 h-5" />} 
                hoverColor="hover:text-red-400 hover:border-red-400/40 hover:bg-red-400/10" 
              />
              <SocialIcon 
                href={`https://wa.me/919284275573?text=${encodeURIComponent(whatsappMessage)}`} 
                icon={<MessageCircle className="w-5 h-5" />} 
                hoverColor="hover:text-green-400 hover:border-green-400/40 hover:bg-green-400/10" 
              />
              <SocialIcon 
                href="https://instagram.com" 
                icon={<InstagramIcon className="w-5 h-5" />} 
                hoverColor="hover:text-pink-400 hover:border-pink-400/40 hover:bg-pink-400/10" 
              />
              <SocialIcon 
                href="https://linkedin.com" 
                icon={<LinkedinIcon className="w-5 h-5" />} 
                hoverColor="hover:text-blue-400 hover:border-blue-400/40 hover:bg-blue-400/10" 
              />
            </div>
          </motion.div>

        </div>

        {/* Footer Bottom Text */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-white/30 text-sm font-light tracking-wide flex flex-col sm:flex-row items-center justify-center gap-2">
            <span>© 2026 Anuj Kumar. Crafted with passion.</span>
            <span className="hidden sm:inline text-white/10">|</span>
            <a 
              href="/admin" 
              className="text-white/40 hover:text-violet-400 transition-colors text-xs font-semibold hover:underline mt-1 sm:mt-0 flex items-center gap-1"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.02 5.912L9 16.5V18a1.5 1.5 0 01-1.5 1.5H6a1.5 1.5 0 01-1.5-1.5v-1.5a1.5 1.5 0 01.378-.978l5.986-5.986a6 6 0 019.886-5.286z" />
              </svg>
              Admin Login
            </a>
          </p>
        </motion.div>

      </div>
    </footer>
  );
}

function SocialIcon({ href, icon, hoverColor }: { href: string, icon: React.ReactNode, hoverColor: string }) {
  return (
    <a 
      href={href} 
      target={href.startsWith("mailto:") ? "_self" : "_blank"} 
      rel="noopener noreferrer"
      className={`w-14 h-14 rounded-full border border-white/10 bg-white/[0.02] flex items-center justify-center text-white/50 transition-all duration-300 ${hoverColor}`}
    >
      {icon}
    </a>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.18-.35 6.52-1.59 6.52-7.14a5.46 5.46 0 0 0-1.53-3.8 5.07 5.07 0 0 0-.15-3.75s-1.25-.4-4.04 1.5a13.8 13.8 0 0 0-7.36 0C4.7 1.25 3.45 1.65 3.45 1.65a5.07 5.07 0 0 0-.15 3.75 5.46 5.46 0 0 0-1.53 3.8c0 5.54 3.33 6.78 6.5 7.14a4.8 4.8 0 0 0-1 3.02v4"></path>
      <path d="M9 20.5c-4 1-5-2.5-5-2.5"></path>
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
      <rect x="2" y="9" width="4" height="12"></rect>
      <circle cx="4" cy="4" r="2"></circle>
    </svg>
  );
}
