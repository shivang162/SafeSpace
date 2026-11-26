import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { INITIAL_SAFESPACE_STATE } from '../data/seedData';
import type {
  DiscoverCategory,
  JournalEntry,
  MoodLevel,
  PostItem,
  ReportItem,
  SafeSpaceState,
  ToastMessage,
  UserProfile,
} from '../types/safespace';
import {
  formatMemberCount,
  generateCompanionReply,
  MOOD_SCORE_MAP,
  resolveReportAction,
} from '../utils/safespaceLogic';

const STORAGE_KEY = 'safespace_demo_state_v1';

interface SafeSpaceContextValue {
  state: SafeSpaceState;
  toasts: ToastMessage[];
  globalSearch: string;
  setGlobalSearch: (q: string) => void;
  showToast: (message: string, type?: ToastMessage['type']) => void;
  dismissToast: (id: string) => void;
  loginDemo: (email: string, name?: string) => void;
  signupDemo: (name: string, email: string) => void;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  addPost: (input: {
    content: string;
    title?: string;
    category?: Exclude<DiscoverCategory, 'All'>;
    tags?: string[];
    communityId?: string;
    isRealTalk?: boolean;
  }) => void;
  toggleLikePost: (postId: string) => void;
  toggleBookmarkPost: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  reportPost: (postId: string, reason: ReportItem['category']) => void;
  toggleJoinCommunity: (communityId: string) => void;
  addCommunity: (input: { name: string; description: string; category: Exclude<DiscoverCategory, 'All'> }) => void;
  toggleSameHereRelate: (id: string) => void;
  toggleSameHereLike: (id: string) => void;
  toggleSameHereBookmark: (id: string) => void;
  addSameHereExperience: (quote: string, context: string) => void;
  logMood: (mood: MoodLevel, note?: string) => void;
  saveJournalEntry: (entry: Omit<JournalEntry, 'id' | 'dateLabel' | 'createdAtISO'> & { id?: string }) => string;
  deleteJournalEntry: (id: string) => void;
  addSmallWin: (text: string) => void;
  sendCompanionMessage: (text: string) => void;
  clearChatHistory: () => void;
  handleModerationAction: (reportId: string, action: 'dismiss' | 'remove') => void;
  resetDemoData: () => void;
}

const SafeSpaceContext = createContext<SafeSpaceContextValue | null>(null);

function loadPersistedState(): SafeSpaceState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_SAFESPACE_STATE;
    const parsed = JSON.parse(raw) as Partial<SafeSpaceState>;
    return {
      ...INITIAL_SAFESPACE_STATE,
      ...parsed,
      user: { ...INITIAL_SAFESPACE_STATE.user, ...(parsed.user ?? {}) },
    };
  } catch {
    return INITIAL_SAFESPACE_STATE;
  }
}

