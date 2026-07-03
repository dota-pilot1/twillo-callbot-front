"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Building2,
  ChevronRight,
  Clock,
  Headset,
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  RefreshCw,
  UserRound,
} from "lucide-react";
import {
  consultationApi,
  createConsultationStatusWebSocket,
} from "@/entities/consultation/api/consultationApi";
import type {
  ConsultationAgentStatus,
  ConsultationAgentStatusResponse,
  ConsultationCallDirection,
  ConsultationStatusSnapshotResponse,
} from "@/entities/consultation/model/types";
import { RequireAuth } from "@/widgets/guards/RequireAuth";

const STATUS_TONE: Record<ConsultationAgentStatus, string> = {
  OFFLINE: "bg-muted-foreground/40",
  AVAILABLE: "bg-emerald-500",
  RINGING: "bg-amber-500",
  IN_CALL: "bg-blue-500",
  AFTER_CALL: "bg-violet-500",
  ERROR: "bg-red-500",
};

const STATUS_DETAIL: Record<ConsultationAgentStatus, string> = {
  OFFLINE: "소프트폰 연결 전",
  AVAILABLE: "전화 받기 화면 연결됨",
  RINGING: "고객 전화 인입 중",
  IN_CALL: "상담 통화 진행 중",
  AFTER_CALL: "통화 종료 후 후처리 중",
  ERROR: "상태 확인 필요",
};

