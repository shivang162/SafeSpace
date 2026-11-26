import React, { useState } from 'react';
import { Lock, Plus, Trash2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useSafeSpace } from '../context/SafeSpaceContext';
import { MOOD_OPTIONS, MoodFaceIcon } from '../components/MoodFaceIcon';
import { EASE_SMOOTH, ScrollReveal, SUBTLE_CARD_HOVER } from '../components/MotionPrimitives';
import type { MoodLevel } from '../types/safespace';

export function JournalPage() {
  const { state, saveJournalEntry, deleteJournalEntry } = useSafeSpace();

  const [selectedId, setSelectedId] = useState<string | null>(
    state.journalEntries[0]?.id ?? null
  );
  const [title, setTitle] = useState(
    state.journalEntries[0]?.title ?? "Today I'm grateful for..."
  );
  const [content, setContent] = useState(state.journalEntries[0]?.content ?? '');
  const [mood, setMood] = useState<MoodLevel>(state.journalEntries[0]?.mood ?? 'good');
  const [isPrivate, setIsPrivate] = useState<boolean>(
    state.journalEntries[0]?.isPrivate ?? true
  );

  const selectEntry = (id: string) => {
    const found = state.journalEntries.find((e) => e.id === id);
    if (!found) return;
    setSelectedId(found.id);
    setTitle(found.title);
    setContent(found.content);
    setMood(found.mood);
    setIsPrivate(found.isPrivate);
  };

  const startNewEntry = () => {
    setSelectedId(null);
    setTitle('');
    setContent('');
    setMood('good');
    setIsPrivate(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) return;
    const savedId = saveJournalEntry({
      id: selectedId ?? undefined,
      title: title.trim() || "Today I'm grateful for...",
      content,
      mood,
      isPrivate,
    });
    setSelectedId(savedId);
  };

  const handleDelete = () => {
    if (!selectedId) return;
    deleteJournalEntry(selectedId);
    const remaining = state.journalEntries.filter((e) => e.id !== selectedId);
    if (remaining.length > 0) {
      selectEntry(remaining[0].id);
    } else {
      startNewEntry();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header matching Screen 11 */}
      <ScrollReveal y={14}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#F4F6FC]">Journal</h1>
            <p className="text-sm text-[#929DB3] mt-1">Write, reflect, and grow.</p>
          </div>

          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={startNewEntry}
            className="safespace-gradient-btn px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white inline-flex items-center gap-2 self-start sm:self-auto whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>New Entry</span>
          </motion.button>
        </div>
      </ScrollReveal>

      {/* Two-Column Journal Workspace matching Screen 11 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Entry List */}
        <ScrollReveal y={14} className="lg:col-span-4">
          <aside className="bg-[#131F35] border border-[#25334D] rounded-2xl p-3 space-y-1.5">
            {state.journalEntries.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#929DB3]">
                No journal entries yet. Click &ldquo;New Entry&rdquo; to begin reflecting.
              </div>
            ) : (
              state.journalEntries.map((entry, idx) => {
                const active = selectedId === entry.id;
                return (
                  <motion.button
                    key={entry.id}
                    type="button"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 'some' }}
                    transition={{ duration: 0.3, delay: idx * 0.04, ease: EASE_SMOOTH }}
                    whileHover={SUBTLE_CARD_HOVER}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => selectEntry(entry.id)}
                    className={`w-full text-left p-3.5 rounded-xl transition-colors border will-change-transform ${
                      active
                        ? 'bg-[#1D2E4E] border-[#648BFF]/70'
                        : 'bg-transparent border-transparent hover:bg-[#182640]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-[#A69BFF]">
                        {entry.dateLabel}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {entry.isPrivate && <Lock className="w-3 h-3 text-[#8492AD]" />}
                        <MoodFaceIcon mood={entry.mood} size="sm" />
                      </div>
                    </div>
                    <p className="text-sm font-bold text-[#F4F6FC] mt-1 truncate">
                      {entry.title}
                    </p>
                    <p className="text-xs text-[#929DB3] mt-0.5 line-clamp-1">
                      {entry.content || 'Empty entry'}
                    </p>
                  </motion.button>
                );
              })
            )}
          </aside>
        </ScrollReveal>

        {/* Right Writing Area */}
        <ScrollReveal y={14} delay={0.06} className="lg:col-span-8">
          <form
            onSubmit={handleSave}
            className="bg-[#131F35] border border-[#25334D] rounded-2xl p-5 sm:p-6 space-y-5"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedId ?? 'new-entry'}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: EASE_SMOOTH }}
                className="space-y-5"
              >
                <div>
                  <label htmlFor="journal-title" className="sr-only">
                    Journal entry title
                  </label>
                  <input
                    id="journal-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Today I'm grateful for..."
                    className="w-full bg-transparent text-xl sm:text-2xl font-bold text-[#F4F6FC] placeholder:text-[#7887A6] focus:outline-none border-b border-[#25334D] pb-3"
                  />
                </div>

                <div>
                  <label htmlFor="journal-body" className="sr-only">
                    Write your thoughts here
                  </label>
                  <textarea
                    id="journal-body"
                    rows={9}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your thoughts here..."
                    className="w-full bg-[#0D1628] border border-[#25334D] rounded-2xl p-4 text-sm text-[#E6ECF8] placeholder:text-[#6D7B98] focus:outline-none focus:border-[#648BFF] leading-relaxed resize-y"
                  />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Mood Selector */}
            <div className="space-y-2.5">
              <p className="text-xs font-semibold text-[#C7D2E8]">How do you feel?</p>
              <div className="flex items-center gap-2.5 flex-wrap">
                {MOOD_OPTIONS.map((opt) => {
                  const active = mood === opt.id;
                  return (
                    <motion.button
                      key={opt.id}
                      type="button"
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setMood(opt.id)}
                      aria-label={`Set journal mood to ${opt.label}`}
                      aria-pressed={active}
                      className={`p-1.5 rounded-full transition-colors ${
                        active
                          ? 'ring-2 ring-[#648BFF] bg-[#1B2942]'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <MoodFaceIcon mood={opt.id} size="sm" />
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Action Row */}
            <div className="pt-4 border-t border-[#25334D] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  role="switch"
                  aria-checked={isPrivate}
                  aria-label="Private Entry toggle"
                  onClick={() => setIsPrivate((prev) => !prev)}
                  className={`w-10 h-5 rounded-full transition-colors p-0.5 ${
                    isPrivate ? 'bg-[#648BFF]' : 'bg-[#25334D]'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      isPrivate ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className="text-xs font-medium text-[#C7D2E8] inline-flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#A69BFF]" />
                  <span>Private Entry</span>
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                {selectedId && (
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDelete}
                    aria-label="Delete entry"
                    className="px-3.5 py-2.5 rounded-xl bg-[#271B2A] hover:bg-[#38233C] border border-[#EB5D68]/40 text-xs font-semibold text-[#FF99A1] inline-flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </motion.button>
                )}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  className="safespace-gradient-btn px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white"
                >
                  Save Entry
                </motion.button>
              </div>
            </div>
          </form>
        </ScrollReveal>
      </div>
    </div>
  );
}
