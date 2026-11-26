import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  BarChart3,
  Flag,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Users,
  UsersRound,
  X,
} from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';
import { EASE_SMOOTH, PageTransition } from '../components/MotionPrimitives';
import { useSafeSpace } from '../context/SafeSpaceContext';

export type AdminTab = 'overview' | 'users' | 'communities' | 'reports' | 'analytics' | 'settings';

interface AdminLayoutProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  pendingReportsCount: number;
  children: React.ReactNode;
}

const ADMIN_NAV: { id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'communities', label: 'Communities', icon: UsersRound },
  { id: 'reports', label: 'Reports', icon: Flag },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function AdminLayout({
  activeTab,
  onSelectTab,
  pendingReportsCount,
  children,
}: AdminLayoutProps) {
  const { logout } = useSafeSpace();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const renderSidebar = (idPrefix: string) => (
    <div className="flex flex-col h-full">
      <div className="h-16 px-5 flex items-center justify-between border-b border-[#1E2C47]">
        <Link to="/admin" onClick={() => setMobileOpen(false)}>
          <BrandLogo size="sm" label="Admin" />
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          aria-label="Close admin sidebar"
          className="lg:hidden p-1.5 text-[#929DB3] hover:text-[#F4F6FC]"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1" aria-label="Admin navigation">
        {ADMIN_NAV.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => {
                onSelectTab(id);
                setMobileOpen(false);
              }}
              className={`relative w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13.5px] font-medium transition-colors ${
                active
                  ? 'text-[#F4F6FC]'
                  : 'text-[#929DB3] hover:text-[#F4F6FC] hover:bg-[#15223B]/70'
              }`}
            >
              {active && (
                <motion.span
                  layoutId={`${idPrefix}-admin-nav`}
                  transition={{ type: 'spring', stiffness: 360, damping: 32 }}
                  className="absolute inset-0 rounded-xl bg-[#223457] -z-0"
                />
              )}
              <span className="relative z-10 flex items-center gap-3">
                <Icon className={`w-[18px] h-[18px] ${active ? 'text-[#A69BFF]' : 'text-[#8492AD]'}`} />
                <span>{label}</span>
              </span>
              {id === 'reports' && pendingReportsCount > 0 && (
                <span className="relative z-10 text-[11px] font-bold text-[#EB5D68] tabular-nums">
                  {pendingReportsCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="px-3 py-3 border-t border-[#1E2C47] space-y-1">
        <Link
          to="/dashboard"
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13.5px] font-medium text-[#9BCBFF] hover:bg-[#15223B] transition-colors"
        >
          <ArrowLeft className="w-[18px] h-[18px]" />
          <span>User App</span>
        </Link>
        <button
          type="button"
          onClick={() => {
            logout();
            navigate('/auth');
          }}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13.5px] font-medium text-[#929DB3] hover:text-[#FF99A1] hover:bg-[#251A26] transition-colors"
        >
          <LogOut className="w-[18px] h-[18px]" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080D18] text-[#F4F6FC] flex">
      <aside className="hidden lg:block w-[224px] shrink-0 bg-[#0D1628] border-r border-[#1F2D49] sticky top-0 h-screen">
        {renderSidebar('desktop')}
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/65 backdrop-blur-xs"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.28, ease: EASE_SMOOTH }}
              className="relative w-64 max-w-[82vw] bg-[#0D1628] border-r border-[#1F2D49] h-full z-10"
            >
              {renderSidebar('mobile')}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="lg:hidden h-14 px-4 border-b border-[#1E2C47] bg-[#0D1628] flex items-center justify-between">
          <BrandLogo size="sm" label="Admin" />
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open admin menu"
            className="p-2 rounded-xl bg-[#131F35] border border-[#25334D] text-[#F4F6FC]"
          >
            <Menu className="w-5 h-5" />
          </button>
        </header>
        <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 overflow-x-clip">
          <AnimatePresence
            mode="wait"
            initial={false}
            onExitComplete={() => {
              window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
            }}
          >
            <PageTransition key={activeTab}>{children}</PageTransition>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
