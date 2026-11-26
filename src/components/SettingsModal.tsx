import React from 'react';
import { RotateCcw, Shield, ShieldCheck, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { useSafeSpace } from '../context/SafeSpaceContext';
import { EASE_SMOOTH } from './MotionPrimitives';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const { state, updateProfile, resetDemoData } = useSafeSpace();
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="settings-modal-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.24, ease: EASE_SMOOTH }}
            className="bg-[#131F35] border border-[#25334D] rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 id="settings-modal-title" className="text-lg font-bold text-[#F4F6FC]">
                  Settings & Privacy
                </h2>
                <p className="text-xs text-[#929DB3]">Manage your SafeSpace demo preferences</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close settings"
                className="p-1.5 rounded-lg text-[#929DB3] hover:text-[#F4F6FC] hover:bg-[#1B2942]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-[#0D1628] border border-[#25334D] rounded-xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#A69BFF] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-[#F4F6FC]">Default Anonymous Posting</p>
                    <p className="text-xs text-[#929DB3] mt-0.5">
                      Hide your display name on Dashboard & Real Talk posts.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={state.user.isAnonymousDefault}
                  aria-label="Toggle default anonymous posting"
                  onClick={() =>
                    updateProfile({ isAnonymousDefault: !state.user.isAnonymousDefault })
                  }
                  className={`w-11 h-6 rounded-full transition-colors p-0.5 shrink-0 ${
                    state.user.isAnonymousDefault ? 'bg-[#648BFF]' : 'bg-[#25334D]'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                      state.user.isAnonymousDefault ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="bg-[#0D1628] border border-[#25334D] rounded-xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-[#9BCBFF] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-[#F4F6FC]">Admin Moderation Portal</p>
                    <p className="text-xs text-[#929DB3] mt-0.5">
                      Open Screen 12 (Admin Dashboard) for moderation demo.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate('/admin');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#1B2942] hover:bg-[#253657] border border-[#2F4368] text-xs font-semibold text-[#F4F6FC] whitespace-nowrap shrink-0 transition-colors"
                >
                  Open Admin
                </button>
              </div>

              <div className="bg-[#0D1628] border border-[#25334D] rounded-xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <RotateCcw className="w-5 h-5 text-[#F4C950] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-[#F4F6FC]">Reset Demo Data</p>
                    <p className="text-xs text-[#929DB3] mt-0.5">
                      Restore initial sample posts, moods, journal entries & reports.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    resetDemoData();
                    onClose();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#2A1F2E] hover:bg-[#3A273E] border border-[#EB5D68]/40 text-xs font-semibold text-[#FF99A1] whitespace-nowrap shrink-0 transition-colors"
                >
                  Reset Data
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
