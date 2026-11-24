"use client";

import Link from "next/link";
import type { Dict } from "@/lib/i18n";
import { interpolate } from "@/lib/i18n/client";
import { SELECT } from "@/lib/routes";
import type { LabelMode } from "@/types";
import { Button } from "@/components/ui/button";

type PrintControlsProps = {
  t: Dict["result"];
  fileCount: number;
  columns: number;
  size: number;
  labelMode: LabelMode;
  cropMarks: boolean;
  onColumns: (value: number) => void;
  onSize: (value: number) => void;
  onLabelMode: (value: LabelMode) => void;
  onCropMarks: (value: boolean) => void;
};

const modeButton = (active: boolean) =>
  `px-3 py-1 rounded-md text-sm font-semibold transition ${
    active ? "bg-purple text-background" : "text-cyan hover:bg-current-line"
  }`;

export const PrintControls = ({
  t,
  fileCount,
  columns,
  size,
  labelMode,
  cropMarks,
  onColumns,
  onSize,
  onLabelMode,
  onCropMarks,
}: PrintControlsProps) => (
  <div
    data-testid="print-controls"
    className="no-print sticky top-0 z-10 flex flex-wrap items-center gap-6 border-b border-current-line bg-background/95 px-6 py-4 backdrop-blur"
  >
    <div className="mr-auto flex items-baseline gap-3">
      <h1 className="text-xl font-bold text-purple">{t.title}</h1>
      <span className="text-sm text-comment">
        {interpolate(t.fileCount, { count: fileCount })}
      </span>
    </div>

    <label className="flex items-center gap-2 text-sm">
      <span className="text-comment">{t.columns}</span>
      <input
        type="range"
        min={1}
        max={12}
        value={columns}
        onChange={(e) => onColumns(Number(e.target.value))}
        className="accent-purple"
      />
      <span className="w-6 tabular-nums text-foreground">{columns}</span>
    </label>

    <label className="flex items-center gap-2 text-sm">
      <span className="text-comment">{t.size}</span>
      <input
        type="range"
        min={15}
        max={80}
        value={size}
        onChange={(e) => onSize(Number(e.target.value))}
        className="accent-purple"
      />
      <span className="w-12 tabular-nums text-foreground">{size}mm</span>
    </label>

    <div className="flex items-center gap-1">
      <span className="mr-1 text-sm text-comment">{t.labelMode}</span>
      <button
        type="button"
        className={modeButton(labelMode === "name")}
        onClick={() => onLabelMode("name")}
      >
        {t.labelName}
      </button>
      <button
        type="button"
        className={modeButton(labelMode === "path")}
        onClick={() => onLabelMode("path")}
      >
        {t.labelPath}
      </button>
    </div>

    <label className="flex cursor-pointer items-center gap-2 text-sm">
      <input
        type="checkbox"
        checked={cropMarks}
        onChange={(e) => onCropMarks(e.target.checked)}
        className="size-4 accent-purple"
      />
      <span className="text-comment">{t.cropMarks}</span>
    </label>

    <div className="flex items-center gap-2">
      <Link
        href={SELECT}
        className="rounded-lg px-4 py-2 text-sm font-semibold text-cyan hover:bg-current-line"
      >
        {t.back}
      </Link>
      <Button onClick={() => window.print()} className="py-2 text-sm">
        {t.print}
      </Button>
    </div>
  </div>
);
