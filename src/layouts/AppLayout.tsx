import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  Bell,
  BookOpen,
  Compass,
  Heart,
  Home,
  LogOut,
  Menu,
  MessageCircle,
  MessageSquareHeart,
  Search,
  Settings,
  Smile,
  User,
  Users,
  X,
} from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';
import { Avatar } from '../components/Avatar';
import { SettingsModal } from '../components/SettingsModal';
import { EASE_SMOOTH, PageTransition } from '../components/MotionPrimitives';
import { useSafeSpace } from '../context/SafeSpaceContext';
import { getRouteTransitionSpec } from '../utils/routeTransitions';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Home', icon: Home },
  { to: '/discover', label: 'Discover', icon: Compass },
  { to: '/communities', label: 'Communities', icon: Users },
  { to: '/real-talk', label: 'Real Talk', icon: MessageCircle },
  { to: '/same-here', label: 'Same Here', icon: Heart },
  { to: '/my-space', label: 'My Space', icon: User },
  { to: '/talk-it-out', label: 'Talk It Out', icon: MessageSquareHeart },
  { to: '/mood-tracker', label: 'Mood Tracker', icon: Smile },
  { to: '/journal', label: 'Journal', icon: BookOpen },
];

function FrozenOutlet() {
  const outlet = useOutlet();
  const [frozen] = useState(outlet);
  return <>{frozen}</>;
}

export function AppLayout() {
  const { state, globalSearch, setGlobalSearch, logout } = useSafeSpace();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const prevPathRef = useRef(location.pathname);
  const transitionSpec = getRouteTransitionSpec(prevPathRef.current, location.pathname);

  useEffect(() => {
    prevPathRef.current = location.pathname;
  }, [location.pathname]);

  const handleGlobalSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/discover');
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const renderSidebar = (idPrefix: string) => (
    <div className="flex flex-col h-full">
      <div className="h-16 px-5 flex items-center justify-between border-b border-[#1E2C47]/80">
        <Link to="/" onClick={() => setMobileNavOpen(false)} aria-label="SafeSpace Home">
          <BrandLogo size="sm" />
        </Link>
        <button
          type="button"
          onClick={() => setMobileNavOpen(false)}
          aria-label="Close navigation menu"
          className="lg:hidden p-1.5 text-[#929DB3] hover:text-[#F4F6FC]"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Main navigation">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setMobileNavOpen(false)}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13.5px] font-medium transition-colors whitespace-nowrap ${
                isActive
                  ? 'text-[#F4F6FC]'
                  : 'text-[#929DB3] hover:text-[#F4F6FC] hover:bg-[#15223B]/70'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId={`${idPrefix}-active-nav`}
                    transition={{ type: 'spring', stiffness: 360, damping: 32 }}
                    className="absolute inset-0 rounded-xl bg-[#223457] shadow-xs -z-0"
                  />
                )}
                <Icon
                  className={`relative z-10 w-[18px] h-[18px] shrink-0 transition-colors ${
                    isActive ? 'text-[#A69BFF]' : 'text-[#8492AD]'
                  }`}
                />
                <span className="relative z-10">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-3 border-t border-[#1E2C47]/80 space-y-1">
        <button
          type="button"
          onClick={() => {
            setMobileNavOpen(false);
            setSettingsOpen(true);
          }}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13.5px] font-medium text-[#929DB3] hover:text-[#F4F6FC] hover:bg-[#15223B] transition-colors"
        >
          <Settings className="w-[18px] h-[18px] text-[#8492AD]" />
          <span>Settings</span>
        </button>
        <button
          type="button"
          onClick={handleLogout}
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
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-[224px] shrink-0 bg-[#0D1628] border-r border-[#1F2D49] sticky top-0 h-screen">
        {renderSidebar('desktop')}
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileNavOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/65 backdrop-blur-xs"
              onClick={() => setMobileNavOpen(false)}
              aria-hidden="true"
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

      {/* Main Column */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="h-16 bg-[#080D18]/90 backdrop-blur-md border-b border-[#1A2742] sticky top-0 z-30 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 max-w-lg">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open navigation menu"
              className="lg:hidden p-2 rounded-xl bg-[#131F35] border border-[#25334D] text-[#F4F6FC]"
            >
              <Menu className="w-5 h-5" />
            </button>

            <form onSubmit={handleGlobalSearchSubmit} className="relative flex-1">
              <Search className="w-4 h-4 text-[#929DB3] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Search SafeSpace..."
                aria-label="Search SafeSpace"
                className="w-full bg-[#111B2E] border border-[#25334D] rounded-xl pl-10 pr-4 py-2 text-sm text-[#F4F6FC] placeholder:text-[#8492AD] focus:outline-none focus:border-[#648BFF] transition-colors"
              />
            </form>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifOpen((prev) => !prev)}
                aria-label="Notifications"
                aria-expanded={notifOpen}
                className="relative p-2 rounded-xl text-[#929DB3] hover:text-[#F4F6FC] hover:bg-[#131F35] transition-colors"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#EB5D68]" />
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: -6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: -6 }}
                    transition={{ duration: 0.18, ease: EASE_SMOOTH }}
                    className="absolute right-0 mt-2 w-72 bg-[#131F35] border border-[#25334D] rounded-2xl shadow-2xl p-4 z-40 origin-top-right"
                  >
                    <div className="flex items-center justify-between pb-2.5 border-b border-[#25334D]">
                      <span className="text-xs font-bold text-[#F4F6FC]">Notifications</span>
                      <button
                        type="button"
                        onClick={() => setNotifOpen(false)}
                        className="text-[11px] text-[#9BCBFF] hover:underline"
                      >
                        Close
                      </button>
                    </div>
                    <div className="divide-y divide-[#25334D]/60 mt-1">
                      <div className="py-2.5">
                        <p className="text-xs text-[#F4F6FC]">
                          Someone related to your anonymous post in <span className="text-[#A69BFF]">Self-Growth</span>.
                        </p>
                        <span className="text-[11px] text-[#929DB3]">18m ago</span>
                      </div>
                      <div className="py-2.5">
                        <p className="text-xs text-[#F4F6FC]">
                          Daily reminder: Take 10 seconds for your Mood Check-in.
                        </p>
                        <span className="text-[11px] text-[#929DB3]">2h ago</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              to="/my-space"
              aria-label={`Open ${state.user.name}'s profile`}
              className="rounded-full ring-2 ring-[#25334D] hover:ring-[#648BFF] transition-all"
            >
              <Avatar src={state.user.avatarUrl} name={state.user.name} size="sm" />
            </Link>
          </div>
        </header>

        {/* Animated Direction-Aware Page Content Transition */}
        <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 overflow-x-clip">
          <AnimatePresence
            mode="wait"
            initial={false}
            custom={transitionSpec}
            onExitComplete={() => {
              window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
            }}
          >
            <PageTransition
              key={location.pathname}
              axis={transitionSpec.axis}
              direction={transitionSpec.direction}
            >
              <FrozenOutlet />
            </PageTransition>
          </AnimatePresence>
        </main>
      </div>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
