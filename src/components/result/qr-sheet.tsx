"use client";

import { useState } from "react";
import type { Dict } from "@/lib/i18n";
import type { DriveFile, LabelMode } from "@/types";
import { PrintControls } from "@/components/result/print-controls";
import { QrGrid } from "@/components/result/qr-grid";

type QrSheetProps = {
  files: DriveFile[];
  t: Dict["result"];
};

export const QrSheet = ({ files, t }: QrSheetProps) => {
  const [columns, setColumns] = useState(4);
  const [size, setSize] = useState(40);
  const [labelMode, setLabelMode] = useState<LabelMode>("name");
  const [cropMarks, setCropMarks] = useState(true);
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [excluded, setExcluded] = useState<Set<string>>(new Set());

  const setLabel = (id: string, value: string) =>
    setOverrides((prev) => ({ ...prev, [id]: value }));

  const toggleExcluded = (id: string) =>
    setExcluded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const includedCount = files.length - excluded.size;

  return (
    <main data-testid="qr-sheet" className="flex flex-1 flex-col">
      <PrintControls
        t={t}
        fileCount={includedCount}
        columns={columns}
        size={size}
        labelMode={labelMode}
        cropMarks={cropMarks}
        onColumns={setColumns}
        onSize={setSize}
        onLabelMode={setLabelMode}
        onCropMarks={setCropMarks}
      />
      <QrGrid
        files={files}
        columns={columns}
        size={size}
        labelMode={labelMode}
        cropMarks={cropMarks}
        overrides={overrides}
        excluded={excluded}
        onLabelChange={setLabel}
        onToggleExcluded={toggleExcluded}
        includeLabel={t.include}
        editLabel={t.editLabel}
      />
    </main>
  );
};
