import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Bookmark,
  Flag,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Send,
} from 'lucide-react';
import type { PostItem, ReportItem } from '../types/safespace';
import { useSafeSpace } from '../context/SafeSpaceContext';
import { Avatar } from './Avatar';
import { EASE_SMOOTH, POST_CARD_HOVER } from './MotionPrimitives';

interface PostCardProps {
  post: PostItem;
  onTagClick?: (tag: string) => void;
  defaultExpanded?: boolean;
}

const REPORT_REASONS: ReportItem['category'][] = [
  'Inappropriate content',
  'Harassment report',
  'Spam post',
  'Self-harm concern',
];

export function PostCard({ post, onTagClick, defaultExpanded = false }: PostCardProps) {
  const { toggleLikePost, toggleBookmarkPost, addComment, reportPost } = useSafeSpace();
  const [showComments, setShowComments] = useState(defaultExpanded);
  const [replyText, setReplyText] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    addComment(post.id, replyText);
    setReplyText('');
    setShowComments(true);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 'some' }}
      whileHover={POST_CARD_HOVER}
      transition={{ duration: 0.4, ease: EASE_SMOOTH }}
      className="bg-[#131F35] border border-[#25334D] rounded-2xl p-4 sm:p-5 transition-colors hover:border-[#3A517D] will-change-transform"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar anonymous tone={post.avatarTone} name={post.author} size="md" />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-[#F4F6FC] truncate">
                {post.author}
              </span>
              <span className="text-xs text-[#929DB3]">· {post.createdAt}</span>
            </div>
            <p className="text-xs text-[#929DB3]">{post.category}</p>
          </div>
        </div>

        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={`More options for ${post.title || post.content.slice(0, 28)}`}
            className="p-1.5 rounded-lg text-[#929DB3] hover:text-[#F4F6FC] hover:bg-[#1B2942] transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                transition={{ duration: 0.16, ease: EASE_SMOOTH }}
                className="absolute right-0 mt-1.5 w-52 bg-[#1B2942] border border-[#2E4062] rounded-xl shadow-xl py-1.5 z-30 origin-top-right"
              >
                <div className="px-3 py-1.5 text-[11px] font-semibold text-[#929DB3] border-b border-[#25334D]">
                  Report this post
                </div>
                {REPORT_REASONS.map((reason) => (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => {
                      reportPost(post.id, reason);
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-[#F4F6FC] hover:bg-[#253657] flex items-center gap-2 transition-colors"
                  >
                    <Flag className="w-3.5 h-3.5 text-[#EB5D68]" />
                    <span>{reason}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Body */}
      <div className="mt-3.5 space-y-2">
        {post.title && post.title !== post.content && (
          <h3 className="text-[15px] font-semibold text-[#F4F6FC] leading-snug">
            {post.title}
          </h3>
        )}
        <p className="text-sm text-[#D6DEF0] leading-relaxed whitespace-pre-line">
          {post.content}
        </p>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {post.tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => onTagClick?.(tag)}
                className="text-xs font-medium text-[#9BCBFF] hover:text-[#A69BFF] transition-colors"
              >
                {tag.startsWith('#') ? tag : `#${tag}`}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="mt-4 pt-3 border-t border-[#25334D]/70 flex items-center justify-between gap-2">
        <div className="flex items-center gap-5">
          <motion.button
            type="button"
            whileTap={{ scale: 0.88 }}
            onClick={() => toggleLikePost(post.id)}
            aria-label={`Like post (${post.likes})`}
            className={`inline-flex items-center gap-1.5 text-xs font-medium transition-colors tabular-nums ${
              post.likedByMe
                ? 'text-[#EB5D68]'
                : 'text-[#929DB3] hover:text-[#F4F6FC]'
            }`}
          >
            <Heart
              className={`w-4 h-4 transition-transform ${
                post.likedByMe ? 'fill-[#EB5D68] text-[#EB5D68] scale-110' : ''
              }`}
            />
            <span>{post.likes}</span>
          </motion.button>

          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={() => setShowComments((prev) => !prev)}
            aria-label={`Toggle comments (${post.comments.length})`}
            aria-expanded={showComments}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#929DB3] hover:text-[#F4F6FC] transition-colors tabular-nums"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{post.comments.length}</span>
          </motion.button>
        </div>

        <motion.button
          type="button"
          whileTap={{ scale: 0.88 }}
          onClick={() => toggleBookmarkPost(post.id)}
          aria-label={post.bookmarked ? 'Remove bookmark' : 'Bookmark post'}
          className={`p-1.5 rounded-lg transition-colors ${
            post.bookmarked
              ? 'text-[#A69BFF] bg-[#A69BFF]/10'
              : 'text-[#929DB3] hover:text-[#F4F6FC] hover:bg-[#1B2942]'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${post.bookmarked ? 'fill-[#A69BFF]' : ''}`} />
        </motion.button>
      </div>

      {/* Expandable Comments & Reply */}
      <AnimatePresence initial={false}>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: EASE_SMOOTH }}
            className="mt-4 pt-3 border-t border-[#25334D]/70 space-y-3"
          >
            {post.comments.length === 0 ? (
              <p className="text-xs text-[#929DB3]">
                No replies yet. Share a supportive response anonymously.
              </p>
            ) : (
              <div className="space-y-2.5">
                {post.comments.map((comment) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22, ease: EASE_SMOOTH }}
                    className="bg-[#0D1628] border border-[#25334D]/70 rounded-xl p-3 flex items-start gap-2.5"
                  >
                    <Avatar anonymous tone={comment.avatarTone} name={comment.author} size="xs" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-semibold text-[#F4F6FC]">{comment.author}</span>
                        <span className="text-[#929DB3]">{comment.createdAt}</span>
                      </div>
                      <p className="text-xs text-[#D6DEF0] mt-1 leading-relaxed">{comment.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            <form onSubmit={handleReplySubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a supportive anonymous reply..."
                aria-label="Write a supportive anonymous reply"
                className="flex-1 bg-[#0D1628] border border-[#25334D] rounded-xl px-3.5 py-2 text-xs text-[#F4F6FC] placeholder:text-[#929DB3] focus:outline-none focus:border-[#648BFF]"
              />
              <button
                type="submit"
                disabled={!replyText.trim()}
                aria-label="Send reply"
                className="safespace-gradient-btn disabled:opacity-40 text-white px-3.5 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-opacity shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Reply</span>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
