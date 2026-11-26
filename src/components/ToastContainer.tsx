import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';
import { useSafeSpace } from '../context/SafeSpaceContext';
import { EASE_SMOOTH } from './MotionPrimitives';

export function ToastContainer() {
  const { toasts, dismissToast } = useSafeSpace();

  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-[calc(100%-2.5rem)] pointer-events-none"
      role="status"
      aria-live="polite"
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.24, ease: EASE_SMOOTH }}
            className="pointer-events-auto bg-[#1B2942] border border-[#344A73] text-[#F4F6FC] rounded-xl px-4 py-3 shadow-2xl flex items-center gap-3"
          >
            {toast.type === 'success' && (
              <CheckCircle2 className="w-4 h-4 text-[#57D38C] shrink-0" />
            )}
            {toast.type === 'info' && (
              <Info className="w-4 h-4 text-[#9BCBFF] shrink-0" />
            )}
            {toast.type === 'warning' && (
              <AlertTriangle className="w-4 h-4 text-[#F4C950] shrink-0" />
            )}
            <span className="text-xs sm:text-sm font-medium flex-1 leading-snug">
              {toast.message}
            </span>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
              className="text-[#929DB3] hover:text-[#F4F6FC] p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
