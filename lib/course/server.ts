import { createClient } from '@/lib/supabase/server';
import { courseCatalog, CourseModuleData, LessonContent } from '@/lib/course/courseCatalog';

export type { LessonContent };

export async function getModuleLessons(slug: string, userId?: string): Promise<CourseModuleData | null> {
  const fallbackModule = courseCatalog[slug] || null;

  try {
    const supabase = await createClient();

    let dbModule = null;
    try {
      const { data } = await supabase
        .from('course_modules')
        .select('id,title,description,level')
        .eq('slug', slug)
        .single();
      dbModule = data;
    } catch {
      // Supabase or table might not exist
    }

    const effectiveModule = dbModule
      ? {
          id: dbModule.id,
          slug: slug as CourseModuleData['slug'],
          title: dbModule.title ?? fallbackModule?.title ?? slug,
          level: dbModule.level ?? fallbackModule?.level ?? 0,
          description: dbModule.description ?? fallbackModule?.description ?? '',
          lessons: fallbackModule?.lessons ?? [],
        }
      : fallbackModule;

    if (!effectiveModule) return null;

    // Check progress if user is authenticated
    let doneIds = new Set<string>();
    if (userId) {
      try {
        const lessonIds = effectiveModule.lessons.map((l) => l.id);
        const { data: progress } = await supabase
          .from('lesson_progress')
          .select('lesson_id,completed')
          .eq('user_id', userId)
          .in('lesson_id', lessonIds);

        if (progress) {
          doneIds = new Set(
            progress.filter((item) => item.completed).map((item) => item.lesson_id),
          );
        }
      } catch {
        // Progress fetch error, continue with empty completed set
      }
    }

    return {
      ...effectiveModule,
      lessons: effectiveModule.lessons.map((lesson) => ({
        ...lesson,
        completed: doneIds.has(lesson.id),
      })),
    };
  } catch {
    // If Supabase client fails completely, return fallback module
    return fallbackModule;
  }
}

