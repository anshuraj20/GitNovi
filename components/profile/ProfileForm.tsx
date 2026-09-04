'use client';

import { useState } from 'react';

export function ProfileForm({
  initialName,
  email,
}: {
  initialName: string;
  email: string;
}) {
  const [name, setName] = useState(initialName);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const r = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ displayName: name }),
    });
    setMsg(r.ok ? 'Profile saved.' : ((await r.json()).error ?? 'Unable to save profile.'));
    setLoading(false);
  };

  return (
    <form onSubmit={save} className="rounded border border-[#293542] bg-[#11161D] p-6 mt-8 space-y-5">
      <label className="block text-sm">
        <span className="text-[#A7B0BC]">Email</span>
        <input
          value={email}
          readOnly
          className="mt-2 w-full rounded border border-[#202934] bg-[#090D12] text-[#737F8C] px-4 py-2.5 text-xs outline-none"
        />
      </label>
      <label className="block text-sm">
        <span className="text-[#A7B0BC]">Display name</span>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-2 w-full rounded border border-[#293542] bg-[#090D12] text-[#E6EDF3] px-4 py-2.5 text-xs outline-none focus:border-[#22D3EE]/60"
        />
      </label>
      <button
        disabled={loading}
        className="px-4 py-2 rounded bg-[#22D3EE] text-[#090D12] text-xs font-semibold hover:bg-[#67E8F9] transition disabled:opacity-50 cursor-pointer"
      >
        {loading ? 'Saving…' : 'Save profile'}
      </button>
      {msg && (
        <p className="text-xs font-mono text-[#34D399]" role="status">
          {msg}
        </p>
      )}
    </form>
  );
}
