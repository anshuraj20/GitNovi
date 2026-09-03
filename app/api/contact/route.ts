import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY?.trim() || '';
  return NextResponse.json({ key: accessKey });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: 'Invalid request payload.' },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'Name, email, and message are required fields.' },
        { status: 400 }
      );
    }

    // Save copy in Supabase Database
    try {
      const supabase = await createClient();
      await supabase.from('contact_messages').insert({
        name: name.trim(),
        email: email.trim(),
        subject: subject?.trim() || 'General Inquiry',
        message: message.trim(),
        created_at: new Date().toISOString(),
      });
    } catch {
      // Table may not exist yet; continue gracefully
    }

    return NextResponse.json({
      success: true,
      message: 'Message saved.',
    });
  } catch (error) {
    console.error('Contact storage error:', error);
    return NextResponse.json(
      { error: 'Failed to record message.' },
      { status: 500 }
    );
  }
}
