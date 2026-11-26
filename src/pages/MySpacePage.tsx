import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Edit3, Lock, Plus, Trophy, X } from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AnimatePresence, motion } from 'motion/react';
import { useSafeSpace } from '../context/SafeSpaceContext';
import { PostCard } from '../components/PostCard';
import { MoodFaceIcon } from '../components/MoodFaceIcon';
import { EASE_SMOOTH, ScrollReveal, SUBTLE_CARD_HOVER } from '../components/MotionPrimitives';

type SpaceTab = 'journal' | 'mood' | 'saved' | 'posts' | 'wins';

export function MySpacePage() {
  const { state, updateProfile, addSmallWin } = useSafeSpace();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialParam = (searchParams.get('tab') as SpaceTab) || 'journal';

  const [activeTab, setActiveTab] = useState<SpaceTab>(initialParam);
  const [editOpen, setEditOpen] = useState(false);
  const [nameInput, setNameInput] = useState(state.user.name);
  const [handleInput, setHandleInput] = useState(state.user.handle);
  const [bioInput, setBioInput] = useState(state.user.bio);
  const [newWinText, setNewWinText] = useState('');

  useEffect(() => {
    const t = searchParams.get('tab') as SpaceTab | null;
    if (t && ['journal', 'mood', 'saved', 'posts', 'wins'].includes(t)) {
      setActiveTab(t);
    }
  }, [searchParams]);

  const handleTabChange = (tab: SpaceTab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    updateProfile({
      name: nameInput.trim(),
      handle: handleInput.trim() || state.user.handle,
      bio: bioInput.trim(),
    });
    setEditOpen(false);
  };

  const handleAddWin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWinText.trim()) return;
    addSmallWin(newWinText);
    setNewWinText('');
  };

  const savedPosts = state.posts.filter((p) => p.bookmarked);
  const myPosts = state.posts.filter((p) => p.isOwn);
  const chartData = state.moodRecords.slice(-7);

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <ScrollReveal y={14}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#F4F6FC]">My Space</h1>
            <p className="text-sm text-[#929DB3] mt-1">Your personal space</p>
          </div>

          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              setNameInput(state.user.name);
              setHandleInput(state.user.handle);
              setBioInput(state.user.bio);
              setEditOpen(true);
            }}
            className="safespace-gradient-btn px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white inline-flex items-center gap-2 self-start sm:self-auto whitespace-nowrap"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </motion.button>
        </div>
      </ScrollReveal>

      {/* Profile Header Card matching Screen 8 */}
      <ScrollReveal y={14}>
        <section className="bg-[#131F35] border border-[#25334D] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-[#7A839E] text-[#F4F6FC] text-2xl font-bold flex items-center justify-center shrink-0 border-2 border-[#34486E]">
            {state.user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl font-bold text-[#F4F6FC]">{state.user.name}</h2>
              <span className="text-xs text-[#9BCBFF]">@{state.user.handle}</span>
            </div>
            <p className="text-xs text-[#929DB3] mt-0.5">
              Member since {state.user.memberSince}
            </p>
            {state.user.bio && (
              <p className="text-sm text-[#D6DEF0] mt-2 leading-relaxed max-w-2xl">
                {state.user.bio}
              </p>
            )}
          </div>
        </section>
      </ScrollReveal>

      {/* Tabs Row matching Screen 8 with sliding pill */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1" role="tablist">
        {(
          [
            { id: 'journal', label: 'Journal' },
            { id: 'mood', label: 'Mood History' },
            { id: 'saved', label: `Saved (${savedPosts.length})` },
            { id: 'posts', label: `My Posts (${myPosts.length})` },
            { id: 'wins', label: `Small Wins (${state.smallWins.length})` },
          ] as const
        ).map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => handleTabChange(tab.id)}
              className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition-colors ${
                active
                  ? 'text-white'
                  : 'bg-[#131F35] border border-[#25334D] text-[#929DB3] hover:text-[#F4F6FC]'
              }`}
            >
              {active && (
                <motion.span
                  layoutId="myspace-tab-pill"
                  transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                  className="absolute inset-0 rounded-xl safespace-gradient-btn shadow-sm"
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.24, ease: EASE_SMOOTH }}
          className="space-y-6"
        >
      {/* Screen 8 Signature Two-Column Overview (Mood History + Small Wins) shown on Journal & Mood tabs */}
      {(activeTab === 'journal' || activeTab === 'mood') && (
        <ScrollReveal y={14} delay={0.04} className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Mood History Chart */}
          <div className="lg:col-span-7 bg-[#131F35] border border-[#25334D] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#F4F6FC]">Mood History</h3>
              <Link
                to="/mood-tracker"
                className="text-xs font-semibold text-[#9BCBFF] hover:text-[#A69BFF]"
              >
                Open Tracker →
              </Link>
            </div>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 12, left: -24, bottom: 0 }}>
                  <defs>
                    <linearGradient id="mySpaceMoodGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B8BFF" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#8B8BFF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#22314D" vertical={false} />
                  <XAxis dataKey="dayLabel" stroke="#8492AD" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} stroke="#8492AD" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0D1628',
                      border: '1px solid #2C3F63',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: '#F4F6FC',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#A69BFF"
                    strokeWidth={2.5}
                    fill="url(#mySpaceMoodGrad)"
                    isAnimationActive={false}
                    dot={{ r: 4, fill: '#F4F6FC', stroke: '#8B8BFF', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Small Wins Trophy Card */}
          <div className="lg:col-span-5 bg-[#131F35] border border-[#25334D] rounded-2xl p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <h3 className="text-base font-bold text-[#F4F6FC]">Small Wins</h3>
              <ul className="space-y-3">
                {state.smallWins.slice(0, 4).map((win) => (
                  <li
                    key={win.id}
                    className="flex items-start gap-3 bg-[#0D1628] border border-[#25334D]/70 rounded-xl p-3"
                  >
                    <Trophy className="w-4 h-4 text-[#F4C950] shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#F4F6FC] leading-snug">{win.text}</p>
                      <span className="text-[11px] text-[#929DB3]">{win.dateLabel}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <form onSubmit={handleAddWin} className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newWinText}
                onChange={(e) => setNewWinText(e.target.value)}
                placeholder="Add a small win..."
                aria-label="Add a small win"
                className="flex-1 bg-[#0D1628] border border-[#25334D] rounded-xl px-3.5 py-2 text-xs text-[#F4F6FC] placeholder:text-[#8492AD] focus:outline-none focus:border-[#648BFF]"
              />
              <button
                type="submit"
                disabled={!newWinText.trim()}
                aria-label="Save small win"
                className="safespace-gradient-btn disabled:opacity-40 p-2 rounded-xl text-white"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>
          </div>
        </ScrollReveal>
      )}

      {/* Tab-specific Detailed Lists */}
      {activeTab === 'journal' && (
        <ScrollReveal y={16} delay={0.06}>
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#F4F6FC]">Recent Private Journal Entries</h3>
              <Link to="/journal" className="text-xs font-semibold text-[#9BCBFF] hover:text-[#A69BFF]">
                Write in Journal →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {state.journalEntries.map((entry, idx) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 'some' }}
                  transition={{ duration: 0.4, delay: idx * 0.05, ease: EASE_SMOOTH }}
                  whileHover={SUBTLE_CARD_HOVER}
                  className="rounded-2xl will-change-transform"
                >
                  <Link
                    to="/journal"
                    className="block h-full bg-[#131F35] border border-[#25334D] hover:border-[#648BFF]/60 rounded-2xl p-4 space-y-2 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#A69BFF]">{entry.dateLabel}</span>
                      <div className="flex items-center gap-1.5">
                        {entry.isPrivate && <Lock className="w-3.5 h-3.5 text-[#929DB3]" />}
                        <MoodFaceIcon mood={entry.mood} size="sm" />
                      </div>
                    </div>
                    <h4 className="text-sm font-bold text-[#F4F6FC]">{entry.title}</h4>
                    <p className="text-xs text-[#929DB3] line-clamp-2 leading-relaxed">{entry.content}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        </ScrollReveal>
      )}

      {activeTab === 'mood' && (
        <ScrollReveal y={16} delay={0.06}>
          <section className="bg-[#131F35] border border-[#25334D] rounded-2xl p-5 space-y-3">
            <h3 className="text-base font-bold text-[#F4F6FC]">Recent Mood Check-ins</h3>
            <div className="divide-y divide-[#25334D]/60">
              {[...state.moodRecords].reverse().map((rec) => (
                <div key={rec.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <MoodFaceIcon mood={rec.mood} size="sm" />
                    <div>
                      <p className="text-sm font-semibold text-[#F4F6FC] capitalize">{rec.mood}</p>
                      <p className="text-xs text-[#929DB3]">{rec.note || 'Daily mood check-in'}</p>
                    </div>
                  </div>
                  <span className="text-xs text-[#929DB3] tabular-nums">{rec.dateISO}</span>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>
      )}

      {activeTab === 'saved' && (
        <section className="space-y-4">
          {savedPosts.length === 0 ? (
            <div className="bg-[#131F35] border border-[#25334D] rounded-2xl p-8 text-center">
              <p className="text-sm font-semibold text-[#F4F6FC]">No saved posts yet.</p>
              <p className="text-xs text-[#929DB3] mt-1">
                Bookmark any discussion in Dashboard or Real Talk to revisit it here.
              </p>
            </div>
          ) : (
            savedPosts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </section>
      )}

      {activeTab === 'posts' && (
        <section className="space-y-4">
          {myPosts.length === 0 ? (
            <div className="bg-[#131F35] border border-[#25334D] rounded-2xl p-8 text-center">
              <p className="text-sm font-semibold text-[#F4F6FC]">You haven&apos;t posted yet.</p>
              <Link
                to="/dashboard"
                className="inline-block mt-3 safespace-gradient-btn px-4 py-2 rounded-xl text-xs font-semibold text-white"
              >
                Share your first thought
              </Link>
            </div>
          ) : (
            myPosts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </section>
      )}

      {activeTab === 'wins' && (
        <ScrollReveal y={14}>
          <section className="bg-[#131F35] border border-[#25334D] rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-[#F4F6FC]">All Small Wins</h3>
                <p className="text-xs text-[#929DB3]">Every tiny step counts toward healing.</p>
              </div>
              <form onSubmit={handleAddWin} className="flex items-center gap-2">
                <input
                  type="text"
                  value={newWinText}
                  onChange={(e) => setNewWinText(e.target.value)}
                  placeholder="Celebrate a new win..."
                  aria-label="Celebrate a new win"
                  className="bg-[#0D1628] border border-[#25334D] rounded-xl px-3.5 py-2 text-xs text-[#F4F6FC] placeholder:text-[#8492AD] focus:outline-none focus:border-[#648BFF]"
                />
                <button
                  type="submit"
                  className="safespace-gradient-btn px-4 py-2 rounded-xl text-xs font-semibold text-white"
                >
                  Add Win
                </button>
              </form>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {state.smallWins.map((win, idx) => (
                <motion.div
                  key={win.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 'some' }}
                  transition={{ duration: 0.35, delay: idx * 0.04, ease: EASE_SMOOTH }}
                  whileHover={SUBTLE_CARD_HOVER}
                  className="bg-[#0D1628] border border-[#25334D] hover:border-[#648BFF]/50 rounded-xl p-4 flex items-center gap-3 transition-colors will-change-transform"
                >
                  <Trophy className="w-5 h-5 text-[#F4C950] shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-[#F4F6FC]">{win.text}</p>
                    <span className="text-xs text-[#929DB3]">{win.dateLabel}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </ScrollReveal>
      )}
        </motion.div>
      </AnimatePresence>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {editOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-profile-title"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.25, ease: EASE_SMOOTH }}
              className="bg-[#131F35] border border-[#25334D] rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <h2 id="edit-profile-title" className="text-lg font-bold text-[#F4F6FC]">
                  Edit Profile
                </h2>
                <button
                  type="button"
                  onClick={() => setEditOpen(false)}
                  aria-label="Close edit profile modal"
                  className="p-1.5 rounded-lg text-[#929DB3] hover:text-[#F4F6FC] hover:bg-[#1B2942]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label htmlFor="prof-name" className="block text-xs font-semibold text-[#D6DEF0] mb-1.5">
                    Display Name
                  </label>
                  <input
                    id="prof-name"
                    type="text"
                    required
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full bg-[#0D1628] border border-[#25334D] rounded-xl px-4 py-2.5 text-sm text-[#F4F6FC] focus:outline-none focus:border-[#648BFF]"
                  />
                </div>

                <div>
                  <label htmlFor="prof-handle" className="block text-xs font-semibold text-[#D6DEF0] mb-1.5">
                    Handle
                  </label>
                  <input
                    id="prof-handle"
                    type="text"
                    value={handleInput}
                    onChange={(e) => setHandleInput(e.target.value)}
                    className="w-full bg-[#0D1628] border border-[#25334D] rounded-xl px-4 py-2.5 text-sm text-[#F4F6FC] focus:outline-none focus:border-[#648BFF]"
                  />
                </div>

                <div>
                  <label htmlFor="prof-bio" className="block text-xs font-semibold text-[#D6DEF0] mb-1.5">
                    Bio
                  </label>
                  <textarea
                    id="prof-bio"
                    rows={3}
                    value={bioInput}
                    onChange={(e) => setBioInput(e.target.value)}
                    className="w-full bg-[#0D1628] border border-[#25334D] rounded-xl px-4 py-2.5 text-sm text-[#F4F6FC] focus:outline-none focus:border-[#648BFF] resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditOpen(false)}
                    className="px-4 py-2 rounded-xl bg-[#1B2942] text-xs font-semibold text-[#C7D2E8]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="safespace-gradient-btn px-5 py-2 rounded-xl text-xs font-semibold text-white"
                  >
                    Save Changes
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
