/**
 * Achievement service - Automatically unlock achievements
 * based on user progress
 */

import { achievementDefinitions } from './definitions';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySupabaseClient = any;

/**
 * Check and unlock achievements for a user
 * Call this after lesson completion, challenge completion, etc.
 */
export async function checkAndUnlockAchievements(
  supabase: AnySupabaseClient,
  userId: string,
) {
  try {
    // Get user's current progress
    const [
      lessonsResult,
      challengesResult,
      streakResult,
      achievementsResult,
    ] = await Promise.all([
      supabase
        .from('lesson_progress')
        .select('*', {
          count: 'exact',
        })
        .eq('user_id', userId)
        .eq('completed', true),
      supabase
        .from('challenge_progress')
        .select('*', {
          count: 'exact',
        })
        .eq('user_id', userId)
        .eq('completed', true),
      supabase
        .from('user_streaks')
        .select('current_streak, longest_streak')
        .eq('user_id', userId)
        .single(),
      supabase
        .from('user_achievements')
        .select('achievement_id')
        .eq('user_id', userId),
    ]);

    const completedLessons = lessonsResult.count || 0;
    const completedChallenges = challengesResult.count || 0;
    const streakData = streakResult.data as { current_streak?: number; longest_streak?: number } | null;
    const currentStreak = streakData?.current_streak || 0;
    const longestStreak = streakData?.longest_streak || 0;
    const unlockedAchievements = new Set(
      ((achievementsResult.data as { achievement_id: string }[] | null) || []).map(
        (a) => a.achievement_id,
      ),
    );

    // Achievements to unlock
    const toUnlock: string[] = [];

    // Check each achievement condition
    if (completedLessons >= 1 && !unlockedAchievements.has('first-lesson')) {
      toUnlock.push('first-lesson');
    }

    if (completedLessons >= 72 && !unlockedAchievements.has('course-complete')) {
      toUnlock.push('course-complete');
    }

    if (currentStreak >= 7 && !unlockedAchievements.has('streak-7')) {
      toUnlock.push('streak-7');
    }

    if (longestStreak >= 30 && !unlockedAchievements.has('streak-30')) {
      toUnlock.push('streak-30');
    }

    if (completedChallenges >= 1 && !unlockedAchievements.has('first-commit')) {
      toUnlock.push('first-commit');
    }

    if (completedChallenges >= 5 && !unlockedAchievements.has('terminal-warrior')) {
      toUnlock.push('terminal-warrior');
    }

    // Unlock achievements
    if (toUnlock.length > 0) {
      const now = new Date().toISOString();
      const records = toUnlock.map((id) => ({
        user_id: userId,
        achievement_id: id,
        earned_at: now,
      }));

      const { error } = await supabase
        .from('user_achievements')
        .insert(records);

      if (error) {
        console.error('Error unlocking achievements:', error);
      }

      return toUnlock;
    }

    return [];
  } catch (err) {
    console.error('Error checking achievements:', err);
    return [];
  }
}

/**
 * Get user's earned achievements with details
 */
export async function getUserAchievements(
  supabase: AnySupabaseClient,
  userId: string,
) {
  try {
    const { data, error } = await supabase
      .from('user_achievements')
      .select('achievement_id, earned_at')
      .eq('user_id', userId)
      .order('earned_at', {
        ascending: false,
      });

    if (error) {
      throw error;
    }

    const records = (data as { achievement_id: string; earned_at: string }[] | null) || [];

    // Enrich with achievement definitions
    return records.map((ua) => ({
      ...ua,
      ...(achievementDefinitions[
        ua.achievement_id as keyof typeof achievementDefinitions
      ] || {}),
    }));
  } catch (err) {
    console.error('Error fetching user achievements:', err);
    return [];
  }
}

/**
 * Get all available achievements with unlock status
 */
export async function getAllAchievements(
  supabase: AnySupabaseClient,
  userId: string,
) {
  try {
    const { data: userAchievements } = await supabase
      .from('user_achievements')
      .select('achievement_id')
      .eq('user_id', userId);

    const records = (userAchievements as { achievement_id: string }[] | null) || [];
    const unlockedIds = new Set(records.map((a) => a.achievement_id));

    return Object.values(achievementDefinitions).map((achievement) => ({
      ...achievement,
      unlocked: unlockedIds.has(achievement.id),
    }));
  } catch (err) {
    console.error('Error fetching all achievements:', err);
    return [];
  }
}
