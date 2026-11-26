import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateMoodInsightPercentage,
  filterCommunities,
  filterPosts,
  generateCompanionReply,
  resolveReportAction,
  validateAuthForm,
} from './safespaceLogic';
import type { CommunityItem, MoodRecord, PostItem, ReportItem } from '../types/safespace';

test('validateAuthForm rejects empty or invalid inputs and accepts valid credentials', () => {
  const invalidLogin = validateAuthForm({ mode: 'login', email: 'not-an-email', password: '123' });
  assert.equal(invalidLogin.valid, false);
  assert.ok(invalidLogin.errors.email);
  assert.ok(invalidLogin.errors.password);

  const invalidSignup = validateAuthForm({
    mode: 'signup',
    name: 'A',
    email: 'alex@example.com',
    password: 'password123',
  });
  assert.equal(invalidSignup.valid, false);
  assert.ok(invalidSignup.errors.name);

  const validLogin = validateAuthForm({
    mode: 'login',
    email: 'alex@safespace.demo',
    password: 'password123',
  });
  assert.equal(validLogin.valid, true);
  assert.deepEqual(validLogin.errors, {});
});

test('calculateMoodInsightPercentage computes accurate percentage from mood records', () => {
  const records: MoodRecord[] = [
    { id: '1', mood: 'great', score: 5, dayLabel: 'Mon', dateISO: '2026-11-20' },
    { id: '2', mood: 'good', score: 4, dayLabel: 'Tue', dateISO: '2026-11-21' },
    { id: '3', mood: 'okay', score: 3, dayLabel: 'Wed', dateISO: '2026-11-22' },
    { id: '4', mood: 'good', score: 4, dayLabel: 'Thu', dateISO: '2026-11-23' },
  ];
  // (5+4+3+4) / 20 = 16 / 20 = 80%
  assert.equal(calculateMoodInsightPercentage(records), 80);
  assert.equal(calculateMoodInsightPercentage([]), 0);
});

test('filterPosts filters by query, category, and tag', () => {
  const samplePosts: PostItem[] = [
    {
      id: 'p1',
      author: 'anonymous_user',
      avatarTone: '#648BFF',
      content: 'Is it normal to overthink everything?',
      createdAt: '2h ago',
      timestampMs: 1,
      category: 'Mental Health',
      tags: ['#Anxiety', '#Overthinking'],
      likes: 342,
      likedByMe: false,
      bookmarked: false,
      comments: [],
      isTrending: true,
      isRealTalk: true,
    },
    {
      id: 'p2',
      author: 'anonymous_user',
      avatarTone: '#A69BFF',
      content: 'How do you make friends in college?',
      createdAt: '4h ago',
      timestampMs: 2,
      category: 'College Life',
      tags: ['#CollegeLife'],
      likes: 120,
      likedByMe: false,
      bookmarked: false,
      comments: [],
      isTrending: true,
      isRealTalk: false,
    },
  ];

  assert.equal(filterPosts(samplePosts, { category: 'College Life' }).length, 1);
  assert.equal(filterPosts(samplePosts, { tag: 'Anxiety' }).length, 1);
  assert.equal(filterPosts(samplePosts, { query: 'overthink' }).length, 1);
  assert.equal(filterPosts(samplePosts, { onlyRealTalk: true }).length, 1);
});

test('filterCommunities searches by name and category', () => {
  const communities: CommunityItem[] = [
    {
      id: 'c1',
      name: 'The Overthinkers Club',
      description: 'Late night spirals and grounding talks.',
      category: 'Mental Health',
      memberCount: 32100,
      memberCountDisplay: '32.1k',
      joined: false,
      imageUrl: '',
      iconBg: '#648BFF',
    },
    {
      id: 'c2',
      name: 'College Survival Club',
      description: 'Exams, dorm life, and making friends.',
      category: 'College Life',
      memberCount: 18700,
      memberCountDisplay: '18.7k',
      joined: true,
      imageUrl: '',
      iconBg: '#A69BFF',
    },
  ];

  assert.equal(filterCommunities(communities, 'overthink').length, 1);
  assert.equal(filterCommunities(communities, '', 'College Life').length, 1);
});

test('generateCompanionReply detects distress and returns professional support guidance', () => {
  const distressReply = generateCompanionReply('I feel hopeless and want to hurt myself');
  assert.equal(distressReply.isDistressNotice, true);
  assert.match(distressReply.text, /988|professional|trusted/i);

  const anxiousReply = generateCompanionReply("I've been feeling really anxious lately.");
  assert.equal(anxiousReply.isDistressNotice, false);
  assert.match(anxiousReply.text, /anxiety|Deep Breathing/i);
});

test('resolveReportAction dismisses reports or removes linked posts cleanly', () => {
  const reports: ReportItem[] = [
    {
      id: 'r1',
      reason: 'Inappropriate content',
      category: 'Inappropriate content',
      postId: 'p1',
      postExcerpt: 'Bad post',
      reportedAuthor: 'anonymous_user',
      reportedAt: '10m ago',
      status: 'pending',
    },
  ];
  const posts: PostItem[] = [
    {
      id: 'p1',
      author: 'anonymous_user',
      avatarTone: '#648BFF',
      content: 'Bad post',
      createdAt: '1h ago',
      timestampMs: 1,
      category: 'Mental Health',
      tags: [],
      likes: 1,
      likedByMe: false,
      bookmarked: false,
      comments: [],
    },
  ];

  const dismissed = resolveReportAction(reports, posts, 'r1', 'dismiss');
  assert.equal(dismissed.reports[0].status, 'dismissed');
  assert.equal(dismissed.posts.length, 1);

  const removed = resolveReportAction(reports, posts, 'r1', 'remove');
  assert.equal(removed.reports[0].status, 'removed');
  assert.equal(removed.posts.length, 0);
});
