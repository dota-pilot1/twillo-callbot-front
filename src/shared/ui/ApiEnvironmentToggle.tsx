"use client";

import { useSyncExternalStore, useState } from "react";
import { Cloud, Laptop } from "lucide-react";
import { authActions } from "@/entities/user/model/authStore";
import {
  getApiEnvironment,
  setApiEnvironment,
  subscribeApiEnvironment,
  type ApiEnvironment,
} from "@/shared/api/apiEnvironment";
import { cn } from "@/shared/lib/utils";
import { useTauriRuntime } from "@/shared/tauri/useIsTauri";

export function ApiEnvironmentToggle() {
  const runtime = useTauriRuntime();
  const environment = useSyncExternalStore(subscribeApiEnvironment, getApiEnvironment, () => "production" as ApiEnvironment);
  const [switching, setSwitching] = useState(false);

  const change = async (next: ApiEnvironment) => {
    if (next === environment || switching) return;
    setSwitching(true);
    setApiEnvironment(next);
    await authActions.restore();
    setSwitching(false);
  };

  if (process.env.NODE_ENV === "production" && (!runtime.isReady || !runtime.isTauri)) return null;

  return (
    <div className="flex h-9 items-center rounded-md border border-border bg-muted/40 p-1" title="API 서버 선택">
      <EnvironmentButton active={environment === "local"} disabled={switching} onClick={() => void change("local")} label="로컬" icon={Laptop} />
      <EnvironmentButton active={environment === "production"} disabled={switching} onClick={() => void change("production")} label="운영" icon={Cloud} />
    </div>
  );
}

function EnvironmentButton({ active, disabled, onClick, label, icon: Icon }: { active: boolean; disabled: boolean; onClick: () => void; label: string; icon: typeof Laptop }) {
  return (
    <button type="button" disabled={disabled} onClick={onClick} className={cn("inline-flex h-7 items-center gap-1 rounded px-2 text-[11px] font-extrabold transition-colors", active ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
      <Icon className="h-3 w-3" />{label}
    </button>
  );
}
