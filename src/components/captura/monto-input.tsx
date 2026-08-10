"use client";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function MontoInput({ value, onChange }: Props) {
  return (
    <label className="block pt-1 text-center">
      <span className="flex items-baseline justify-center text-5xl font-black tracking-tight">
        $&nbsp;
        <input
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^\d.]/g, ""))}
          inputMode="decimal"
          placeholder="0"
          style={{ width: `${Math.max(value.length, 1)}ch` }}
          className="bg-transparent text-5xl font-black tracking-tight outline-none placeholder:text-muted-foreground"
        />
      </span>
      <span className="lbl mt-1 block tracking-[0.24em]">MXN</span>
    </label>
  );
}
