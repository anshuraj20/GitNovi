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

function CodeExampleBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore
    }
  };

  return (
    <div className="rounded-md border border-[#202934] bg-[#090D12] overflow-hidden my-2.5">
      <div className="flex items-center justify-between border-b border-[#202934] bg-[#11161D] px-3 py-1 text-[11px] text-[#737F8C] font-mono">
        <span>bash</span>
        <button
          type="button"
          onClick={handleCopy}
          className="hover:text-[#E6EDF3] transition cursor-pointer"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <div className="p-3 overflow-x-auto">
        <pre className="font-mono text-xs text-[#E6EDF3] leading-relaxed whitespace-pre">
          {code}
        </pre>
      </div>
    </div>
  );
}

export function ModuleLessons({ lessons }: { lessons: Lesson[] }) {
  return (
    <div className="space-y-8 divide-y divide-[#202934]">
      {lessons.map((lesson, index) => {
        const content =
          typeof lesson.content === 'object' && lesson.content !== null
            ? lesson.content
            : null;

        const summary = content?.summary || content?.why || lesson.objective;
        const why = content?.why;
        const practice = content?.practice;
        const example = content?.command || content?.example || 'git status';

        return (
          <article
            key={lesson.id}
            id={lesson.id}
            className={`pt-8 first:pt-0 space-y-4`}
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2.5">
              <div>
                <div className="text-xs font-mono text-[#737F8C]">
                  Lesson {String(index + 1).padStart(2, '0')} · {lesson.estimated_minutes} min
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-[#E6EDF3] mt-1">
                  {lesson.title}
                </h2>
              </div>

              <div className="shrink-0 pt-1 sm:pt-0">
                <LessonCompleteButton
                  lessonId={lesson.id}
                  initialCompleted={lesson.completed}
                />
              </div>
            </div>

            {/* Explanation / Summary */}
            <p className="text-sm leading-relaxed text-[#E6EDF3]">
              {summary}
            </p>

            {/* Why it matters (if different from summary) */}
            {why && why !== summary && (
              <div className="text-xs text-[#A7B0BC] leading-relaxed">
                <strong className="text-[#E6EDF3] font-semibold">Why this matters: </strong>
                {why}
              </div>
            )}

            {/* Example Command Block */}
            <div>
              <div className="text-xs font-semibold text-[#737F8C] uppercase tracking-wider font-mono">
                Command Example
              </div>
              <CodeExampleBlock code={example} />
            </div>

            {/* Practice Steps */}
            {practice && (
              <div className="space-y-1.5 pt-1">
                <div className="text-xs font-semibold text-[#737F8C] uppercase tracking-wider font-mono">
                  Practice Steps
                </div>
                <div className="space-y-1 text-xs text-[#E6EDF3] leading-relaxed">
                  {practice.split('\n').filter(Boolean).map((line, i) => {
                    const match = line.match(/^(\d+\.|\-|\•)\s*(.*)/);
                    if (match) {
                      return (
                        <div key={i} className="flex items-start gap-2">
                          <span className="font-mono text-[#22D3EE] shrink-0 font-semibold">{match[1]}</span>
                          <span>{match[2]}</span>
                        </div>
                      );
                    }
                    return <p key={i}>{line}</p>;
                  })}
                </div>
              </div>
            )}

            {/* Common Pitfall */}
            {content?.commonMistake && (
              <div className="border-l-2 border-[#FBBF24] bg-[#11161D] p-3 text-xs leading-relaxed text-[#E6EDF3] rounded-r">
                <div className="font-semibold text-[#FBBF24] font-mono text-[11px] mb-0.5">
                  Common pitfall:
                </div>
                <div>{content.commonMistake}</div>
              </div>
            )}

            {/* Terminal Sandbox Quick Link */}
            <div className="pt-2 text-xs">
              <Link
                href="/terminal"
                className="text-[#22D3EE] hover:underline inline-flex items-center gap-1 font-medium"
              >
                <span>Try this in the Terminal Sandbox</span>
                <span>→</span>
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