export default function ConsultationManagementPage() {
  const [agents, setAgents] = useState<ConsultationAgentStatusResponse[]>([]);
  const [connectionState, setConnectionState] = useState<"connecting" | "connected" | "fallback">("connecting");

  useEffect(() => {
    let closed = false;
    let socket: WebSocket | null = null;
    let reconnectTimer: number | null = null;

    const loadInitial = async () => {
      try {
        const data = await consultationApi.listAgents();
        if (!closed) setAgents(data);
      } catch {
        if (!closed) setConnectionState("fallback");
      }
    };

    const connect = () => {
      socket = createConsultationStatusWebSocket();
      if (!socket) {
        setConnectionState("fallback");
        return;
      }

      socket.onopen = () => {
        if (!closed) setConnectionState("connected");
      };
      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data) as ConsultationStatusSnapshotResponse;
          if (payload.type === "SNAPSHOT" && !closed) {
            setAgents(payload.agents);
          }
        } catch {
          // Ignore malformed frames. The REST fallback keeps the page usable.
        }
      };
      socket.onclose = () => {
        if (closed) return;
        setConnectionState("fallback");
        reconnectTimer = window.setTimeout(connect, 3000);
      };
      socket.onerror = () => {
        if (!closed) setConnectionState("fallback");
        socket?.close();
      };
    };

    void loadInitial();
    connect();

    return () => {
      closed = true;
      if (reconnectTimer !== null) window.clearTimeout(reconnectTimer);
      socket?.close();
    };
  }, []);

  const metrics = useMemo(() => {
    const count = (statuses: ConsultationAgentStatus[]) =>
      agents.filter((agent) => statuses.includes(agent.status)).length;

    return {
      activeCalls: count(["IN_CALL", "RINGING"]),
      available: count(["AVAILABLE"]),
      outboundToday: agents.filter((agent) => agent.direction === "OUTBOUND").length,
      afterCall: count(["AFTER_CALL"]),
    };
  }, [agents]);

  const callRows = useMemo(
    () => agents.filter((agent) => agent.phoneNumber || agent.status === "IN_CALL" || agent.status === "RINGING"),
    [agents]
  );

  return (
    <RequireAuth>
      <main className="min-h-[calc(100vh-3.5rem)] w-full bg-background">
        <div className="mx-auto grid w-full max-w-[1500px] grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)]">
          <AgentSidebar agents={agents} />

          <div className="min-w-0 px-4 py-8 pb-20 lg:px-8">
            <section className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-6">
              <div>
                <p className="flex items-center gap-1.5 text-sm font-semibold text-primary">
                  <Headset className="h-4 w-4" />
                  Consultation Monitor
                </p>
                <h1 className="mt-1 text-3xl font-extrabold tracking-tight">상담 관리</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                  전화 걸기와 전화 받기 화면에서 발생하는 상담 상태를 WebSocket으로 받아 운영 화면에 반영합니다.
                </p>
              </div>
              <ConnectionBadge state={connectionState} />
            </section>

            <section className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-4">
              <MetricCard icon={<PhoneCall className="h-5 w-5" />} label="진행 중" value={`${metrics.activeCalls}건`} tone="blue" />
              <MetricCard icon={<PhoneIncoming className="h-5 w-5" />} label="수신 대기" value={`${metrics.available}명`} tone="emerald" />
              <MetricCard icon={<PhoneOutgoing className="h-5 w-5" />} label="발신 상태" value={`${metrics.outboundToday}명`} tone="violet" />
              <MetricCard icon={<Clock className="h-5 w-5" />} label="후처리" value={`${metrics.afterCall}명`} tone="amber" />
            </section>

            <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
              <div className="rounded-lg border border-border bg-card">
                <div className="flex items-center justify-between border-b border-border p-5">
                  <div>
                    <h2 className="text-lg font-bold tracking-tight">통화 상태 타임라인</h2>
                    <p className="mt-1 text-sm text-muted-foreground">상담원별 최신 통화 상태를 실시간으로 봅니다.</p>
                  </div>
                  <span className="rounded-md border border-border bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                    실시간
                  </span>
                </div>
                {callRows.length === 0 ? (
                  <EmptyState title="표시할 통화 상태가 없습니다." description="소프트폰에서 수신 대기 또는 통화를 시작하면 이 영역에 표시됩니다." />
                ) : (
                  <div className="divide-y divide-border">
                    {callRows.map((agent) => (
                      <CallRow key={agent.agentId} agent={agent} />
                    ))}
                  </div>
                )}
                <div className="border-t border-border bg-muted/30 p-5">
                  <div className="flex items-start gap-3 rounded-md border border-dashed border-border bg-background p-4">
                    <Activity className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-bold">연동 방식</p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        소프트폰 화면의 Twilio Device 이벤트가 백엔드 상태 API를 갱신하고, 백엔드는 WebSocket으로 상담 관리 화면에 스냅샷을 전송합니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card">
                <div className="border-b border-border p-5">
                  <h2 className="text-lg font-bold tracking-tight">상담원 상태</h2>
                  <p className="mt-1 text-sm text-muted-foreground">현재 서버가 받은 실제 상담원 상태입니다.</p>
                </div>
                {agents.length === 0 ? (
                  <EmptyState title="등록된 상담원이 없습니다." description="소프트폰에서 수신 대기를 시작하면 상담원이 표시됩니다." />
                ) : (
                  <div className="divide-y divide-border">
                    {agents.map((agent) => (
                      <AgentRow key={agent.agentId} agent={agent} />
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </RequireAuth>
  );
}

function AgentSidebar({ agents }: { agents: ConsultationAgentStatusResponse[] }) {
  return (
    <aside className="border-b border-border bg-sidebar px-4 py-5 lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)] lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Agents</p>
          <h2 className="mt-1 text-lg font-extrabold tracking-tight">상담사 트리</h2>
        </div>
        <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-md border border-border bg-background px-2 text-sm font-bold">
          {agents.length}
        </span>
      </div>

      <nav className="mt-5 space-y-4">
        <section>
          <div className="flex items-center gap-2 rounded-md bg-background px-3 py-2 text-sm font-bold">
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <Building2 className="h-4 w-4 text-primary" />
            <span className="min-w-0 flex-1 truncate">마포 미용실</span>
          </div>
          <div className="ml-5 mt-2 border-l border-border pl-3">
            <div className="mb-1 flex h-8 items-center gap-2 text-xs font-semibold text-muted-foreground">
              <ChevronRight className="h-3.5 w-3.5" />
              상담팀
            </div>
            {agents.length === 0 ? (
              <p className="px-2 py-3 text-xs leading-5 text-muted-foreground">소프트폰 연결 후 실제 상담원이 표시됩니다.</p>
            ) : (
              <div className="space-y-1">
                {agents.map((agent) => (
                  <AgentTreeItem key={agent.agentId} agent={agent} />
                ))}
              </div>
            )}
          </div>
        </section>
      </nav>
    </aside>
  );
}

function AgentTreeItem({ agent }: { agent: ConsultationAgentStatusResponse }) {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left transition-colors hover:bg-accent"
    >
      <UserRound className="h-4 w-4 shrink-0 text-muted-foreground" />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-bold">{agent.agentName}</span>
        <span className="block truncate text-xs text-muted-foreground">{agent.extension}</span>
      </span>
      <StatusBadge status={agent.status} label={agent.statusLabel} />
    </button>
  );
}

function ConnectionBadge({ state }: { state: "connecting" | "connected" | "fallback" }) {
  const label = state === "connected" ? "실시간 연결됨" : state === "connecting" ? "실시간 연결 중" : "REST 조회 모드";
  return (
    <span className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-semibold text-muted-foreground">
      <RefreshCw className={`h-4 w-4 ${state === "connecting" ? "animate-spin" : ""}`} />
      {label}
    </span>
  );
}

function MetricCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "blue" | "emerald" | "violet" | "amber";
}) {
  const toneClass = {
    blue: "bg-blue-500/10 text-blue-600",
    emerald: "bg-emerald-500/10 text-emerald-600",
    violet: "bg-violet-500/10 text-violet-600",
    amber: "bg-amber-500/10 text-amber-600",
  }[tone];

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-muted-foreground">{label}</p>
        <span className={`flex h-10 w-10 items-center justify-center rounded-md ${toneClass}`}>{icon}</span>
      </div>
      <p className="mt-4 text-2xl font-extrabold tracking-tight">{value}</p>
    </div>
  );
}

