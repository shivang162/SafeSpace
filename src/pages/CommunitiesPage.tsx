import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Check, Plus, Search, Users } from 'lucide-react';
import { useSafeSpace } from '../context/SafeSpaceContext';
import { filterCommunities, filterPosts } from '../utils/safespaceLogic';
import { PostCard } from '../components/PostCard';
import { AvatarStack } from '../components/Avatar';
import { ScrollReveal, StaggerGroup, StaggerItem } from '../components/MotionPrimitives';

export function CommunitiesPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, toggleJoinCommunity, addPost } = useSafeSpace();

  const [query, setQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'joined'>('all');
  const [communityPostText, setCommunityPostText] = useState('');

  const filteredCommunities = useMemo(() => {
    const base = filterCommunities(state.communities, query);
    return filterMode === 'joined' ? base.filter((c) => c.joined) : base;
  }, [state.communities, query, filterMode]);

  // Community Detail View when /communities/:id is active
  if (id) {
    const community = state.communities.find((c) => c.id === id);
    if (!community) {
      return (
        <div className="bg-[#131F35] border border-[#25334D] rounded-2xl p-8 text-center space-y-3">
          <h1 className="text-xl font-bold text-[#F4F6FC]">Community not found</h1>
          <Link
            to="/communities"
            className="inline-flex items-center gap-2 text-sm text-[#9BCBFF] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Communities</span>
          </Link>
        </div>
      );
    }

    const communityPosts = filterPosts(state.posts, { communityId: community.id });

    const handleCommunityPostSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!communityPostText.trim()) return;
      addPost({
        content: communityPostText,
        category: community.category,
        communityId: community.id,
        tags: [`#${community.category.replace(/\s+/g, '')}`],
      });
      setCommunityPostText('');
    };

    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => navigate('/communities')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9BCBFF] hover:text-[#A69BFF]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Communities</span>
        </button>

        {/* Community Banner */}
        <ScrollReveal y={14}>
          <div className="bg-[#131F35] border border-[#25334D] rounded-2xl overflow-hidden">
            <div className="h-44 sm:h-52 relative overflow-hidden">
              <motion.img
                initial={{ scale: 1.06 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.7 }}
                src={community.imageUrl}
                alt={community.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#131F35] via-[#131F35]/50 to-transparent" />
            </div>
            <div className="p-5 sm:p-6 -mt-12 relative flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-[#A69BFF]">{community.category}</span>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#F4F6FC] mt-1">
                  {community.name}
                </h1>
                <p className="text-sm text-[#C7D2E8] mt-1.5 max-w-2xl">{community.description}</p>
                <div className="flex items-center gap-3 mt-3">
                  <AvatarStack count={4} size="xs" />
                  <span className="text-xs text-[#929DB3] tabular-nums">
                    {community.memberCountDisplay} members
                  </span>
                </div>
              </div>
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleJoinCommunity(community.id)}
                className={`px-6 py-2.5 rounded-xl text-sm font-semibold inline-flex items-center gap-2 whitespace-nowrap shrink-0 transition-all ${
                  community.joined
                    ? 'bg-[#1B2942] border border-[#364D77] text-[#9BCBFF] hover:bg-[#243658]'
                    : 'safespace-gradient-btn text-white'
                }`}
              >
                {community.joined ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Joined</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Join Community</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </ScrollReveal>

        {/* Community Post Composer */}
        <ScrollReveal delay={0.06} y={14}>
          <form
            onSubmit={handleCommunityPostSubmit}
            className="bg-[#131F35] border border-[#25334D] rounded-2xl p-4 flex flex-col sm:flex-row gap-3"
          >
            <input
              type="text"
              value={communityPostText}
              onChange={(e) => setCommunityPostText(e.target.value)}
              placeholder={`Share anonymously with ${community.name}...`}
              aria-label={`Share anonymously with ${community.name}`}
              className="flex-1 bg-[#0D1628] border border-[#25334D] rounded-xl px-4 py-2.5 text-sm text-[#F4F6FC] placeholder:text-[#8492AD] focus:outline-none focus:border-[#648BFF]"
            />
            <button
              type="submit"
              disabled={!communityPostText.trim()}
              className="safespace-gradient-btn disabled:opacity-45 px-5 py-2.5 rounded-xl text-xs font-semibold text-white whitespace-nowrap"
            >
              Post Anonymously
            </button>
          </form>
        </ScrollReveal>

        {/* Community Feed */}
        <div className="space-y-4">
          <ScrollReveal y={12}>
            <h2 className="text-base font-bold text-[#F4F6FC]">
              Community Discussions ({communityPosts.length})
            </h2>
          </ScrollReveal>
          {communityPosts.length === 0 ? (
            <div className="bg-[#131F35] border border-[#25334D] rounded-2xl p-8 text-center">
              <p className="text-sm font-semibold text-[#F4F6FC]">
                Start the first conversation in {community.name}.
              </p>
              <p className="text-xs text-[#929DB3] mt-1">
                Everything you share here stays anonymous and supportive.
              </p>
            </div>
          ) : (
            communityPosts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>
      </div>
    );
  }

  // Main Screen 5 Communities Grid
  const joinedCount = state.communities.filter((c) => c.joined).length;

  return (
    <div className="space-y-6">
      <ScrollReveal y={14} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#F4F6FC]">Communities</h1>
          <p className="text-sm text-[#929DB3] mt-1">Find your people, join communities</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              filterMode === 'all'
                ? 'safespace-gradient-btn text-white'
                : 'bg-[#131F35] border border-[#25334D] text-[#929DB3] hover:text-[#F4F6FC]'
            }`}
          >
            All ({state.communities.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('joined')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              filterMode === 'joined'
                ? 'safespace-gradient-btn text-white'
                : 'bg-[#131F35] border border-[#25334D] text-[#929DB3] hover:text-[#F4F6FC]'
            }`}
          >
            Joined ({joinedCount})
          </button>
        </div>
      </ScrollReveal>

      {/* Search Bar */}
      <ScrollReveal delay={0.05} y={12} className="relative max-w-2xl">
        <Search className="w-4 h-4 text-[#929DB3] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search communities..."
          aria-label="Search communities"
          className="w-full bg-[#131F35] border border-[#25334D] rounded-xl pl-11 pr-4 py-3 text-sm text-[#F4F6FC] placeholder:text-[#8492AD] focus:outline-none focus:border-[#648BFF]"
        />
      </ScrollReveal>

      {/* 3-column Community Cards Grid matching Screen 5 */}
      {filteredCommunities.length === 0 ? (
        <div className="bg-[#131F35] border border-[#25334D] rounded-2xl p-10 text-center">
          <Users className="w-8 h-8 text-[#929DB3] mx-auto mb-2" />
          <p className="text-sm font-semibold text-[#F4F6FC]">No communities match your search.</p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setFilterMode('all');
            }}
            className="mt-3 px-4 py-2 rounded-xl bg-[#1B2942] text-xs font-semibold text-[#9BCBFF]"
          >
            Show all communities
          </button>
        </div>
      ) : (
        <StaggerGroup key={`${filterMode}-${query}`} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCommunities.map((community) => (
            <StaggerItem key={community.id} hoverLift>
              <div className="h-full bg-[#131F35] border border-[#25334D] hover:border-[#3A517D] rounded-2xl overflow-hidden flex flex-col transition-colors">
                <Link
                  to={`/communities/${community.id}`}
                  className="aspect-[16/10] w-full overflow-hidden bg-[#1B2942] block"
                >
                  <img
                    src={community.imageUrl}
                    alt={community.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </Link>

                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <Link
                      to={`/communities/${community.id}`}
                      className="text-base font-bold text-[#F4F6FC] hover:text-[#9BCBFF] transition-colors block"
                    >
                      {community.name}
                    </Link>
                    <p className="text-xs text-[#929DB3] mt-1 tabular-nums">
                      {community.memberCountDisplay} members
                    </p>
                    <p className="text-xs text-[#C7D2E8] mt-2 line-clamp-2 leading-relaxed">
                      {community.description}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-2">
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.94 }}
                      onClick={() => toggleJoinCommunity(community.id)}
                      aria-label={`${community.joined ? 'Leave' : 'Join'} ${community.name}`}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-all ${
                        community.joined
                          ? 'bg-[#1B2942] border border-[#364D77] text-[#9BCBFF] hover:bg-[#233557]'
                          : 'safespace-gradient-btn text-white'
                      }`}
                    >
                      {community.joined ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Joined</span>
                        </>
                      ) : (
                        <span>Join</span>
                      )}
                    </motion.button>

                    <Link
                      to={`/communities/${community.id}`}
                      className="text-xs font-medium text-[#929DB3] hover:text-[#F4F6FC]"
                    >
                      Open →
                    </Link>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      )}
    </div>
  );
}
