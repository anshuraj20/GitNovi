import { describe, it, expect } from 'vitest';
import { achievementDefinitions } from '@/lib/achievements/definitions';

describe('Achievements Module', () => {
  it('contains valid achievement definitions with titles and icons', () => {
    const keys = Object.keys(achievementDefinitions);
    expect(keys.length).toBeGreaterThanOrEqual(10);

    for (const key of keys) {
      const def = achievementDefinitions[key as keyof typeof achievementDefinitions];
      expect(def.id).toBe(key);
      expect(def.title).toBeTruthy();
      expect(def.description).toBeTruthy();
      expect(def.icon).toBeTruthy();
      expect(def.condition).toBeTruthy();
    }
  });

  it('includes key milestones: first-lesson, first-commit, streak-7, course-complete', () => {
    expect(achievementDefinitions['first-lesson']).toBeDefined();
    expect(achievementDefinitions['first-commit']).toBeDefined();
    expect(achievementDefinitions['streak-7']).toBeDefined();
    expect(achievementDefinitions['streak-30']).toBeDefined();
    expect(achievementDefinitions['course-complete']).toBeDefined();
    expect(achievementDefinitions['terminal-warrior']).toBeDefined();
  });
});
