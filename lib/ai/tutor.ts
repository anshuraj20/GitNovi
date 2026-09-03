import { z } from 'zod';
import { GROQ_MODELS } from '@/lib/ai/models';

const schema = z.object({
  question: z.string().min(1).max(6000),
  context: z.string().max(10000).optional(),
});

const SYSTEM_PROMPT = `
You are GitNovi, an expert Git and software version-control tutor.

Your mission is to teach Git from absolute beginner level through advanced
professional usage and Git internals.

Teaching rules:

1. Explain the WHY, not only the WHAT.
2. Give practical examples.
3. Provide real Git commands when useful.
4. Explain important flags and arguments.
5. Diagnose errors step by step.
6. When the user provides terminal output, carefully analyze it.
7. Warn clearly before destructive commands.
8. Prefer the safest solution first.
9. If there are multiple solutions, explain their tradeoffs.
10. Distinguish real Git behavior from GitNovi's educational simulator.
11. Never claim simulator behavior is identical to real Git unless it is actually
    implemented by GitNovi.
12. For advanced topics, explain Git's internal objects and references when useful.
13. Teach progressively based on the learner's apparent level.
14. Use realistic repository examples.
15. Stay focused on Git, GitHub, version control, terminals, repositories,
    branching, merging, rebasing, recovery, workflows and closely related
    software-development topics.
16. If asked something unrelated, politely redirect the user toward Git and
    software version control.

Answer-quality rules:

- Be accurate.
- Do not invent Git commands.
- Do not pretend a command exists if it does not.
- Explain potentially dangerous commands before the command.
- Use examples that the learner can copy and understand.
- If the question is ambiguous, explain the most likely interpretation and state
  what additional information would help.
- If the user is debugging an error, identify the likely cause before suggesting
  commands.

Formatting rules:

- Use Markdown.
- Use headings for longer answers.
- Use numbered steps for procedures.
- Use bullet lists when appropriate.
- Use fenced code blocks for terminal commands.
- Use inline code for commands, flags, filenames, branches and Git concepts.
- Use tables when they genuinely improve understanding.
- Keep answers readable and structured.
- Do not unnecessarily repeat the user's question.
`;

function shouldFallback(status: number) {
  return (
    status === 404 ||
    status === 408 ||
    status === 409 ||
    status === 429 ||
    status >= 500
  );
}

async function requestModel(
  model: string,
  question: string,
  context?: string,
) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured');
  }

  const response = await fetch(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,

        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: `Context:
${context ?? 'none'}

Question:
${question}`,
          },
        ],

        max_tokens: 1600,
      }),
    },
  );

  if (!response.ok) {
    let details = '';

    try {
      const errorBody = await response.json();

      details =
        errorBody?.error?.message ||
        errorBody?.message ||
        '';
    } catch {
      // Ignore malformed error bodies.
    }

    const error = new Error(
      `Groq request failed (${response.status})${
        details ? `: ${details}` : ''
      }`,
    );

    Object.assign(error, {
      status: response.status,
      shouldFallback: shouldFallback(response.status),
    });

    throw error;
  }

  return response;
}

export async function askGitTutor(input: unknown) {
  const { question, context } = schema.parse(input);

  const errors: string[] = [];

  /*
   * Models are attempted in the priority order defined by models.ts.
   *
   * Example:
   *
   * 1. GPT OSS 120B
   * 2. GPT OSS 20B
   * 3. Llama 3.3 70B
   * 4. Llama 3.1 8B
   *
   * If a model is unavailable, rate-limited, timed out, or the provider
   * returns a server-side error, the next model is attempted automatically.
   */

  const orderedModels = [...GROQ_MODELS].sort(
    (a, b) => a.priority - b.priority,
  );

  for (const model of orderedModels) {
    try {
      const response = await requestModel(
        model.id,
        question,
        context,
      );

      const json = await response.json();

      const answer =
        json?.choices?.[0]?.message?.content;

      if (
        typeof answer !== 'string' ||
        !answer.trim()
      ) {
        throw new Error(
          `Model ${model.id} returned an empty response`,
        );
      }

      return {
        answer,
        model: model.id,
        modelLabel: model.label,
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unknown model error';

      errors.push(
        `${model.label} (${model.id}): ${message}`,
      );

      const status =
        typeof error === 'object' &&
        error !== null &&
        'status' in error
          ? Number(
              (error as { status?: unknown }).status,
            )
          : undefined;

      /*
       * If the failure is not a recoverable/provider problem,
       * stop immediately instead of hiding the real error.
       */
      if (
        status !== undefined &&
        !shouldFallback(status)
      ) {
        throw error;
      }

      /*
       * For provider/model availability problems,
       * continue to the next configured model.
       */
      continue;
    }
  }

  throw new Error(
    `All configured Groq AI models failed.\n\n${errors.join('\n')}`,
  );
}