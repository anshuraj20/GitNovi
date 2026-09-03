import { describe, it, expect } from 'vitest';
import { courseCatalog } from '@/lib/course/courseCatalog';

describe('Course Catalog Integrity', () => {
  it('contains modules for all 4 tracks (pre-git, beginner, intermediate, advanced)', () => {
    expect(courseCatalog['pre-git']).toBeDefined();
    expect(courseCatalog['beginner']).toBeDefined();
    expect(courseCatalog['intermediate']).toBeDefined();
    expect(courseCatalog['advanced']).toBeDefined();
  });

  it('ensures every track has lessons with unique IDs, titles, and curriculum content', () => {
    const modules = Object.values(courseCatalog);
    const lessonIds = new Set<string>();
    let totalLessons = 0;

    for (const mod of modules) {
      expect(mod.id).toBeTruthy();
      expect(mod.title).toBeTruthy();
      expect(mod.lessons.length).toBeGreaterThan(0);

      for (const lesson of mod.lessons) {
        expect(lessonIds.has(lesson.id)).toBe(false);
        lessonIds.add(lesson.id);
        expect(lesson.title).toBeTruthy();
        expect(lesson.objective).toBeTruthy();
        totalLessons++;
      }
    }

    expect(totalLessons).toBe(72);
  });
});
