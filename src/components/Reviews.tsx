"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Star } from "lucide-react";

export interface Review {
  id: string;
  name: string;
  rating: number;
  message: string;
  date: string;
  approved?: boolean;
}

import { submitReviewAction } from "@/app/actions/reviews";

interface ReviewsProps {
  initialReviews: Review[];
}

export default function Reviews({ initialReviews }: ReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;
    
    const tempId = String(Date.now());
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    
    const newReview: Review = {
      id: tempId,
      name,
      rating,
      message,
      date: dateStr,
    };
    
    // Optimistic UI updates - keeping existing functionality of immediate render
    setReviews(prev => [newReview, ...prev]);
    setName("");
    setMessage("");
    setRating(5);

    try {
      await submitReviewAction({ name, rating, message });
    } catch (err) {
      console.error("Failed to persist review:", err);
    }
  };

  return (
    <section id="reviews" className="relative z-20 overflow-hidden bg-[#0a0a0a] py-32 px-5 md:px-12 lg:px-20">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_50%_0%,rgba(244,63,94,0.03),transparent)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="mb-16 md:mb-24 flex flex-col md:flex-row gap-12 md:items-end md:justify-between border-b border-white/[0.05] pb-10"
        >
          <div>
            <div className="mb-6 flex items-center gap-3">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-pink-500/50" />
              <p className="text-[10px] uppercase tracking-[0.5em] text-white/40 font-light">
                Client Feedback
              </p>
            </div>
            
            <h2
              className="font-black tracking-[-0.06em] leading-tight"
              style={{ fontSize: "clamp(3rem, 8vw, 6rem)" }}
            >
              <span
                className="bg-clip-text text-transparent block"
                style={{
                  backgroundImage: "linear-gradient(120deg, #ffffff 0%, #f472b6 60%, #e879f9 100%)",
                }}
              >
                Testimonials
              </span>
            </h2>
          </div>
          <div className="max-w-sm md:pb-4">
            <p className="text-sm md:text-base font-light leading-relaxed text-white/50">
              Hear what clients and collaborators have to say about my work, process, and the value I bring to every project.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Review Form */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:col-span-5"
          >
            <div className="p-8 rounded-[2rem] border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              <h3 className="text-2xl font-bold text-white/90 mb-6 tracking-tight">Leave a Review</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/40 mb-2 ml-1">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-pink-500/50 focus:bg-white/[0.05] transition-all"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/40 mb-2 ml-1">Rating</label>
                  <div className="flex gap-2 ml-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(null)}
                        className="transition-transform hover:scale-110 focus:outline-none"
                      >
                        <Star
                          className={`w-6 h-6 transition-colors duration-200 ${(hoveredStar !== null ? star <= hoveredStar : star <= rating) ? "fill-amber-400 text-amber-400" : "text-white/20"}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/40 mb-2 ml-1">Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={4}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-pink-500/50 focus:bg-white/[0.05] transition-all resize-none"
                    placeholder="Share your experience..."
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full relative overflow-hidden rounded-2xl px-8 py-4 text-sm font-bold tracking-widest uppercase text-white bg-white/[0.05] border border-white/10 hover:border-pink-500/30 transition-colors"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 opacity-0 hover:opacity-100 transition-opacity" />
                  <span className="relative z-10">Submit Review</span>
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Reviews List */}
          <div className="lg:col-span-7 space-y-6">
            {reviews.map((review, idx) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="p-8 rounded-[2rem] border border-white/[0.04] bg-gradient-to-br from-white/[0.03] to-transparent backdrop-blur-md relative group hover:border-white/[0.08] transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-white/90">{review.name}</h4>
                    <span className="text-xs text-white/30 tracking-wider uppercase">{review.date}</span>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-white/10"}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-white/60 font-light leading-relaxed text-sm md:text-base">
                  &ldquo;{review.message}&rdquo;
                </p>
                
                {/* Decorative corner */}
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-pink-400/50" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
