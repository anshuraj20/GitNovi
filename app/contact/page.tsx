'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Feedback');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [accessKey, setAccessKey] = useState<string>('');

  // Fetch access key configured on server
  useEffect(() => {
    fetch('/api/contact')
      .then((res) => res.json())
      .then((data) => {
        if (data?.key) {
          setAccessKey(data.key);
        }
      })
      .catch(() => null);
  }, []);

  // Dynamic Gmail Compose URL that includes user-typed fields
  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=ansh13raj@gmail.com&su=${encodeURIComponent(
    `[GitNovi] ${subject || 'Student Inquiry'} from ${name || 'Learner'}`
  )}&body=${encodeURIComponent(
    `Hi Anshu,\n\n${message ? `${message}\n\n` : ''}---\nFrom: ${name || 'Anonymous'}\nEmail: ${
      email || 'Not provided'
    }`
  )}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      let keyToUse = accessKey || process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || '';

      if (!keyToUse) {
        const keyRes = await fetch('/api/contact').then((r) => r.json()).catch(() => null);
        keyToUse = keyRes?.key || '';
      }

      if (!keyToUse) {
        throw new Error(
          'Web3Forms access key is not loaded. Please ensure WEB3FORMS_ACCESS_KEY is saved in .env.local.'
        );
      }

      // Direct client-side browser submission to Web3Forms
      const formData = new FormData();
      formData.append('access_key', keyToUse.trim());
      formData.append('name', name.trim());
      formData.append('email', email.trim());
      formData.append('subject', `[GitNovi Contact] ${subject} from ${name.trim()}`);
      formData.append('message', message.trim());
      formData.append('from_name', 'GitNovi Contact Hub');

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.success === false) {
        throw new Error(data.message || 'Failed to deliver message via Web3Forms.');
      }

      // Save backup copy to database asynchronously
      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      }).catch(() => null);

      setResult({
        type: 'success',
        text: 'Message sent successfully! Your message has been delivered directly to Anshu’s inbox.',
      });

      // Clear the form fields upon success
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      setResult({
        type: 'error',
        text: `${
          err instanceof Error ? err.message : 'An error occurred while sending your message.'
        } You can also click the "Compose in Gmail ↗" button above to send directly!`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:py-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 font-mono text-xs font-bold uppercase tracking-wider text-cyan-300 mb-4">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>Connect & Contact</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Get in Touch with the Creator
        </h1>

        <p className="mt-4 text-sm sm:text-base text-slate-400 leading-relaxed">
          Have feedback on a lesson, a bug to report, a collaboration idea, or a course inquiry? 
          Send a direct message below or write directly via Gmail.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Creator Profile & Social Hub */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-7 sm:p-8 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-500/40 bg-cyan-950/40 font-mono text-2xl font-bold text-cyan-400 shadow-inner">
                AR
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-white">Anshu Raj</h2>
                <p className="text-xs font-mono text-cyan-400">Creator & Lead Engineer</p>
              </div>
            </div>

            <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              Hey! I engineered <strong>GitNovi</strong> to make learning Git and internal plumbing mechanics intuitive, zero-risk, and genuinely interactive for developers everywhere.
            </p>

            <div className="mt-6 border-t border-slate-800/80 pt-6 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                Official Profiles & Channels
              </div>

              {/* GitHub */}
              <a
                href="https://github.com/anshuraj20"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-xs font-semibold text-slate-200 transition hover:border-slate-700 hover:bg-slate-900 hover:text-white group"
              >
                <div className="flex items-center gap-3">
                  <svg className="h-4 w-4 fill-white" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
                    />
                  </svg>
                  <span>GitHub</span>
                </div>
                <span className="font-mono text-slate-400 group-hover:text-cyan-300">@anshuraj20 ↗</span>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com/in/anshuraj20"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-xl border border-blue-500/20 bg-blue-950/20 px-4 py-3 text-xs font-semibold text-blue-200 transition hover:border-blue-400 hover:bg-blue-950/40 group"
              >
                <div className="flex items-center gap-3">
                  <svg className="h-4 w-4 fill-current text-blue-400" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                  <span>LinkedIn</span>
                </div>
                <span className="font-mono text-blue-300 group-hover:text-blue-200">anshuraj20 ↗</span>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com/anshuraj_ar"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-xl border border-pink-500/20 bg-pink-950/20 px-4 py-3 text-xs font-semibold text-pink-200 transition hover:border-pink-400 hover:bg-pink-950/40 group"
              >
                <div className="flex items-center gap-3">
                  <svg className="h-4 w-4 fill-current text-pink-400" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  <span>Instagram</span>
                </div>
                <span className="font-mono text-pink-300 group-hover:text-pink-200">@anshuraj_ar ↗</span>
              </a>
            </div>

            <div className="mt-6 flex items-center gap-2 text-[11px] text-emerald-400 font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Direct messages monitored daily</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Message Form */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-7 sm:p-9 shadow-2xl backdrop-blur-xl">
            {/* Header with Heading & Compose in Gmail Button */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Send a Direct Message
              </h2>

              {/* Gmail Button */}
              <a
                href={gmailComposeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 self-start rounded-xl border border-red-500/30 bg-red-950/30 px-3.5 py-1.5 text-xs font-semibold text-red-300 hover:text-white hover:bg-red-900/40 hover:border-red-500/50 transition cursor-pointer shadow-sm group"
                title="Write directly in Gmail"
              >
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L12 9.545l8.073-6.052C21.69 2.28 24 3.434 24 5.457z"/>
                </svg>
                <span>Compose in Gmail</span>
                <span className="text-[11px] group-hover:translate-x-0.5 transition-transform">↗</span>
              </a>
            </div>

            <p className="text-xs sm:text-sm text-slate-400">
              Fill in your details below and click Send Message, or open directly in Gmail.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 font-mono mb-1.5">
                    Your Name
                  </label>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Smith"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder-slate-500 shadow-inner outline-none transition focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 font-mono mb-1.5">
                    Your Email Address
                  </label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder-slate-500 shadow-inner outline-none transition focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 font-mono mb-1.5">
                  Topic / Subject
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-white shadow-inner outline-none transition focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40"
                >
                  <option value="General Feedback">General Feedback</option>
                  <option value="Collaboration & Inquiry">Collaboration & Project Inquiry</option>
                  <option value="Bug Report or Issue">Bug Report or Issue</option>
                  <option value="Course Content Suggestion">Course Content Suggestion</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 font-mono mb-1.5">
                  Message
                </label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message, thoughts, questions, or ideas here..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder-slate-500 shadow-inner outline-none transition focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 py-3.5 text-xs sm:text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:brightness-110 active:scale-[0.99] disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                    <span>Sending Message...</span>
                  </>
                ) : (
                  'Send Message →'
                )}
              </button>
            </form>

            {/* In-Platform Success / Error Alert Message */}
            {result && (
              <div
                className={`mt-4 rounded-xl p-4 text-xs sm:text-sm leading-relaxed flex items-center gap-3 ${
                  result.type === 'success'
                    ? 'border border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                    : 'border border-rose-500/40 bg-rose-500/10 text-rose-300'
                }`}
              >
                <span className="text-base">{result.type === 'success' ? '✓' : '⚠️'}</span>
                <span>{result.text}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
