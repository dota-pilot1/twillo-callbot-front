"use client";

import Link from "next/link";
import {
  CheckCircle2,
  Headset,
  MonitorDot,
  PhoneCall,
  PhoneIncoming,
  Route,
  Users,
} from "lucide-react";

const SOFTPHONE_NUMBER = process.env.NEXT_PUBLIC_SOFTPHONE_NUMBER ?? "+1 814 402 8603";
const SOFTPHONE_AGENT = process.env.NEXT_PUBLIC_SOFTPHONE_AGENT_IDENTITY ?? "agent-admin";

const FLOW_STEPS = [
  { label: "전화 받기 대기", description: "상담원이 브라우저 Device를 등록합니다." },
  { label: "전화 인입", description: "Twilio Voice webhook이 상담원 Client로 연결합니다." },
  { label: "상담중", description: "상담원이 받으면 소프트폰 화면이 통화 상태로 바뀝니다." },
  { label: "후처리", description: "통화 종료 후 간단한 후처리 상태로 전환합니다." },
];

export function ConsultationConsole() {
  return (
    <main className="mx-auto min-h-[calc(100vh-3.5rem)] w-full max-w-6xl px-4 py-8">
      <section className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <p className="flex items-center gap-1.5 text-sm font-semibold text-primary">
            <Headset className="h-4 w-4" />
            상담 관리
          </p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight">
            미용실 전화 상담 운영
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            현재 MVP는 상담 전화 1개를 브라우저 소프트폰 1명에게 연결합니다. 다중 상담원 ACD 분배는 실제 상담원 계정과 상태 저장이 생긴 뒤 붙이는 단계입니다.
          </p>
        </div>
        <Link
          href="/softphone"
          className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <PhoneIncoming className="h-4 w-4" />
          소프트폰 열기
        </Link>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
        <SummaryCard
          icon={<PhoneCall className="h-5 w-5" />}
          label="상담 전화"
          value="1개"
          description={SOFTPHONE_NUMBER}
          tone="emerald"
        />
        <SummaryCard
          icon={<Users className="h-5 w-5" />}
          label="현재 상담원"
          value="1명"
          description={SOFTPHONE_AGENT}
          tone="blue"
        />
        <SummaryCard
          icon={<Route className="h-5 w-5" />}
          label="라우팅"
          value="Softphone"
          description="Voice webhook → Browser Client"
          tone="violet"
        />
      </section>

      <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[420px_1fr]">
        <div className="rounded-lg border border-border bg-card">
          <div className="border-b border-border p-5">
            <h2 className="text-lg font-bold tracking-tight">현재 수신 구조</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              실제 전화 상태는 소프트폰 화면에서 Twilio Device 이벤트로 전환됩니다.
            </p>
          </div>
          <div className="space-y-3 p-5">
            {FLOW_STEPS.map((step, index) => (
              <div key={step.label} className="flex gap-3 rounded-md border border-border bg-background p-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-foreground">{step.label}</p>
                  <p className="mt-1 text-sm leading-5 text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <section className="rounded-lg border border-border bg-card">
            <div className="border-b border-border p-5">
              <h2 className="text-lg font-bold tracking-tight">MVP 기준</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                지금 화면에서는 실제보다 큰 콜센터처럼 보이는 가짜 상담원/가짜 통화를 제거했습니다.
              </p>
            </div>
            <div className="grid gap-px bg-border sm:grid-cols-2">
              <StatusBlock
                icon={<CheckCircle2 className="h-5 w-5" />}
                title="실제 연동"
                description="수신 대기, 인입, 받기, 거절, 통화 종료"
              />
              <StatusBlock
                icon={<MonitorDot className="h-5 w-5" />}
                title="현재 한계"
                description="여러 상담원 상태 공유와 ACD 분배는 아직 목업 단계"
              />
            </div>
          </section>

          <section className="rounded-lg border border-border bg-card p-5">
            <h2 className="text-lg font-bold tracking-tight">다음 구현 단위</h2>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <p>1. 로그인 사용자별 소프트폰 identity 발급</p>
              <p>2. 상담원 상태를 백엔드에 저장하고 SSE/WebSocket으로 공유</p>
              <p>3. 대표번호 1개에서 대기 상담원에게 자동 배분하는 ACD 라우팅</p>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  description,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
  tone: "emerald" | "blue" | "violet";
}) {
  const toneClass = {
    emerald: "bg-emerald-500/10 text-emerald-600",
    blue: "bg-blue-500/10 text-blue-600",
    violet: "bg-violet-500/10 text-violet-600",
  }[tone];

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-muted-foreground">{label}</p>
        <span className={`flex h-10 w-10 items-center justify-center rounded-md ${toneClass}`}>
          {icon}
        </span>
      </div>
      <p className="mt-3 text-2xl font-extrabold tracking-tight">{value}</p>
      <p className="mt-1 truncate text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function StatusBlock({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-background p-5">
      <span className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-foreground">
        {icon}
      </span>
      <p className="mt-3 text-sm font-bold text-foreground">{title}</p>
      <p className="mt-1 text-sm leading-5 text-muted-foreground">{description}</p>
    </div>
  );
}
