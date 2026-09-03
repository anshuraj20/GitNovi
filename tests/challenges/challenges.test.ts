import { describe, it, expect } from 'vitest';
import { challengesCatalog } from '@/lib/challenges/challengeCatalog';
import { GitDispatcher } from '@/lib/git-engine';
import { validateChallengeState } from '@/lib/challenges/validators';

describe('Challenge Catalog & Validators', () => {
  it('loads all 18 challenges with required fields, goals, and xp', () => {
    expect(challengesCatalog.length).toBe(18);
    for (const c of challengesCatalog) {
      expect(c.id).toBeTruthy();
      expect(c.title).toBeTruthy();
      expect(c.level).toBeTruthy();
      expect(c.xp).toBeGreaterThan(0);
      expect(c.goal).toBeTruthy();
      expect(c.instructions.length).toBeGreaterThan(0);
    }
  });

  it('validates first commit challenge accurately', () => {
    const d = new GitDispatcher();
    // Initially not passed
    const initialResult = validateChallengeState('first-commit', d.state);
    expect(initialResult.valid).toBe(false);

    // Perform challenge steps
    d.execute('git init');
    d.execute('touch hello.txt');
    d.execute('git add hello.txt');
    d.execute('git commit -m "feat: initial commit"');

    const passedResult = validateChallengeState('first-commit', d.state);
    expect(passedResult.valid).toBe(true);
  });

  it('validates branch creation challenge (branch-orbit)', () => {
    const d = new GitDispatcher();
    d.execute('git init');
    d.execute('touch file.txt');
    d.execute('git add file.txt');
    d.execute('git commit -m "Initial commit"');
    d.execute('git branch feature/orbit');

    const result = validateChallengeState('branch-orbit', d.state);
    expect(result.valid).toBe(true);
  });
});
