import React, { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { motion } from 'motion/react';
import { useSafeSpace } from '../context/SafeSpaceContext';
import { MOOD_OPTIONS, MoodFaceIcon } from '../components/MoodFaceIcon';
import { EASE_SMOOTH, ScrollReveal } from '../components/MotionPrimitives';
import {
  calculateMoodInsightPercentage,
  getMoodInsightSummary,
} from '../utils/safespaceLogic';
import type { MoodLevel } from '../types/safespace';

export function MoodTrackerPage() {
  const { state, logMood } = useSafeSpace();
  const [range, setRange] = useState<'week' | 'month'>('month');
  const [selectedMood, setSelectedMood] = useState<MoodLevel>(
    state.moodRecords[state.moodRecords.length - 1]?.mood ?? 'good'
  );
  const [note, setNote] = useState('');

  const visibleRecords = useMemo(() => {
    if (range === 'week') {
      return state.moodRecords.slice(-7);
    }
    // Monthly view augments saved history with earlier weeks if needed
    if (state.moodRecords.length >= 10) return state.moodRecords;
    const prefix = [
      { id: 'pre-1', mood: 'okay' as MoodLevel, score: 3, dayLabel: 'Wk 1', dateISO: '2026-11-03' },
      { id: 'pre-2', mood: 'good' as MoodLevel, score: 4, dayLabel: 'Wk 2', dateISO: '2026-11-10' },
      { id: 'pre-3', mood: 'good' as MoodLevel, score: 4, dayLabel: 'Wk 3', dateISO: '2026-11-16' },
    ];
    return [...prefix, ...state.moodRecords];
  }, [state.moodRecords, range]);

  const insightPercent = calculateMoodInsightPercentage(visibleRecords);
  const insightSummary = getMoodInsightSummary(insightPercent);

  const handleSaveCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    logMood(selectedMood, note);
    setNote('');
  };

  // Circular progress ring math
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (insightPercent / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* Header matching Screen 10 */}
      <ScrollReveal y={14}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#F4F6FC]">Mood Tracker</h1>
            <p className="text-sm text-[#929DB3] mt-1">
              Track your mood and see patterns
            </p>
          </div>

          <select
            value={range}
            onChange={(e) => setRange(e.target.value as 'week' | 'month')}
            aria-label="Select mood chart timeframe"
            className="bg-[#131F35] border border-[#25334D] rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#F4F6FC] focus:outline-none focus:border-[#648BFF] self-start sm:self-auto"
          >
            <option value="month">This Month</option>
            <option value="week">This Week</option>
          </select>
        </div>
      </ScrollReveal>

      {/* Mood Selector Card matching Screen 10 */}
      <ScrollReveal y={14}>
        <form
          onSubmit={handleSaveCheckIn}
          className="bg-[#131F35] border border-[#25334D] rounded-2xl p-5 sm:p-6 space-y-5"
        >
          <div className="grid grid-cols-5 gap-2 sm:gap-4">
            {MOOD_OPTIONS.map((option) => {
              const active = selectedMood === option.id;
              return (
                <motion.button
                  key={option.id}
                  type="button"
                  whileHover={{ y: -3, scale: 1.03 }}
                  whileTap={{ scale: 0.94 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 24 }}
                  onClick={() => setSelectedMood(option.id)}
                  aria-label={`Select mood ${option.trackerLabel}`}
                  aria-pressed={active}
                  className={`flex flex-col items-center gap-2.5 py-3.5 px-2 rounded-2xl border transition-colors ${
                    active
                      ? 'bg-[#1B2942] border-[#648BFF] ring-2 ring-[#648BFF]/40'
                      : 'bg-[#0D1628]/60 border-[#25334D]/60 hover:bg-[#18253E]'
                  }`}
                >
                  <MoodFaceIcon mood={option.id} size="lg" />
                  <span
                    className={`text-xs sm:text-sm font-semibold ${
                      active ? 'text-[#F4F6FC]' : 'text-[#929DB3]'
                    }`}
                  >
                    {option.trackerLabel}
                  </span>
                </motion.button>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add an optional note about what shaped your mood today..."
              aria-label="Mood check-in note"
              className="flex-1 bg-[#0D1628] border border-[#25334D] rounded-xl px-4 py-2.5 text-sm text-[#F4F6FC] placeholder:text-[#8492AD] focus:outline-none focus:border-[#648BFF]"
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              className="safespace-gradient-btn px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white whitespace-nowrap"
            >
              Save Check-in
            </motion.button>
          </div>
        </form>
      </ScrollReveal>

      {/* Chart + Mood Insights Row matching Screen 10 */}
      <ScrollReveal delay={0.07} className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <section className="lg:col-span-8 bg-[#131F35] border border-[#25334D] rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-[#F4F6FC]">
              {range === 'week' ? 'Weekly Mood Pattern' : 'Monthly Mood Pattern'}
            </h2>
            <span className="text-xs text-[#929DB3] tabular-nums">
              {visibleRecords.length} check-ins
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={visibleRecords} margin={{ top: 10, right: 12, left: -24, bottom: 0 }}>
                <defs>
                  <linearGradient id="moodTrackerFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7E8BFF" stopOpacity={0.38} />
                    <stop offset="95%" stopColor="#7E8BFF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#22314D" vertical={false} />
                <XAxis dataKey="dayLabel" stroke="#929DB3" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} stroke="#929DB3" fontSize={11} tickLine={false} axisLine={false} />
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
                  stroke="#9D96FF"
                  strokeWidth={2.5}
                  fill="url(#moodTrackerFill)"
                  isAnimationActive={false}
                  dot={{ r: 4.5, fill: '#F4F6FC', stroke: '#7C91FF', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#A69BFF' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Mood Insights Card with Circular Progress Ring */}
        <section className="lg:col-span-4 bg-[#131F35] border border-[#25334D] rounded-2xl p-6 flex flex-col items-center justify-between text-center">
          <div>
            <h2 className="text-base font-bold text-[#F4F6FC]">Mood Insights</h2>
            <p className="text-xs sm:text-sm text-[#C7D2E8] mt-1.5 leading-relaxed">
              {insightSummary}
            </p>
          </div>

          <div className="relative w-36 h-36 flex items-center justify-center my-4">
            <svg viewBox="0 0 110 110" className="w-full h-full -rotate-90">
              <defs>
                <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#57D38C" />
                  <stop offset="55%" stopColor="#648BFF" />
                  <stop offset="100%" stopColor="#A69BFF" />
                </linearGradient>
              </defs>
              <circle
                cx="55"
                cy="55"
                r={radius}
                stroke="#1E2C47"
                strokeWidth="10"
                fill="none"
              />
              <motion.circle
                cx="55"
                cy="55"
                r={radius}
                stroke="url(#ringGrad)"
                strokeWidth="10"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: dashOffset }}
                transition={{ duration: 0.85, ease: EASE_SMOOTH }}
              />
            </svg>
            <span className="absolute text-2xl font-extrabold text-[#F4F6FC] tabular-nums">
              {insightPercent}%
            </span>
          </div>

          <p className="text-xs text-[#929DB3]">
            Overall emotional balance score based on your saved check-ins.
          </p>
        </section>
      </ScrollReveal>

      {/* Previous Check-ins List */}
      <ScrollReveal delay={0.12}>
        <section className="bg-[#131F35] border border-[#25334D] rounded-2xl p-5 space-y-3">
          <h2 className="text-base font-bold text-[#F4F6FC]">Previous Check-ins</h2>
          <div className="divide-y divide-[#25334D]/60">
            {[...state.moodRecords].reverse().map((rec) => (
              <div key={rec.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <MoodFaceIcon mood={rec.mood} size="sm" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#F4F6FC] capitalize">{rec.mood}</p>
                    <p className="text-xs text-[#929DB3] truncate">
                      {rec.note || 'Logged mood check-in'}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-[#929DB3] whitespace-nowrap tabular-nums">
                  {rec.dayLabel} · {rec.dateISO}
                </span>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
