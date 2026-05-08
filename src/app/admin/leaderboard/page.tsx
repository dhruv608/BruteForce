import { Suspense } from 'react';
import AdminLeaderboardClient from './AdminLeaderboardClient';
import { parseCronSchedule } from '@/lib/utils/cronUtils';

export default function AdminLeaderboardPage() {
  const cronExpr = process.env.CRON_LEADERBOARD_SYNC ?? "0 9,18,23 * * *";
  const syncSchedule = parseCronSchedule(cronExpr);
  return (
    <Suspense>
      <AdminLeaderboardClient syncSchedule={syncSchedule} />
    </Suspense>
  );
}
