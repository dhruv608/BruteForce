/**
 * Leaderboard-related types for student
 */

export interface LeaderboardEntry {
  student_id: number;
  username: string;
  name: string;
  profile_image_url?: string;
  city_name?: string;
  batch_year?: number;
  global_rank?: number;
  city_rank?: number;
  batch_rank?: number;
  score?: number;
  max_streak?: number;
  total_solved?: number;
}

export interface LeaderboardCity {
  city_name: string;
  available_years: number[];
}

export interface LeaderboardData {
  leaderboard: LeaderboardEntry[];
  total: number;
  top10?: LeaderboardEntry[];
  yourRank?: {
    global_rank?: number;
    city_rank?: number;
    batch_rank?: number;
  };
  available_cities?: LeaderboardCity[];
  last_calculated?: string;
}

export interface LeaderboardTableProps {
  data: LeaderboardData;
  loading: boolean;
  error?: string;
  page: number;
  limit: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  selectedCity: string;
  mode?: 'admin' | 'student';
}

export interface LeaderboardTableRowProps {
  entry: LeaderboardEntry;
  selectedCity: string;
}

export interface FilterBarProps {
  lSearch: string;
  setLSearch: (value: string) => void;
  lCity: string;
  setLCity: (value: string) => void;
  cityOptionsObj: Array<{ value: string; label: string }>;
  setLYear: (value: number | null) => void;
  lYear: number | null;
  yearOptionsObj: Array<{ value: string; label: string }>;
  allYears: number[];
  isLoading: boolean;
  mode?: 'admin' | 'student';
}

export interface PodiumCardProps {
  student: LeaderboardEntry;
  rank: number;
  isCenter?: boolean;
}

export interface PodiumSectionProps {
  top3: LeaderboardEntry[];
  loading: boolean;
  error?: string;
  selectedCity: string;
}

export interface YourRankProps {
  yourRank?: {
    rank?: number;
    global_rank?: number;
    city_rank?: number;
    batch_rank?: number;
    name?: string;
    username?: string;
    profile_image_url?: string;
    city_name?: string;
    batch_year?: number;
    easy_solved?: number;
    medium_solved?: number;
    hard_solved?: number;
    total_solved?: number;
    total_assigned?: number;
    score?: number;
    max_streak?: number;
  };
}

export interface EvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: LeaderboardEntry;
}

export interface LeaderboardHeaderProps {
  lCity: string;
  lYear: number | null;
  lastUpdated?: string;
}

export interface TimerLeaderboardProps {
  lastUpdated?: string;
  onRefresh?: () => void;
}
