'use client';

import { useState } from 'react';

export function TerminalInput({ onSubmit }: { onSubmit: (s: string) => void }) {
  const [value, setValue] = useState('');

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const trimmed = value.trim();
        if (!trimmed) return;
        onSubmit(trimmed);
        setValue('');
      }}
      className="mt-3 flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/60 px-2 py-2"
    >
      <span className="shrink-0 text-sm font-bold text-cyan-400">❯</span>
      <input
        autoFocus
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="flex-1 bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-600"
        aria-label="Git terminal command"
        placeholder="Try: git init"
      />
    </form>
  );
}
