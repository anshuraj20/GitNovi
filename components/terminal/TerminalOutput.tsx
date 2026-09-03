export function TerminalOutput({
  lines,
}: {
  lines: { input: string; output: string; error?: boolean }[];
}) {
  return (
    <div className="space-y-4">
      {lines.map((line, index) => (
        <div key={`${line.input}-${index}`}>
          <div className="text-xs text-cyan-400">$ {line.input}</div>
          {line.output && (
            <pre
              className={
                line.error
                  ? 'mt-2 whitespace-pre-wrap text-sm text-rose-300'
                  : 'mt-2 whitespace-pre-wrap text-sm text-slate-300'
              }
            >
              {line.output}
            </pre>
          )}
        </div>
      ))}
    </div>
  );
}
