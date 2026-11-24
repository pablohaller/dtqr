import type { CSSProperties } from "react";
import type { DriveFile, LabelMode } from "@/types";
import { QrCell } from "./qr-cell";

type QrGridProps = {
  files: DriveFile[];
  columns: number;
  size: number;
  labelMode: LabelMode;
  cropMarks: boolean;
  overrides: Record<string, string>;
  excluded: Set<string>;
  onLabelChange: (id: string, value: string) => void;
  onToggleExcluded: (id: string) => void;
  includeLabel: string;
  editLabel: string;
};

export const QrGrid = ({
  files,
  columns,
  size,
  labelMode,
  cropMarks,
  overrides,
  excluded,
  onLabelChange,
  onToggleExcluded,
  includeLabel,
  editLabel,
}: QrGridProps) => (
  <div
    data-testid="qr-grid"
    className={`grid p-3 print:p-0 ${cropMarks ? "gap-0" : "gap-3"}`}
    style={
      {
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      } as CSSProperties
    }
  >
    {files.map((file) => (
      <QrCell
        key={file.id}
        file={file}
        size={size}
        cropMarks={cropMarks}
        excluded={excluded.has(file.id)}
        label={overrides[file.id] ?? (labelMode === "path" ? file.path : file.name)}
        onLabelChange={onLabelChange}
        onToggleExcluded={onToggleExcluded}
        includeLabel={includeLabel}
        editLabel={editLabel}
      />
    ))}
  </div>
);
