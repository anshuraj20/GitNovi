import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const schema = z.object({
  lessonId: z.string().min(1),
  percent: z.number().int().min(0).max(100).default(100),
});

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    const completed = body.percent >= 100;

    let user = null;
    let supabase = null;

    try {
      supabase = await createClient();
      const { data, error: authError } = await supabase.auth.getUser();
      if (!authError && data?.user) {
        user = data.user;
      }
    } catch {
      // Supabase unconfigured or offline
    }

    if (!user || !supabase) {
      // Return ok for guest/offline sessions so local client state updates cleanly
      return NextResponse.json({ ok: true, completed, guest: true });
    }

    const { error: upsertError } = await supabase.from('lesson_progress').upsert({
      user_id: user.id,
      lesson_id: body.lessonId,
      percent: body.percent,
      completed,
      completed_at: completed ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    });

    if (upsertError) {
      console.warn('lesson_progress upsert:', upsertError.message);
    }

    if (completed) {
      try {
        await supabase.rpc('record_learning_activity', {
          p_user_id: user.id,
          p_kind: 'lesson',
          p_minutes: 10,
        });
      } catch {
        // Non-blocking activity recording
      }
    }

    return NextResponse.json({ ok: true, completed });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to save lesson progress' },
      { status: 400 },
    );
  }
}

