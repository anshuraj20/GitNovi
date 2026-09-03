'use client';

import {
  FormEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { GROQ_MODELS } from '@/lib/ai/models';

type Conversation = {
  id: string;
  user_id: string;
  title: string;
  model: string | null;
  created_at: string;
  updated_at: string;
};

type AIMessage = {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  model: string | null;
  created_at: string;
};

type StreamEvent =
  | { type: 'model'; model: string; modelLabel: string }
  | { type: 'text'; content: string }
  | { type: 'done'; conversationId: string; model: string; modelLabel: string }
  | { type: 'error'; error: string };

const MAX_QUESTION_LENGTH = 6000;

const SUGGESTIONS = [
  'Compare git reset --soft vs --mixed vs --hard in a table',
  'Explain git rebase vs git merge with examples & tradeoffs',
  'How to resolve a merge conflict step by step?',
  'Explain git stash pop vs git stash apply with a cheat sheet',
];

// Interactive Code Block with 1-click Copy & Preserved Line Breaks
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
      // Ignore clipboard write error
    }
  };

  return (
    <div className="relative my-3.5 overflow-hidden rounded-xl border border-slate-800 bg-[#070b14] font-mono text-xs shadow-lg">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-3.5 py-1.5 select-none text-[11px] text-slate-400">
        <span className="font-bold text-cyan-400 uppercase tracking-wider font-mono">{language}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-cyan-300 transition cursor-pointer font-sans"
        >
          {copied ? (
            <>
              <span className="text-emerald-400 font-bold">✓</span>
              <span className="text-emerald-400 font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <span>📋</span>
              <span>Copy code</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content with Guaranteed Line Breaks */}
      <div className="overflow-x-auto p-3.5 text-slate-200 leading-relaxed font-mono">
        <pre className="whitespace-pre font-mono text-xs text-slate-200">
          <code>{codeText}</code>
        </pre>
      </div>
    </div>
  );
}

