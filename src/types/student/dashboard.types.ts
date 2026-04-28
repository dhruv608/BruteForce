/**
 * Dashboard-related types for student
 */

import { Topic } from './topics.types';

export interface DashboardStats {
  solved: number;
  rank: string;
  topicsActive: number;
}

export interface User {
  username?: string;
  leetcode?: string;
  gfg?: string;
  codingStats?: {
    totalSolved?: number;
  };
  leaderboard?: {
    globalRank?: string;
  };
}

export interface StudentDataResponse {
  success: boolean;
  data: User;
}

export interface TopicsDataResponse {
  topics: Topic[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface HomePageProps {
  // No props needed
}
