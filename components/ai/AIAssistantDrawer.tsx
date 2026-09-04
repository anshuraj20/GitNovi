'use client';

import { KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GROQ_MODELS } from '@/lib/ai/models';

type AIMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  model?: string | null;
};

type StreamEvent =
  | { type: 'model'; model: string; modelLabel: string }
  | { type: 'text'; content: string }
  | { type: 'done'; conversationId: string; model: string; modelLabel: string }
  | { type: 'error'; error: string };

function CodeBlock({ children, className }: { children: React.ReactNode; className?: string }) {
  const [copied, setCopied] = useState(false);
  const codeText = String(children).replace(/\n$/, '');
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : 'bash';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="relative my-2.5 overflow-hidden rounded-md border border-[#202934] bg-[#090D12] font-mono text-xs">
      <div className="flex items-center justify-between border-b border-[#202934] bg-[#11161D] px-3 py-1 text-[10px] text-[#737F8C] select-none">
        <span className="font-bold uppercase tracking-wider text-[#22D3EE] font-mono">{language}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 text-[10px] text-[#737F8C] hover:text-[#E6EDF3] transition cursor-pointer font-sans"
        >
          {copied ? (
            <span className="text-[#34D399] font-semibold">✓ Copied</span>
          ) : (
            <span>Copy code</span>
          )}
        </button>
      </div>
      <div className="overflow-x-auto p-3 text-[#E6EDF3] leading-relaxed font-mono">
        <pre className="whitespace-pre font-mono text-xs text-[#E6EDF3]">
          <code>{codeText}</code>
        </pre>
      </div>
    </div>
  );
}