function AgentRow({ agent }: { agent: ConsultationAgentStatusResponse }) {
  return (
    <div className="flex items-start gap-3 p-5">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted text-foreground">
        <UserRound className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-bold">{agent.agentName}</p>
          <span className="text-xs text-muted-foreground">{agent.extension}</span>
        </div>
        <p className="mt-1 text-sm leading-5 text-muted-foreground">
          {agent.message ?? STATUS_DETAIL[agent.status]}
        </p>
      </div>
      <StatusBadge status={agent.status} label={agent.statusLabel} />
    </div>
  );
}

function CallRow({ agent }: { agent: ConsultationAgentStatusResponse }) {
  const isOutbound = agent.direction === "OUTBOUND";
  const directionLabel = directionToLabel(agent.direction);

  return (
    <div className="grid gap-3 p-5 md:grid-cols-[1fr_auto] md:items-center">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${
              isOutbound
                ? "border-blue-500/30 bg-blue-500/10 text-blue-600"
                : "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
            }`}
          >
            {isOutbound ? <PhoneOutgoing className="h-3 w-3" /> : <PhoneIncoming className="h-3 w-3" />}
            {directionLabel}
          </span>
          <p className="text-sm font-bold">{agent.phoneNumber ?? "전화번호 미확인"}</p>
          <p className={agent.status === "ERROR" ? "text-sm font-semibold text-red-600" : "text-sm text-muted-foreground"}>
            {agent.statusLabel}
          </p>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{agent.agentName} / {agent.extension}</p>
      </div>
      <div className="text-sm text-muted-foreground">{formatUpdatedAt(agent.updatedAt)}</div>
    </div>
  );
}

function StatusBadge({ status, label }: { status: ConsultationAgentStatus; label: string }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-bold">
      <span className={`h-2 w-2 rounded-full ${STATUS_TONE[status]}`} />
      {label}
    </span>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex min-h-[190px] flex-col items-center justify-center px-5 text-center">
      <Clock className="h-8 w-8 text-muted-foreground/40" />
      <p className="mt-3 text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-1 max-w-xs text-sm leading-5 text-muted-foreground">{description}</p>
    </div>
  );
}

function directionToLabel(direction: ConsultationCallDirection | null) {
  if (direction === "OUTBOUND") return "발신";
  if (direction === "INBOUND") return "수신";
  return "상태";
}

function formatUpdatedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
}
