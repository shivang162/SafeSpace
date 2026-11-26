import React, { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  Heart,
  RotateCcw,
  Send,
  Sparkles,
  Wind,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useSafeSpace } from '../context/SafeSpaceContext';
import { ASSETS } from '../data/seedData';
import { Avatar } from '../components/Avatar';
import { EASE_SMOOTH, ScrollReveal, SUBTLE_CARD_HOVER } from '../components/MotionPrimitives';

const STARTER_PROMPTS = [
  'I feel anxious',
  'Overthinking',
  'Low motivation',
  'Need support',
  'Something else',
];

export function TalkItOutPage() {
  const { state, sendCompanionMessage, clearChatHistory } = useSafeSpace();
  const [input, setInput] = useState('');
  const [breathingOpen, setBreathingOpen] = useState(false);
  const [breathSeconds, setBreathSeconds] = useState(0);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.chatMessages.length]);

  useEffect(() => {
    if (!breathingOpen) {
      setBreathSeconds(0);
      return;
    }
    const timer = window.setInterval(() => {
      setBreathSeconds((s) => (s + 1) % 120);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [breathingOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendCompanionMessage(input);
    setInput('');
  };

  const breathPhase =
    breathSeconds % 12 < 4
      ? 'Breathe in slowly (4s)'
      : breathSeconds % 12 < 8
      ? 'Hold gently (4s)'
      : 'Exhale completely (4s)';

  return (
    <div className="bg-[#0D1628] border border-[#25334D] rounded-3xl overflow-hidden grid grid-cols-1 xl:grid-cols-12 min-h-[calc(100vh-8.5rem)]">
      {/* Left Aesthetic Cozy Desk Column matching Screen 9 */}
      <div className="hidden xl:block xl:col-span-3 relative bg-[#131F35] overflow-hidden">
        <motion.img
          src={ASSETS.cozyDesk}
          alt="Cozy desk by a twilight window with tea mug and plant"
          referrerPolicy="no-referrer"
          initial={{ scale: 1.06, opacity: 0.85 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.9, ease: EASE_SMOOTH }}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080D18]/85 via-transparent to-[#080D18]/25" />
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: EASE_SMOOTH }}
          className="absolute bottom-5 left-5 right-5 text-xs text-[#D6DEF0] bg-[#0D1628]/80 border border-white/10 backdrop-blur-xs rounded-xl p-3.5"
        >
          <p className="font-semibold text-[#F4F6FC]">Safe reflection space</p>
          <p className="text-[11px] text-[#C7D2E8] mt-1 leading-relaxed">
            Simulated demo companion for supportive reflection — not a licensed therapist.
          </p>
        </motion.div>
      </div>

      {/* Main Chat Area */}
      <div className="xl:col-span-9 flex flex-col">
        {/* Header */}
        <ScrollReveal y={12}>
          <div className="px-5 sm:px-6 py-4 border-b border-[#25334D] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#F4F6FC]">Talk it Out</h1>
              <p className="text-xs text-[#929DB3] mt-0.5">
                Simulated supportive demo companion for mental wellness reflection — not a professional therapist.
              </p>
            </div>
            <button
              type="button"
              onClick={clearChatHistory}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#131F35] hover:bg-[#1B2942] border border-[#25334D] text-xs font-semibold text-[#C7D2E8] self-start sm:self-auto whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Chat</span>
            </button>
          </div>
        </ScrollReveal>

        {/* 3-Part Workspace matching Screen 9 */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0">
          {/* Starter Buttons Column */}
          <div className="lg:col-span-3 p-4 border-b lg:border-b-0 lg:border-r border-[#25334D]/70 flex lg:flex-col gap-2 overflow-x-auto">
            {STARTER_PROMPTS.map((starter, idx) => (
              <motion.button
                key={starter}
                type="button"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 'some' }}
                transition={{ duration: 0.3, delay: idx * 0.04, ease: EASE_SMOOTH }}
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => sendCompanionMessage(starter)}
                className="text-left px-3.5 py-2.5 rounded-xl bg-[#131F35] hover:bg-[#1E2E4E] border border-[#25334D] text-xs font-medium text-[#D6DEF0] hover:text-[#F4F6FC] transition-colors whitespace-nowrap lg:whitespace-normal shrink-0"
              >
                {starter}
              </motion.button>
            ))}
          </div>

          {/* Chat Thread + Composer */}
          <div className="lg:col-span-6 flex flex-col min-h-[420px]">
            <div className="flex-1 p-4 sm:p-5 space-y-4 overflow-y-auto max-h-[520px]">
              <AnimatePresence initial={false}>
                {state.chatMessages.map((msg) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.28, ease: EASE_SMOOTH }}
                      className={`flex items-start gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isUser && (
                        <Avatar
                          tone="#648BFF"
                          name="S"
                          size="sm"
                          className="mt-0.5 ring-2 ring-[#25334D]"
                        />
                      )}
                      <div
                        className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                          isUser
                            ? 'bg-gradient-to-r from-[#5C7CFA] to-[#7B78F8] text-white rounded-br-sm'
                            : msg.isDistressNotice
                            ? 'bg-[#2B1D2B] border border-[#EB5D68]/60 text-[#FFE5E8] rounded-bl-sm'
                            : 'bg-[#16243E] border border-[#25334D] text-[#E6ECF8] rounded-bl-sm'
                        }`}
                      >
                        {msg.isDistressNotice && (
                          <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF99A1] mb-1.5">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>Support Resources Available 24/7</span>
                          </div>
                        )}
                        <p>{msg.text}</p>
                        <span
                          className={`block text-[10px] mt-1.5 ${
                            isUser ? 'text-white/75 text-right' : 'text-[#8492AD]'
                          }`}
                        >
                          {msg.timestamp}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              <div ref={bottomRef} />
            </div>

            <form
              onSubmit={handleSend}
              className="p-4 border-t border-[#25334D] flex items-center gap-2.5 bg-[#0B1323]"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                aria-label="Type a message"
                className="flex-1 bg-[#131F35] border border-[#25334D] rounded-xl px-4 py-2.5 text-sm text-[#F4F6FC] placeholder:text-[#8492AD] focus:outline-none focus:border-[#648BFF]"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                aria-label="Send message"
                className="safespace-gradient-btn disabled:opacity-45 w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 transition-opacity"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right "Try these too:" Column matching Screen 9 */}
          <aside className="lg:col-span-3 p-4 border-t lg:border-t-0 lg:border-l border-[#25334D]/70 bg-[#101A2F]/60 space-y-3">
            <h2 className="text-xs font-bold text-[#C7D2E8]">Try these too:</h2>

            <motion.button
              type="button"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 'some' }}
              transition={{ duration: 0.36, ease: EASE_SMOOTH }}
              whileHover={SUBTLE_CARD_HOVER}
              whileTap={{ scale: 0.97 }}
              onClick={() => setBreathingOpen(true)}
              className="w-full text-left bg-[#16243E] hover:bg-[#1E2F50] border border-[#2A3C60] rounded-xl p-3.5 transition-colors space-y-1 will-change-transform"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-[#F4F6FC]">
                <Wind className="w-4 h-4 text-[#9BCBFF]" />
                <span>Deep Breathing</span>
              </div>
              <p className="text-[11px] text-[#929DB3]">(2 min) Guided calm reset</p>
            </motion.button>

            <motion.button
              type="button"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 'some' }}
              transition={{ duration: 0.36, delay: 0.06, ease: EASE_SMOOTH }}
              whileHover={SUBTLE_CARD_HOVER}
              whileTap={{ scale: 0.97 }}
              onClick={() =>
                sendCompanionMessage(
                  'Can you give me a quick gratitude prompt to shift my headspace?'
                )
              }
              className="w-full text-left bg-[#16243E] hover:bg-[#1E2F50] border border-[#2A3C60] rounded-xl p-3.5 transition-colors space-y-1 will-change-transform"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-[#F4F6FC]">
                <Sparkles className="w-4 h-4 text-[#A69BFF]" />
                <span>Gratitude Prompt</span>
              </div>
              <p className="text-[11px] text-[#929DB3]">Name one steady thing today</p>
            </motion.button>

            <motion.button
              type="button"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 'some' }}
              transition={{ duration: 0.36, delay: 0.12, ease: EASE_SMOOTH }}
              whileHover={SUBTLE_CARD_HOVER}
              whileTap={{ scale: 0.97 }}
              onClick={() =>
                sendCompanionMessage(
                  'I need a mindful break — help me ground myself right now.'
                )
              }
              className="w-full text-left bg-[#16243E] hover:bg-[#1E2F50] border border-[#2A3C60] rounded-xl p-3.5 transition-colors space-y-1 will-change-transform"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-[#F4F6FC]">
                <Heart className="w-4 h-4 text-[#57D38C]" />
                <span>Mindful Break</span>
              </div>
              <p className="text-[11px] text-[#929DB3]">5-4-3-2-1 grounding check</p>
            </motion.button>

            <div className="bg-[#0D1628] border border-[#25334D] rounded-xl p-3 text-[11px] text-[#929DB3] leading-relaxed">
              In immediate distress? Reach out to a trusted person or call/text{' '}
              <strong className="text-[#F4F6FC]">988</strong> for free, confidential support.
            </div>
          </aside>
        </div>
      </div>

      {/* Deep Breathing Modal with animated breathing orb */}
      <AnimatePresence>
        {breathingOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="breathing-title"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.28, ease: EASE_SMOOTH }}
              className="bg-[#131F35] border border-[#2C3F63] rounded-3xl w-full max-w-sm p-7 text-center space-y-5 shadow-2xl"
            >
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setBreathingOpen(false)}
                  aria-label="Close breathing exercise"
                  className="p-1.5 rounded-lg text-[#929DB3] hover:text-[#F4F6FC]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                <motion.div
                  aria-hidden="true"
                  animate={{
                    scale: breathSeconds % 12 < 8 ? 1.24 : 0.88,
                    opacity: breathSeconds % 12 < 8 ? 0.45 : 0.18,
                  }}
                  transition={{ duration: 3.6, ease: 'easeInOut' }}
                  className="absolute inset-2 rounded-full bg-gradient-to-br from-[#648BFF]/35 to-[#A69BFF]/35 blur-md"
                />
                <motion.div
                  animate={{
                    scale: breathSeconds % 12 < 8 ? 1.12 : 0.92,
                  }}
                  transition={{ duration: 3.6, ease: 'easeInOut' }}
                  className="relative w-28 h-28 rounded-full bg-gradient-to-br from-[#648BFF]/30 to-[#A69BFF]/30 border-2 border-[#9BCBFF] flex items-center justify-center shadow-lg shadow-[#648BFF]/20"
                >
                  <span className="text-2xl font-bold text-[#F4F6FC] tabular-nums">
                    {120 - breathSeconds}s
                  </span>
                </motion.div>
              </div>
              <div>
                <h2 id="breathing-title" className="text-lg font-bold text-[#F4F6FC]">
                  {breathPhase}
                </h2>
                <p className="text-xs text-[#929DB3] mt-1">
                  Drop your shoulders and unclench your jaw.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setBreathingOpen(false)}
                className="w-full safespace-gradient-btn py-2.5 rounded-xl text-xs font-semibold text-white"
              >
                Done
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
