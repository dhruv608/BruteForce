// types/student/profile.ts
export interface StudentProfile {
    id: number;
    username: string;
    name: string;
    photo_url?: string;
    profileImageUrl?: string;
    github?: string;
    linkedin?: string;
    leetcode_id?: string;
    leetcode?: string;
    gfg_id?: string;
    gfg?: string;
    enrollment_id?: string;
    enrollmentId?: string;
    batch?: string;
    year?: string;
    city?: string;
    stats?: StudentStats;
}
export interface StudentStats {
    total_solved: number;
    easy_solved: number;
    medium_solved: number;
    hard_solved: number;
    streak?: number;
    rank?: number;
}

export interface ProfileEditForm {
    name: string;
    github: string;
    linkedin: string;
    leetcode: string;
    gfg: string;
}

export interface UsernameForm {
    username: string;
}

// Add to types/student/profile.ts
export interface ProfileUpdateData {
    github?: string;
    linkedin?: string;
    name?: string;
    leetcode_id?: string;
    gfg_id?: string;
    username?: string;
}

export interface UsernameUpdateData {
    username: string;
}

// Add to types/student/profile.ts
export interface ProfileUpdateResponse {
    message: string;
    student: StudentProfile;
}

export interface UsernameUpdateResponse {
    message: string;
    username: string;
}


// Heatmap data structure
export interface HeatmapData {
    date: string;
    count: number;
    day: number;
    month: number;
    year: number;
}

// Activity data structure
export interface RecentActivity {
    id: number;
    question_name: string;
    question_link?: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    platform: string;
    solvedAt: string;
}

// Coding statistics structure
export interface CodingStats {
    totalSolved?: number;
    easy: {
        solved: number;
        assigned: number;
    };
    medium: {
        solved: number;
        assigned: number;
    };
    hard: {
        solved: number;
        assigned: number;
    };
}

// Leaderboard data structure for user's own ranks
export interface UserLeaderboardRanks {
  globalRank?: number;
  cityRank?: number;
  batchRank?: number;
}

export interface StreakData {
    maxStreak?: number;
    currentStreak?: number;
    lastSolvedDate?: string;
    count?: number;
    hasQuestion?: boolean;
}

// API Response wrapper types
export interface ProfileResponse {
    student: StudentProfile;
    stats?: StudentStats;
    codingStats?: CodingStats;
    heatmap?: HeatmapData[];
    heatmapStartMonth?: string | Date; // New field for dynamic start date
    recentActivity?: RecentActivity[];
    leaderboard?: UserLeaderboardRanks;
    streak?: StreakData;
}

export interface CurrentUserResponse {
    data: StudentProfile;
    // May also have error property for auth failures
    error?: string;
}

// Update the main profile page state types
export type ProfileDataState = ProfileResponse | null;
export type CurrentUserState = CurrentUserResponse | null;

// Profile component props
export interface ActivityHeatmapProps {
  heatmapData: HeatmapData[];
  heatmapStartMonth?: string | Date;
  loading: boolean;
}

export interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    date: string;
  }>;
}

export interface DeleteImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  loading: boolean;
}

export interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  onSubmit: (data: ProfileUpdateData) => Promise<void>;
  loading: boolean;
}

export interface EditUsernameModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUsername: string;
  onSubmit: (data: UsernameUpdateData) => Promise<void>;
  loading: boolean;
}

export interface OverviewStatsProps {
  stats: StudentStats;
  loading: boolean;
}

export interface ProblemSolvingStatsProps {
  codingStats: CodingStats;
  loading: boolean;
}

export interface ProfileHeaderProps {
  profile: StudentProfile;
  isOwnProfile: boolean;
  onEditProfile: () => void;
  onEditUsername: () => void;
  onDeleteImage: () => void;
  loading: boolean;
}

export interface ProfileInfoProps {
  profile: StudentProfile;
  loading: boolean;
}

export interface ProfileNotFoundProps {
  username: string;
}

export interface RecentActivityProps {
  activities: RecentActivity[];
  loading: boolean;
}

export interface SocialLinksProps {
  github?: string;
  linkedin?: string;
  leetcode?: string;
  gfg?: string;
  loading: boolean;
}

export interface ProfileShimmerProps {
  // No props needed
}
