// lib/challenges/challengeCatalog.ts – Complete GitNovi Hands-On Challenges (18 Challenges)

export type Challenge = {
  id: string;
  slug: string;
  title: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  xp: number;
  goal: string;
  instructions: string[];
  hint: string;
  requiredCommands: string[];
};

export const challengesCatalog: Challenge[] = [
  // ----------------------------------------------------
  // BEGINNER CHALLENGES (6 Challenges)
  // ----------------------------------------------------
  {
    id: 'c1000000-0000-4000-8000-000000000001',
    slug: 'first-commit',
    title: '1. The Genesis Commit',
    level: 'beginner',
    xp: 50,
    goal: 'Initialize your first repository, configure your identity, stage README.md, and record a commit.',
    instructions: [
      'Initialize an empty Git repository with "git init".',
      'Configure your author name and email using "git config".',
      'Stage the initial files with "git add .".',
      'Create your very first commit with a message: git commit -m "feat: initial commit".',
    ],
    hint: 'Run "git init" followed by "git add ." and "git commit -m \'feat: initial commit\'".',
    requiredCommands: ['git init', 'git add', 'git commit'],
  },
  {
    id: 'c1000000-0000-4000-8000-000000000002',
    slug: 'targeted-staging',
    title: '2. Targeted Staging & Status',
    level: 'beginner',
    xp: 50,
    goal: 'Practice staging specific files while keeping untracked secrets out of the staging index.',
    instructions: [
      'Check the repository state with "git status -s".',
      'Stage only specific files (e.g. "git add app.js index.html").',
      'Verify with "git status" that the staging area only contains the intended files.',
      'Commit the staged changes.',
    ],
    hint: 'Use "git status -s" to inspect two-column short statuses and stage files individually with "git add <filename>".',
    requiredCommands: ['git status', 'git add', 'git commit'],
  },
  {
    id: 'c1000000-0000-4000-8000-000000000003',
    slug: 'branch-orbit',
    title: '3. Feature Branch Orbit',
    level: 'beginner',
    xp: 75,
    goal: 'Create an isolated feature branch, make a commit on it, and switch back to main.',
    instructions: [
      'Create and switch to a new branch: "git switch -c feature/navbar" (or "git checkout -b feature/navbar").',
      'Make a commit on your feature branch.',
      'Switch back to the main branch using "git switch main".',
      'Verify with "git branch" that both branches exist.',
    ],
    hint: 'Use "git switch -c feature/navbar", add a commit, and then run "git switch main".',
    requiredCommands: ['git switch', 'git branch', 'git commit'],
  },
  {
    id: 'c1000000-0000-4000-8000-000000000004',
    slug: 'restore-safety',
    title: '4. Safe Undo with Restore',
    level: 'beginner',
    xp: 75,
    goal: 'Unstage mistakenly staged files safely without discarding your uncommitted work.',
    instructions: [
      'Stage files with "git add .".',
      'Unstage a file safely from index using "git restore --staged <file>".',
      'Inspect the unified diff with "git diff" to verify working edits are preserved.',
    ],
    hint: '"git restore --staged <file>" removes the file from the index while keeping your disk modifications intact.',
    requiredCommands: ['git add', 'git restore', 'git diff'],
  },
  {
    id: 'c1000000-0000-4000-8000-000000000005',
    slug: 'file-lifecycle',
    title: '5. Moving & Removing Files',
    level: 'beginner',
    xp: 75,
    goal: 'Safely remove untracked files with "git rm" and rename files using "git mv".',
    instructions: [
      'Stage and commit initial files.',
      'Rename a file using "git mv old-name.ts new-name.ts".',
      'Remove a deprecated file using "git rm obsolete.ts".',
      'Verify the staged operations with "git status" and commit.',
    ],
    hint: 'Use "git mv <old> <new>" and "git rm <file>" to stage filesystem refactoring in one step.',
    requiredCommands: ['git mv', 'git rm', 'git status'],
  },
  {
    id: 'c1000000-0000-4000-8000-000000000006',
    slug: 'log-detective',
    title: '6. Commit Log Detective',
    level: 'beginner',
    xp: 75,
    goal: 'Explore visual commit graphs and inspect specific historical snapshots.',
    instructions: [
      'Inspect your branch history with "git log --oneline --graph --all".',
      'Inspect the latest commit diff with "git show HEAD".',
      'Inspect the second most recent commit using "git show HEAD~1".',
    ],
    hint: 'Use "git log --graph --oneline --all" to view DAG branches and "git show HEAD" to view patches.',
    requiredCommands: ['git log', 'git show'],
  },

  // ----------------------------------------------------
  // INTERMEDIATE CHALLENGES (6 Challenges)
  // ----------------------------------------------------
  {
    id: 'c2000000-0000-4000-8000-000000000007',
    slug: 'conflict-solver',
    title: '7. The Conflict Crucible',
    level: 'intermediate',
    xp: 100,
    goal: 'Merge divergent branches and resolve conflict markers cleanly.',
    instructions: [
      'Create two divergent branches with distinct commits.',
      'Attempt to merge the feature branch into main: "git merge feature/auth".',
      'Observe conflict markers (<<<<<<< HEAD, =======, >>>>>>>).',
      'Stage the resolved file with "git add" and finalize the merge commit.',
    ],
    hint: 'Merge the branch, inspect conflicting files with "git status", and finalize with "git commit".',
    requiredCommands: ['git merge', 'git status', 'git commit'],
  },
  {
    id: 'c2000000-0000-4000-8000-000000000008',
    slug: 'emergency-stash',
    title: '8. Emergency Stash Stacking',
    level: 'intermediate',
    xp: 100,
    goal: 'Shelve uncommitted work-in-progress onto a stash stack and pop it back.',
    instructions: [
      'Stash your current uncommitted changes: "git stash push -u -m \'WIP auth form\'".',
      'Verify the working directory is completely clean with "git status".',
      'List your saved stashes with "git stash list".',
      'Restore and remove your stashed changes with "git stash pop".',
    ],
    hint: 'Use "git stash push -u" to save dirty state and "git stash pop" to restore it.',
    requiredCommands: ['git stash', 'git status'],
  },
  {
    id: 'c2000000-0000-4000-8000-000000000009',
    slug: 'linear-rebase',
    title: '9. Linear History Rebase',
    level: 'intermediate',
    xp: 125,
    goal: 'Rebase a feature branch onto the latest main branch commit to produce a clean linear timeline.',
    instructions: [
      'Switch to your feature branch.',
      'Rebase your branch commits onto main: "git rebase main".',
      'Inspect the linear history graph with "git log --graph --oneline".',
    ],
    hint: 'Run "git rebase main" while on your feature branch, and verify with "git log --graph --oneline".',
    requiredCommands: ['git rebase', 'git log'],
  },
  {
    id: 'c2000000-0000-4000-8000-000000000010',
    slug: 'reflog-rescue',
    title: '10. The Reflog Time Machine',
    level: 'intermediate',
    xp: 125,
    goal: 'Simulate an accidental hard reset and recover your lost commit using the reflog.',
    instructions: [
      'Create a commit with a recognizable message.',
      'Simulate a mistake: "git reset --hard HEAD~1".',
      'Run "git reflog" to locate the SHA hash of your "lost" commit.',
      'Restore your lost commit using "git reset --hard HEAD@{1}" or by checking out the hash.',
    ],
    hint: 'Inspect "git reflog" to find the lost commit SHA and restore it with "git reset --hard <SHA>".',
    requiredCommands: ['git reset', 'git reflog'],
  },
  {
    id: 'c2000000-0000-4000-8000-000000000011',
    slug: 'release-tagger',
    title: '11. Semantic Version Tagging',
    level: 'intermediate',
    xp: 100,
    goal: 'Create an annotated release tag v1.0.0 and inspect its metadata.',
    instructions: [
      'Create an annotated tag: git tag -a v1.0.0 -m "Production release v1.0.0".',
      'List all tags with "git tag".',
      'Inspect tag metadata and associated commit with "git show v1.0.0".',
    ],
    hint: 'Use "git tag -a v1.0.0 -m \'Release v1.0.0\'" followed by "git show v1.0.0".',
    requiredCommands: ['git tag', 'git show'],
  },
  {
    id: 'c2000000-0000-4000-8000-000000000012',
    slug: 'safe-revert',
    title: '12. Safe Public Rollback',
    level: 'intermediate',
    xp: 100,
    goal: 'Safely undo a broken commit on a shared branch by creating an inverse commit with "git revert".',
    instructions: [
      'Create a commit introducing a bug.',
      'Revert the bad commit safely: "git revert HEAD".',
      'Inspect the log with "git log -2" to verify the new Revert commit is recorded.',
    ],
    hint: 'Run "git revert HEAD" to compute the inverse diff and record a safe rollback commit.',
    requiredCommands: ['git revert', 'git log'],
  },

  // ----------------------------------------------------
  // ADVANCED CHALLENGES (6 Challenges)
  // ----------------------------------------------------
  {
    id: 'c3000000-0000-4000-8000-000000000013',
    slug: 'object-detective',
    title: '13. Object Database Detective',
    level: 'advanced',
    xp: 150,
    goal: 'Hash a raw string into a blob in .git/objects and inspect it with plumbing commands.',
    instructions: [
      'Hash and write a blob directly into the database: echo "GitNovi Internals" | git hash-object -w --stdin.',
      'Check the object type using "git cat-file -t <hash>".',
      'Read the raw object content using "git cat-file -p <hash>".',
    ],
    hint: 'Use "git hash-object -w" to generate a SHA, then "git cat-file -p <hash>" to read it.',
    requiredCommands: ['git hash-object', 'git cat-file'],
  },
  {
    id: 'c3000000-0000-4000-8000-000000000014',
    slug: 'plumbing-architect',
    title: '14. The Plumbing Architect',
    level: 'advanced',
    xp: 150,
    goal: 'Construct a commit manually using low-level plumbing commands (write-tree, commit-tree, update-ref).',
    instructions: [
      'Write the current staging index to a tree object with "git write-tree".',
      'Create a commit object pointing to that tree: git commit-tree <tree-hash> -m "Manual commit".',
      'Advance the main branch reference manually with "git update-ref refs/heads/main <commit-hash>".',
    ],
    hint: 'Execute "git write-tree" -> "git commit-tree <tree>" -> "git update-ref refs/heads/main <commit>".',
    requiredCommands: ['git write-tree', 'git commit-tree', 'git update-ref'],
  },
  {
    id: 'c3000000-0000-4000-8000-000000000015',
    slug: 'tree-traversal',
    title: '15. Tree & Staging Index Inspector',
    level: 'advanced',
    xp: 150,
    goal: 'Inspect directory tree structures recursively with "git ls-tree" and staging cache entries with "git ls-files".',
    instructions: [
      'Recursively inspect repository trees with "git ls-tree -r HEAD".',
      'Query the staging index stage numbers with "git ls-files -s".',
      'Inspect unmerged stage conflict entries with "git ls-files -u".',
    ],
    hint: 'Use "git ls-tree -r HEAD" to view blob hashes and "git ls-files -s" to query stage numbers.',
    requiredCommands: ['git ls-tree', 'git ls-files'],
  },
  {
    id: 'c3000000-0000-4000-8000-000000000016',
    slug: 'worktree-pro',
    title: '16. Concurrent Worktree Matrix',
    level: 'advanced',
    xp: 150,
    goal: 'Create multiple concurrent working tree directories linked to a single repository.',
    instructions: [
      'List existing working trees with "git worktree list".',
      'Create a new linked worktree for a branch: "git worktree add ../hotfix-worktree main".',
      'Verify that both worktrees share the same commit database.',
    ],
    hint: 'Use "git worktree add <path> <branch>" and "git worktree list" to manage parallel workspaces.',
    requiredCommands: ['git worktree', 'git branch'],
  },
  {
    id: 'c3000000-0000-4000-8000-000000000017',
    slug: 'sparse-checkout-pro',
    title: '17. Monorepo Sparse Cone Checkout',
    level: 'advanced',
    xp: 150,
    goal: 'Initialize cone mode sparse checkout to restrict working directory to specific subfolders.',
    instructions: [
      'Initialize sparse checkout cone mode: "git sparse-checkout init --cone".',
      'Set sparse checkout to a single directory: "git sparse-checkout set src/".',
      'Verify sparse checkout status with "git sparse-checkout list".',
    ],
    hint: 'Run "git sparse-checkout init --cone" and "git sparse-checkout set <folder>" to restrict checkouts.',
    requiredCommands: ['git sparse-checkout'],
  },
  {
    id: 'c3000000-0000-4000-8000-000000000018',
    slug: 'maintenance-fsck',
    title: '18. Repository Integrity & Health Check',
    level: 'advanced',
    xp: 150,
    goal: 'Verify repository object database integrity with "git fsck" and inspect storage counts.',
    instructions: [
      'Run a complete database integrity audit with "git fsck".',
      'Inspect loose object storage and packfile metrics with "git count-objects -v".',
      'Run garbage collection optimization with "git gc".',
    ],
    hint: 'Use "git fsck" to verify object integrity and "git count-objects -v" / "git gc" to optimize.',
    requiredCommands: ['git fsck', 'git gc', 'git count-objects'],
  },
];
