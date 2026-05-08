export interface SyncTime { hour: number; minute: number }

export function parseCronSchedule(expr: string): SyncTime[] {
  const parts = expr.trim().split(/\s+/);
  if (parts.length < 2) return [];
  const minutes = parts[0].split(',').map(Number).filter(n => !isNaN(n));
  const hours   = parts[1].split(',').map(Number).filter(n => !isNaN(n));
  return hours
    .flatMap(h => minutes.map(m => ({ hour: h, minute: m })))
    .sort((a, b) => (a.hour * 60 + a.minute) - (b.hour * 60 + b.minute));
}
