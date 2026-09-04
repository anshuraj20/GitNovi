export function TerminalPrompt({ branch }: { branch: string }) {
  return (
    <div className="mt-3 text-xs font-medium text-[#737F8C]">
      learner@gitnovi:~ (<span className="text-[#67E8F9]">{branch}</span>)<span className="text-[#22D3EE]">$</span>
    </div>
  );
}
