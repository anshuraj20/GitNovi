/**
 * Achievement definitions with unlock conditions
 */

export const achievementDefinitions = {
  'first-lesson': {
    id: 'first-lesson',
    title: 'First Lesson',
    description: 'Complete your first Git lesson',
    icon: '🎓',
    condition: 'Complete 1 lesson',
  },
  'first-commit': {
    id: 'first-commit',
    title: 'First Commit',
    description: 'Create your first commit in the terminal',
    icon: '✨',
    condition: 'Create 1 commit',
  },
  'branch-explorer': {
    id: 'branch-explorer',
    title: 'Branch Explorer',
    description: 'Create 5 different branches',
    icon: '🌳',
    condition: 'Create 5 branches',
  },
  'merge-master': {
    id: 'merge-master',
    title: 'Merge Master',
    description: 'Successfully merge 3 branches',
    icon: '🔀',
    condition: 'Merge 3 branches',
  },
  'rebase-apprentice': {
    id: 'rebase-apprentice',
    title: 'Rebase Apprentice',
    description: 'Complete the rebase lesson and practice',
    icon: '📊',
    condition: 'Complete rebase lesson',
  },
  'recovery-expert': {
    id: 'recovery-expert',
    title: 'Recovery Expert',
    description: 'Learn and practice Git recovery techniques',
    icon: '🆘',
    condition: 'Complete recovery lesson',
  },
  'internals-explorer': {
    id: 'internals-explorer',
    title: 'Git Internals Explorer',
    description: 'Understand Git internals and objects',
    icon: '🔍',
    condition: 'Complete internals lesson',
  },
  'terminal-warrior': {
    id: 'terminal-warrior',
    title: 'Terminal Warrior',
    description: 'Complete 5 terminal challenges',
    icon: '⚔️',
    condition: 'Complete 5 challenges',
  },
  'streak-7': {
    id: 'streak-7',
    title: '7 Day Streak',
    description: 'Learn for 7 consecutive days',
    icon: '🔥',
    condition: '7 day streak',
  },
  'streak-30': {
    id: 'streak-30',
    title: '30 Day Streak',
    description: 'Learn for 30 consecutive days',
    icon: '🌟',
    condition: '30 day streak',
  },
  'course-complete': {
    id: 'course-complete',
    title: 'Course Completed',
    description: 'Complete all lessons in the GitNovi curriculum',
    icon: '🏆',
    condition: 'Complete all lessons',
  },
} as const;

export type AchievementId = keyof typeof achievementDefinitions;
