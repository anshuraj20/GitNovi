export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 bg-[#171D25] rounded-full overflow-hidden">
      <div
        className="h-full bg-[#22D3EE] transition-all"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}
