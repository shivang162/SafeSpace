import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Plus,
  RotateCcw,
  ShieldAlert,
  Trash2,
  X,
} from 'lucide-react';
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
import { AdminLayout, type AdminTab } from '../layouts/AdminLayout';
import { useSafeSpace } from '../context/SafeSpaceContext';
import { Avatar } from '../components/Avatar';
import {
  EASE_SMOOTH,
  ScrollReveal,
  StaggerGroup,
  StaggerItem,
  SUBTLE_CARD_HOVER,
} from '../components/MotionPrimitives';
import type { DiscoverCategory, ReportItem } from '../types/safespace';

const ACTIVITY_30_DAYS = [
  { label: 'W1', active: 6200, posts: 14200 },
  { label: 'W2', active: 7800, posts: 16400 },
  { label: 'W3', active: 7100, posts: 15800 },
  { label: 'W4', active: 9400, posts: 18900 },
  { label: 'W5', active: 8900, posts: 19600 },
  { label: 'Now', active: 11200, posts: 22400 },
];

const ACTIVITY_7_DAYS = [
  { label: 'Mon', active: 8100, posts: 2800 },
  { label: 'Tue', active: 9200, posts: 3100 },
  { label: 'Wed', active: 8700, posts: 2950 },
  { label: 'Thu', active: 10400, posts: 3600 },
  { label: 'Fri', active: 9900, posts: 3400 },
  { label: 'Sat', active: 10800, posts: 3900 },
  { label: 'Sun', active: 11500, posts: 4200 },
];

