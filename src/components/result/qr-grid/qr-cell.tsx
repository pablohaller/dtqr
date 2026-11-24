"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import type { DriveFile } from "@/types";

type QrCellProps = {
  file: DriveFile;
  size: number;
  cropMarks: boolean;
  excluded: boolean;
  label: string;
  onLabelChange: (id: string, value: string) => void;
  onToggleExcluded: (id: string) => void;
  includeLabel: string;
  editLabel: string;
};

export const QrCell = ({
  file,
  size,
  cropMarks,
  excluded,
  label,
  onLabelChange,
  onToggleExcluded,
  includeLabel,
  editLabel,
}: QrCellProps) => {
  const [editing, setEditing] = useState(false);

  return (
    <figure
      data-testid={`qr-cell-${file.id}`}
      style={{ width: `${size}mm`, maxWidth: "100%" }}
      className={`print-cell relative flex flex-col items-center gap-1 justify-self-center p-2 ${
        cropMarks ? "border border-dashed border-comment print:border-black" : ""
      } ${excluded ? "opacity-30 print:hidden" : ""}`}
    >
      <input
        type="checkbox"
        title={includeLabel}
        checked={!excluded}
        onChange={() => onToggleExcluded(file.id)}
        className="no-print absolute left-1 top-1 size-4 accent-purple"
      />

      <QRCodeSVG
        value={file.webViewLink}
        size={512}
        level="M"
        style={{ width: "100%", height: "auto" }}
      />

      {editing ? (
        <input
          autoFocus
          defaultValue={label}
          onBlur={(e) => {
            onLabelChange(file.id, e.target.value);
            setEditing(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
            if (e.key === "Escape") setEditing(false);
          }}
          className="no-print w-full rounded border border-comment bg-background px-1 text-center text-xs text-foreground"
        />
      ) : (
        <figcaption
          title={`${label} — ${editLabel}`}
          onClick={() => setEditing(true)}
          className="w-full cursor-text break-all text-center text-[10px] leading-tight text-foreground print:text-black"
        >
          {label}
        </figcaption>
      )}
    </figure>
  );
};
