"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Mail } from "lucide-react";

const NAV_LINKS = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "Education", href: "#education" },
  { name: "Reviews", href: "#reviews" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Determine active section
      const sections = NAV_LINKS.map(link => link.href.substring(1));
      let current = "home";

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 3 && rect.bottom >= window.innerHeight / 3) {
            current = section;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.substring(1);
    const elem = document.getElementById(targetId);
    
    if (elem) {
      const rect = elem.getBoundingClientRect();
      const topOffset = rect.top + window.scrollY;
      window.scrollTo({
        top: topOffset,
        behavior: "smooth"
      });
    }
    setIsMobileMenuOpen(false);
  };

  const mailToLink = "mailto:ianujkumar004@gmail.com?subject=Hiring%20Opportunity&body=Hi%20Anuj%2C%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20discuss%20an%20opportunity.";

  return (
    <header 
      className={`fixed top-0 inset-x-0 z-[100] transition-all duration-500 ${
        isScrolled 
          ? "bg-[#050505]/80 backdrop-blur-xl border-b border-white/[0.05] py-4" 
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        
        {/* Logo / Brand */}
        <a 
          href="#home" 
          onClick={(e) => handleNavClick(e, "#home")}
          className="relative z-10 text-xl font-black tracking-tighter text-white hover:text-white/80 transition-colors"
        >
          AK<span className="text-purple-500">.</span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`relative text-sm font-medium transition-colors ${
                  isActive ? "text-white" : "text-white/50 hover:text-white"
                }`}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="navbar-active-indicator"
                    className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Hire Me CTA (Desktop) */}
        <div className="hidden lg:block">
          <a
            href={mailToLink}
            className="group relative inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold tracking-wide text-white overflow-hidden rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-purple-600/30 to-cyan-600/30 transition-opacity duration-300 blur-md" />
            <span className="relative z-10 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Hire Me
            </span>
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden relative z-50 p-2 text-white/70 hover:text-white"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute top-full left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur-2xl border-b border-white/[0.05] p-6 lg:hidden"
          >
            <div className="flex flex-col gap-6">
              {NAV_LINKS.map((link) => {
                const isActive = activeSection === link.href.substring(1);
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`text-lg font-medium transition-colors ${
                      isActive ? "text-white pl-2 border-l-2 border-purple-500" : "text-white/60 hover:text-white pl-2 border-l-2 border-transparent"
                    }`}
                  >
                    {link.name}
                  </a>
                );
              })}
              
              <div className="pt-6 border-t border-white/10">
                <a
                  href={mailToLink}
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border border-white/10 text-white font-semibold"
                >
                  <Mail className="w-5 h-5" />
                  Hire Me
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
