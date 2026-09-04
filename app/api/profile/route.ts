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
      .upsert(
        {
          id: user.id,
          email: user.email,
          display_name: body.displayName,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );

    if (error) {
      console.warn('Profile update warning:', error.message);
    }

    try {
      await supabase.auth.updateUser({
        data: {
          display_name: body.displayName,
          full_name: body.displayName,
          name: body.displayName,
        },
      });
    } catch {
      // Optional metadata sync
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to update profile' },
      { status: 400 },
    );
  }
}
