export function TerminalPrompt({ branch }: { branch: string }) {
  return (
    <div className="mt-3 text-xs font-medium text-slate-500">
      learner@gitnovi:~ ({branch})$
    </div>
  );
}
