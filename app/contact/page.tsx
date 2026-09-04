'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Feedback');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [accessKey, setAccessKey] = useState<string>('');

  useEffect(() => {
    fetch('/api/contact')
      .then((res) => res.json())
      .then((data) => {
        if (data?.key) setAccessKey(data.key);
      })
      .catch(() => null);
  }, []);

  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=ansh13raj@gmail.com&su=${encodeURIComponent(
    `[GitNovi] ${subject} from ${name || 'Developer'}`
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
          'Web3Forms access key is missing in environment variables.'
        );
      }

      const formData = new FormData();
      formData.append('access_key', keyToUse.trim());
      formData.append('name', name.trim());
      formData.append('email', email.trim());
      formData.append('subject', `[GitNovi] ${subject} from ${name.trim()}`);
      formData.append('message', message.trim());
      formData.append('from_name', 'GitNovi Contact');

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.success === false) {
        throw new Error(data.message || 'Failed to deliver message.');
      }

      // Backup async write
      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      }).catch(() => null);

      setResult({
        type: 'success',
        text: 'Message delivered directly to Anshu’s inbox. Thank you!',
      });

      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      setResult({
        type: 'error',
        text: `${
          err instanceof Error ? err.message : 'Error sending message.'
        } You can also use the direct Gmail link above.`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-10 space-y-6">
      <div className="space-y-1.5 max-w-xl">
        <div className="text-xs font-mono text-[#737F8C]">
          Contact
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#E6EDF3] tracking-tight">
          Get in Touch
        </h1>
        <p className="text-xs sm:text-sm text-[#A7B0BC] leading-relaxed">
          Questions, suggestions, bug reports, or feedback regarding GitNovi? Send a message below or reach out via email.
        </p>
      </div>

      <div className="grid sm:grid-cols-12 gap-6 items-start">
        {/* Creator Info (Left) */}
        <div className="sm:col-span-4 space-y-3">
          <div className="rounded border border-[#293542] bg-[#11161D] p-4 space-y-3 text-xs text-[#A7B0BC]">
            <div className="text-sm font-bold text-[#E6EDF3]">
              Anshu Raj
            </div>
            <p className="leading-relaxed">
              Creator of GitNovi. Built as an interactive platform for mastering Git from basics to internals.
            </p>

            <div className="border-t border-[#202934] pt-3 space-y-1.5 font-mono text-[11px]">
              <div><a href="https://github.com/anshuraj20" target="_blank" rel="noopener noreferrer" className="hover:text-[#22D3EE] transition">GitHub: @anshuraj20 ↗</a></div>
              <div><a href="https://linkedin.com/in/anshuraj20" target="_blank" rel="noopener noreferrer" className="hover:text-[#22D3EE] transition">LinkedIn: anshuraj20 ↗</a></div>
              <div><a href="https://instagram.com/anshuraj_ar" target="_blank" rel="noopener noreferrer" className="hover:text-[#22D3EE] transition">Instagram: @anshuraj_ar ↗</a></div>
            </div>
          </div>
        </div>

        {/* Message Form (Right) */}
        <div className="sm:col-span-8 rounded border border-[#293542] bg-[#11161D] p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#202934] pb-2.5">
            <h2 className="text-xs font-semibold uppercase font-mono tracking-wider text-[#737F8C]">
              Direct Message
            </h2>

            <a
              href={gmailComposeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#22D3EE] hover:text-[#67E8F9] hover:underline transition"
            >
              Compose in Gmail ↗
            </a>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#E6EDF3] mb-1">
                  Name
                </label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full rounded border border-[#293542] bg-[#090D12] px-3 py-1.5 text-xs text-[#E6EDF3] placeholder-[#737F8C] outline-none focus:border-[#22D3EE]/60 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#E6EDF3] mb-1">
                  Email
                </label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded border border-[#293542] bg-[#090D12] px-3 py-1.5 text-xs text-[#E6EDF3] placeholder-[#737F8C] outline-none focus:border-[#22D3EE]/60 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#E6EDF3] mb-1">
                Topic
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded border border-[#293542] bg-[#090D12] px-3 py-1.5 text-xs text-[#E6EDF3] outline-none focus:border-[#22D3EE]/60 transition cursor-pointer"
              >
                <option value="Feedback">General Feedback</option>
                <option value="Lesson Question">Lesson / Concept Question</option>
                <option value="Bug Report">Bug / Issue Report</option>
                <option value="Collaboration">Collaboration Inquiry</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#E6EDF3] mb-1">
                Message
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full rounded border border-[#293542] bg-[#090D12] px-3 py-1.5 text-xs text-[#E6EDF3] placeholder-[#737F8C] outline-none focus:border-[#22D3EE]/60 leading-relaxed transition"
              />
            </div>

            {result && (
              <div
                className={`rounded border p-2 text-xs font-mono ${
                  result.type === 'success'
                    ? 'border-[#34D399]/40 bg-[#090D12] text-[#34D399]'
                    : 'border-[#F87171]/40 bg-[#090D12] text-[#F87171]'
                }`}
              >
                {result.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="rounded bg-[#22D3EE] px-4 py-1.5 text-xs font-semibold text-[#090D12] hover:bg-[#67E8F9] disabled:opacity-50 transition cursor-pointer"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
