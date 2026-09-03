import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const schema = z.object({
  displayName: z.string().trim().min(1).max(80),
  bio: z.string().max(300).optional(),
  preferredEditor: z.string().max(50).optional(),
});

export async function PATCH(request: Request) {
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

    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: body.displayName,
      })
      .eq('id', user.id);

    if (error) {
      console.warn('Profile update warning:', error.message);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to update profile' },
      { status: 400 },
    );
  }
}
