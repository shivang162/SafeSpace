/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig } from 'motion/react';
import { SafeSpaceProvider } from './context/SafeSpaceContext';
import { ToastContainer } from './components/ToastContainer';
import { RouteTransitionBar, ShellPageTransition } from './components/MotionPrimitives';
import { getRouteShellKey } from './utils/routeTransitions';
import { AppLayout } from './layouts/AppLayout';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { DiscoverPage } from './pages/DiscoverPage';
import { CommunitiesPage } from './pages/CommunitiesPage';
import { RealTalkPage } from './pages/RealTalkPage';
import { SameHerePage } from './pages/SameHerePage';
import { MySpacePage } from './pages/MySpacePage';
import { TalkItOutPage } from './pages/TalkItOutPage';
import { MoodTrackerPage } from './pages/MoodTrackerPage';
import { JournalPage } from './pages/JournalPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

function AnimatedRoutes() {
  const location = useLocation();
  const shellKey = getRouteShellKey(location.pathname);
  const initialPathRef = useRef(location.pathname);
  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    if (location.pathname !== initialPathRef.current) {
      setHasNavigated(true);
    }
  }, [location.pathname]);

  const handleExitComplete = () => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  return (
    <>
      {hasNavigated && <RouteTransitionBar routeKey={location.pathname} />}
      <AnimatePresence mode="wait" initial={false} onExitComplete={handleExitComplete}>
        <ShellPageTransition key={shellKey} className="min-h-screen">
          <Routes location={location}>
            {/* Screen 1: Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Screen 2: Login / Signup */}
            <Route path="/auth" element={<AuthPage />} />

            {/* Screens 3–11: Main SafeSpace App Shell */}
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/discover" element={<DiscoverPage />} />
              <Route path="/communities" element={<CommunitiesPage />} />
              <Route path="/communities/:id" element={<CommunitiesPage />} />
              <Route path="/real-talk" element={<RealTalkPage />} />
              <Route path="/same-here" element={<SameHerePage />} />
              <Route path="/my-space" element={<MySpacePage />} />
              <Route path="/talk-it-out" element={<TalkItOutPage />} />
              <Route path="/mood-tracker" element={<MoodTrackerPage />} />
              <Route path="/journal" element={<JournalPage />} />
            </Route>

            {/* Screen 12: Separate Admin Dashboard */}
            <Route path="/admin" element={<AdminDashboardPage />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ShellPageTransition>
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <SafeSpaceProvider>
        <BrowserRouter>
          <AnimatedRoutes />
          <ToastContainer />
        </BrowserRouter>
      </SafeSpaceProvider>
    </MotionConfig>
  );
}
