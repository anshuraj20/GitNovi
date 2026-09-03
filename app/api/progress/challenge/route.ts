import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const schema = z.object({
  challengeId: z.string(),
  score: z.number().int().min(0).max(200).default(100),
  completed: z.boolean().optional().default(true),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const body = schema.parse(json);

    let supabase;
    let user;
    try {
      supabase = await createClient();
      const { data: userData } = await supabase.auth.getUser();
      user = userData?.user;
    } catch {
      // Guest mode
    }

    if (!user || !supabase) {
      return NextResponse.json({ ok: true, guest: true, completed: body.completed });
    }

    const { error } = await supabase.from('challenge_progress').upsert({
      user_id: user.id,
      challenge_id: body.challengeId,
      completed: body.completed,
      score: body.score,
      completed_at: body.completed ? new Date().toISOString() : null,
    });

    if (error) {
      console.warn('Supabase challenge progress upsert error:', error.message);
    }

    try {
      if (body.completed) {
        await supabase.rpc('record_learning_activity', {
          p_user_id: user.id,
          p_kind: 'challenge',
          p_minutes: 0,
        });
      }
    } catch {
      // Ignore RPC if not present
    }

    return NextResponse.json({ ok: true, completed: body.completed });
  } catch (error) {
    return NextResponse.json({ ok: true, fallback: true, error: String(error) });
  }
}

