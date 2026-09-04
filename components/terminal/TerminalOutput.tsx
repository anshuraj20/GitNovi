export function TerminalOutput({
  lines,
}: {
  lines: { input: string; output: string; error?: boolean }[];
}) {
  return (
    <div className="space-y-4">
      {lines.map((line, index) => (
        <div key={`${line.input}-${index}`}>
          <div className="text-xs text-[#22D3EE]">$ {line.input}</div>
          {line.output && (
            <pre
              className={
                line.error
                  ? 'mt-2 whitespace-pre-wrap text-xs sm:text-sm text-[#F87171]'
                  : 'mt-2 whitespace-pre-wrap text-xs sm:text-sm text-[#E6EDF3]'
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
