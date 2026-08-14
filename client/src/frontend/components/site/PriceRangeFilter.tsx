// FE — thanh trượt khoảng giá 2 đầu min/max, giới hạn lấy từ backend.
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { formatVnd } from "@/shared/format";

const STEP = 50_000;

export function PriceRangeFilter({
  bounds,
  min,
  max,
  onChange,
}: {
  bounds: { min: number; max: number };
  min?: number | undefined;
  max?: number | undefined;
  onChange: (next: { min?: number | undefined; max?: number | undefined }) => void;
}) {
  const lo = Math.floor(bounds.min / STEP) * STEP;
  const hi = Math.ceil(bounds.max / STEP) * STEP;

  const [range, setRange] = useState<[number, number]>([min ?? lo, max ?? hi]);

  useEffect(() => {
    setRange([min ?? lo, max ?? hi]);
  }, [min, max, lo, hi]);

  const clamp = (v: number) => Math.min(hi, Math.max(lo, v));
  const dirty = range[0] !== (min ?? lo) || range[1] !== (max ?? hi);
  const filtered = min !== undefined || max !== undefined;

  const apply = () => {
    const next: [number, number] = [clamp(Math.min(...range)), clamp(Math.max(...range))];
    onChange({
      min: next[0] > lo ? next[0] : undefined,
      max: next[1] < hi ? next[1] : undefined,
    });
  };

  return (
    <div className="space-y-4">
      <Slider
        min={lo}
        max={hi}
        step={STEP}
        value={range}
        onValueChange={(v) => setRange([v[0] ?? lo, v[1] ?? hi])}
        onValueCommit={apply}
        aria-label="Khoảng giá"
      />

      <div className="flex items-center gap-2">
        <NumberField
          label="Giá thấp nhất"
          value={range[0]}
          onChange={(v) => setRange([clamp(v), range[1]])}
        />
        <span className="text-muted-foreground">—</span>
        <NumberField
          label="Giá cao nhất"
          value={range[1]}
          onChange={(v) => setRange([range[0], clamp(v)])}
        />
      </div>

      <p className="text-xs text-muted-foreground">
        {formatVnd(Math.min(...range))} – {formatVnd(Math.max(...range))}
      </p>

      <div className="flex gap-2">
        <Button size="sm" className="flex-1" disabled={!dirty} onClick={apply}>
          Áp dụng
        </Button>
        {filtered && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onChange({ min: undefined, max: undefined })}
          >
            Xoá
          </Button>
        )}
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <Input
      aria-label={label}
      inputMode="numeric"
      className="h-9 text-sm"
      value={value.toLocaleString("vi-VN")}
      onChange={(e) => {
        const digits = e.target.value.replace(/\D/g, "");
        onChange(digits ? Number(digits) : 0);
      }}
    />
  );
}
