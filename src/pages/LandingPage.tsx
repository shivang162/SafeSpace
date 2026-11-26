import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react';
import {
  ArrowRight,
  HeartHandshake,
  Lock,
  Menu,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';
import { AvatarStack } from '../components/Avatar';
import {
  EASE_SMOOTH,
  ScrollProgressBar,
  ScrollReveal,
  StaggerGroup,
  StaggerItem,
} from '../components/MotionPrimitives';
import { ASSETS } from '../data/seedData';
import { useSafeSpace } from '../context/SafeSpaceContext';

export function LandingPage() {
  const { state, setGlobalSearch } = useSafeSpace();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickQuery, setQuickQuery] = useState('');

  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroBgY = useTransform(heroScroll, [0, 1], ['0%', '14%']);
  const heroBgScale = useTransform(heroScroll, [0, 1], [1, 1.06]);

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalSearch(quickQuery);
    navigate('/discover');
  };

  return (
    <div className="min-h-screen bg-[#080D18] text-[#F4F6FC]">
      <ScrollProgressBar />

      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-[#080D18]/85 backdrop-blur-md border-b border-[#1A2742]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
          <Link to="/" aria-label="SafeSpace Home">
            <BrandLogo size="sm" />
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#B7C2D9]">
            <Link to="/" className="text-[#F4F6FC] hover:text-white transition-colors whitespace-nowrap">
              Home
            </Link>
            <Link to="/communities" className="hover:text-[#F4F6FC] transition-colors whitespace-nowrap">
              Communities
            </Link>
            <Link to="/discover" className="hover:text-[#F4F6FC] transition-colors whitespace-nowrap">
              Discover
            </Link>
            <a href="#why-safespace" className="hover:text-[#F4F6FC] transition-colors whitespace-nowrap">
              More
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-3 shrink-0">
            {searchOpen ? (
              <motion.form
                initial={{ opacity: 0, width: 120 }}
                animate={{ opacity: 1, width: 'auto' }}
                onSubmit={handleQuickSearch}
                className="flex items-center gap-1.5"
              >
                <input
                  type="search"
                  value={quickQuery}
                  onChange={(e) => setQuickQuery(e.target.value)}
                  placeholder="Search topics..."
                  aria-label="Search topics"
                  autoFocus
                  className="w-44 bg-[#131F35] border border-[#25334D] rounded-lg px-3 py-1.5 text-xs text-[#F4F6FC] placeholder:text-[#929DB3] focus:outline-none focus:border-[#648BFF]"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  aria-label="Close search"
                  className="p-1.5 text-[#929DB3] hover:text-[#F4F6FC]"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.form>
            ) : (
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="Search SafeSpace"
                className="p-2 rounded-lg text-[#B7C2D9] hover:text-[#F4F6FC] hover:bg-[#131F35] transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            )}

            <Link
              to="/auth?tab=login"
              className="px-4 py-2 rounded-xl border border-[#2A3B5E] bg-[#101A2F] hover:bg-[#182644] text-xs font-semibold text-[#F4F6FC] transition-colors whitespace-nowrap"
            >
              Login
            </Link>
            <Link
              to="/auth?tab=signup"
              className="safespace-gradient-btn px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-md shadow-[#648BFF]/20 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
            >
              Sign Up
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 rounded-xl bg-[#131F35] border border-[#25334D] text-[#F4F6FC]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: EASE_SMOOTH }}
              className="md:hidden bg-[#0D1628] border-b border-[#25334D] px-4 py-4 space-y-3"
            >
              <div className="flex flex-col space-y-2 text-sm font-medium text-[#D6DEF0]">
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="py-1.5">
                  Home
                </Link>
                <Link to="/communities" onClick={() => setMobileMenuOpen(false)} className="py-1.5">
                  Communities
                </Link>
                <Link to="/discover" onClick={() => setMobileMenuOpen(false)} className="py-1.5">
                  Discover
                </Link>
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="py-1.5">
                  Open Dashboard
                </Link>
              </div>
              <div className="flex items-center gap-3 pt-2 border-t border-[#25334D]">
                <Link
                  to="/auth?tab=login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 rounded-xl border border-[#2A3B5E] bg-[#131F35] text-sm font-semibold"
                >
                  Login
                </Link>
                <Link
                  to="/auth?tab=signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 rounded-xl safespace-gradient-btn text-sm font-semibold text-white"
                >
                  Sign Up
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section with gentle scroll parallax */}
      <section ref={heroRef} className="relative overflow-hidden border-b border-[#1A2742]">
        <motion.div
          style={{ y: heroBgY, scale: heroBgScale }}
          className="absolute inset-0 will-change-transform"
        >
          <img
            src={ASSETS.heroRooftop}
            alt="Quiet twilight rooftop overlooking city lights"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-right opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080D18] via-[#080D18]/85 to-[#080D18]/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080D18] via-transparent to-[#080D18]/40" />
        </motion.div>

        <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
          <div className="max-w-xl space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold leading-[1.12] tracking-tight">
              <motion.span
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.05, ease: EASE_SMOOTH }}
                className="block text-[#F4F6FC]"
              >
                A place to be human.
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.16, ease: EASE_SMOOTH }}
                className="block safespace-gradient-text"
              >
                Nothing to prove.
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.27, ease: EASE_SMOOTH }}
                className="block safespace-gradient-text"
              >
                Nothing to pretend.
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.36, ease: EASE_SMOOTH }}
              className="text-base sm:text-lg text-[#C7D2E8] leading-relaxed max-w-md"
            >
              Real conversations, honest experiences and a community that gets it.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.45, ease: EASE_SMOOTH }}
              className="flex flex-wrap items-center gap-3.5 pt-2"
            >
              <Link
                to="/discover"
                className="safespace-gradient-btn px-6 py-3.5 rounded-xl text-sm font-semibold text-white inline-flex items-center gap-2 shadow-lg shadow-[#648BFF]/25 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
              >
                <span>Find Your People</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#why-safespace"
                className="px-6 py-3.5 rounded-xl bg-[#131F35]/90 hover:bg-[#1B2942] border border-[#2C3E62] text-sm font-semibold text-[#F4F6FC] transition-all hover:-translate-y-0.5 whitespace-nowrap"
              >
                Explore SafeSpace
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why SafeSpace? Section */}
      <section id="why-safespace" className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <ScrollReveal className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F4F6FC]">Why SafeSpace?</h2>
          <p className="text-sm sm:text-base text-[#929DB3] mt-2">
            Speak Freely. Stay Anonymous. Share Your Feelings without comparison or pressure.
          </p>
        </ScrollReveal>

        <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
          <StaggerItem hoverLift>
            <div className="h-full bg-[#131F35] border border-[#25334D] rounded-2xl p-6 text-center flex flex-col items-center hover:border-[#3A4F78] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#1B2942] border border-[#2F4369] flex items-center justify-center text-[#A69BFF] mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#F4F6FC]">Anonymous &amp; Safe</h3>
              <p className="text-sm text-[#929DB3] mt-1.5">Share freely, stay private.</p>
            </div>
          </StaggerItem>

          <StaggerItem hoverLift>
            <div className="h-full bg-[#131F35] border border-[#25334D] rounded-2xl p-6 text-center flex flex-col items-center hover:border-[#3A4F78] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#1B2942] border border-[#2F4369] flex items-center justify-center text-[#9BCBFF] mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#F4F6FC]">Supportive Community</h3>
              <p className="text-sm text-[#929DB3] mt-1.5">Find your people.</p>
            </div>
          </StaggerItem>

          <StaggerItem hoverLift>
            <div className="h-full bg-[#131F35] border border-[#25334D] rounded-2xl p-6 text-center flex flex-col items-center hover:border-[#3A4F78] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#1B2942] border border-[#2F4369] flex items-center justify-center text-[#A69BFF] mb-4">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#F4F6FC]">Mental Wellness Tools</h3>
              <p className="text-sm text-[#929DB3] mt-1.5">Track, reflect and grow.</p>
            </div>
          </StaggerItem>
        </StaggerGroup>

        {/* Social proof bar */}
        <ScrollReveal delay={0.12} className="mt-10 flex flex-col items-center justify-center gap-3">
          <p className="text-sm font-medium text-[#C7D2E8]">Trusted by 100K+ people</p>
          <AvatarStack count={6} size="md" />
        </ScrollReveal>
      </section>

      {/* Community Preview Section */}
      <section className="bg-[#0D1628]/70 border-y border-[#1A2742] py-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#F4F6FC]">
                Find People Who Understand
              </h2>
              <p className="text-sm text-[#929DB3] mt-1.5">
                Join judgment-free circles built around college life, anxiety, friendships, and self-growth.
              </p>
            </div>
            <Link
              to="/communities"
              className="text-sm font-semibold text-[#9BCBFF] hover:text-[#A69BFF] inline-flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>Explore all communities</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </ScrollReveal>

          <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {state.communities.slice(0, 3).map((comm) => (
              <StaggerItem key={comm.id} hoverLift>
                <Link
                  to={`/communities/${comm.id}`}
                  className="group h-full bg-[#131F35] border border-[#25334D] rounded-2xl overflow-hidden hover:border-[#648BFF]/70 transition-all flex flex-col"
                >
                  <div className="aspect-[16/10] w-full overflow-hidden bg-[#1B2942]">
                    <img
                      src={comm.imageUrl}
                      alt={comm.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-base font-bold text-[#F4F6FC] group-hover:text-[#9BCBFF] transition-colors">
                      {comm.name}
                    </h3>
                    <p className="text-xs text-[#929DB3] mt-1 tabular-nums">
                      {comm.memberCountDisplay} members
                    </p>
                    <p className="text-xs text-[#C7D2E8] mt-2.5 line-clamp-2 leading-relaxed flex-1">
                      {comm.description}
                    </p>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Privacy & Emotional Journey Section */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <StaggerGroup className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <StaggerItem hoverLift>
            <div className="h-full bg-[#131F35] border border-[#25334D] rounded-2xl p-7 flex flex-col justify-between hover:border-[#3A4F78] transition-colors">
              <div>
                <div className="w-11 h-11 rounded-xl bg-[#1B2942] border border-[#2F4369] flex items-center justify-center text-[#57D38C] mb-4">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-[#F4F6FC]">Speak Freely. Stay Anonymous.</h3>
                <p className="text-sm text-[#929DB3] mt-2.5 leading-relaxed">
                  No follower counts, no curated perfection, and no real-name pressure. Every journal
                  entry stays private on your device, and every Real Talk post protects your identity.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#25334D] flex items-center gap-6 text-xs text-[#C7D2E8]">
                <span>100% Anonymous Posting</span>
                <span>·</span>
                <span>Private Journal Lock</span>
                <span>·</span>
                <span>Active Moderation</span>
              </div>
            </div>
          </StaggerItem>

          <StaggerItem hoverLift>
            <div className="h-full bg-[#131F35] border border-[#25334D] rounded-2xl p-7 flex flex-col justify-between hover:border-[#3A4F78] transition-colors">
              <div>
                <div className="w-11 h-11 rounded-xl bg-[#1B2942] border border-[#2F4369] flex items-center justify-center text-[#A69BFF] mb-4">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-[#F4F6FC]">Track Your Emotional Journey</h3>
                <p className="text-sm text-[#929DB3] mt-2.5 leading-relaxed">
                  Check in with your mood in two seconds, celebrate one small win each day, reflect in
                  your private journal, or talk through heavy thoughts anytime.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/dashboard"
                  className="safespace-gradient-btn px-5 py-2.5 rounded-xl text-xs font-semibold text-white inline-flex items-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Enter SafeSpace Demo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/mood-tracker"
                  className="px-5 py-2.5 rounded-xl bg-[#1B2942] hover:bg-[#253657] border border-[#2E4266] text-xs font-semibold text-[#F4F6FC] transition-colors"
                >
                  Try Mood Tracker
                </Link>
              </div>
            </div>
          </StaggerItem>
        </StaggerGroup>
      </section>

      {/* Signup CTA */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <ScrollReveal>
          <div className="bg-gradient-to-r from-[#162441] via-[#1B294A] to-[#21264D] border border-[#2E4068] rounded-3xl p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F4F6FC]">
              Ready for a quieter corner of the internet?
            </h2>
            <p className="text-sm sm:text-base text-[#C7D2E8] mt-2.5 max-w-lg mx-auto">
              Join over 100,000 students and young adults sharing real feelings without judgment.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3.5">
              <Link
                to="/auth?tab=signup"
                className="safespace-gradient-btn px-7 py-3 rounded-xl text-sm font-semibold text-white inline-flex items-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Create Free Account</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/dashboard"
                className="px-7 py-3 rounded-xl bg-[#0D1628] hover:bg-[#131F35] border border-[#2C3E62] text-sm font-semibold text-[#F4F6FC] transition-colors"
              >
                Explore Dashboard
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1A2742] bg-[#060A13] py-10">
        <ScrollReveal y={12} className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <BrandLogo size="sm" />
            <span className="text-xs text-[#929DB3]">
              A place to be human. Nothing to prove. Nothing to pretend.
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-[#929DB3]">
            <Link to="/discover" className="hover:text-[#F4F6FC] transition-colors">
              Discover
            </Link>
            <Link to="/communities" className="hover:text-[#F4F6FC] transition-colors">
              Communities
            </Link>
            <Link to="/real-talk" className="hover:text-[#F4F6FC] transition-colors">
              Real Talk
            </Link>
            <Link to="/talk-it-out" className="hover:text-[#F4F6FC] transition-colors">
              Talk It Out
            </Link>
            <Link to="/admin" className="hover:text-[#A69BFF] transition-colors">
              Admin Dashboard
            </Link>
          </div>
        </ScrollReveal>
      </footer>
    </div>
  );
}
