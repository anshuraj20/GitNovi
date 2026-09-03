// app/api/progress/activity/route.ts – Activity & Streak Endpoint

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const schema = z.object({
  kind: z.enum(['lesson', 'command', 'challenge']),
  minutes: z.number().int().min(0).max(240).default(0),
  achievementId: z.string().optional(),
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
      return NextResponse.json({ ok: true, guest: true });
    }

    const today = new Date().toISOString().split('T')[0];

    // 1. Update daily activity
    try {
      const { data: existingActivity } = await supabase
        .from('daily_activity')
        .select('*')
        .eq('user_id', user.id)
        .eq('activity_date', today)
        .maybeSingle();

      if (existingActivity) {
        await supabase
          .from('daily_activity')
          .update({
            lessons: (existingActivity.lessons || 0) + (body.kind === 'lesson' ? 1 : 0),
            commands: (existingActivity.commands || 0) + (body.kind === 'command' ? 1 : 0),
            challenges: (existingActivity.challenges || 0) + (body.kind === 'challenge' ? 1 : 0),
            minutes: (existingActivity.minutes || 0) + (body.minutes || 1),
          })
          .eq('id', existingActivity.id);
      } else {
        await supabase.from('daily_activity').insert({
          user_id: user.id,
          activity_date: today,
          lessons: body.kind === 'lesson' ? 1 : 0,
          commands: body.kind === 'command' ? 1 : 0,
          challenges: body.kind === 'challenge' ? 1 : 0,
          minutes: body.minutes || 1,
        });
      }
    } catch {
      // Daily activity table error
    }

    // 2. Update streak in user_streaks
    try {
      const { data: existingStreak } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

      if (existingStreak) {
        let nextCurrent = existingStreak.current_streak || 1;
        const lastDate = existingStreak.last_active_date;

        if (lastDate === today) {
          // Already recorded today
        } else if (lastDate === yesterday) {
          // Consecutive day!
          nextCurrent += 1;
        } else {
          // Reset streak
          nextCurrent = 1;
        }

        const nextLongest = Math.max(existingStreak.longest_streak || 1, nextCurrent);

        await supabase
          .from('user_streaks')
          .update({
            current_streak: nextCurrent,
            longest_streak: nextLongest,
            last_active_date: today,
          })
          .eq('id', existingStreak.id);
      } else {
        await supabase.from('user_streaks').insert({
          user_id: user.id,
          current_streak: 1,
          longest_streak: 1,
          last_active_date: today,
        });
      }
    } catch {
      // Streak table error
    }

    // 3. Unlock achievement if requested
    if (body.achievementId) {
      try {
        await supabase.from('user_achievements').upsert({
          user_id: user.id,
          achievement_id: body.achievementId,
          earned_at: new Date().toISOString(),
        });
      } catch {
        // Achievement unlock error
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: true, fallback: true, error: String(error) });
  }
}
