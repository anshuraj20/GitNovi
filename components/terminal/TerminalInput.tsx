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
      className="mt-3 flex items-center gap-2 rounded-md border border-[#293542] bg-[#090D12] px-2 py-2"
    >
      <span className="shrink-0 text-sm font-bold text-[#22D3EE]">❯</span>
      <input
        autoFocus
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="flex-1 bg-transparent text-xs sm:text-sm font-mono text-[#E6EDF3] outline-none placeholder:text-[#737F8C]"
        aria-label="Git terminal command"
        placeholder="Try: git init"
      />
    </form>
  );
}
