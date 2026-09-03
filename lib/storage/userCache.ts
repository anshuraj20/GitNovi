// lib/storage/userCache.ts – User Cache Isolation & Cleanup

export function clearLocalProgressCache() {
  if (typeof window === 'undefined') return;

  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('gitnovi_')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch (err) {
    console.warn('Failed to clear user storage cache:', err);
  }
}

export function syncUserProgressWithServer(
  userId: string | null | undefined,
  serverLessons: string[],
  serverChallenges: string[],
) {
  if (typeof window === 'undefined' || !userId) return;

  try {
    const lastUser = localStorage.getItem('gitnovi_current_user_id');

    // If a different user has logged in, wipe old user's local cache
    if (lastUser && lastUser !== userId) {
      clearLocalProgressCache();
    }

    localStorage.setItem('gitnovi_current_user_id', userId);

    // Sync authoritative lessons from server
    serverLessons.forEach((id) => {
      localStorage.setItem(`gitnovi_lesson_${id}`, 'true');
    });

    // Sync authoritative challenges from server
    serverChallenges.forEach((id) => {
      localStorage.setItem(`gitnovi_challenge_${id}`, 'true');
    });
  } catch (err) {
    console.warn('Failed to sync user progress cache:', err);
  }
}
