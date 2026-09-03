// lib/progress/streak.ts – Reliable Streak Calculation & Persistence

export type StreakData = {
  current_streak: number;
  longest_streak: number;
  last_activity_date: string; // YYYY-MM-DD
  history: string[]; // List of YYYY-MM-DD active days
};

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getYesterdayDateString(): string {
  const now = new Date();
  now.setDate(now.getDate() - 1);
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getLocalStreak(): StreakData {
  if (typeof window === 'undefined') {
    return {
      current_streak: 1,
      longest_streak: 1,
      last_activity_date: getTodayDateString(),
      history: [getTodayDateString()],
    };
  }

  try {
    const raw = localStorage.getItem('gitnovi_streak_data');
    if (raw) {
      const parsed: StreakData = JSON.parse(raw);
      const today = getTodayDateString();
      const yesterday = getYesterdayDateString();

      // If active today or yesterday, streak is alive
      if (parsed.last_activity_date === today) {
        return parsed;
      }
      if (parsed.last_activity_date === yesterday) {
        return parsed;
      }
      // If gap of 2 or more days, streak reset but preserve longest
      return {
        ...parsed,
        current_streak: 0,
      };
    }
  } catch {
    // Storage read error
  }

  return {
    current_streak: 1,
    longest_streak: 1,
    last_activity_date: getTodayDateString(),
    history: [getTodayDateString()],
  };
}

export function recordStreakActivity(kind: 'lesson' | 'command' | 'challenge' = 'command'): StreakData {
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();
  const current = getLocalStreak();

  let nextStreak = current.current_streak;
  let nextLongest = current.longest_streak;
  const historySet = new Set(current.history || []);
  historySet.add(today);

  if (current.last_activity_date === today) {
    // Already counted for today
    if (nextStreak === 0) nextStreak = 1;
  } else if (current.last_activity_date === yesterday) {
    // Consecutive day!
    nextStreak += 1;
  } else {
    // Gap or first time
    nextStreak = 1;
  }

  nextLongest = Math.max(nextLongest, nextStreak);

  const updated: StreakData = {
    current_streak: nextStreak,
    longest_streak: nextLongest,
    last_activity_date: today,
    history: Array.from(historySet).sort().slice(-30), // keep last 30 days
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('gitnovi_streak_data', JSON.stringify(updated));
    } catch {
      // Storage write error
    }
  }

  // Asynchronously ping server
  if (typeof window !== 'undefined') {
    fetch('/api/progress/activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind, minutes: 1 }),
    }).catch(() => undefined);
  }

  return updated;
}
