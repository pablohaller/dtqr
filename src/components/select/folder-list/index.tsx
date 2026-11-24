"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Dict } from "@/lib/i18n";
import { interpolate } from "@/lib/i18n/client";
import { RESULT } from "@/lib/routes";
import type { DriveFolder } from "@/types";
import { Button } from "@/components/ui/button";
import { FolderNode } from "./folder-node";

type FolderListProps = {
  folders: DriveFolder[];
  t: Dict["select"];
};

export const FolderList = ({ folders, t }: FolderListProps) => {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pending, startTransition] = useTransition();

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const clear = () => setSelected(new Set());

  const generate = () => {
    const params = new URLSearchParams();
    selected.forEach((id) => params.append("folder", id));
    startTransition(() => router.push(`${RESULT}?${params}`));
  };

  return (
    <section data-testid="folder-list" className="flex flex-col gap-4">
      <div className="flex items-center gap-3 text-sm">
        <Button variant="ghost" onClick={clear} className="px-3 py-1.5">
          {t.clear}
        </Button>
        <span className="ml-auto text-comment">
          {interpolate(t.selectedCount, { count: selected.size })}
        </span>
      </div>

      <ul className="rounded-lg border border-current-line bg-current-line/30 py-1">
        {folders.map((folder) => (
          <FolderNode
            key={folder.id}
            folder={folder}
            depth={0}
            selected={selected}
            onToggle={toggle}
          />
        ))}
      </ul>

      <Button
        onClick={generate}
        disabled={selected.size === 0 || pending}
        className="self-start"
      >
        {pending ? t.scanning : t.generate}
      </Button>
    </section>
  );
};
