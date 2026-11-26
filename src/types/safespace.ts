export type MoodLevel = 'great' | 'good' | 'okay' | 'low' | 'bad';

export type DiscoverCategory =
  | 'All'
  | 'Relationships'
  | 'College Life'
  | 'Career'
  | 'Mental Health'
  | 'Self-Growth';

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  email: string;
  memberSince: string;
  bio: string;
  avatarUrl: string;
  role: 'member' | 'admin';
  isAnonymousDefault: boolean;
}

export interface CommentItem {
  id: string;
  author: string;
  avatarTone: string;
  text: string;
  createdAt: string;
  likes: number;
  likedByMe?: boolean;
}

export interface PostItem {
  id: string;
  author: string;
  avatarTone: string;
  isOwn?: boolean;
  title?: string;
  content: string;
  createdAt: string;
  timestampMs: number;
  category: Exclude<DiscoverCategory, 'All'>;
  tags: string[];
  communityId?: string;
  likes: number;
  likedByMe: boolean;
  bookmarked: boolean;
  comments: CommentItem[];
  imageUrl?: string;
  isTrending?: boolean;
  isFollowing?: boolean;
  isRealTalk?: boolean;
}

export interface CommunityItem {
  id: string;
  name: string;
  shortSubtitle?: string;
  description: string;
  category: Exclude<DiscoverCategory, 'All'>;
  memberCount: number;
  memberCountDisplay: string;
  joined: boolean;
  imageUrl: string;
  iconBg: string;
  featured?: boolean;
}

export interface SameHereExperience {
  id: string;
  quote: string;
  context: string;
  author: string;
  relateCount: number;
  relatedByMe: boolean;
  likedByMe: boolean;
  bookmarked: boolean;
  imageUrl: string;
  createdAt: string;
}

export interface MoodRecord {
  id: string;
  mood: MoodLevel;
  score: number; // 1 (bad) to 5 (great)
  dayLabel: string; // e.g., 'Mon', 'Tue'
  dateISO: string; // YYYY-MM-DD
  note?: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: MoodLevel;
  isPrivate: boolean;
  dateLabel: string; // e.g., 'Nov 24'
  createdAtISO: string;
}

export interface SmallWin {
  id: string;
  text: string;
  dateLabel: string;
  completed: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'companion' | 'user';
  text: string;
  timestamp: string;
  isDistressNotice?: boolean;
}

export interface ReportItem {
  id: string;
  reason: string;
  category: 'Inappropriate content' | 'Spam post' | 'Harassment report' | 'Self-harm concern' | 'Community guidelines';
  postId?: string;
  postExcerpt: string;
  reportedAuthor: string;
  reportedAt: string;
  status: 'pending' | 'dismissed' | 'removed';
}

export interface SampleMember {
  id: string;
  name: string;
  handle: string;
  joinedDate: string;
  status: 'Active' | 'Flagged' | 'New';
  postsCount: number;
  avatarTone: string;
  avatarUrl?: string;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

export interface SafeSpaceState {
  isAuthenticated: boolean;
  user: UserProfile;
  posts: PostItem[];
  communities: CommunityItem[];
  sameHereList: SameHereExperience[];
  moodRecords: MoodRecord[];
  journalEntries: JournalEntry[];
  smallWins: SmallWin[];
  chatMessages: ChatMessage[];
  reports: ReportItem[];
  sampleMembers: SampleMember[];
}
