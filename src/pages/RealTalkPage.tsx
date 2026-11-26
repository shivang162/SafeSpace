import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Heart, Plus, X } from 'lucide-react';
import { useSafeSpace } from '../context/SafeSpaceContext';
import { filterPosts } from '../utils/safespaceLogic';
import { PostCard } from '../components/PostCard';
import { EASE_SMOOTH, ScrollReveal, SUBTLE_CARD_HOVER } from '../components/MotionPrimitives';
import type { DiscoverCategory } from '../types/safespace';

const POPULAR_TAGS = ['#Anxiety', 'Relationships', '#CollegeLife', 'SelfGrowth', 'Overthinking'];

export function RealTalkPage() {
  const { state, addPost } = useSafeSpace();
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Exclude<DiscoverCategory, 'All'>>('Mental Health');
  const [tagInput, setTagInput] = useState('#Anxiety');

  const realTalkPosts = useMemo(
    () =>
      filterPosts(state.posts, {
        tag: activeTag,
        onlyRealTalk: true,
      }),
    [state.posts, activeTag]
  );

  const handleCreateDiscussion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    const parsedTags = tagInput
      .split(/[\s,]+/)
      .filter(Boolean)
      .map((t) => (t.startsWith('#') ? t : `#${t}`));
    addPost({
      title: title.trim() || undefined,
      content,
      category,
      tags: parsedTags.length > 0 ? parsedTags : ['#RealTalk'],
      isRealTalk: true,
    });
    setTitle('');
    setContent('');
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <ScrollReveal y={14} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#F4F6FC]">Real Talk</h1>
          <p className="text-sm text-[#929DB3] mt-1">
            Anonymous discussions. Real conversations.
          </p>
        </div>

        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setModalOpen(true)}
          className="safespace-gradient-btn px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white inline-flex items-center gap-2 self-start sm:self-auto shadow-md shadow-[#648BFF]/20 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>New Post</span>
        </motion.button>
      </ScrollReveal>

      {/* Main 2-Column Layout matching Screen 6 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Feed */}
        <div className="lg:col-span-8 space-y-4">
          <AnimatePresence>
            {activeTag && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="bg-[#131F35] border border-[#2C3F63] rounded-xl px-4 py-2.5 flex items-center justify-between"
              >
                <span className="text-xs text-[#C7D2E8]">
                  Filtering by <strong className="text-[#A69BFF]">{activeTag}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTag(null)}
                  className="text-xs font-semibold text-[#9BCBFF] hover:underline"
                >
                  Clear filter
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {realTalkPosts.length === 0 ? (
            <div className="bg-[#131F35] border border-[#25334D] rounded-2xl p-8 text-center">
              <p className="text-sm font-semibold text-[#F4F6FC]">
                No discussions tagged {activeTag} yet.
              </p>
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="mt-3 safespace-gradient-btn px-4 py-2 rounded-xl text-xs font-semibold text-white"
              >
                Start a conversation
              </button>
            </div>
          ) : (
            realTalkPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onTagClick={(tag) => setActiveTag(tag)}
              />
            ))
          )}
        </div>

        {/* Right Sidebar: Popular Tags + Be kind card */}
        <ScrollReveal delay={0.08} className="lg:col-span-4 space-y-4">
          <div className="bg-[#131F35] border border-[#25334D] rounded-2xl p-5 space-y-3.5">
            <h2 className="text-base font-bold text-[#F4F6FC]">Popular Tags</h2>
            <div className="flex flex-col gap-2">
              {POPULAR_TAGS.map((tag) => {
                const isSelected = activeTag?.toLowerCase() === tag.toLowerCase();
                return (
                  <motion.button
                    key={tag}
                    type="button"
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTag(isSelected ? null : tag)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                      isSelected
                        ? 'bg-[#223457] border-[#648BFF] text-[#F4F6FC]'
                        : 'bg-[#0D1628] border-[#25334D] text-[#C7D2E8] hover:border-[#3A4F78]'
                    }`}
                  >
                    {tag}
                  </motion.button>
                );
              })}
            </div>
          </div>

          <motion.div
            whileHover={SUBTLE_CARD_HOVER}
            className="bg-gradient-to-br from-[#2B2B5C] via-[#3A3573] to-[#283563] border border-[#5B58A8]/50 rounded-2xl p-5 text-center space-y-1.5 will-change-transform"
          >
            <p className="text-sm font-bold text-[#F4F6FC] inline-flex items-center justify-center gap-1.5">
              <span>Be kind. Always.</span>
              <Heart className="w-4 h-4 text-[#C5BFFF] fill-[#C5BFFF]/30" />
            </p>
            <p className="text-xs text-[#D6DEF0]">This is a safe space.</p>
          </motion.div>
        </ScrollReveal>
      </div>

      {/* New Anonymous Discussion Modal */}
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
            aria-labelledby="realtalk-modal-title"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.24, ease: EASE_SMOOTH }}
              className="bg-[#131F35] border border-[#25334D] rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 id="realtalk-modal-title" className="text-lg font-bold text-[#F4F6FC]">
                    Start a Real Talk
                  </h2>
                  <p className="text-xs text-[#929DB3]">Posted as anonymous_user</p>
                </div>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  aria-label="Close new post modal"
                  className="p-1.5 rounded-lg text-[#929DB3] hover:text-[#F4F6FC] hover:bg-[#1B2942]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateDiscussion} className="space-y-4">
                <div>
                  <label htmlFor="rt-title" className="block text-xs font-semibold text-[#D6DEF0] mb-1.5">
                    Question or Headline (optional)
                  </label>
                  <input
                    id="rt-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Does anyone else struggle with Sunday anxiety?"
                    className="w-full bg-[#0D1628] border border-[#25334D] rounded-xl px-4 py-2.5 text-sm text-[#F4F6FC] placeholder:text-[#6D7B98] focus:outline-none focus:border-[#648BFF]"
                  />
                </div>

                <div>
                  <label htmlFor="rt-content" className="block text-xs font-semibold text-[#D6DEF0] mb-1.5">
                    Your thoughts
                  </label>
                  <textarea
                    id="rt-content"
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Share honestly without judgment..."
                    required
                    className="w-full bg-[#0D1628] border border-[#25334D] rounded-xl px-4 py-3 text-sm text-[#F4F6FC] placeholder:text-[#6D7B98] focus:outline-none focus:border-[#648BFF] resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="rt-category" className="block text-xs font-semibold text-[#D6DEF0] mb-1.5">
                      Category
                    </label>
                    <select
                      id="rt-category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value as Exclude<DiscoverCategory, 'All'>)}
                      className="w-full bg-[#0D1628] border border-[#25334D] rounded-xl px-3 py-2.5 text-xs text-[#F4F6FC] focus:outline-none focus:border-[#648BFF]"
                    >
                      <option value="Mental Health">Mental Health</option>
                      <option value="Relationships">Relationships</option>
                      <option value="College Life">College Life</option>
                      <option value="Career">Career</option>
                      <option value="Self-Growth">Self-Growth</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="rt-tags" className="block text-xs font-semibold text-[#D6DEF0] mb-1.5">
                      Tags
                    </label>
                    <input
                      id="rt-tags"
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="#Anxiety #Overthinking"
                      className="w-full bg-[#0D1628] border border-[#25334D] rounded-xl px-3 py-2.5 text-xs text-[#F4F6FC] focus:outline-none focus:border-[#648BFF]"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-[#1B2942] text-xs font-semibold text-[#C7D2E8]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="safespace-gradient-btn px-5 py-2.5 rounded-xl text-xs font-semibold text-white"
                  >
                    Post Anonymously
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
