// app/api/terminal/session/route.ts – Terminal Session Endpoint

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const schema = z.object({
  state: z.record(z.string(), z.unknown()).optional(),
  reset: z.boolean().optional(),
});

export async function GET() {
  try {
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
      return NextResponse.json({ state: null, guest: true });
    }

    const { data, error } = await supabase
      .from('terminal_sessions')
      .select('id,state,updated_at')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.warn('Failed to fetch terminal session:', error.message);
      return NextResponse.json({ state: null });
    }

    return NextResponse.json({ state: data?.state ?? null, id: data?.id ?? null });
  } catch (error) {
    return NextResponse.json({ state: null, error: String(error) });
  }
}

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

    if (body.reset) {
      await supabase.from('terminal_sessions').delete().eq('user_id', user.id);
      return NextResponse.json({ ok: true, reset: true });
    }

    if (!body.state) {
      return NextResponse.json({ ok: true });
    }

    const { data: existing } = await supabase
      .from('terminal_sessions')
      .select('id')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const payload = {
      user_id: user.id,
      state: body.state,
      updated_at: new Date().toISOString(),
    };

    if (existing?.id) {
      const { error } = await supabase
        .from('terminal_sessions')
        .update(payload)
        .eq('id', existing.id);
      if (error) throw error;
      return NextResponse.json({ id: existing.id });
    }

    const { data, error } = await supabase
      .from('terminal_sessions')
      .insert(payload)
      .select('id')
      .single();

    if (error) throw error;
    return NextResponse.json({ id: data.id });
  } catch (error) {
    return NextResponse.json({ ok: true, fallback: true, error: String(error) });
  }
}
