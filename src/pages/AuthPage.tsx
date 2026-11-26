import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';
import { EASE_SMOOTH } from '../components/MotionPrimitives';
import { useSafeSpace } from '../context/SafeSpaceContext';
import { validateAuthForm } from '../utils/safespaceLogic';

export function AuthPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'signup' ? 'signup' : 'login';
  const [mode, setMode] = useState<'login' | 'signup'>(initialTab);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('alex@safespace.demo');
  const [password, setPassword] = useState('safespace2026');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  const { loginDemo, signupDemo, showToast } = useSafeSpace();
  const navigate = useNavigate();

  useEffect(() => {
    const param = searchParams.get('tab');
    if (param === 'signup' || param === 'login') {
      setMode(param);
    }
  }, [searchParams]);

  const switchMode = (next: 'login' | 'signup') => {
    setMode(next);
    setErrors({});
    setSearchParams({ tab: next });
    if (next === 'signup' && email === 'alex@safespace.demo') {
      setEmail('');
      setPassword('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateAuthForm({ mode, name, email, password });
    if (!result.valid) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    if (mode === 'login') {
      loginDemo(email);
    } else {
      signupDemo(name, email);
    }
    navigate('/dashboard');
  };

  const handleProviderDemo = (provider: 'Google' | 'Discord') => {
    loginDemo(`alex.${provider.toLowerCase()}@safespace.demo`, 'Alex');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#080D18] text-[#F4F6FC] flex flex-col items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.985 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 'some' }}
        transition={{ duration: 0.45, ease: EASE_SMOOTH }}
        className="w-full max-w-[920px] bg-[#0D1628] border border-[#223252] rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12"
      >
        {/* Left Brand Panel */}
        <div className="md:col-span-5 bg-[#091020] p-8 sm:p-10 flex flex-col items-center justify-between text-center border-b md:border-b-0 md:border-r border-[#1F2D49]">
          <div className="pt-4">
            <Link to="/" aria-label="Return to SafeSpace home">
              <BrandLogo size="lg" stacked />
            </Link>
            <h1 className="text-2xl font-bold text-[#F4F6FC] mt-7">
              {mode === 'login' ? 'Welcome back' : 'Join SafeSpace'}
            </h1>
            <p className="text-xs sm:text-sm text-[#929DB3] mt-2">
              {mode === 'login'
                ? 'Sign in to continue your journey'
                : 'Create your anonymous mental wellness space'}
            </p>
          </div>

          {/* Gently floating sprouting plant matching Screen 2 */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            className="my-8 relative flex items-center justify-center"
            aria-hidden="true"
          >
            <div className="w-36 h-36 rounded-full bg-[#648BFF]/10 blur-2xl absolute" />
            <svg viewBox="0 0 160 120" fill="none" className="w-40 h-28 relative">
              <path
                d="M25 96C50 86 110 86 135 96"
                stroke="#3A4F7A"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M80 90V52"
                stroke="#9A94FF"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
              <path
                d="M80 65C64 62 56 50 56 38C68 38 78 47 80 60Z"
                fill="#A69BFF"
                fillOpacity="0.85"
              />
              <path
                d="M80 58C95 54 103 43 103 31C91 31 82 40 80 53Z"
                fill="#648BFF"
                fillOpacity="0.9"
              />
              <circle cx="54" cy="28" r="2" fill="#9BCBFF" opacity="0.7" />
              <circle cx="109" cy="24" r="1.5" fill="#A69BFF" opacity="0.8" />
              <circle cx="96" cy="70" r="1.5" fill="#648BFF" opacity="0.6" />
            </svg>
          </motion.div>

          <p className="text-sm font-medium text-[#C5BFFF] italic pb-2">
            &lsquo;A safer space for your mind.&rsquo;
          </p>
        </div>

        {/* Right Form Panel */}
        <div className="md:col-span-7 bg-[#111C33] p-7 sm:p-10">
          {/* Tabs with smooth animated underline */}
          <div className="grid grid-cols-2 border-b border-[#25334D] mb-7 relative" role="tablist">
            {(
              [
                { id: 'login', label: 'Login' },
                { id: 'signup', label: 'Sign Up' },
              ] as const
            ).map((tab) => {
              const active = mode === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => switchMode(tab.id)}
                  className={`relative pb-3.5 text-sm font-semibold transition-colors ${
                    active ? 'text-[#F4F6FC]' : 'text-[#929DB3] hover:text-[#F4F6FC]'
                  }`}
                >
                  {tab.label}
                  {active && (
                    <motion.span
                      layoutId="auth-tab-underline"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      className="absolute left-0 right-0 -bottom-px h-0.5 bg-[#7C91FF]"
                    />
                  )}
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <AnimatePresence initial={false}>
              {mode === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: EASE_SMOOTH }}
                >
                  <label htmlFor="auth-name" className="block text-xs font-semibold text-[#D6DEF0] mb-1.5">
                    Display name
                  </label>
                  <input
                    id="auth-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex"
                    className="w-full bg-[#0D1628] border border-[#25334D] rounded-xl px-4 py-3 text-sm text-[#F4F6FC] placeholder:text-[#6D7B98] focus:outline-none focus:border-[#648BFF]"
                  />
                  {errors.name && <p className="text-xs text-[#FF8C96] mt-1">{errors.name}</p>}
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label htmlFor="auth-email" className="block text-xs font-semibold text-[#D6DEF0] mb-1.5">
                Email address
              </label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-[#0D1628] border border-[#25334D] rounded-xl px-4 py-3 text-sm text-[#F4F6FC] placeholder:text-[#6D7B98] focus:outline-none focus:border-[#648BFF]"
              />
              {errors.email && <p className="text-xs text-[#FF8C96] mt-1">{errors.email}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="auth-password" className="text-xs font-semibold text-[#D6DEF0]">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0D1628] border border-[#25334D] rounded-xl pl-4 pr-11 py-3 text-sm text-[#F4F6FC] placeholder:text-[#6D7B98] focus:outline-none focus:border-[#648BFF]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#929DB3] hover:text-[#F4F6FC]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-[#FF8C96] mt-1">{errors.password}</p>}

              {mode === 'login' && (
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    onClick={() =>
                      showToast('Demo mode: use any valid email & 6+ character password.', 'info')
                    }
                    className="text-xs font-medium text-[#A69BFF] hover:text-[#C4BCFF]"
                  >
                    Forgot password?
                  </button>
                </div>
              )}
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.985 }}
              className="w-full safespace-gradient-btn py-3 rounded-xl text-sm font-semibold text-white inline-flex items-center justify-center gap-2 shadow-lg shadow-[#648BFF]/20 mt-2 transition-all"
            >
              <span>{mode === 'login' ? 'Login' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="h-px bg-[#25334D] flex-1" />
            <span className="text-xs text-[#929DB3]">or continue with</span>
            <div className="h-px bg-[#25334D] flex-1" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => handleProviderDemo('Google')}
              className="py-2.5 px-4 rounded-xl bg-[#182643] hover:bg-[#203256] border border-[#2B3E64] text-sm font-semibold text-[#F4F6FC] flex items-center justify-center gap-2 transition-colors"
            >
              <span className="w-4 h-4 rounded-full bg-white text-[#080D18] text-[11px] font-extrabold inline-flex items-center justify-center">
                G
              </span>
              <span>Google</span>
            </motion.button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => handleProviderDemo('Discord')}
              className="py-2.5 px-4 rounded-xl bg-[#182643] hover:bg-[#203256] border border-[#2B3E64] text-sm font-semibold text-[#F4F6FC] flex items-center justify-center gap-2 transition-colors"
            >
              <span className="w-4 h-4 rounded-full bg-[#5865F2] text-white text-[10px] font-bold inline-flex items-center justify-center">
                D
              </span>
              <span>Discord</span>
            </motion.button>
          </div>

          <p className="text-center text-xs text-[#929DB3] mt-6">
            {mode === 'login' ? (
              <>
                New to SafeSpace?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('signup')}
                  className="text-[#A69BFF] hover:text-[#C5BFFF] font-semibold"
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="text-[#A69BFF] hover:text-[#C5BFFF] font-semibold"
                >
                  Login here
                </button>
              </>
            )}
          </p>
        </div>
      </motion.div>

      <div className="mt-5 flex items-center gap-4 text-xs text-[#929DB3]">
        <Link to="/" className="hover:text-[#F4F6FC]">
          ← Back to Landing Page
        </Link>
        <span>·</span>
        <Link to="/admin" className="hover:text-[#A69BFF]">
          Admin Portal
        </Link>
      </div>
    </div>
  );
}
