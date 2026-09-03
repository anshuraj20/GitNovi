import { NextResponse } from 'next/server';

import {
  createConversation,
  listConversations,
} from '@/lib/ai/conversations';

import { requireUser } from '@/lib/supabase/server';

export async function GET() {
  try {
    const { user } = await requireUser();

    const conversations =
      await listConversations(user.id);

    return NextResponse.json({
      conversations,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to load conversations',
      },
      {
        status: 400,
      },
    );
  }
}

export async function POST(req: Request) {
  try {
    const { user } = await requireUser();

    let title = 'New Git chat';

    try {
      const body = await req.json();

      if (
        typeof body?.title === 'string' &&
        body.title.trim()
      ) {
        title = body.title
          .trim()
          .slice(0, 120);
      }
    } catch {
      /*
       * Empty request body is allowed.
       */
    }

    const conversation =
      await createConversation(
        user.id,
        title,
      );

    return NextResponse.json({
      conversation,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to create conversation',
      },
      {
        status: 400,
      },
    );
  }
}