export function SafeSpaceProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SafeSpaceState>(loadPersistedState);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [globalSearch, setGlobalSearch] = useState('');

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota issues in demo environment
    }
  }, [state]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastMessage['type'] = 'success') => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev.slice(-2), { id, message, type }]);
      window.setTimeout(() => {
        dismissToast(id);
      }, 3200);
    },
    [dismissToast]
  );

  const loginDemo = useCallback(
    (email: string, name?: string) => {
      const inferredName =
        name?.trim() ||
        (email.toLowerCase().includes('alex')
          ? 'Alex'
          : email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()));
      setState((prev) => ({
        ...prev,
        isAuthenticated: true,
        user: {
          ...prev.user,
          email: email.trim(),
          name: inferredName || 'Alex',
        },
      }));
      showToast(`Welcome back, ${inferredName || 'Alex'}!`);
    },
    [showToast]
  );

  const signupDemo = useCallback(
    (name: string, email: string) => {
      const cleanName = name.trim() || 'Alex';
      setState((prev) => ({
        ...prev,
        isAuthenticated: true,
        user: {
          ...prev.user,
          name: cleanName,
          email: email.trim(),
          handle: cleanName.toLowerCase().replace(/\s+/g, '_') + '_safe',
          memberSince: '2026',
        },
      }));
      showToast(`Account created! Welcome to SafeSpace, ${cleanName}.`);
    },
    [showToast]
  );

  const logout = useCallback(() => {
    setState((prev) => ({ ...prev, isAuthenticated: false }));
    showToast('You have been logged out safely.', 'info');
  }, [showToast]);

  const updateProfile = useCallback(
    (updates: Partial<UserProfile>) => {
      setState((prev) => ({
        ...prev,
        user: { ...prev.user, ...updates },
      }));
      showToast('Profile updated.');
    },
    [showToast]
  );

  const addPost = useCallback(
    (input: {
      content: string;
      title?: string;
      category?: Exclude<DiscoverCategory, 'All'>;
      tags?: string[];
      communityId?: string;
      isRealTalk?: boolean;
    }) => {
      const trimmed = input.content.trim();
      if (!trimmed) return;
      const newPost: PostItem = {
        id: `post-${Date.now()}`,
        author: 'anonymous_user',
        avatarTone: '#648BFF',
        isOwn: true,
        title: input.title?.trim() || undefined,
        content: trimmed,
        createdAt: 'Just now',
        timestampMs: Date.now(),
        category: input.category ?? 'Mental Health',
        tags: input.tags && input.tags.length > 0 ? input.tags : ['#SafeSpace'],
        communityId: input.communityId,
        likes: 1,
        likedByMe: true,
        bookmarked: false,
        comments: [],
        isTrending: false,
        isFollowing: true,
        isRealTalk: input.isRealTalk ?? true,
      };
      setState((prev) => ({
        ...prev,
        posts: [newPost, ...prev.posts],
      }));
      showToast('Shared anonymously to SafeSpace.');
    },
    [showToast]
  );

  const toggleLikePost = useCallback((postId: string) => {
    setState((prev) => ({
      ...prev,
      posts: prev.posts.map((p) =>
        p.id === postId
          ? {
              ...p,
              likedByMe: !p.likedByMe,
              likes: p.likedByMe ? Math.max(0, p.likes - 1) : p.likes + 1,
            }
          : p
      ),
    }));
  }, []);

  const toggleBookmarkPost = useCallback(
    (postId: string) => {
      let nowSaved = false;
      setState((prev) => ({
        ...prev,
        posts: prev.posts.map((p) => {
          if (p.id === postId) {
            nowSaved = !p.bookmarked;
            return { ...p, bookmarked: !p.bookmarked };
          }
          return p;
        }),
      }));
      showToast(nowSaved ? 'Saved to My Space.' : 'Removed from Saved.', 'info');
    },
    [showToast]
  );

  const addComment = useCallback(
    (postId: string, text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      setState((prev) => ({
        ...prev,
        posts: prev.posts.map((p) =>
          p.id === postId
            ? {
                ...p,
                comments: [
                  ...p.comments,
                  {
                    id: `cmt-${Date.now()}`,
                    author: 'anonymous_user',
                    avatarTone: '#A69BFF',
                    text: trimmed,
                    createdAt: 'Just now',
                    likes: 0,
                  },
                ],
              }
            : p
        ),
      }));
      showToast('Reply posted anonymously.');
    },
    [showToast]
  );

  const reportPost = useCallback(
    (postId: string, reason: ReportItem['category']) => {
      setState((prev) => {
        const target = prev.posts.find((p) => p.id === postId);
        if (!target) return prev;
        const newReport: ReportItem = {
          id: `rep-${Date.now()}`,
          reason,
          category: reason,
          postId,
          postExcerpt: target.content.slice(0, 100),
          reportedAuthor: target.author,
          reportedAt: 'Just now',
          status: 'pending',
        };
        return {
          ...prev,
          reports: [newReport, ...prev.reports],
        };
      });
      showToast('Post reported to moderation team. Thank you for keeping SafeSpace safe.', 'warning');
    },
    [showToast]
  );

  const toggleJoinCommunity = useCallback(
    (communityId: string) => {
      let joinedLabel = '';
      setState((prev) => ({
        ...prev,
        communities: prev.communities.map((c) => {
          if (c.id !== communityId) return c;
          const nextJoined = !c.joined;
          const nextCount = nextJoined ? c.memberCount + 1 : Math.max(0, c.memberCount - 1);
          joinedLabel = nextJoined ? `Joined ${c.name}!` : `Left ${c.name}.`;
          return {
            ...c,
            joined: nextJoined,
            memberCount: nextCount,
            memberCountDisplay: formatMemberCount(nextCount),
          };
        }),
      }));
      if (joinedLabel) showToast(joinedLabel, 'info');
    },
    [showToast]
  );

  const addCommunity = useCallback(
    (input: { name: string; description: string; category: Exclude<DiscoverCategory, 'All'> }) => {
      const id = `comm-${Date.now()}`;
      setState((prev) => ({
        ...prev,
        communities: [
          {
            id,
            name: input.name.trim(),
            description: input.description.trim(),
            category: input.category,
            memberCount: 1,
            memberCountDisplay: '1',
            joined: true,
            imageUrl: INITIAL_SAFESPACE_STATE.communities[0].imageUrl,
            iconBg: '#648BFF',
            featured: false,
          },
          ...prev.communities,
        ],
      }));
      showToast(`Community "${input.name.trim()}" created.`);
    },
    [showToast]
  );

  const toggleSameHereRelate = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      sameHereList: prev.sameHereList.map((item) =>
        item.id === id
          ? {
              ...item,
              relatedByMe: !item.relatedByMe,
              relateCount: item.relatedByMe ? Math.max(0, item.relateCount - 1) : item.relateCount + 1,
            }
          : item
      ),
    }));
  }, []);

  const toggleSameHereLike = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      sameHereList: prev.sameHereList.map((item) =>
        item.id === id ? { ...item, likedByMe: !item.likedByMe } : item
      ),
    }));
  }, []);

  const toggleSameHereBookmark = useCallback(
    (id: string) => {
      setState((prev) => ({
        ...prev,
        sameHereList: prev.sameHereList.map((item) =>
          item.id === id ? { ...item, bookmarked: !item.bookmarked } : item
        ),
      }));
      showToast('Updated saved experiences.', 'info');
    },
    [showToast]
  );

  const addSameHereExperience = useCallback(
    (quote: string, context: string) => {
      const cleanQuote = quote.trim();
      if (!cleanQuote) return;
      setState((prev) => ({
        ...prev,
        sameHereList: [
          {
            id: `sh-${Date.now()}`,
            quote: cleanQuote,
            context: context.trim() || 'Shared anonymously from the heart.',
            author: 'anonymous_user',
            relateCount: 1,
            relatedByMe: true,
            likedByMe: true,
            bookmarked: false,
            imageUrl: INITIAL_SAFESPACE_STATE.sameHereList[0].imageUrl,
            createdAt: 'Just now',
          },
          ...prev.sameHereList,
        ],
      }));
      showToast('Your experience is now live anonymously.');
    },
    [showToast]
  );

  const logMood = useCallback(
    (mood: MoodLevel, note?: string) => {
      const now = new Date();
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayLabel = days[now.getDay()];
      const dateISO = now.toISOString().slice(0, 10);

      setState((prev) => {
        const entry = {
          id: `mood-${Date.now()}`,
          mood,
          score: MOOD_SCORE_MAP[mood],
          dayLabel,
          dateISO,
          note: note?.trim() || undefined,
        };
        const existingIdx = prev.moodRecords.findIndex((r) => r.dateISO === dateISO);
        const nextRecords =
          existingIdx >= 0
            ? prev.moodRecords.map((r, i) => (i === existingIdx ? entry : r))
            : [...prev.moodRecords, entry];
        return { ...prev, moodRecords: nextRecords };
      });
      showToast('Mood check-in saved!');
    },
    [showToast]
  );

  const saveJournalEntry = useCallback(
    (entry: Omit<JournalEntry, 'id' | 'dateLabel' | 'createdAtISO'> & { id?: string }): string => {
      const now = new Date();
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const dateLabel = `${months[now.getMonth()]} ${now.getDate()}`;
      const id = entry.id ?? `journal-${Date.now()}`;

      setState((prev) => {
        const exists = prev.journalEntries.some((j) => j.id === id);
        if (exists) {
          return {
            ...prev,
            journalEntries: prev.journalEntries.map((j) =>
              j.id === id
                ? {
                    ...j,
                    title: entry.title.trim() || 'Untitled reflection',
                    content: entry.content,
                    mood: entry.mood,
                    isPrivate: entry.isPrivate,
                  }
                : j
            ),
          };
        }
        const newEntry: JournalEntry = {
          id,
          title: entry.title.trim() || 'Untitled reflection',
          content: entry.content,
          mood: entry.mood,
          isPrivate: entry.isPrivate,
          dateLabel,
          createdAtISO: now.toISOString(),
        };
        return {
          ...prev,
          journalEntries: [newEntry, ...prev.journalEntries],
        };
      });

      showToast('Journal entry saved privately.');
      return id;
    },
    [showToast]
  );

  const deleteJournalEntry = useCallback(
    (id: string) => {
      setState((prev) => ({
        ...prev,
        journalEntries: prev.journalEntries.filter((j) => j.id !== id),
      }));
      showToast('Journal entry deleted.', 'info');
    },
    [showToast]
  );

  const addSmallWin = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      setState((prev) => ({
        ...prev,
        smallWins: [
          {
            id: `win-${Date.now()}`,
            text: trimmed,
            dateLabel: 'Just now',
            completed: true,
          },
          ...prev.smallWins,
        ],
      }));
      showToast('Small win celebrated!');
    },
    [showToast]
  );

  const sendCompanionMessage = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const reply = generateCompanionReply(trimmed);

    setState((prev) => ({
      ...prev,
      chatMessages: [
        ...prev.chatMessages,
        {
          id: `msg-u-${Date.now()}`,
          sender: 'user',
          text: trimmed,
          timestamp: nowTime,
        },
        {
          id: `msg-c-${Date.now() + 1}`,
          sender: 'companion',
          text: reply.text,
          timestamp: nowTime,
          isDistressNotice: reply.isDistressNotice,
        },
      ],
    }));
  }, []);

  const clearChatHistory = useCallback(() => {
    setState((prev) => ({
      ...prev,
      chatMessages: [
        {
          id: `msg-reset-${Date.now()}`,
          sender: 'companion',
          text: "I'm here for you. What's on your mind?",
          timestamp: 'Just now',
        },
      ],
    }));
    showToast('Conversation cleared.', 'info');
  }, [showToast]);

  const handleModerationAction = useCallback(
    (reportId: string, action: 'dismiss' | 'remove') => {
      setState((prev) => {
        const result = resolveReportAction(prev.reports, prev.posts, reportId, action);
        return {
          ...prev,
          reports: result.reports,
          posts: result.posts,
        };
      });
      showToast(
        action === 'dismiss'
          ? 'Report dismissed and archived.'
          : 'Reported post removed from SafeSpace.',
        action === 'dismiss' ? 'info' : 'warning'
      );
    },
    [showToast]
  );

  const resetDemoData = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setState(INITIAL_SAFESPACE_STATE);
    showToast('Demo data has been reset to defaults.', 'info');
  }, [showToast]);

  return (
    <SafeSpaceContext.Provider
      value={{
        state,
        toasts,
        globalSearch,
        setGlobalSearch,
        showToast,
        dismissToast,
        loginDemo,
        signupDemo,
        logout,
        updateProfile,
        addPost,
        toggleLikePost,
        toggleBookmarkPost,
        addComment,
        reportPost,
        toggleJoinCommunity,
        addCommunity,
        toggleSameHereRelate,
        toggleSameHereLike,
        toggleSameHereBookmark,
        addSameHereExperience,
        logMood,
        saveJournalEntry,
        deleteJournalEntry,
        addSmallWin,
        sendCompanionMessage,
        clearChatHistory,
        handleModerationAction,
        resetDemoData,
      }}
    >
      {children}
    </SafeSpaceContext.Provider>
  );
}

export function useSafeSpace() {
  const ctx = useContext(SafeSpaceContext);
  if (!ctx) {
    throw new Error('useSafeSpace must be used within SafeSpaceProvider');
  }
  return ctx;
}
