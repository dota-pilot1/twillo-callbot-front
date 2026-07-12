"use client";

import { KeyboardEvent, useState } from "react";
import { Plus, X } from "lucide-react";
import { cn } from "@/shared/lib/utils";

type TagInputProps = {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  className?: string;
};

export function TagInput({ value, onChange, placeholder = "태그 입력 후 Enter", maxTags = 20, className }: TagInputProps) {
  const [input, setInput] = useState("");

  const add = (raw: string) => {
    const candidates = raw.split(/[,\n]/).map((tag) => tag.trim()).filter(Boolean);
    if (candidates.length === 0) return;
    const unique = [...value];
    for (const tag of candidates) {
      if (unique.length >= maxTags) break;
      if (!unique.some((item) => item.toLocaleLowerCase() === tag.toLocaleLowerCase())) unique.push(tag.slice(0, 50));
    }
    onChange(unique);
    setInput("");
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      add(input);
    } else if (event.key === "Backspace" && !input && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div className={cn("flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-md border border-input bg-background px-2 py-1.5 focus-within:border-primary", className)}>
      {value.map((tag) => (
        <span key={tag} className="inline-flex h-7 items-center gap-1 rounded-md bg-emerald-50 px-2 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
          {tag}
          <button type="button" onClick={() => onChange(value.filter((item) => item !== tag))} aria-label={`${tag} 태그 삭제`} className="rounded p-0.5 hover:bg-black/10">
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      {value.length < maxTags && (
        <div className="flex min-w-28 flex-1 items-center gap-1">
          <Plus className="h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={onKeyDown}
            onBlur={() => add(input)}
            maxLength={50}
            placeholder={value.length === 0 ? placeholder : "태그 추가"}
            className="h-7 min-w-20 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
      )}
    </div>
  );
}
