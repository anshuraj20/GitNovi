import { NextResponse } from 'next/server';

import {
  deleteConversation,
  getConversation,
  getMessages,
  updateConversation,
} from '@/lib/ai/conversations';

import { requireUser } from '@/lib/supabase/server';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _req: Request,
  context: RouteContext,
) {
  try {
    const { user } = await requireUser();

    const { id } = await context.params;

    const conversation =
      await getConversation(
        user.id,
        id,
      );

    const messages =
      await getMessages(
        user.id,
        id,
      );

    return NextResponse.json({
      conversation,
      messages,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to load conversation',
      },
      {
        status: 404,
      },
    );
  }
}

export async function PATCH(
  req: Request,
  context: RouteContext,
) {
  try {
    const { user } = await requireUser();

    const { id } = await context.params;

    const body = await req.json();

    const updates: {
      title?: string;
      model?: string | null;
    } = {};

    if (
      typeof body?.title === 'string'
    ) {
      const title =
        body.title.trim();

      if (title) {
        updates.title =
          title.slice(0, 120);
      }
    }

    if (
      typeof body?.model === 'string'
    ) {
      updates.model =
        body.model;
    }

    if (
      Object.keys(updates).length === 0
    ) {
      return NextResponse.json(
        {
          error:
            'No valid updates supplied',
        },
        {
          status: 400,
        },
      );
    }

    const conversation =
      await updateConversation(
        user.id,
        id,
        updates,
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
            : 'Failed to update conversation',
      },
      {
        status: 400,
      },
    );
  }
}

export async function DELETE(
  _req: Request,
  context: RouteContext,
) {
  try {
    const { user } = await requireUser();

    const { id } = await context.params;

    await deleteConversation(
      user.id,
      id,
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to delete conversation',
      },
      {
        status: 400,
      },
    );
  }
}