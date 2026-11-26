import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, MessageCircle, Search, Sparkles, X } from 'lucide-react';
import { useSafeSpace } from '../context/SafeSpaceContext';
import { filterCommunities, filterPosts } from '../utils/safespaceLogic';
import type { DiscoverCategory, PostItem } from '../types/safespace';
import { PostCard } from '../components/PostCard';
import { EASE_SMOOTH, ScrollReveal, StaggerGroup, StaggerItem } from '../components/MotionPrimitives';

const CATEGORIES: DiscoverCategory[] = [
  'All',
  'Relationships',
  'College Life',
  'Career',
  'Mental Health',
  'Self-Growth',
];

export function DiscoverPage() {
  const { state, globalSearch, setGlobalSearch, toggleJoinCommunity } = useSafeSpace();
  const [selectedCategory, setSelectedCategory] = useState<DiscoverCategory>('All');
  const [showAllDiscussions, setShowAllDiscussions] = useState(false);
  const [activeDiscussionId, setActiveDiscussionId] = useState<string | null>(null);

  const filteredDiscussions = useMemo(
    () =>
      filterPosts(state.posts, {
        query: globalSearch,
        category: selectedCategory,
      }),
    [state.posts, globalSearch, selectedCategory]
  );

  // Prioritize visual featured discussions first (matching Screen 4)
  const sortedDiscussions = useMemo(() => {
    return [...filteredDiscussions].sort((a, b) => {
      if (a.imageUrl && !b.imageUrl) return -1;
      if (!a.imageUrl && b.imageUrl) return 1;
      return b.likes - a.likes;
    });
  }, [filteredDiscussions]);

  const featuredDiscussions = showAllDiscussions
    ? sortedDiscussions
    : sortedDiscussions.slice(0, 2);

  const recommendedCommunities = useMemo(
    () => filterCommunities(state.communities, globalSearch, selectedCategory),
    [state.communities, globalSearch, selectedCategory]
  );

  const activeDiscussion: PostItem | undefined = state.posts.find(
    (p) => p.id === activeDiscussionId
  );

  return (
    <div className="space-y-7">
      {/* Header */}
      <ScrollReveal y={14} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#F4F6FC]">Discover</h1>
          <p className="text-sm text-[#929DB3] mt-1">
            Explore trending topics, stories and communities
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#929DB3] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Filter topics or communities..."
            aria-label="Filter topics or communities"
            className="w-full bg-[#131F35] border border-[#25334D] rounded-xl pl-10 pr-8 py-2 text-xs sm:text-sm text-[#F4F6FC] placeholder:text-[#8492AD] focus:outline-none focus:border-[#648BFF]"
          />
          {globalSearch && (
            <button
              type="button"
              onClick={() => setGlobalSearch('')}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#929DB3] hover:text-[#F4F6FC]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </ScrollReveal>

      {/* Category Filter Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((category) => {
          const active = selectedCategory === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`relative px-4 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                active
                  ? 'text-white'
                  : 'bg-[#131F35] border border-[#25334D] text-[#C7D2E8] hover:border-[#3A4F78]'
              }`}
            >
              {active && (
                <motion.span
                  layoutId="discover-cat-pill"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  className="absolute inset-0 rounded-xl safespace-gradient-btn shadow-sm -z-0"
                />
              )}
              <span className="relative z-10">{category}</span>
            </button>
          );
        })}
      </div>

      {/* Trending Discussions */}
      <section className="space-y-4">
        <ScrollReveal y={12} className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#F4F6FC]">Trending Discussions</h2>
          <button
            type="button"
            onClick={() => setShowAllDiscussions((prev) => !prev)}
            className="text-xs font-semibold text-[#9BCBFF] hover:text-[#A69BFF] inline-flex items-center gap-1"
          >
            <span>{showAllDiscussions ? 'Show less' : 'View all'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </ScrollReveal>

        {featuredDiscussions.length === 0 ? (
          <div className="bg-[#131F35] border border-[#25334D] rounded-2xl p-8 text-center">
            <p className="text-sm font-semibold text-[#F4F6FC]">No matching discussions found.</p>
            <button
              type="button"
              onClick={() => {
                setGlobalSearch('');
                setSelectedCategory('All');
              }}
              className="mt-3 px-4 py-2 rounded-xl bg-[#1B2942] text-xs font-semibold text-[#9BCBFF]"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <StaggerGroup key={`${selectedCategory}-${showAllDiscussions}`} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {featuredDiscussions.map((post) => (
              <StaggerItem key={post.id} hoverLift>
                <button
                  type="button"
                  onClick={() => setActiveDiscussionId(post.id)}
                  className="w-full h-full text-left group bg-[#131F35] border border-[#25334D] hover:border-[#648BFF]/70 rounded-2xl overflow-hidden transition-all flex flex-col"
                >
                  {post.imageUrl && (
                    <div className="aspect-[16/9] w-full overflow-hidden bg-[#1B2942]">
                      <img
                        src={post.imageUrl}
                        alt={post.title || 'Discussion topic'}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-bold text-[#F4F6FC] group-hover:text-[#9BCBFF] transition-colors leading-snug">
                        {post.title || post.content}
                      </h3>
                      {!post.imageUrl && (
                        <p className="text-xs text-[#929DB3] mt-2 line-clamp-2">{post.content}</p>
                      )}
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-[#929DB3]">
                      <span className="inline-flex items-center gap-1.5 tabular-nums">
                        <MessageCircle className="w-3.5 h-3.5 text-[#A69BFF]" />
                        <span>
                          {post.id === 'post-disc-1'
                            ? '6.3k replies'
                            : post.id === 'post-disc-2'
                            ? '3.5k replies'
                            : `${post.comments.length} replies · ${post.likes} likes`}
                        </span>
                      </span>
                      <span className="text-[#9BCBFF]">{post.category}</span>
                    </div>
                  </div>
                </button>
              </StaggerItem>
            ))}
          </StaggerGroup>
        )}
      </section>

      {/* Recommended Communities */}
      <ScrollReveal className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#F4F6FC]">Recommended Communities</h2>
          <Link
            to="/communities"
            className="text-xs font-semibold text-[#9BCBFF] hover:text-[#A69BFF] inline-flex items-center gap-1"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendedCommunities.slice(0, 4).map((community) => (
            <StaggerItem key={community.id} hoverLift>
              <div className="bg-[#131F35] border border-[#25334D] rounded-2xl p-4 flex items-center justify-between gap-4 hover:border-[#3A4F78] transition-colors">
                <Link to={`/communities/${community.id}`} className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-white shadow-sm"
                    style={{ backgroundColor: community.iconBg }}
                  >
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-[#F4F6FC] truncate hover:text-[#9BCBFF]">
                      {community.name}
                    </h3>
                    <p className="text-xs text-[#929DB3] mt-0.5 tabular-nums">
                      {community.memberCountDisplay} members · {community.category}
                    </p>
                  </div>
                </Link>

                <motion.button
                  type="button"
                  whileTap={{ scale: 0.94 }}
                  onClick={() => toggleJoinCommunity(community.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                    community.joined
                      ? 'bg-[#1B2942] border border-[#344A73] text-[#9BCBFF] hover:bg-[#233557]'
                      : 'safespace-gradient-btn text-white'
                  }`}
                >
                  {community.joined ? 'Joined' : 'Join'}
                </motion.button>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </ScrollReveal>

      {/* Discussion Detail Modal */}
      <AnimatePresence>
        {activeDiscussion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Discussion details"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.24, ease: EASE_SMOOTH }}
              className="bg-[#0D1628] border border-[#25334D] rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-5 sm:p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#A69BFF]">
                  Discussion · {activeDiscussion.category}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveDiscussionId(null)}
                  aria-label="Close discussion modal"
                  className="p-1.5 rounded-lg text-[#929DB3] hover:text-[#F4F6FC] hover:bg-[#1B2942]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <PostCard post={activeDiscussion} defaultExpanded />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
