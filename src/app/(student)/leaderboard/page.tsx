import LeaderboardClient from './LeaderboardClient';

export const metadata = {
  title: 'Leaderboard | BruteForce',
  description: 'DSA leaderboard rankings',
};

export interface SyncTime { hour: number; minute: number }

function parseCronSchedule(expr: string): SyncTime[] {
  const parts = expr.trim().split(/\s+/);
  if (parts.length < 2) return [];
  const minutes = parts[0].split(',').map(Number).filter(n => !isNaN(n));
  const hours   = parts[1].split(',').map(Number).filter(n => !isNaN(n));
  return hours
    .flatMap(h => minutes.map(m => ({ hour: h, minute: m })))
    .sort((a, b) => (a.hour * 60 + a.minute) - (b.hour * 60 + b.minute));
}

export default function StudentLeaderboardPage() {
  const cronExpr = process.env.CRON_LEADERBOARD_SYNC ?? "0 9,18,23 * * *";
  const syncSchedule = parseCronSchedule(cronExpr);
  return <LeaderboardClient syncSchedule={syncSchedule} />;
}
