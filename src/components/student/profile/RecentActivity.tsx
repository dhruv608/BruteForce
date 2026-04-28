
import React from 'react';
import { Clock, Calendar, Target, CheckCircle2, Flame, Zap, Skull } from 'lucide-react';
import { RecentActivity as RecentActivityType } from '@/types/student/index.types';

interface RecentActivityProps {
  recentActivity?: RecentActivityType[];
}

export function RecentActivity({ recentActivity }: RecentActivityProps) {
  const getDifficultyStyle = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return {
          bg: '#a3e63520',
          color: 'var(--easy)',
          icon: <CheckCircle2 className="w-6 h-6" />,
        };
      case 'medium':
        return {
          bg: '#f59e0b20',
          color: 'var(--medium)',
          icon: <Zap className="w-6 h-6" />,
        };
      case 'hard':
        return {
          bg: '#ef444420',
          color: 'var(--hard)',
          icon: <Flame className="w-6 h-6" />,
        };
      default:
        return {
          bg: 'var(--accent-secondary)',
          color: 'var(--text-secondary)',
          icon: <CheckCircle2 className="w-6 h-6" />,
        };
    }
  };

  return (
    <div className="glass  backdrop-blur-sm p-10 rounded-(--radius-lg)">
      <h3 className="font-bold mb-8 flex items-center gap-3 text-[var(--text-lg)] text-[var(--foreground)]">
        <Clock className="w-6 h-6 text-[var(--accent-primary)]" />
        Recent Activity
      </h3>

      {recentActivity && recentActivity.length > 0 ? (
        <div className="space-y-6">
          {recentActivity.map((activity: RecentActivityType, idx: number) => {
            const style = getDifficultyStyle(activity.difficulty);

            return (
              <div
                key={idx}
                className="flex items-center justify-between p-6 hover-glow transition-all duration-200 rounded-(--radius-lg) border-border "
                style={{
                  backgroundColor: 'var(--background-secondary)',
                }}
              >
                <div className="flex items-center gap-6 flex-1">
                  {/* CONTENT */}
                  <div className="flex-1">
                    <div
                      className="font-semibold cursor-pointer transition-colors text-[var(--text-lg)] text-[var(--foreground)] hover:text-[var(--accent-primary)]"
                      onClick={() =>
                        activity.question_link &&
                        window.open(activity.question_link, '_blank', 'noopener,noreferrer')
                      }
                    >
                      {activity.question_name}
                    </div>

                    <div className="font-mono mt-2 flex items-center gap-6 text-[var(--text-sm)] text-[var(--text-secondary)]">
                      <Calendar className="w-4 h-4" />
                      {new Date(activity.solvedAt).toLocaleDateString('en-US', {
                        timeZone: 'UTC',
                      })}
                    </div>
                  </div>
                </div>
                {/* DIFFICULTY BADGE */}
                <div className="w-27.5 flex justify-end">
                  <div
                    className="font-bold uppercase tracking-wider px-4 py-2 rounded-2xl text-center w-full"
                    style={{
                      fontSize: 'var(--text-sm)',
                      backgroundColor: style.bg,
                      color: style.color,
                    }}
                  >
                    {activity.difficulty}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-[var(--text-secondary)]">
          <Target className="w-12 h-12 mx-auto mb-4 text-[var(--text-secondary)]" />
          <div className="text-[var(--text-base)]">No recent submissions.</div>
          <div className="text-[var(--text-sm)] mt-[var(--spacing-sm)]">
            Start solving problems to see your activity here!
          </div>
        </div>
      )}
    </div>
  );
}