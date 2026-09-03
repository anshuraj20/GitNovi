// lib/challenges/validators.ts – Challenge State Validation Suite

import type { RepoState } from '@/lib/git-engine';

export type ChallengeValidationResult = {
  valid: boolean;
  score: number;
  reason?: string;
};

// Map of challenge IDs to their canonical slugs
const idToSlugMap: Record<string, string> = {
  'c1000000-0000-4000-8000-000000000001': 'first-commit',
  'c1000000-0000-4000-8000-000000000002': 'targeted-staging',
  'c1000000-0000-4000-8000-000000000003': 'branch-orbit',
  'c1000000-0000-4000-8000-000000000004': 'restore-safety',
  'c1000000-0000-4000-8000-000000000005': 'file-lifecycle',
  'c1000000-0000-4000-8000-000000000006': 'log-detective',
  'c2000000-0000-4000-8000-000000000007': 'conflict-solver',
  'c2000000-0000-4000-8000-000000000008': 'emergency-stash',
  'c2000000-0000-4000-8000-000000000009': 'linear-rebase',
  'c2000000-0000-4000-8000-000000000010': 'reflog-rescue',
  'c2000000-0000-4000-8000-000000000011': 'release-tagger',
  'c2000000-0000-4000-8000-000000000012': 'safe-revert',
  'c3000000-0000-4000-8000-000000000013': 'object-detective',
  'c3000000-0000-4000-8000-000000000014': 'plumbing-architect',
  'c3000000-0000-4000-8000-000000000015': 'tree-traversal',
  'c3000000-0000-4000-8000-000000000016': 'worktree-pro',
  'c3000000-0000-4000-8000-000000000017': 'sparse-checkout-pro',
  'c3000000-0000-4000-8000-000000000018': 'maintenance-fsck',
};

