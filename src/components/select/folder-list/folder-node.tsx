"use client";

import { useState, useTransition } from "react";
import { fetchSubfolders } from "@/actions/drive";
import type { DriveFolder } from "@/types";

type FolderNodeProps = {
  folder: DriveFolder;
  depth: number;
  selected: Set<string>;
  onToggle: (id: string) => void;
};

export const FolderNode = ({
  folder,
  depth,
  selected,
  onToggle,
}: FolderNodeProps) => {
  const { id, name } = folder;
  const [expanded, setExpanded] = useState(false);
  const [children, setChildren] = useState<DriveFolder[] | null>(null);
  const [loading, startLoading] = useTransition();

  const toggleExpand = () => {
    const next = !expanded;
    setExpanded(next);
    if (next && children === null) {
      startLoading(async () => setChildren(await fetchSubfolders(id)));
    }
  };

  return (
    <li data-testid={`folder-node-${id}`}>
      <div
        className="flex items-center gap-2 py-1.5 pr-3 hover:bg-current-line"
        style={{ paddingLeft: `${depth * 1.25 + 0.5}rem` }}
      >
        <button
          type="button"
          onClick={toggleExpand}
          aria-label={expanded ? "Collapse" : "Expand"}
          className="flex size-5 shrink-0 items-center justify-center rounded text-comment hover:text-cyan"
        >
          <span
            className={`transition-transform ${expanded ? "rotate-90" : ""}`}
          >
            ▸
          </span>
        </button>
        <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={selected.has(id)}
            onChange={() => onToggle(id)}
            className="size-4 shrink-0 accent-purple"
          />
          <span className="truncate">{name}</span>
        </label>
      </div>

      {expanded && (
        <ul>
          {loading && children === null && (
            <li
              className="py-1 text-xs text-comment"
              style={{ paddingLeft: `${(depth + 1) * 1.25 + 1.75}rem` }}
            >
              …
            </li>
          )}
          {children?.map((child) => (
            <FolderNode
              key={child.id}
              folder={child}
              depth={depth + 1}
              selected={selected}
              onToggle={onToggle}
            />
          ))}
          {children?.length === 0 && (
            <li
              className="py-1 text-xs text-comment"
              style={{ paddingLeft: `${(depth + 1) * 1.25 + 1.75}rem` }}
            >
              —
            </li>
          )}
        </ul>
      )}
    </li>
  );
};
