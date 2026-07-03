"use client";

import Link from "next/link";
import { ArrowRight, ClipboardCheck, PhoneIncoming } from "lucide-react";
import { RequireAuth } from "@/widgets/guards/RequireAuth";

const SOFTPHONE_NUMBER = process.env.NEXT_PUBLIC_SOFTPHONE_NUMBER ?? "+1 814 402 8603";

export default function DashboardPage() {
  return (
    <RequireAuth>
      <main className="mx-auto flex min-h-[calc(100vh-3.5rem)] w-full max-w-3xl flex-col justify-center px-4 py-10">
        <section className="border-b border-border pb-6">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-primary">
            <ClipboardCheck className="h-4 w-4" />
            Mini Call Center Step 1
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight">소프트폰 MVP</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            지금 단계에서는 대시보드, 예약 자동화, 프로모션보다 상담원이 전화를 받을 수 있는 최소 상태 전이를 먼저 검증합니다.
          </p>
        </section>

        <section className="mt-6 rounded-lg border border-border bg-card p-5">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-emerald-600 text-white">
              <PhoneIncoming className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold tracking-tight">전화 받기 화면부터 구현</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                대표번호 {SOFTPHONE_NUMBER} 인입을 브라우저 소프트폰으로 받고, 오프라인/수신 대기/전화 옴/통화중/후처리 상태만 확인합니다.
              </p>
              <Link
                href="/softphone"
                className="mt-4 inline-flex h-10 items-center gap-2 rounded-md bg-primary px-3 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
              >
                소프트폰 열기
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </RequireAuth>
  );
}