export function validateChallengeState(
  challengeSlugOrId: string,
  state: RepoState | null | undefined,
): ChallengeValidationResult {
  const canonicalSlug = idToSlugMap[challengeSlugOrId] || challengeSlugOrId;

  // If repository is not initialized
  if (!state || !state.initialized) {
    if (canonicalSlug === 'first-commit') {
      return {
        valid: false,
        score: 0,
        reason: 'Initialize a repository using "git init" and create your first commit in the Sandbox Terminal first.',
      };
    }
    return {
      valid: false,
      score: 0,
      reason: 'Please open the Sandbox Terminal and initialize your repository with "git init" to begin.',
    };
  }

  const commitsCount = Object.keys(state.commits || {}).length;
  const branchRefs = Object.keys(state.refs || {}).filter((ref) => ref.startsWith('heads/'));
  const tagRefs = Object.keys(state.refs || {}).filter((ref) => ref.startsWith('tags/'));
  const objects = Object.values(state.objects || {});
  const reflogs = Object.values(state.reflogs || {});

  switch (canonicalSlug) {
    case 'first-commit': {
      if (commitsCount >= 1) {
        return { valid: true, score: 50 };
      }
      return {
        valid: false,
        score: 0,
        reason: 'No commits detected. Run "git add ." and "git commit -m \'feat: initial commit\'" in the terminal.',
      };
    }

    case 'targeted-staging': {
      if (commitsCount >= 1 || Object.keys(state.index || {}).length > 0 || Object.keys(state.files || {}).length > 0) {
        return { valid: true, score: 50 };
      }
      return {
        valid: false,
        score: 0,
        reason: 'Stage specific files with "git add" and commit them in the terminal.',
      };
    }

    case 'branch-orbit': {
      if (branchRefs.length >= 2 || (reflogs.length > 0 && reflogs.some(r => r.some(e => e.message.includes('branch') || e.message.includes('checkout'))))) {
        return { valid: true, score: 75 };
      }
      return {
        valid: false,
        score: 0,
        reason: 'Create a feature branch with "git switch -c feature/navbar" and switch back to main.',
      };
    }

    case 'restore-safety': {
      if (commitsCount >= 1 || reflogs.length > 0) {
        return { valid: true, score: 75 };
      }
      return {
        valid: false,
        score: 0,
        reason: 'Unstage files using "git restore --staged <file>" in the terminal sandbox.',
      };
    }

    case 'file-lifecycle': {
      if (commitsCount >= 1 || Object.keys(state.index || {}).length > 0) {
        return { valid: true, score: 75 };
      }
      return {
        valid: false,
        score: 0,
        reason: 'Use "git mv" and "git rm" in the terminal sandbox to manage file lifecycles.',
      };
    }

    case 'log-detective': {
      if (commitsCount >= 1 || reflogs.length > 0) {
        return { valid: true, score: 75 };
      }
      return {
        valid: false,
        score: 0,
        reason: 'Create at least 1 commit and inspect commit logs with "git log --oneline".',
      };
    }

    case 'conflict-solver': {
      if (branchRefs.length >= 2 || state.merge || commitsCount >= 2) {
        return { valid: true, score: 100 };
      }
      return {
        valid: false,
        score: 0,
        reason: 'Create two branches with divergent commits and run "git merge" in the terminal.',
      };
    }

    case 'emergency-stash': {
      if ((state.stash && state.stash.length > 0) || reflogs.some(r => r.some(e => e.message.toLowerCase().includes('stash')))) {
        return { valid: true, score: 100 };
      }
      return {
        valid: false,
        score: 0,
        reason: 'Save uncommitted work with "git stash push" in the terminal.',
      };
    }

    case 'linear-rebase': {
      if (commitsCount >= 2 || reflogs.some(r => r.some(e => e.message.toLowerCase().includes('rebase')))) {
        return { valid: true, score: 125 };
      }
      return {
        valid: false,
        score: 0,
        reason: 'Run "git rebase main" on a feature branch to create a linear history.',
      };
    }

    case 'reflog-rescue': {
      if (reflogs.length > 0 && reflogs.some(r => r.length >= 2)) {
        return { valid: true, score: 125 };
      }
      return {
        valid: false,
        score: 0,
        reason: 'Perform a reset and locate the previous commit with "git reflog".',
      };
    }

    case 'release-tagger': {
      if (tagRefs.length >= 1) {
        return { valid: true, score: 100 };
      }
      return {
        valid: false,
        score: 0,
        reason: 'Create an annotated release tag: "git tag -a v1.0.0 -m \'Release v1.0.0\'".',
      };
    }

    case 'safe-revert': {
      if (commitsCount >= 2 || reflogs.some(r => r.some(e => e.message.toLowerCase().includes('revert')))) {
        return { valid: true, score: 100 };
      }
      return {
        valid: false,
        score: 0,
        reason: 'Create a rollback commit using "git revert HEAD".',
      };
    }

    case 'object-detective': {
      if (objects.length >= 1 || commitsCount >= 1) {
        return { valid: true, score: 150 };
      }
      return {
        valid: false,
        score: 0,
        reason: 'Hash a raw string into the database: echo "GitNovi" | git hash-object -w --stdin.',
      };
    }

    case 'plumbing-architect': {
      if (objects.some(o => o.type === 'tree') || commitsCount >= 1) {
        return { valid: true, score: 150 };
      }
      return {
        valid: false,
        score: 0,
        reason: 'Run "git write-tree" and "git commit-tree" in the sandbox terminal.',
      };
    }

    case 'tree-traversal': {
      if (commitsCount >= 1 || objects.length >= 1) {
        return { valid: true, score: 150 };
      }
      return {
        valid: false,
        score: 0,
        reason: 'Create a commit and inspect tree listings with "git ls-tree HEAD".',
      };
    }

    case 'worktree-pro': {
      if (branchRefs.length >= 1 || commitsCount >= 1) {
        return { valid: true, score: 150 };
      }
      return {
        valid: false,
        score: 0,
        reason: 'Create or list worktrees with "git worktree list" in the terminal.',
      };
    }

    case 'sparse-checkout-pro': {
      if (commitsCount >= 1 || Object.keys(state.files || {}).length > 0) {
        return { valid: true, score: 150 };
      }
      return {
        valid: false,
        score: 0,
        reason: 'Initialize cone mode sparse checkout with "git sparse-checkout init --cone".',
      };
    }

    case 'maintenance-fsck': {
      if (commitsCount >= 1 || objects.length >= 1) {
        return { valid: true, score: 150 };
      }
      return {
        valid: false,
        score: 0,
        reason: 'Run "git fsck" and "git count-objects -v" in the sandbox terminal.',
      };
    }

    default: {
      return { valid: true, score: 100 };
    }
  }
}
