import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Plus, Star, TrendingUp } from 'lucide-react';
import { useSafeSpace } from '../context/SafeSpaceContext';
import { Avatar } from '../components/Avatar';
import { MOOD_OPTIONS, MoodFaceIcon } from '../components/MoodFaceIcon';
import { PostCard } from '../components/PostCard';
import { EASE_SMOOTH, ScrollReveal } from '../components/MotionPrimitives';
import { filterPosts } from '../utils/safespaceLogic';
import type { DiscoverCategory, MoodLevel } from '../types/safespace';

const TRENDING_TOPICS = [
  { tag: '#Anxiety', count: '1.2k' },
  { tag: '#SelfGrowth', count: '940' },
  { tag: '#CollegeLife', count: '785' },
  { tag: '#Overthinking', count: '612' },
  { tag: '#Relationships', count: '540' },
];

export function DashboardPage() {
  const { state, addPost, logMood, addSmallWin, setGlobalSearch } = useSafeSpace();
  const navigate = useNavigate();

  const [composerText, setComposerText] = useState('');
  const [composerCategory, setComposerCategory] = useState<Exclude<DiscoverCategory, 'All'>>('Mental Health');
  const [feedTab, setFeedTab] = useState<'for-you' | 'trending' | 'following'>('for-you');
  const [selectedMood, setSelectedMood] = useState<MoodLevel | null>(
    state.moodRecords[state.moodRecords.length - 1]?.mood ?? null
  );
  const [addingWin, setAddingWin] = useState(false);
  const [winInput, setWinInput] = useState('');

  const visiblePosts = useMemo(
    () => filterPosts(state.posts, { tab: feedTab }),
    [state.posts, feedTab]
  );

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composerText.trim()) return;
    addPost({
      content: composerText,
      category: composerCategory,
      tags: [`#${composerCategory.replace(/\s+/g, '')}`],
    });
    setComposerText('');
  };

  const handleSelectMood = (mood: MoodLevel) => {
    setSelectedMood(mood);
    logMood(mood);
  };

  const handleAddWinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!winInput.trim()) return;
    addSmallWin(winInput);
    setWinInput('');
    setAddingWin(false);
  };

  const openTopicInDiscover = (tag: string) => {
    setGlobalSearch(tag.replace(/^#/, ''));
    navigate('/discover');
  };

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <ScrollReveal y={14}>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#F4F6FC]">
          Good morning, {state.user.name}!
        </h1>
        <p className="text-sm text-[#929DB3] mt-1">
          You&apos;re doing great. Take a deep breath.
        </p>
      </ScrollReveal>

      {/* Anonymous Post Composer */}
      <ScrollReveal delay={0.05} y={14}>
        <form
          onSubmit={handleCreatePost}
          className="bg-[#131F35] border border-[#25334D] rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-3 focus-within:border-[#648BFF]/80 transition-colors"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Avatar src={state.user.avatarUrl} name={state.user.name} size="md" />
            <input
              type="text"
              value={composerText}
              onChange={(e) => setComposerText(e.target.value)}
              placeholder="What's on your mind?"
              aria-label="What's on your mind?"
              className="flex-1 bg-transparent text-sm text-[#F4F6FC] placeholder:text-[#8492AD] focus:outline-none min-w-0"
            />
          </div>
          <div className="flex items-center justify-end gap-2 shrink-0">
            <select
              value={composerCategory}
              onChange={(e) => setComposerCategory(e.target.value as Exclude<DiscoverCategory, 'All'>)}
              aria-label="Select post topic"
              className="bg-[#0D1628] border border-[#25334D] rounded-xl px-2.5 py-2 text-xs text-[#C7D2E8] focus:outline-none focus:border-[#648BFF]"
            >
              <option value="Mental Health">Mental Health</option>
              <option value="College Life">College Life</option>
              <option value="Relationships">Relationships</option>
              <option value="Career">Career</option>
              <option value="Self-Growth">Self-Growth</option>
            </select>
            <motion.button
              type="submit"
              whileTap={{ scale: 0.96 }}
              disabled={!composerText.trim()}
              className="safespace-gradient-btn disabled:opacity-45 px-5 py-2 rounded-xl text-xs font-semibold text-white whitespace-nowrap transition-opacity"
            >
              Post
            </motion.button>
          </div>
        </form>
      </ScrollReveal>

      {/* Mood Check-in + One Small Win Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Mood Check-in Card */}
        <ScrollReveal className="lg:col-span-7 bg-[#131F35] border border-[#25334D] rounded-2xl p-5">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-[#F4F6FC]">Mood Check-in</h2>
              <p className="text-xs text-[#929DB3] mt-0.5">How are you feeling today?</p>
            </div>
            <Link
              to="/mood-tracker"
              className="text-xs font-medium text-[#9BCBFF] hover:text-[#A69BFF] transition-colors"
            >
              History →
            </Link>
          </div>

          <div className="grid grid-cols-5 gap-2 sm:gap-3 mt-5">
            {MOOD_OPTIONS.map((option) => {
              const active = selectedMood === option.id;
              return (
                <motion.button
                  key={option.id}
                  type="button"
                  whileHover={{ scale: 1.06, y: -2 }}
                  whileTap={{ scale: 0.94 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 24 }}
                  onClick={() => handleSelectMood(option.id)}
                  aria-label={`Check in mood as ${option.label}`}
                  aria-pressed={active}
                  className={`flex flex-col items-center gap-2 py-2.5 px-1 rounded-xl border transition-colors ${
                    active
                      ? 'bg-[#1B2942] border-[#648BFF] ring-1 ring-[#648BFF]/60'
                      : 'bg-transparent border-transparent hover:bg-[#18253E]'
                  }`}
                >
                  <MoodFaceIcon mood={option.id} size="md" />
                  <span
                    className={`text-[11px] sm:text-xs font-medium whitespace-nowrap ${
                      active ? 'text-[#F4F6FC]' : 'text-[#929DB3]'
                    }`}
                  >
                    {option.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </ScrollReveal>

        {/* One Small Win Card */}
        <ScrollReveal delay={0.08} className="lg:col-span-5 bg-[#131F35] border border-[#25334D] rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-base font-bold text-[#F4F6FC] inline-flex items-center gap-2">
                <span>One Small Win</span>
                <Star className="w-4 h-4 fill-[#F4C950] text-[#F4C950]" />
              </h2>
              <button
                type="button"
                onClick={() => setAddingWin((prev) => !prev)}
                className="text-xs font-semibold text-[#A69BFF] hover:text-[#C5BFFF] inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
            <p className="text-sm text-[#D6DEF0] mt-3 leading-relaxed">
              You showed up today. And that matters.
            </p>
            {state.smallWins[0] && (
              <p className="text-xs text-[#9BCBFF] mt-2">
                Latest win: {state.smallWins[0].text}
              </p>
            )}
          </div>

          {addingWin ? (
            <motion.form
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleAddWinSubmit}
              className="mt-4 flex items-center gap-2"
            >
              <input
                type="text"
                value={winInput}
                onChange={(e) => setWinInput(e.target.value)}
                placeholder="e.g., Drank water & took a walk"
                aria-label="Add a small win"
                className="flex-1 bg-[#0D1628] border border-[#25334D] rounded-xl px-3 py-2 text-xs text-[#F4F6FC] placeholder:text-[#8492AD] focus:outline-none focus:border-[#648BFF]"
              />
              <button
                type="submit"
                className="safespace-gradient-btn px-3.5 py-2 rounded-xl text-xs font-semibold text-white"
              >
                Save
              </button>
            </motion.form>
          ) : (
            <div className="mt-4">
              <Link
                to="/my-space?tab=wins"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1B2942] hover:bg-[#243658] border border-[#2C3F64] text-xs font-semibold text-[#F4F6FC] transition-colors"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </ScrollReveal>
      </div>

      {/* Feed + Trending Topics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Feed Column */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center gap-2" role="tablist" aria-label="Feed filter">
            {(
              [
                { id: 'for-you', label: 'For You' },
                { id: 'trending', label: 'Trending' },
                { id: 'following', label: 'Following' },
              ] as const
            ).map((tab) => {
              const active = feedTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFeedTab(tab.id)}
                  className={`relative px-4 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap ${
                    active
                      ? 'text-white'
                      : 'bg-[#131F35] border border-[#25334D] text-[#929DB3] hover:text-[#F4F6FC]'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="dashboard-feed-tab"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      className="absolute inset-0 rounded-xl safespace-gradient-btn shadow-sm -z-0"
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={feedTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: EASE_SMOOTH }}
              className="space-y-4"
            >
              {visiblePosts.length === 0 ? (
                <div className="bg-[#131F35] border border-[#25334D] rounded-2xl p-8 text-center">
                  <p className="text-sm font-semibold text-[#F4F6FC]">No posts in this tab yet.</p>
                  <p className="text-xs text-[#929DB3] mt-1">
                    Share a thought above or explore communities to fill your feed.
                  </p>
                </div>
              ) : (
                visiblePosts.map((post) => (
                  <PostCard key={post.id} post={post} onTagClick={openTopicInDiscover} />
                ))
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Trending Topics Column */}
        <ScrollReveal delay={0.1} className="lg:col-span-4 bg-[#131F35] border border-[#25334D] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#F4F6FC]">Trending Topics</h2>
            <TrendingUp className="w-4 h-4 text-[#A69BFF]" />
          </div>

          <div className="divide-y divide-[#25334D]/60">
            {TRENDING_TOPICS.map((topic) => (
              <button
                key={topic.tag}
                type="button"
                onClick={() => openTopicInDiscover(topic.tag)}
                className="w-full py-3 flex items-center justify-between text-left group hover:bg-[#1B2942]/40 -mx-2 px-2 rounded-lg transition-colors"
              >
                <span className="text-sm font-semibold text-[#F4F6FC] group-hover:text-[#9BCBFF] transition-colors">
                  {topic.tag}
                </span>
                <span className="text-xs text-[#929DB3] tabular-nums">{topic.count} posts</span>
              </button>
            ))}
          </div>

          <Link
            to="/discover"
            className="block text-center py-2.5 rounded-xl bg-[#1B2942] hover:bg-[#253657] border border-[#2C3F63] text-xs font-semibold text-[#9BCBFF] transition-colors"
          >
            Explore Discover →
          </Link>
        </ScrollReveal>
      </div>
    </div>
  );
}
