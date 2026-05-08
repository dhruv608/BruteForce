import LeaderboardClient from './LeaderboardClient';
import { parseCronSchedule } from '@/lib/utils/cronUtils';

export const metadata = {
  title: 'Leaderboard | BruteForce',
  description: 'DSA leaderboard rankings',
};

export default function StudentLeaderboardPage() {
  const cronExpr = process.env.CRON_LEADERBOARD_SYNC ?? "0 9,18,23 * * *";
  const syncSchedule = parseCronSchedule(cronExpr);
  return <LeaderboardClient syncSchedule={syncSchedule} />;
}