export function AIAssistantDrawer() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(GROQ_MODELS[0].id);
  const [activeModelLabel, setActiveModelLabel] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Hide floating button on /ai full page and /auth routes
  const isHidden = pathname === '/ai' || pathname.startsWith('/auth');

  // Compute active page context name
  const pageContext = useMemo(() => {
    if (pathname === '/learn/pre-git') return { title: 'Pre-Git Foundations (10 Lessons)', type: 'Curriculum' };
    if (pathname === '/learn/beginner') return { title: 'Beginner Git (16 Commands)', type: 'Curriculum' };
    if (pathname === '/learn/intermediate') return { title: 'Intermediate Git (16 Commands)', type: 'Curriculum' };
    if (pathname === '/learn/advanced') return { title: 'Advanced & Plumbing (30 Commands)', type: 'Curriculum' };
    if (pathname.startsWith('/learn')) return { title: 'Git Curriculum Overview', type: 'Curriculum' };
    if (pathname === '/challenges') return { title: 'Hands-On Lab (18 Challenges)', type: 'Lab' };
    if (pathname === '/terminal') return { title: 'Virtual Git Sandbox Terminal', type: 'Sandbox' };
    if (pathname === '/commands') return { title: 'Command Encyclopedia (62 Commands)', type: 'Reference' };
    if (pathname === '/dashboard') return { title: 'Learner Dashboard', type: 'Dashboard' };
    if (pathname === '/progress') return { title: 'Progress & Analytics', type: 'Analytics' };
    if (pathname === '/achievements') return { title: 'Milestones & Badges', type: 'Badges' };
    return { title: 'GitNovi Learning Platform', type: 'Overview' };
  }, [pathname]);

  // Contextual question suggestions
  const contextualPrompts = useMemo(() => {
    if (pathname.startsWith('/learn/pre-git')) {
      return [
        'Explain absolute vs relative paths with examples',
        'Why are Git commits immutable snapshots?',
        'How does the terminal shell interpret commands?',
        'What is the difference between CVCS and DVCS?',
      ];
    }
    if (pathname.startsWith('/learn/beginner')) {
      return [
        'Explain git status output and staging area mechanics',
        'What is the difference between git restore and git checkout?',
        'How does git branch and git switch work under the hood?',
        'What is an atomic commit and why does it matter?',
      ];
    }
    if (pathname.startsWith('/learn/intermediate')) {
      return [
        'Compare git merge vs git rebase in a table with tradeoffs',
        'How to resolve a merge conflict step by step?',
        'How to recover a deleted commit using git reflog?',
        'Explain git stash push vs pop vs apply',
      ];
    }
    if (pathname.startsWith('/learn/advanced')) {
      return [
        'How do blobs, trees, and commits link together in .git/objects?',
        'Explain git write-tree, commit-tree, and update-ref',
        'How do multiple git worktrees share object storage?',
        'What is cone mode in git sparse-checkout?',
      ];
    }
    if (pathname === '/challenges') {
      return [
        'Give me a hint for resolving merge conflict markers',
        'How do I use git reflog to locate my lost commit hash?',
        'How to manually forge a commit using low-level plumbing?',
        'Help me verify why my sandbox challenge check failed',
      ];
    }
    if (pathname === '/terminal') {
      return [
        'How do I inspect object headers with git cat-file -t?',
        'Show me a safe workflow to test rebasing on a test branch',
        'Explain why my working tree is dirty vs clean',
        'How to undo my last commit without losing my code?',
      ];
    }
    return [
      'Compare git reset --soft vs --mixed vs --hard in a table',
      'Explain git rebase vs git merge with examples',
      'How to resolve a merge conflict step by step?',
      'Explain git stash pop vs apply with best practices',
    ];
  }, [pathname]);

  // Keyboard shortcut Ctrl+J / Cmd+J to toggle drawer
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => textareaRef.current?.focus(), 150);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const ensureConversation = async (): Promise<string> => {
    if (conversationId) return conversationId;

    const res = await fetch('/api/conversations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: `Quick Tutor (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`,
      }),
    });

    if (!res.ok) throw new Error('Failed to create conversation session');
    const data = await res.json();
    setConversationId(data.conversation.id);
    return data.conversation.id;
  };

  const handleSend = async (customPrompt?: string) => {
    const text = (customPrompt || input).trim();
    if (!text || loading) return;

    setInput('');
    setError(null);
    setLoading(true);

    const userMessageId = `user-${Date.now()}`;
    const assistantMessageId = `ai-${Date.now()}`;

    setMessages((prev) => [
      ...prev,
      { id: userMessageId, role: 'user', content: text },
      { id: assistantMessageId, role: 'assistant', content: '', model: selectedModel },
    ]);

    try {
      const activeConvoId = await ensureConversation();

      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: activeConvoId,
          question: text,
          modelId: selectedModel,
          context: `User is viewing: ${pageContext.title} (URL: ${pathname})`,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Server responded with ${response.status}`);
      }

      if (!response.body) throw new Error('No response stream received');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let accumulatedContent = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;
          const jsonStr = trimmed.slice(5).trim();
          if (!jsonStr) continue;

          try {
            const event = JSON.parse(jsonStr) as StreamEvent;
            if (event.type === 'model') {
              setActiveModelLabel(event.modelLabel);
            } else if (event.type === 'text') {
              accumulatedContent += event.content;
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantMessageId
                    ? { ...msg, content: accumulatedContent }
                    : msg,
                ),
              );
            } else if (event.type === 'done') {
              setActiveModelLabel(event.modelLabel);
            } else if (event.type === 'error') {
              setError(event.error);
            }
          } catch {
            // Ignore partial parse errors
          }
        }
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown AI streaming error';
      setError(errorMsg);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? { ...msg, content: `⚠️ ${errorMsg}` }
            : msg,
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  const handleNewChat = () => {
    setConversationId(null);
    setMessages([]);
    setError(null);
    setInput('');
  };

  if (isHidden) return null;

  return (
    <>
      {/* Floating Trigger Widget Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 rounded-full border border-[#293542] bg-[#11161D] px-4 py-2.5 text-xs font-semibold text-[#E6EDF3] transition-all hover:border-[#22D3EE]/50 hover:bg-[#171D25] cursor-pointer group shadow-lg"
          title="Ask AI Git Mentor (Ctrl+J)"
        >
          <span className="h-2 w-2 rounded-full bg-[#22D3EE] inline-block" />
          <span className="font-semibold text-[#E6EDF3] tracking-wide">Ask AI Tutor</span>
          <span className="hidden sm:inline-block rounded bg-[#090D12] px-1.5 py-0.5 font-mono text-[10px] text-[#737F8C] border border-[#202934]">
            Ctrl+J
          </span>
        </button>
      )}

      {/* Dimmed Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-[#0B0F14]/70 backdrop-blur-sm transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Slide-in Assistant Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-50 flex w-full sm:w-[480px] lg:w-[520px] flex-col border-l border-[#293542] bg-[#0B0F14] transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-[#202934] bg-[#11161D] px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md border border-[#22D3EE]/40 bg-[#083344] font-mono text-xs font-bold text-[#22D3EE]">
              &gt;_
            </div>
            <div>
              <div className="text-xs font-bold text-[#E6EDF3] flex items-center gap-2">
                <span>GitNovi AI Mentor</span>
                <span className="rounded bg-[#34D399]/10 px-1.5 py-0.5 text-[9px] font-mono font-bold text-[#34D399] border border-[#34D399]/30 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#34D399] inline-block" />
                  Live
                </span>
              </div>
              <div className="text-[10px] text-[#737F8C] font-mono">
                {activeModelLabel || 'Auto-fallback cascade enabled'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleNewChat}
              className="rounded-md border border-[#293542] bg-[#11161D] px-2.5 py-1 text-[11px] font-medium text-[#737F8C] transition hover:text-[#E6EDF3] hover:bg-[#171D25] cursor-pointer"
              title="Start fresh conversation"
            >
              + New Chat
            </button>

            <Link
              href="/ai"
              className="rounded-md border border-[#22D3EE]/40 bg-[#083344] px-2.5 py-1 text-[11px] font-semibold text-[#22D3EE] transition hover:bg-[#22D3EE] hover:text-[#0B0F14]"
              title="Open full AI workspace"
            >
              Expand ↗
            </Link>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-md border border-[#293542] bg-[#11161D] p-1.5 text-[#737F8C] transition hover:text-[#E6EDF3] hover:bg-[#171D25] cursor-pointer ml-1"
              title="Close drawer (Esc)"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Page Context & Model Selector Bar */}
        <div className="border-b border-[#202934] bg-[#11161D] px-4 py-2 flex flex-col gap-2">
          {/* Active Location Badge */}
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 text-[#737F8C] truncate">
              <span className="text-[#22D3EE] font-mono text-xs">📍</span>
              <span className="font-semibold text-[#A7B0BC] truncate max-w-[280px]">
                {pageContext.title}
              </span>
            </div>
            <span className="rounded bg-[#090D12] px-2 py-0.5 text-[9px] font-mono uppercase text-[#737F8C] border border-[#202934]">
              {pageContext.type}
            </span>
          </div>

          {/* Model Selector Dropdown */}
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#202934]">
            <span className="text-[#737F8C] font-mono text-[10px]">AI Engine:</span>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="rounded-md bg-[#090D12] px-2.5 py-1 text-[10px] font-mono text-[#22D3EE] border border-[#293542] outline-none focus:border-[#22D3EE]/50 cursor-pointer"
            >
              {GROQ_MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label} ({m.tag})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Chat Messages Stream Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-xs">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col justify-center items-center text-center px-4 py-8">
              <div className="h-12 w-12 rounded-lg border border-[#22D3EE]/40 bg-[#083344] flex items-center justify-center text-xl text-[#22D3EE] font-mono mb-3">
                &gt;_
              </div>
              <h3 className="text-sm font-bold text-[#E6EDF3]">How can I help you right now?</h3>
              <p className="mt-1.5 text-xs text-[#A7B0BC] max-w-xs leading-relaxed">
                Ask any question about commands, lesson steps, error messages, or Git internals without leaving your current workspace.
              </p>

              {/* Context-aware suggestions */}
              <div className="mt-6 flex flex-col gap-1.5 w-full max-w-sm text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#737F8C] font-mono mb-1">
                  Suggested Questions for {pageContext.type}:
                </span>
                {contextualPrompts.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => void handleSend(q)}
                    className="rounded-md border border-[#293542] bg-[#11161D] p-2.5 text-left text-xs text-[#A7B0BC] transition hover:border-[#22D3EE]/50 hover:bg-[#171D25] hover:text-[#E6EDF3] cursor-pointer flex items-center justify-between group"
                  >
                    <span className="truncate pr-2">{q}</span>
                    <span className="text-[#22D3EE] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div className="mb-1 flex items-center gap-1.5 text-[10px] text-[#737F8C] font-mono">
                  <span>{msg.role === 'user' ? 'You' : 'GitNovi AI Mentor'}</span>
                </div>

                <div
                  className={`max-w-[92%] rounded-lg px-4 py-3 leading-relaxed ${
                    msg.role === 'user'
                      ? 'border border-[#293542] bg-[#171D25] text-[#E6EDF3]'
                      : 'border border-[#293542] bg-[#11161D] text-[#E6EDF3]'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <p className="whitespace-pre-wrap font-sans text-[#E6EDF3]">{msg.content}</p>
                  ) : (
                    <div className="prose prose-invert prose-xs max-w-none space-y-2 text-[#E6EDF3]">
                      {msg.content ? (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            code({ className, children, ...props }) {
                              const isInline = !className && typeof children === 'string' && !children.includes('\n');
                              if (isInline) {
                                return (
                                  <code className="rounded bg-[#090D12] px-1.5 py-0.5 font-mono text-[11px] text-[#22D3EE] border border-[#202934]" {...props}>
                                    {children}
                                  </code>
                                );
                              }
                              return <CodeBlock className={className}>{children}</CodeBlock>;
                            },
                            table({ children }) {
                              return (
                                <div className="my-2 overflow-x-auto rounded-md border border-[#202934] bg-[#090D12]">
                                  <table className="min-w-full text-left text-xs divide-y divide-[#202934]">
                                    {children}
                                  </table>
                                </div>
                              );
                            },
                            th({ children }) {
                              return (
                                <th className="bg-[#11161D] px-3 py-1.5 font-mono font-bold text-[#22D3EE] text-[10px] uppercase">
                                  {children}
                                </th>
                              );
                            },
                            td({ children }) {
                              return <td className="px-3 py-1.5 border-t border-[#202934] text-[#A7B0BC]">{children}</td>;
                            },
                            p({ children }) {
                              return <p className="my-2 leading-relaxed text-xs text-[#E6EDF3]">{children}</p>;
                            },
                            blockquote({ children }) {
                              return (
                                <blockquote className="my-3 border-l-2 border-[#FBBF24] bg-[#11161D] rounded-r p-3 text-[#E6EDF3] text-xs leading-relaxed not-italic">
                                  {children}
                                </blockquote>
                              );
                            },
                            h1({ children }) {
                              return <h1 className="text-sm font-bold text-[#E6EDF3] mt-3 mb-1 pb-1 border-b border-[#202934]">{children}</h1>;
                            },
                            h2({ children }) {
                              return <h2 className="text-xs font-bold text-[#22D3EE] mt-2.5 mb-1 flex items-center gap-1">{children}</h2>;
                            },
                            h3({ children }) {
                              return <h3 className="text-xs font-semibold text-[#E6EDF3] mt-2 mb-0.5">{children}</h3>;
                            },
                            ul({ children }) {
                              return <ul className="my-2 list-disc pl-5 space-y-1 text-xs text-[#A7B0BC] leading-relaxed">{children}</ul>;
                            },
                            ol({ children }) {
                              return <ol className="my-2 list-decimal pl-5 space-y-1 text-xs text-[#A7B0BC] leading-relaxed">{children}</ol>;
                            },
                            li({ children }) {
                              return <li className="leading-relaxed">{children}</li>;
                            },
                            strong({ children }) {
                              return <strong className="font-bold text-[#E6EDF3]">{children}</strong>;
                            },
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      ) : (
                        <div className="flex items-center gap-2 text-[#737F8C] py-1 font-mono text-xs">
                          <span className="h-2 w-2 rounded-full bg-[#22D3EE] animate-pulse" />
                          <span>Thinking & formulating guidance...</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Error Notification */}
        {error && (
          <div className="border-t border-[#F87171]/40 bg-[#11161D] px-4 py-2 text-xs text-[#F87171] flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-xs hover:text-white cursor-pointer">✕</button>
          </div>
        )}

        {/* Text Input Footer Bar */}
        <div className="border-t border-[#202934] bg-[#11161D] p-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void handleSend();
            }}
            className="flex items-end gap-2"
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about a command, concept, or error... (Enter to send)"
              rows={2}
              disabled={loading}
              className="w-full resize-none rounded-md border border-[#293542] bg-[#090D12] p-2.5 text-xs text-[#E6EDF3] placeholder-[#737F8C] outline-none transition focus:border-[#22D3EE]/50 disabled:opacity-60 font-sans"
            />

            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#22D3EE] text-[#0B0F14] font-bold transition hover:bg-[#67E8F9] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              title="Send message (Enter)"
            >
              {loading ? (
                <span className="h-4 w-4 rounded-full border-2 border-[#0B0F14] border-t-transparent animate-spin" />
              ) : (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
