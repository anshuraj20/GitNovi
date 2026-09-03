import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireUser } from '@/lib/supabase/server';
import {
  addMessage,
  getConversation,
  getMessages,
  updateConversation,
} from '@/lib/ai/conversations';
import { GROQ_MODELS } from '@/lib/ai/models';

const schema = z.object({
  conversationId: z.string().uuid(),
  question: z.string().min(1).max(6000),
  context: z.string().max(10000).optional(),
  modelId: z.string().optional(),
});

const SYSTEM_PROMPT = `You are GitNovi AI, a world-class interactive Git and version control tutor.
Your mission is to provide high-quality, beautifully structured educational answers for any Git topic.

CRITICAL FORMATTING & COMPLETION RULES:
1. COMPLETION & CONCISENESS:
   - Provide comprehensive, high-density explanations that reach a full, polished conclusion.
   - Do not ramble excessively; keep each section focused so your answer always finishes cleanly.
2. TABLE FORMAT FOR COMPARISONS & CHEAT SHEETS:
   - Whenever explaining differences, flags, or command comparisons (e.g., reset vs revert, rebase vs merge, soft vs mixed vs hard, stash options), ALWAYS include a clean, comprehensive Markdown table with clear column headers.
3. TERMINAL COMMANDS & FENCED CODE BLOCKS:
   - Always put commands in fenced code blocks with the \`bash\` identifier.
   - Include realistic comments inside code blocks (e.g. \`# 1. Stage changes\`).
4. DANGEROUS & DESTRUCTIVE COMMAND WARNINGS:
   - Before any destructive command (e.g., \`git reset --hard\`, \`git clean -fd\`, \`git push --force\`), ALWAYS add a blockquote callout:
     > ⚠️ **Caution / Destructive Action:** This command permanently discards uncommitted changes. Make sure to stash or backup first.
5. STEP-BY-STEP PROCEDURES:
   - Use bold numbered steps for workflows (e.g. resolving merge conflicts, cherry-picking, interactive rebasing).
6. KEY TERMS & CONCEPTS:
   - Bold important Git concepts (like **HEAD**, **Index/Stage**, **Working Tree**, **Reflog**, **Blob**, **Tree**, **Commit**).`;

export async function POST(req: Request) {
  try {
    const { user } = await requireUser();
    const input = schema.parse(await req.json());

    const groqKey = process.env.GROQ_API_KEY?.trim();

    if (!groqKey) {
      return NextResponse.json(
        {
          error:
            'GROQ_API_KEY is not configured in .env.local.',
        },
        { status: 500 },
      );
    }

    const conversation = await getConversation(user.id, input.conversationId);
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found.' }, { status: 404 });
    }

    const previousMessages = await getMessages(user.id, input.conversationId);

    // Save user message in database
    await addMessage(user.id, input.conversationId, {
      role: 'user',
      content: input.question,
    });

    const modelMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...(input.context ? [{ role: 'system', content: `Context: ${input.context}` }] : []),
      ...previousMessages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: input.question },
    ];

    // Build ordered list of models
    const allModels = [...GROQ_MODELS];
    let modelsToTry = allModels;

    if (input.modelId && input.modelId !== 'auto') {
      const selected = allModels.find((m) => m.id === input.modelId);
      if (selected) {
        modelsToTry = [selected, ...allModels.filter((m) => m.id !== input.modelId)];
      }
    }

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        let fullAnswer = '';
        let modelUsed = '';
        let modelLabel = '';
        let success = false;
        let lastErrorMsg = '';

        for (const m of modelsToTry) {
          try {
            const controllerAbort = new AbortController();
            const timeout = setTimeout(() => controllerAbort.abort(), 16000);

            const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${groqKey}`,
                'Content-Type': 'application/json',
              },
              signal: controllerAbort.signal,
              body: JSON.stringify({
                model: m.id,
                temperature: 0.3,
                stream: true,
                messages: modelMessages,
                max_tokens: 4000,
              }),
            });

            clearTimeout(timeout);

            if (!res.ok) {
              const errJson = await res.json().catch(() => ({}));
              lastErrorMsg = errJson?.error?.message || `HTTP ${res.status}`;
              continue;
            }

            if (!res.body) continue;

            modelUsed = m.id;
            modelLabel = m.label;

            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: 'model', model: modelUsed, modelLabel })}\n\n`),
            );

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split('\n');
              buffer = lines.pop() ?? '';

              for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed || trimmed === 'data: [DONE]' || !trimmed.startsWith('data:')) continue;

                try {
                  const json = JSON.parse(trimmed.slice(5).trim());
                  const token = json?.choices?.[0]?.delta?.content;
                  if (token) {
                    fullAnswer += token;
                    controller.enqueue(
                      encoder.encode(`data: ${JSON.stringify({ type: 'text', content: token })}\n\n`),
                    );
                  }
                } catch {
                  // Ignore SSE token parsing errors
                }
              }
            }

            // Flush any remaining buffer text
            if (buffer.trim().startsWith('data:')) {
              try {
                const json = JSON.parse(buffer.trim().slice(5).trim());
                const token = json?.choices?.[0]?.delta?.content;
                if (token) {
                  fullAnswer += token;
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ type: 'text', content: token })}\n\n`),
                  );
                }
              } catch {
                // Ignore buffer parse error
              }
            }

            if (fullAnswer.trim().length > 0) {
              success = true;
              break;
            }
          } catch (err) {
            lastErrorMsg = err instanceof Error ? err.message : 'Groq request failed';
          }
        }

        if (!success || !fullAnswer.trim()) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: 'error',
                error: lastErrorMsg || 'Unable to generate AI response. Try selecting a different model from the top dropdown.',
              })}\n\n`,
            ),
          );
          controller.close();
          return;
        }

        // Save assistant answer in DB
        try {
          await addMessage(user.id, input.conversationId, {
            role: 'assistant',
            content: fullAnswer,
            model: modelUsed,
          });

          await updateConversation(user.id, input.conversationId, {
            model: modelUsed,
            title:
              conversation.title === 'New chat' || conversation.title === 'New Git chat'
                ? input.question.trim().slice(0, 50)
                : conversation.title,
          });
        } catch {
          // DB sync
        }

        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              type: 'done',
              conversationId: input.conversationId,
              model: modelUsed,
              modelLabel,
            })}\n\n`,
          ),
        );

        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input format.' }, { status: 400 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'AI request failed' },
      { status: 500 },
    );
  }
}