export function GitTutor() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('auto');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const activeStreamContentRef = useRef('');
  const isGeneratingRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);

  // Restore saved model preference from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gitnovi_ai_model');
      if (saved) {
        setSelectedModel(saved);
      }
    }
  }, []);

  // Fast, non-blocking scroll
  const scrollToBottom = useCallback(() => {
    const el = scrollViewportRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, []);

  // Fetch all conversations on mount
  useEffect(() => {
    let mounted = true;
    const fetchConversations = async () => {
      try {
        setLoadingConversations(true);
        const res = await fetch('/api/conversations');
        if (!res.ok) return;
        const data = await res.json();
        if (mounted && Array.isArray(data?.conversations)) {
          setConversations(data.conversations);
          if (data.conversations.length > 0 && !activeConversationId) {
            setActiveConversationId(data.conversations[0].id);
          }
        }
      } catch (err) {
        console.warn('Failed to load conversations:', err);
      } finally {
        if (mounted) setLoadingConversations(false);
      }
    };
    fetchConversations();
    return () => {
      mounted = false;
    };
  }, []);

  // Load messages whenever active conversation changes
  useEffect(() => {
    if (isGeneratingRef.current) return;

    if (!activeConversationId) {
      setMessages([]);
      return;
    }

    let mounted = true;
    const fetchMessages = async () => {
      try {
        setLoadingMessages(true);
        setError('');
        const res = await fetch(`/api/conversations/${activeConversationId}`);
        if (!res.ok) return;
        const data = await res.json();
        if (mounted && Array.isArray(data?.messages)) {
          setMessages(data.messages);
          requestAnimationFrame(() => scrollToBottom());
        }
      } catch (err) {
        console.warn('Failed to load conversation messages:', err);
      } finally {
        if (mounted) setLoadingMessages(false);
      }
    };

    fetchMessages();
    return () => {
      mounted = false;
    };
  }, [activeConversationId, scrollToBottom]);

  const createNewConversation = async () => {
    if (loading) return;
    try {
      setLoading(true);
      setError('');
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New chat' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to create chat');

      if (data?.conversation) {
        setConversations((prev) => [data.conversation, ...prev]);
        setActiveConversationId(data.conversation.id);
        setMessages([]);
        setSidebarOpen(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating chat');
    } finally {
      setLoading(false);
      textareaRef.current?.focus();
    }
  };

  const deleteConversation = async (id: string) => {
    if (loading) return;
    try {
      await fetch(`/api/conversations/${id}`, { method: 'DELETE' });
      const next = conversations.filter((c) => c.id !== id);
      setConversations(next);
      if (activeConversationId === id) {
        setActiveConversationId(next[0]?.id ?? null);
      }
    } catch (err) {
      console.warn('Delete failed:', err);
    }
  };

  const ask = async (customPrompt?: string, overrideModel?: string) => {
    const promptToSend = (customPrompt || question).trim();
    if (!promptToSend || loading) return;

    const modelToUse = overrideModel || selectedModel;
    let convId = activeConversationId;
    const tempAssistId = `assist-${Date.now()}`;

    try {
      setLoading(true);
      isGeneratingRef.current = true;
      setError('');
      setQuestion('');
      activeStreamContentRef.current = '';

      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }

      // Auto create conversation if none exists
      if (!convId) {
        const createRes = await fetch('/api/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: promptToSend.slice(0, 50) }),
        });
        const createData = await createRes.json();
        if (!createRes.ok) throw new Error(createData?.error || 'Could not start conversation');
        convId = createData.conversation.id;
        setActiveConversationId(convId);
        setConversations((prev) => [createData.conversation, ...prev]);
      }

      // Add user message
      const tempUserMsg: AIMessage = {
        id: `user-${Date.now()}`,
        conversation_id: convId!,
        role: 'user',
        content: promptToSend,
        model: null,
        created_at: new Date().toISOString(),
      };

      // Add assistant message placeholder
      setMessages((prev) => [
        ...prev,
        tempUserMsg,
        {
          id: tempAssistId,
          conversation_id: convId!,
          role: 'assistant',
          content: '',
          model: null,
          created_at: new Date().toISOString(),
        },
      ]);

      requestAnimationFrame(() => scrollToBottom());

      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: convId,
          question: promptToSend,
          modelId: modelToUse,
          context: 'GitNovi Modern Chat UI',
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body?.error || `AI request error (HTTP ${response.status})`);
      }

      if (!response.body) {
        throw new Error('No response stream received from AI server.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      const triggerBatchedUpdate = () => {
        if (rafIdRef.current !== null) return;
        rafIdRef.current = requestAnimationFrame(() => {
          rafIdRef.current = null;
          const currentContent = activeStreamContentRef.current;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === tempAssistId ? { ...msg, content: currentContent } : msg,
            ),
          );
          scrollToBottom();
        });
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data:')) continue;

          try {
            const rawJson = trimmed.slice(5).trim();
            const event = JSON.parse(rawJson) as StreamEvent;

            if (event.type === 'text') {
              activeStreamContentRef.current += event.content;
              triggerBatchedUpdate();
            } else if (event.type === 'error') {
              throw new Error(event.error);
            }
          } catch (jsonErr) {
            if (jsonErr instanceof Error && jsonErr.message.includes('AI request')) {
              throw jsonErr;
            }
          }
        }
      }

      // Final synchronous flush
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }

      const finalContent = activeStreamContentRef.current;
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempAssistId ? { ...msg, content: finalContent } : msg,
        ),
      );
      scrollToBottom();

      if (!finalContent.trim()) {
        throw new Error('AI returned an empty response. You can try selecting another model from the top dropdown.');
      }

      // Update conversation title in sidebar
      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId && (c.title === 'New chat' || c.title === 'New Git chat')
            ? { ...c, title: promptToSend.slice(0, 50) }
            : c,
        ),
      );
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Failed to generate response';
      setError(errMsg);
      setMessages((prev) =>
        prev.filter((msg) => !(msg.id === tempAssistId && !msg.content.trim())),
      );
    } finally {
      isGeneratingRef.current = false;
      setLoading(false);
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void ask();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(e.target.value.slice(0, MAX_QUESTION_LENGTH));
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`;
  };

  return (
    <div className="mx-auto max-w-6xl">
      {/* ChatGPT / Gemini Style Container Frame */}
      <div className="flex rounded-3xl border border-slate-800 bg-[#070b14]/90 shadow-2xl shadow-slate-950/60 overflow-hidden h-[calc(100vh-140px)] min-h-[600px] max-h-[820px]">
        {/* Left Sidebar (Conversations / History) */}
        <aside
          className={`shrink-0 w-64 border-r border-slate-800/80 bg-slate-950/90 flex flex-col transition-all duration-300 z-20 ${
            sidebarOpen ? 'block' : 'hidden lg:flex'
          }`}
        >
          {/* New Chat Button */}
          <div className="p-3 border-b border-slate-800/80">
            <button
              type="button"
              onClick={createNewConversation}
              disabled={loading}
              className="w-full flex items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-3.5 py-2.5 text-xs font-bold text-slate-200 transition hover:border-cyan-500/40 hover:bg-slate-900 hover:text-white cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="text-cyan-400 font-bold text-base">+</span>
                <span>New chat</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">⌘K</span>
            </button>
          </div>

          {/* History List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1 [scrollbar-gutter:stable]">
            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
              Recent Chats
            </div>

            {loadingConversations ? (
              <div className="space-y-2 p-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-9 rounded-xl bg-slate-900/60 animate-pulse" />
                ))}
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500">No previous chats.</div>
            ) : (
              conversations.map((c) => {
                const isActive = c.id === activeConversationId;
                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      if (loading) return;
                      setActiveConversationId(c.id);
                      setSidebarOpen(false);
                    }}
                    className={`group flex items-center justify-between rounded-xl px-3 py-2 text-xs transition cursor-pointer ${
                      isActive
                        ? 'bg-slate-800/80 text-cyan-300 font-semibold shadow-sm'
                        : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate flex-1">
                      <span className="text-slate-500 text-[11px]">💬</span>
                      <span className="truncate">{c.title}</span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        void deleteConversation(c.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 p-0.5 rounded transition"
                      title="Delete chat"
                    >
                      ✕
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="font-mono font-bold text-cyan-400">λ</span>
              <span>GitNovi AI</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">Online</span>
          </div>
        </aside>

        {/* Main Central Chat Area */}
        <main className="flex-1 flex flex-col min-w-0 bg-gradient-to-b from-[#070b14] to-slate-950 overflow-hidden relative">
          {/* Top Chat Header with Dynamic Model Switcher */}
          <div className="h-14 shrink-0 border-b border-slate-800/80 px-4 flex items-center justify-between bg-slate-950/40 backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              {/* Mobile Sidebar Toggle */}
              <button
                type="button"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white"
              >
                ☰
              </button>

              {/* GitNovi Logo Badge */}
              <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-cyan-500/40 bg-cyan-500/10 font-mono font-black text-cyan-400 shadow-md">
                λ
              </div>

              <div>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span>GitNovi AI</span>
                  <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Ready</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Model Switcher & New Chat Controls */}
            <div className="flex items-center gap-2">
              {/* Model Dropdown */}
              <div className="relative">
                <select
                  value={selectedModel}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedModel(val);
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('gitnovi_ai_model', val);
                    }
                  }}
                  disabled={loading}
                  className="cursor-pointer appearance-none rounded-xl border border-slate-800 bg-slate-900/90 py-1.5 pl-2.5 pr-7 font-mono text-[11px] font-semibold text-cyan-400 outline-none transition hover:border-cyan-500/50 focus:border-cyan-400 disabled:opacity-50"
                  title="Select AI Model"
                >
                  <option value="auto">⚡ Auto Fallback</option>
                  {GROQ_MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label} ({m.description})
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[8px] text-cyan-400/80">
                  ▼
                </div>
              </div>

              <button
                type="button"
                onClick={createNewConversation}
                disabled={loading}
                className="text-xs font-semibold text-slate-400 hover:text-cyan-300 transition flex items-center gap-1.5 cursor-pointer rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-1.5 hover:bg-slate-900"
              >
                <span>+ New Chat</span>
              </button>
            </div>
          </div>

          {/* Chat Messages Stream */}
          <div
            ref={scrollViewportRef}
            className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-6 [scrollbar-gutter:stable]"
          >
            {loadingMessages ? (
              <div className="flex items-center justify-center h-full text-xs text-slate-500 gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
                <span>Loading chat...</span>
              </div>
            ) : messages.length === 0 ? (
              /* Empty Chat Showcase */
              <div className="flex flex-col items-center justify-center h-full max-w-xl mx-auto text-center space-y-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-cyan-500/40 bg-cyan-500/10 font-mono font-black text-3xl text-cyan-400 shadow-xl shadow-cyan-500/10">
                  λ
                </div>

                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                    What would you like to solve in Git today?
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Ask about merge conflicts, commit recovery, interactive rebases, or internal plumbing objects.
                  </p>
                </div>

                {/* Suggestions Grid */}
                <div className="grid sm:grid-cols-2 gap-2.5 w-full text-left">
                  {SUGGESTIONS.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => void ask(s)}
                      disabled={loading}
                      className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-3 text-xs text-slate-300 transition hover:border-cyan-500/50 hover:bg-slate-900/80 hover:text-white cursor-pointer shadow-sm"
                    >
                      <span className="text-cyan-400 font-bold">↳ </span>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Message Bubbles */
              messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {/* Assistant Logo Avatar */}
                    {!isUser && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-cyan-500/40 bg-cyan-500/10 font-mono font-black text-cyan-400 shadow-md mt-0.5">
                        λ
                      </div>
                    )}

                    {/* Message Bubble Container */}
                    <div
                      className={`max-w-[94%] sm:max-w-[88%] rounded-2xl p-4 sm:p-5 shadow-lg leading-relaxed text-sm ${
                        isUser
                          ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-slate-950 font-medium rounded-tr-sm shadow-cyan-950/30'
                          : 'border border-slate-800/80 bg-slate-900/85 text-slate-200 rounded-tl-sm shadow-slate-950/40'
                      }`}
                    >
                      {isUser ? (
                        <div className="whitespace-pre-wrap font-sans">{msg.content}</div>
                      ) : msg.content ? (
                        <div className="prose prose-invert prose-sm max-w-none text-slate-200 leading-relaxed">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              // Table Rendering
                              table({ children }) {
                                return (
                                  <div className="my-3.5 overflow-x-auto rounded-xl border border-slate-800 bg-[#070b14] shadow-md">
                                    <table className="min-w-full divide-y divide-slate-800 text-xs text-left border-collapse">
                                      {children}
                                    </table>
                                  </div>
                                );
                              },
                              thead({ children }) {
                                return (
                                  <thead className="bg-slate-900 text-cyan-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-800 select-none">
                                    {children}
                                  </thead>
                                );
                              },
                              tbody({ children }) {
                                return <tbody className="divide-y divide-slate-800/60">{children}</tbody>;
                              },
                              tr({ children }) {
                                return <tr className="hover:bg-slate-900/40 transition odd:bg-transparent even:bg-slate-900/20">{children}</tr>;
                              },
                              th({ children }) {
                                return <th className="px-4 py-2.5 font-bold whitespace-nowrap text-cyan-300">{children}</th>;
                              },
                              td({ children }) {
                                return <td className="px-4 py-2.5 text-slate-300 leading-relaxed align-top">{children}</td>;
                              },

                              // Code Blocks
                              pre({ children }) {
                                return <>{children}</>;
                              },
                              code({ className, children, ...props }) {
                                const isMultiline = String(children).includes('\n') || (className && className.includes('language-'));
                                if (isMultiline) {
                                  return <CodeBlock className={className}>{children}</CodeBlock>;
                                }
                                return (
                                  <code
                                    className="rounded-md border border-cyan-500/30 bg-cyan-950/40 px-1.5 py-0.5 font-mono text-xs font-semibold text-cyan-300 inline-block align-middle"
                                    {...props}
                                  >
                                    {children}
                                  </code>
                                );
                              },

                              // Paragraphs
                              p({ children }) {
                                return <p className="my-2 leading-relaxed text-xs sm:text-sm text-slate-200">{children}</p>;
                              },

                              // Callouts
                              blockquote({ children }) {
                                return (
                                  <blockquote className="my-3 border-l-4 border-amber-500 bg-amber-500/10 rounded-r-xl px-4 py-2.5 text-amber-200 text-xs leading-relaxed not-italic">
                                    {children}
                                  </blockquote>
                                );
                              },

                              // Headings
                              h1({ children }) {
                                return <h1 className="text-base font-extrabold text-white mt-4 mb-2 pb-1 border-b border-slate-800">{children}</h1>;
                              },
                              h2({ children }) {
                                return <h2 className="text-sm font-bold text-cyan-400 mt-3.5 mb-1.5 flex items-center gap-1">{children}</h2>;
                              },
                              h3({ children }) {
                                return <h3 className="text-xs font-semibold text-slate-200 mt-2.5 mb-1">{children}</h3>;
                              },

                              // Lists
                              ul({ children }) {
                                return <ul className="my-2 list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-300 leading-relaxed">{children}</ul>;
                              },
                              ol({ children }) {
                                return <ol className="my-2 list-decimal pl-5 space-y-1 text-xs sm:text-sm text-slate-300 leading-relaxed">{children}</ol>;
                              },
                              li({ children }) {
                                return <li className="leading-relaxed">{children}</li>;
                              },
                              strong({ children }) {
                                return <strong className="font-bold text-white">{children}</strong>;
                              },
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono">
                          <span className="h-3 w-3 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
                          <span>Generating response...</span>
                        </div>
                      )}
                    </div>

                    {/* User Avatar */}
                    {isUser && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-xs font-bold text-slate-300 border border-slate-700 mt-0.5">
                        You
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {/* Error Message with Quick Model Switch Option */}
            {error && (
              <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold">✕ Request Error</span>
                  <button onClick={() => setError('')} className="text-rose-400 hover:text-white">
                    Dismiss
                  </button>
                </div>
                <div className="text-rose-200/80 leading-relaxed">{error}</div>
                <div className="pt-1 flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">Quick Model Switch:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedModel('openai/gpt-oss-20b');
                      setError('');
                    }}
                    className="rounded-lg bg-rose-500/20 px-2 py-1 text-[11px] font-semibold text-rose-200 hover:bg-rose-500/30"
                  >
                    Switch to GPT OSS 20B
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedModel('qwen/qwen3.8-27b');
                      setError('');
                    }}
                    className="rounded-lg bg-rose-500/20 px-2 py-1 text-[11px] font-semibold text-rose-200 hover:bg-rose-500/30"
                  >
                    Switch to Qwen 3.8
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ChatGPT / Gemini Style Bottom Centered Pill Input */}
          <div className="p-4 sm:p-5 shrink-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void ask();
              }}
              className="max-w-3xl mx-auto relative flex items-end rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl shadow-slate-950/60 p-2 transition focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/30"
            >
              <textarea
                ref={textareaRef}
                rows={1}
                value={question}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                disabled={loading}
                placeholder="Ask GitNovi AI anything about Git (e.g. merge conflicts, rebase, plumbing)..."
                className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-500 outline-none resize-none max-h-36 leading-relaxed disabled:opacity-50"
              />

              <button
                type="submit"
                disabled={loading || !question.trim()}
                className="h-9 w-9 shrink-0 flex items-center justify-center rounded-xl bg-cyan-500 text-slate-950 font-bold transition hover:bg-cyan-400 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer mb-0.5 mr-0.5 shadow-md shadow-cyan-500/20"
                title="Send message"
              >
                {loading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            </form>

            <div className="text-center mt-2 text-[11px] text-slate-500">
              GitNovi AI can assist with commands, errors, and concepts. Verify sensitive repository operations.
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
