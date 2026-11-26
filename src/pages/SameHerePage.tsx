import React, { useState } from 'react';
import { ArrowRight, Bookmark, Heart, Plus, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useSafeSpace } from '../context/SafeSpaceContext';
import { AvatarStack } from '../components/Avatar';
import { formatRelateCount } from '../utils/safespaceLogic';
import { CARD_HOVER, EASE_SMOOTH, ScrollReveal } from '../components/MotionPrimitives';

export function SameHerePage() {
  const {
    state,
    toggleSameHereRelate,
    toggleSameHereLike,
    toggleSameHereBookmark,
    addSameHereExperience,
  } = useSafeSpace();

  const [featuredId, setFeaturedId] = useState<string>(state.sameHereList[0]?.id ?? '');
  const [showAll, setShowAll] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [quoteInput, setQuoteInput] = useState('');
  const [contextInput, setContextInput] = useState('');

  const featured =
    state.sameHereList.find((item) => item.id === featuredId) ?? state.sameHereList[0];

  const similarItems = state.sameHereList.filter((item) => item.id !== featured?.id);
  const visibleSimilar = showAll ? similarItems : similarItems.slice(0, 2);

  const handleShareSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteInput.trim()) return;
    addSameHereExperience(quoteInput, contextInput);
    setQuoteInput('');
    setContextInput('');
    setModalOpen(false);
  };

  if (!featured) {
    return (
      <div className="bg-[#131F35] border border-[#25334D] rounded-2xl p-10 text-center">
        <p className="text-sm text-[#929DB3]">No experiences shared yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* Header Row */}
      <ScrollReveal y={14}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#F4F6FC]">Same Here</h1>
            <p className="text-sm text-[#929DB3] mt-1">
              You are never the only one feeling this way.
            </p>
          </div>

          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setModalOpen(true)}
            className="safespace-gradient-btn px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white inline-flex items-center gap-2 self-start sm:self-auto whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Share Your Experience</span>
          </motion.button>
        </div>
      </ScrollReveal>

      {/* Large Relatable Experience Hero Card matching Screen 7 */}
      <ScrollReveal y={16}>
        <section className="relative rounded-3xl overflow-hidden border border-[#2A3B5E] min-h-[320px] sm:min-h-[370px] flex flex-col justify-between p-6 sm:p-10 shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.img
              key={`bg-${featured.id}`}
              src={featured.imageUrl}
              alt="Atmospheric horizon background"
              referrerPolicy="no-referrer"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: EASE_SMOOTH }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0C1324]/70 via-[#0E182D]/65 to-[#080D18]/90" />

          {/* Top quick actions */}
          <div className="relative flex items-center justify-between">
            <span className="text-xs font-medium text-[#D6DEF0]/90">
              Shared by {featured.author} · {featured.createdAt}
            </span>
            <div className="flex items-center gap-2">
              <motion.button
                type="button"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleSameHereLike(featured.id)}
                aria-label={featured.likedByMe ? 'Unlike experience' : 'Like experience'}
                className={`p-2 rounded-xl bg-[#0D1628]/70 border border-white/15 backdrop-blur-xs transition-colors ${
                  featured.likedByMe ? 'text-[#EB5D68]' : 'text-[#F4F6FC] hover:text-[#EB5D68]'
                }`}
              >
                <Heart className={`w-4 h-4 ${featured.likedByMe ? 'fill-[#EB5D68]' : ''}`} />
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleSameHereBookmark(featured.id)}
                aria-label={featured.bookmarked ? 'Remove bookmark' : 'Bookmark experience'}
                className={`p-2 rounded-xl bg-[#0D1628]/70 border border-white/15 backdrop-blur-xs transition-colors ${
                  featured.bookmarked ? 'text-[#A69BFF]' : 'text-[#F4F6FC] hover:text-[#A69BFF]'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${featured.bookmarked ? 'fill-[#A69BFF]' : ''}`} />
              </motion.button>
            </div>
          </div>

          {/* Center Quote with smooth crossfade */}
          <AnimatePresence mode="wait">
            <motion.div
              key={featured.id}
              initial={{ opacity: 0, y: 14, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.985 }}
              transition={{ duration: 0.34, ease: EASE_SMOOTH }}
              className="relative text-center max-w-2xl mx-auto my-8 space-y-3"
            >
              <blockquote className="text-2xl sm:text-4xl font-bold text-[#F4F6FC] leading-snug tracking-tight">
                &ldquo;{featured.quote}&rdquo;
              </blockquote>
              {featured.context && (
                <p className="text-xs sm:text-sm text-[#D6DEF0]/90 max-w-xl mx-auto leading-relaxed">
                  {featured.context}
                </p>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Bottom Support Bar */}
          <div className="relative flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-3 bg-[#0D1628]/75 border border-white/10 backdrop-blur-xs rounded-2xl px-4 py-2">
              <AvatarStack count={4} size="xs" />
              <span className="text-xs sm:text-sm font-semibold text-[#F4F6FC] tabular-nums">
                {formatRelateCount(featured.relateCount)} people relate
              </span>
            </div>

            <motion.button
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => toggleSameHereRelate(featured.id)}
              aria-pressed={featured.relatedByMe}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-lg ${
                featured.relatedByMe
                  ? 'bg-[#223457] border-2 border-[#A69BFF] text-[#F4F6FC] shadow-[#A69BFF]/25'
                  : 'safespace-gradient-btn text-white shadow-[#648BFF]/30'
              }`}
            >
              {featured.relatedByMe ? 'Same Here ✓' : 'Same Here'}
            </motion.button>
          </div>
        </section>
      </ScrollReveal>

      {/* Similar Experiences */}
      <ScrollReveal delay={0.08} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#F4F6FC]">Similar experiences</h2>
          <button
            type="button"
            onClick={() => setShowAll((prev) => !prev)}
            className="text-xs font-semibold text-[#9BCBFF] hover:text-[#A69BFF] inline-flex items-center gap-1"
          >
            <span>{showAll ? 'Show less' : 'View all'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visibleSimilar.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 'some' }}
              transition={{ duration: 0.4, delay: idx * 0.05, ease: EASE_SMOOTH }}
              whileHover={CARD_HOVER}
              className="bg-[#131F35] border border-[#25334D] hover:border-[#648BFF]/70 rounded-2xl p-4 flex items-center gap-4 transition-colors will-change-transform"
            >
              <button
                type="button"
                onClick={() => setFeaturedId(item.id)}
                className="flex items-center gap-4 flex-1 min-w-0 text-left group"
              >
                <img
                  src={item.imageUrl}
                  alt={item.quote}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-xl object-cover shrink-0 border border-[#25334D] transition-transform duration-300 group-hover:scale-105"
                />
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-[#F4F6FC] group-hover:text-[#9BCBFF] transition-colors line-clamp-2">
                    &ldquo;{item.quote}&rdquo;
                  </h3>
                  <p className="text-xs text-[#929DB3] mt-1.5 inline-flex items-center gap-1.5 tabular-nums">
                    <Heart className="w-3.5 h-3.5 text-[#EB5D68] fill-[#EB5D68]" />
                    <span>{formatRelateCount(item.relateCount)} relate</span>
                  </p>
                </div>
              </button>

              <motion.button
                type="button"
                whileTap={{ scale: 0.94 }}
                onClick={() => toggleSameHereRelate(item.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors ${
                  item.relatedByMe
                    ? 'bg-[#223457] text-[#9BCBFF] border border-[#3B5482]'
                    : 'bg-[#1B2942] hover:bg-[#253759] text-[#F4F6FC]'
                }`}
              >
                {item.relatedByMe ? 'Related ✓' : 'Same Here'}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </ScrollReveal>

      {/* Share Experience Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="samehere-modal-title"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.25, ease: EASE_SMOOTH }}
              className="bg-[#131F35] border border-[#25334D] rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 id="samehere-modal-title" className="text-lg font-bold text-[#F4F6FC]">
                    Share an Anonymous Experience
                  </h2>
                  <p className="text-xs text-[#929DB3]">
                    Help someone else realize they aren&apos;t alone.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  aria-label="Close modal"
                  className="p-1.5 rounded-lg text-[#929DB3] hover:text-[#F4F6FC] hover:bg-[#1B2942]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleShareSubmit} className="space-y-4">
                <div>
                  <label htmlFor="sh-quote" className="block text-xs font-semibold text-[#D6DEF0] mb-1.5">
                    One-line feeling or experience
                  </label>
                  <input
                    id="sh-quote"
                    type="text"
                    required
                    value={quoteInput}
                    onChange={(e) => setQuoteInput(e.target.value)}
                    placeholder="e.g., Sometimes I cancel plans just to breathe."
                    className="w-full bg-[#0D1628] border border-[#25334D] rounded-xl px-4 py-2.5 text-sm text-[#F4F6FC] placeholder:text-[#6D7B98] focus:outline-none focus:border-[#648BFF]"
                  />
                </div>

                <div>
                  <label htmlFor="sh-context" className="block text-xs font-semibold text-[#D6DEF0] mb-1.5">
                    More context (optional)
                  </label>
                  <textarea
                    id="sh-context"
                    rows={3}
                    value={contextInput}
                    onChange={(e) => setContextInput(e.target.value)}
                    placeholder="Add a few lines if you'd like..."
                    className="w-full bg-[#0D1628] border border-[#25334D] rounded-xl px-4 py-2.5 text-sm text-[#F4F6FC] placeholder:text-[#6D7B98] focus:outline-none focus:border-[#648BFF] resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-[#1B2942] text-xs font-semibold text-[#C7D2E8]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="safespace-gradient-btn px-5 py-2 rounded-xl text-xs font-semibold text-white"
                  >
                    Share Anonymously
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
