import type {
  CommunityItem,
  DiscoverCategory,
  MoodLevel,
  MoodRecord,
  PostItem,
  ReportItem,
} from '../types/safespace';

export const MOOD_SCORE_MAP: Record<MoodLevel, number> = {
  great: 5,
  good: 4,
  okay: 3,
  low: 2,
  bad: 1,
};

export interface AuthValidationResult {
  valid: boolean;
  errors: {
    name?: string;
    email?: string;
    password?: string;
  };
}

export function validateAuthForm(input: {
  mode: 'login' | 'signup';
  name?: string;
  email: string;
  password: string;
}): AuthValidationResult {
  const errors: AuthValidationResult['errors'] = {};
  const trimmedEmail = input.email.trim();

  if (input.mode === 'signup') {
    if (!input.name || input.name.trim().length < 2) {
      errors.name = 'Please enter a display name (at least 2 characters).';
    }
  }

  if (!trimmedEmail) {
    errors.email = 'Email address is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!input.password) {
    errors.password = 'Password is required.';
  } else if (input.password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function calculateMoodInsightPercentage(records: MoodRecord[]): number {
  if (records.length === 0) return 0;
  const total = records.reduce((sum, r) => sum + r.score, 0);
  const max = records.length * 5;
  return Math.round((total / max) * 100);
}

export function getMoodInsightSummary(percentage: number): string {
  if (percentage >= 75) return "You've been feeling good this week!";
  if (percentage >= 55) return 'Steady progress — keep checking in.';
  if (percentage > 0) return 'It has been a heavy stretch. Be gentle with yourself.';
  return 'Log your first mood to see insights.';
}

export function filterPosts(
  posts: PostItem[],
  options: {
    query?: string;
    category?: DiscoverCategory;
    tag?: string | null;
    tab?: 'for-you' | 'trending' | 'following';
    communityId?: string;
    onlyRealTalk?: boolean;
  }
): PostItem[] {
  const q = (options.query ?? '').trim().toLowerCase();

  return posts.filter((post) => {
    if (options.onlyRealTalk && !post.isRealTalk) return false;
    if (options.communityId && post.communityId !== options.communityId) return false;
    if (options.category && options.category !== 'All' && post.category !== options.category) {
      return false;
    }
    if (options.tag) {
      const normalized = options.tag.replace(/^#/, '').toLowerCase();
      const hasTag = post.tags.some(
        (t) => t.replace(/^#/, '').toLowerCase() === normalized
      );
      if (!hasTag) return false;
    }
    if (options.tab === 'trending' && !post.isTrending && post.likes < 100) {
      return false;
    }
    if (options.tab === 'following' && !post.isFollowing && !post.isOwn) {
      return false;
    }
    if (q) {
      const haystack = [
        post.title ?? '',
        post.content,
        post.category,
        post.author,
        ...post.tags,
      ]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

export function filterCommunities(
  communities: CommunityItem[],
  query: string,
  category?: DiscoverCategory
): CommunityItem[] {
  const q = query.trim().toLowerCase();
  return communities.filter((c) => {
    if (category && category !== 'All' && c.category !== category) return false;
    if (!q) return true;
    const haystack = `${c.name} ${c.description} ${c.category}`.toLowerCase();
    return haystack.includes(q);
  });
}

export function formatMemberCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return String(count);
}

export function formatRelateCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return String(count);
}

const DISTRESS_KEYWORDS = [
  'suicide',
  'kill myself',
  'end my life',
  'hurt myself',
  'self harm',
  'self-harm',
  'want to die',
  'hopeless',
  'cant go on',
  "can't go on",
  'no reason to live',
];

export interface CompanionReply {
  text: string;
  isDistressNotice: boolean;
}

export function generateCompanionReply(userMessage: string): CompanionReply {
  const lower = userMessage.toLowerCase();

  if (DISTRESS_KEYWORDS.some((kw) => lower.includes(kw))) {
    return {
      isDistressNotice: true,
      text:
        "I'm really glad you spoke up, and I hear how heavy things feel right now. Because I'm a simulated demo companion and not a professional therapist, please consider reaching out to someone who can truly be there for you — a trusted friend, family member, campus counselor, or a free 24/7 crisis line (call or text 988 in the US/Canada, or find local support at findahelpline.com). You don't have to carry this alone.",
    };
  }

  if (lower.includes('anxious') || lower.includes('anxiety') || lower.includes('panic') || lower.includes('stressed')) {
    return {
      isDistressNotice: false,
      text:
        "That constant buzz of stress and anxiety can feel exhausting. Let's slow things down for a second — what's the one thing sitting heaviest on your mind right now? You can also try the 2-minute Deep Breathing exercise on the right whenever you want a quick reset.",
    };
  }

  if (lower.includes('overthink') || lower.includes('overthinking') || lower.includes('racing')) {
    return {
      isDistressNotice: false,
      text:
        "Overthinking has a way of turning one small moment into ten worst-case scenarios. If you want, write down the thought that keeps looping — sometimes seeing it outside your head takes away half its weight.",
    };
  }

  if (lower.includes('motivation') || lower.includes('tired') || lower.includes('burnout') || lower.includes('exhausted')) {
    return {
      isDistressNotice: false,
      text:
        "Running on low motivation doesn't mean you're failing — it usually means your mind is asking for a breather. What's one tiny, low-pressure thing you could do today (even just drinking water or stepping outside for two minutes)?",
    };
  }

  if (lower.includes('lonely') || lower.includes('alone') || lower.includes('friends') || lower.includes('second choice')) {
    return {
      isDistressNotice: false,
      text:
        "Feeling unseen or disconnected hurts, especially when it seems like everyone else has it figured out. So many people in SafeSpace feel the exact same way. What's been making you feel most isolated lately?",
    };
  }

  if (lower.includes('need support') || lower.includes('help') || lower.includes('listen')) {
    return {
      isDistressNotice: false,
      text:
        "I'm right here listening, with zero judgment. Take all the time you need — do you want to vent freely, or would you like to break down what's been bothering you step by step?",
    };
  }

  if (lower.includes('college') || lower.includes('exam') || lower.includes('assignment') || lower.includes('future') || lower.includes('career')) {
    return {
      isDistressNotice: false,
      text:
        "The pressure around school, grades, and figuring out your whole future can feel massive. Remember you don't need every answer tonight. Which part feels the most overwhelming right now?",
    };
  }

  return {
    isDistressNotice: false,
    text:
      "Thank you for trusting this space with what you're feeling. It takes real honesty to put that into words. How long has this been weighing on you, and what would feel most supportive right now?",
  };
}

export function resolveReportAction(
  reports: ReportItem[],
  posts: PostItem[],
  reportId: string,
  action: 'dismiss' | 'remove'
): { reports: ReportItem[]; posts: PostItem[] } {
  const target = reports.find((r) => r.id === reportId);
  const updatedReports = reports.map((r) =>
    r.id === reportId
      ? { ...r, status: action === 'dismiss' ? ('dismissed' as const) : ('removed' as const) }
      : r
  );

  const updatedPosts =
    action === 'remove' && target?.postId
      ? posts.filter((p) => p.id !== target.postId)
      : posts;

  return { reports: updatedReports, posts: updatedPosts };
}
