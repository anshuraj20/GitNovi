'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LessonCompleteButton } from './LessonCompleteButton';

type LessonContent = {
  summary?: string;
  why?: string;
  example?: string;
  command?: string;
  practice?: string;
  commonMistake?: string;
};

type Lesson = {
  id: string;
  title: string;
  objective: string;
  estimated_minutes: number;
  completed?: boolean;
  content?: LessonContent | null;
};

function ExampleBox({ example }: { example: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(example);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard error
    }
  };

  return (
    <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-950/40 p-3">
      <div>
        <div className="flex items-center justify-between">
          <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-cyan-300 font-mono">
            Example
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-cyan-300 transition cursor-pointer font-mono"
            title="Copy command"
          >
            {copied ? (
              <span className="text-emerald-400 font-semibold">✓ Copied</span>
            ) : (
              <span>📋 Copy</span>
            )}
          </button>
        </div>
        <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-words font-mono text-xs leading-6 text-slate-200">
          {example}
        </pre>
      </div>

      <div className="mt-3 pt-2 border-t border-slate-900 flex items-center justify-end">
        <Link
          href="/terminal"
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 transition"
        >
          <span>Try in Terminal</span>
          <span>↗</span>
        </Link>
      </div>
    </div>
  );
}

export function ModuleLessons({ lessons }: { lessons: Lesson[] }) {
  return (
    <div className="mt-8 grid gap-4">
      {lessons.map((lesson, index) => {
        const content =
          typeof lesson.content === 'object' && lesson.content !== null
            ? lesson.content
            : null;

        const summary =
          content?.summary || content?.why || lesson.objective;

        const why =
          content?.why ||
          'This concept matters because it changes how you understand repository state, safety, and collaboration.';

        const practice =
          content?.practice ||
          'Practice this concept in the terminal and describe what changed before moving forward.';

        const example =
          content?.command || content?.example || 'git status';

        return (
          <div
            key={lesson.id}
            id={lesson.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 shadow-lg shadow-slate-950/20 transition hover:border-slate-700/80"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-slate-500 font-mono">
                  <span className="text-cyan-400 font-bold">Lesson {String(index + 1).padStart(2, '0')}</span>
                  <span>•</span>
                  <span>{lesson.estimated_minutes} min read</span>
                </div>

                <h2 className="mt-2 text-xl font-bold text-slate-100">
                  {lesson.title}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {summary}
                </p>
              </div>

              <div className="shrink-0">
                <LessonCompleteButton
                  lessonId={lesson.id}
                  initialCompleted={lesson.completed}
                />
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {/* Why Box */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-cyan-300 font-mono">
                  Why it matters
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-300">{why}</p>
              </div>

              {/* Example Box with Copy & Terminal Link */}
              <ExampleBox example={example} />

              {/* Practice Box */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-cyan-300 font-mono">
                  Practice Steps
                </div>
                <div className="mt-2 space-y-2 text-sm leading-relaxed text-slate-300">
                  {practice.split('\n').filter(Boolean).map((line, i) => {
                    const match = line.match(/^(\d+\.|\-|\•)\s*(.*)/);
                    if (match) {
                      return (
                        <div key={i} className="flex items-start gap-2">
                          <span className="font-bold text-cyan-400 shrink-0 select-none text-xs mt-0.5 font-mono">
                            {match[1]}
                          </span>
                          <span className="flex-1 text-slate-300 text-xs sm:text-sm">{match[2]}</span>
                        </div>
                      );
                    }
                    return (
                      <p key={i} className="text-slate-300 text-xs sm:text-sm">
                        {line}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Common Mistake Alert */}
            {content?.commonMistake && (
              <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-amber-300 font-mono">
                  <span>⚠️</span>
                  <span>Common pitfall to avoid</span>
                </div>
                <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-slate-300">
                  {content.commonMistake}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