export function AdminDashboardPage() {
  const { state, handleModerationAction, addCommunity, resetDemoData } = useSafeSpace();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [timeframe, setTimeframe] = useState<'30d' | '7d'>('30d');
  const [reviewingReport, setReviewingReport] = useState<ReportItem | null>(null);

  const [newCommName, setNewCommName] = useState('');
  const [newCommDesc, setNewCommDesc] = useState('');
  const [newCommCategory, setNewCommCategory] =
    useState<Exclude<DiscoverCategory, 'All'>>('Mental Health');

  const pendingReports = state.reports.filter((r) => r.status === 'pending');
  const displayReportsCount = 239 + pendingReports.length;
  const chartData = timeframe === '30d' ? ACTIVITY_30_DAYS : ACTIVITY_7_DAYS;

  const handleAddCommunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommName.trim() || !newCommDesc.trim()) return;
    addCommunity({
      name: newCommName,
      description: newCommDesc,
      category: newCommCategory,
    });
    setNewCommName('');
    setNewCommDesc('');
  };

  return (
    <AdminLayout
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      pendingReportsCount={pendingReports.length}
    >
      <div className="space-y-6">
        {/* Header matching Screen 12 */}
        <ScrollReveal y={14}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#F4F6FC]">Admin Dashboard</h1>
              <p className="text-sm text-[#929DB3] mt-1">
                Monitor and manage your platform
              </p>
            </div>

            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as '30d' | '7d')}
              aria-label="Select admin timeframe"
              className="bg-[#131F35] border border-[#25334D] rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#F4F6FC] focus:outline-none focus:border-[#648BFF] self-start sm:self-auto"
            >
              <option value="30d">Last 30 days</option>
              <option value="7d">Last 7 days</option>
            </select>
          </div>
        </ScrollReveal>

        {/* OVERVIEW & ANALYTICS */}
        {(activeTab === 'overview' || activeTab === 'analytics') && (
          <>
            {/* 4 KPI Stat Cards matching Screen 12 */}
            <StaggerGroup className="grid grid-cols-2 lg:grid-cols-4 gap-4" staggerDelay={0.06}>
              <StaggerItem hoverLift>
                <div className="bg-[#131F35] border border-[#25334D] rounded-2xl p-5">
                  <p className="text-2xl sm:text-3xl font-extrabold text-[#648BFF] tabular-nums">
                    12.5K
                  </p>
                  <p className="text-xs font-medium text-[#929DB3] mt-1">Total Users</p>
                </div>
              </StaggerItem>
              <StaggerItem hoverLift>
                <div className="bg-[#131F35] border border-[#25334D] rounded-2xl p-5">
                  <p className="text-2xl sm:text-3xl font-extrabold text-[#F4F6FC] tabular-nums">
                    68.2K
                  </p>
                  <p className="text-xs font-medium text-[#929DB3] mt-1">Total Posts</p>
                </div>
              </StaggerItem>
              <StaggerItem hoverLift>
                <div className="bg-[#131F35] border border-[#25334D] rounded-2xl p-5">
                  <p className="text-2xl sm:text-3xl font-extrabold text-[#EB5D68] tabular-nums">
                    {displayReportsCount}
                  </p>
                  <p className="text-xs font-medium text-[#929DB3] mt-1">
                    Reports ({pendingReports.length} pending)
                  </p>
                </div>
              </StaggerItem>
              <StaggerItem hoverLift>
                <div className="bg-[#131F35] border border-[#25334D] rounded-2xl p-5">
                  <p className="text-2xl sm:text-3xl font-extrabold text-[#57D38C] tabular-nums">
                    98%
                  </p>
                  <p className="text-xs font-medium text-[#929DB3] mt-1">Active Users</p>
                </div>
              </StaggerItem>
            </StaggerGroup>

            {/* Middle 2-Column Grid: Platform Activity + Moderation Queue */}
            <ScrollReveal delay={0.08} className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              <section className="lg:col-span-6 bg-[#131F35] border border-[#25334D] rounded-2xl p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-[#F4F6FC]">Platform Activity</h2>
                  <span className="text-xs text-[#9BCBFF]">Daily engagement</span>
                </div>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 12, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="adminActivityGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8E84FF" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#8E84FF" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#22314D" vertical={false} />
                      <XAxis dataKey="label" stroke="#8492AD" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#8492AD" fontSize={11} tickLine={false} axisLine={false} />
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
                        dataKey="active"
                        stroke="#A69BFF"
                        strokeWidth={2.5}
                        fill="url(#adminActivityGrad)"
                        isAnimationActive={false}
                        dot={{ r: 4, fill: '#F4F6FC', stroke: '#648BFF', strokeWidth: 2 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </section>

              {/* Moderation Queue Card */}
              <section className="lg:col-span-6 bg-[#131F35] border border-[#25334D] rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-[#F4F6FC]">Moderation Queue</h2>
                  <button
                    type="button"
                    onClick={() => setActiveTab('reports')}
                    className="text-xs font-semibold text-[#9BCBFF] hover:text-[#A69BFF]"
                  >
                    Manage all →
                  </button>
                </div>

                {pendingReports.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, ease: EASE_SMOOTH }}
                    className="py-10 text-center space-y-2"
                  >
                    <CheckCircle2 className="w-8 h-8 text-[#57D38C] mx-auto" />
                    <p className="text-sm font-semibold text-[#F4F6FC]">Queue is all clear!</p>
                    <p className="text-xs text-[#929DB3]">No pending reports require action.</p>
                  </motion.div>
                ) : (
                  <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                      {pendingReports.slice(0, 4).map((report) => (
                        <motion.div
                          key={report.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: 24, scale: 0.96 }}
                          whileHover={SUBTLE_CARD_HOVER}
                          transition={{ duration: 0.25, ease: EASE_SMOOTH }}
                          className="bg-[#0D1628] border border-[#25334D] hover:border-[#648BFF]/50 rounded-xl p-3.5 flex items-center justify-between gap-3 transition-colors will-change-transform"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-full bg-[#24213A] border border-[#EB5D68]/30 flex items-center justify-center shrink-0">
                              <ShieldAlert className="w-4 h-4 text-[#EB5D68]" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-[#F4F6FC] truncate">
                                {report.reason}
                              </p>
                              <p className="text-xs text-[#929DB3] truncate">
                                {report.reportedAuthor} · {report.reportedAt}
                              </p>
                            </div>
                          </div>

                          <motion.button
                            type="button"
                            whileTap={{ scale: 0.94 }}
                            onClick={() => setReviewingReport(report)}
                            className="safespace-gradient-btn px-4 py-1.5 rounded-xl text-xs font-semibold text-white whitespace-nowrap shrink-0"
                          >
                            Review
                          </motion.button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </section>
            </ScrollReveal>

            {/* Bottom Recent Users Strip matching Screen 12 */}
            <ScrollReveal delay={0.14}>
              <section className="bg-[#131F35] border border-[#25334D] rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-[#F4F6FC]">Recent Users</h2>
                  <button
                    type="button"
                    onClick={() => setActiveTab('users')}
                    className="text-xs font-semibold text-[#9BCBFF] hover:text-[#A69BFF] inline-flex items-center gap-1"
                  >
                    <span>View all</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  {state.sampleMembers.map((member) => (
                    <motion.div
                      key={member.id}
                      whileHover={SUBTLE_CARD_HOVER}
                      className="flex items-center gap-2.5 bg-[#0D1628] border border-[#25334D] hover:border-[#648BFF]/50 rounded-xl px-3.5 py-2 transition-colors will-change-transform"
                    >
                      <Avatar
                        src={member.avatarUrl}
                        name={member.name}
                        tone={member.avatarTone}
                        size="sm"
                      />
                      <div>
                        <p className="text-xs font-bold text-[#F4F6FC]">{member.name}</p>
                        <p className="text-[11px] text-[#929DB3]">{member.handle}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            </ScrollReveal>
          </>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <section className="bg-[#131F35] border border-[#25334D] rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-[#25334D]">
              <h2 className="text-base font-bold text-[#F4F6FC]">Sample Platform Members</h2>
              <p className="text-xs text-[#929DB3] mt-0.5">
                Anonymous handles and account health overview.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#25334D] text-xs text-[#929DB3]">
                    <th className="py-3 px-5 font-semibold">Member</th>
                    <th className="py-3 px-5 font-semibold">Joined</th>
                    <th className="py-3 px-5 font-semibold">Posts</th>
                    <th className="py-3 px-5 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#25334D]/60 text-sm">
                  {state.sampleMembers.map((m) => (
                    <tr key={m.id} className="hover:bg-[#1B2942]/40">
                      <td className="py-3.5 px-5 flex items-center gap-3">
                        <Avatar src={m.avatarUrl} name={m.name} tone={m.avatarTone} size="sm" />
                        <div>
                          <p className="font-semibold text-[#F4F6FC]">{m.name}</p>
                          <p className="text-xs text-[#929DB3]">{m.handle}</p>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-xs text-[#C7D2E8]">{m.joinedDate}</td>
                      <td className="py-3.5 px-5 text-xs text-[#F4F6FC] tabular-nums">{m.postsCount}</td>
                      <td className="py-3.5 px-5 text-xs font-semibold">
                        <span
                          className={
                            m.status === 'Active'
                              ? 'text-[#57D38C]'
                              : m.status === 'Flagged'
                              ? 'text-[#EB5D68]'
                              : 'text-[#9BCBFF]'
                          }
                        >
                          {m.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* COMMUNITIES MANAGEMENT TAB */}
        {activeTab === 'communities' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <section className="lg:col-span-7 bg-[#131F35] border border-[#25334D] rounded-2xl p-5 space-y-3">
              <h2 className="text-base font-bold text-[#F4F6FC]">
                Active Communities ({state.communities.length})
              </h2>
              <div className="divide-y divide-[#25334D]/60">
                {state.communities.map((comm) => (
                  <div key={comm.id} className="py-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-[#F4F6FC]">{comm.name}</p>
                      <p className="text-xs text-[#929DB3]">
                        {comm.category} · {comm.memberCountDisplay} members
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-[#57D38C]">Healthy</span>
                  </div>
                ))}
              </div>
            </section>

            <form
              onSubmit={handleAddCommunity}
              className="lg:col-span-5 bg-[#131F35] border border-[#25334D] rounded-2xl p-5 space-y-4 self-start"
            >
              <h2 className="text-base font-bold text-[#F4F6FC]">Create New Community</h2>
              <div>
                <label htmlFor="admin-comm-name" className="block text-xs font-semibold text-[#D6DEF0] mb-1.5">
                  Community Name
                </label>
                <input
                  id="admin-comm-name"
                  type="text"
                  required
                  value={newCommName}
                  onChange={(e) => setNewCommName(e.target.value)}
                  placeholder="e.g., Late Night Creatives"
                  className="w-full bg-[#0D1628] border border-[#25334D] rounded-xl px-3.5 py-2.5 text-sm text-[#F4F6FC] focus:outline-none focus:border-[#648BFF]"
                />
              </div>
              <div>
                <label htmlFor="admin-comm-cat" className="block text-xs font-semibold text-[#D6DEF0] mb-1.5">
                  Category
                </label>
                <select
                  id="admin-comm-cat"
                  value={newCommCategory}
                  onChange={(e) =>
                    setNewCommCategory(e.target.value as Exclude<DiscoverCategory, 'All'>)
                  }
                  className="w-full bg-[#0D1628] border border-[#25334D] rounded-xl px-3.5 py-2.5 text-xs text-[#F4F6FC]"
                >
                  <option value="Mental Health">Mental Health</option>
                  <option value="College Life">College Life</option>
                  <option value="Relationships">Relationships</option>
                  <option value="Career">Career</option>
                  <option value="Self-Growth">Self-Growth</option>
                </select>
              </div>
              <div>
                <label htmlFor="admin-comm-desc" className="block text-xs font-semibold text-[#D6DEF0] mb-1.5">
                  Description
                </label>
                <textarea
                  id="admin-comm-desc"
                  rows={3}
                  required
                  value={newCommDesc}
                  onChange={(e) => setNewCommDesc(e.target.value)}
                  placeholder="Describe the purpose and safe-space rules..."
                  className="w-full bg-[#0D1628] border border-[#25334D] rounded-xl px-3.5 py-2.5 text-sm text-[#F4F6FC] resize-none focus:outline-none focus:border-[#648BFF]"
                />
              </div>
              <button
                type="submit"
                className="w-full safespace-gradient-btn py-2.5 rounded-xl text-xs font-semibold text-white inline-flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Community</span>
              </button>
            </form>
          </div>
        )}

        {/* REPORTS TAB */}
        {activeTab === 'reports' && (
          <section className="bg-[#131F35] border border-[#25334D] rounded-2xl p-5 space-y-4">
            <h2 className="text-base font-bold text-[#F4F6FC]">All Moderation Reports</h2>
            <div className="space-y-3">
              {state.reports.map((report) => (
                <div
                  key={report.id}
                  className="bg-[#0D1628] border border-[#25334D] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-[#EB5D68]" />
                      <span className="text-sm font-bold text-[#F4F6FC]">{report.reason}</span>
                      <span className="text-xs text-[#929DB3]">· {report.reportedAt}</span>
                    </div>
                    <p className="text-xs text-[#C7D2E8]">{report.postExcerpt}</p>
                    <p className="text-[11px] text-[#929DB3]">
                      Reported user: {report.reportedAuthor} · Status:{' '}
                      <strong className="capitalize text-[#F4F6FC]">{report.status}</strong>
                    </p>
                  </div>

                  {report.status === 'pending' ? (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleModerationAction(report.id, 'dismiss')}
                        className="px-3.5 py-2 rounded-xl bg-[#1B2942] hover:bg-[#243658] text-xs font-semibold text-[#C7D2E8]"
                      >
                        Dismiss
                      </button>
                      <button
                        type="button"
                        onClick={() => handleModerationAction(report.id, 'remove')}
                        className="px-3.5 py-2 rounded-xl bg-[#3A1E29] hover:bg-[#4D2535] border border-[#EB5D68]/50 text-xs font-semibold text-[#FF99A1]"
                      >
                        Remove Post
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs font-semibold text-[#57D38C] capitalize">
                      {report.status}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <section className="bg-[#131F35] border border-[#25334D] rounded-2xl p-6 max-w-xl space-y-4">
            <h2 className="text-base font-bold text-[#F4F6FC]">Admin Demo Controls</h2>
            <p className="text-sm text-[#929DB3]">
              Reset all LocalStorage demo data (posts, mood check-ins, journal entries, memberships, and moderation queue) back to initial sample records.
            </p>
            <button
              type="button"
              onClick={resetDemoData}
              className="px-5 py-2.5 rounded-xl bg-[#3A1E29] hover:bg-[#4D2535] border border-[#EB5D68]/50 text-xs font-semibold text-[#FF99A1] inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Demo Data</span>
            </button>
          </section>
        )}
      </div>

      {/* Review Report Modal */}
      <AnimatePresence>
        {reviewingReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-report-title"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.25, ease: EASE_SMOOTH }}
              className="bg-[#131F35] border border-[#25334D] rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <h2 id="review-report-title" className="text-lg font-bold text-[#F4F6FC]">
                  Review Flagged Content
                </h2>
                <button
                  type="button"
                  onClick={() => setReviewingReport(null)}
                  aria-label="Close review modal"
                  className="p-1.5 rounded-lg text-[#929DB3] hover:text-[#F4F6FC]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-[#0D1628] border border-[#25334D] rounded-xl p-4 space-y-2">
                <p className="text-xs font-bold text-[#EB5D68]">{reviewingReport.reason}</p>
                <p className="text-sm text-[#F4F6FC] leading-relaxed">
                  {reviewingReport.postExcerpt}
                </p>
                <p className="text-xs text-[#929DB3]">
                  Author: {reviewingReport.reportedAuthor} · {reviewingReport.reportedAt}
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    handleModerationAction(reviewingReport.id, 'dismiss');
                    setReviewingReport(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#1B2942] hover:bg-[#253657] text-xs font-semibold text-[#F4F6FC]"
                >
                  Dismiss Report
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleModerationAction(reviewingReport.id, 'remove');
                    setReviewingReport(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#D94A56] hover:bg-[#E85B67] text-xs font-semibold text-white inline-flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Post</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
