/**
 * Centralized Cache TTL Configuration
 * 
 * TTL values are in seconds for Redis compatibility
 * Grouped by data change frequency and access patterns
 */
export const CACHE_TTL = {
  
  // LEADERBOARD — syncs 3×/day (9 AM, 6 PM, 11 PM IST)
  // Cache is explicitly busted after each sync, so TTL is just a safety net.
  // 8h > longest gap between syncs (11 PM → 9 AM = 10h, covered by next sync bust).
  studentLeaderboard: 14400,    // 4 hours - API: /api/students/leaderboard
  adminLeaderboard: 14400,      // 4 hours - API: /api/admin/leaderboard
  adminStats: 300,              // 5 minutes - API: /api/admin/stats (Admin side)
  
  // MEDIUM FREQUENCY CHANGES (10 minutes)
  // User activity data - progress, questions, bookmarks
  studentAssignedQuestions: 600,   // 10 minutes - API: /api/students/addedQuestions (Student side)
  studentTopics: 600,              // 10 minutes - API: /api/students/topics (Student side)
  studentTopicOverview: 600,       // 10 minutes - API: /api/students/topics/:topicSlug (Student side)
  studentClassProgress: 600,       // 10 minutes - API: /api/students/topics/:topicSlug/classes/:classSlug (Student side)
  studentBookmarks: 600,           // 10 minutes - API: /api/students/bookmarks (Student side)
  
  // LOW FREQUENCY CHANGES (15 minutes)
  // User profile data - changes less frequently
  studentProfile: 900,             // 15 minutes - API: /api/students/me (Student side)
  studentPublicProfile: 900,       // 15 minutes - API: /api/students/profile/:username (Student side)
  studentRecentQuestions: 900,     // 15 minutes - API: /api/students/recent-questions (Student side)
  
  // STATIC DATA (30 minutes)
  // Rarely changes - admin data, static content
  adminTopics: 1800,               // 30 minutes - API: /api/admin/topics (Admin side)
  
} as const;

/**
 * Type-safe TTL values for use across services
 */
export type CacheTTLKey = keyof typeof CACHE_TTL;

/**
 * Utility function to get TTL value with type safety
 */
export const getCacheTTL = (key: CacheTTLKey): number => {
  return CACHE_TTL[key];
};
