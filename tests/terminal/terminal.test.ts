import { describe, expect, it } from 'vitest';

import { GitDispatcher } from '@/lib/git-engine';
import { validateChallengeState } from '@/lib/challenges/validators';

describe('terminal', () => {
  it('returns safe unsupported command response', () => {
    const dispatcher = new GitDispatcher();
    dispatcher.execute('git init');
    const result = dispatcher.execute('git totally-future-command');

    expect(result.error).toBe(true);
    expect(result.output).toContain('does not simulate');
  });

  it('validates a first commit challenge only after a real commit exists', () => {
    const dispatcher = new GitDispatcher();
    expect(validateChallengeState('first-commit', dispatcher.state).valid).toBe(false);

    dispatcher.execute('git init');
    dispatcher.execute('touch hello.txt');
    dispatcher.execute('git add hello.txt');
    dispatcher.execute('git commit -m "Initial commit"');

    expect(validateChallengeState('first-commit', dispatcher.state).valid).toBe(true);
  });

  it('validates recovery workflow using reflog history', () => {
    const dispatcher = new GitDispatcher();
    dispatcher.execute('git init');

    dispatcher.execute('touch a.txt');
    dispatcher.execute('git add a.txt');
    dispatcher.execute('git commit -m "first"');

    dispatcher.execute('touch b.txt');
    dispatcher.execute('git add b.txt');
    dispatcher.execute('git commit -m "second"');

    dispatcher.execute('git reset --hard HEAD~1');

    expect(validateChallengeState('reflog-rescue', dispatcher.state).valid).toBe(true);
  });
});
