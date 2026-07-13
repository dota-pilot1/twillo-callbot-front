"use client";

import { cn } from "@/shared/lib/utils";
import type { ChatAgent } from "@/entities/chat/model/types";

type Props = {
  agents: ChatAgent[];
  loading?: boolean;
  error?: string | null;
  startingId?: number | null;
  onSelect: (agentId: number) => void;
};

const ROLE_LABEL: Record<string, string> = {
  ROLE_ADMIN: "관리자",
  ROLE_MANAGER: "매니저",
};

export function AgentList({ agents, loading, error, startingId, onSelect }: Props) {
  if (loading) {
    return <p className="px-5 py-6 text-sm text-muted-foreground">불러오는 중…</p>;
  }
  if (error) {
    return <p className="px-5 py-6 text-sm text-destructive">{error}</p>;
  }
  if (agents.length === 0) {
    return <p className="px-5 py-6 text-sm text-muted-foreground">상담 가능한 직원이 없습니다.</p>;
  }

  return (
    <ul className="flex-1 overflow-y-auto">
      {agents.map((agent) => (
        <li key={agent.id}>
          <button
            type="button"
            disabled={startingId === agent.id}
            onClick={() => onSelect(agent.id)}
            className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-accent disabled:opacity-50"
          >
            <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-500 text-sm font-bold text-white">
              {agent.name.charAt(0)}
              <span
                className={cn(
                  "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background",
                  agent.online ? "bg-emerald-500" : "bg-slate-300",
                )}
              />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold">{agent.name}</span>
              <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                {ROLE_LABEL[agent.role] ?? agent.role} · {agent.online ? "온라인" : "오프라인"}
              </span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
