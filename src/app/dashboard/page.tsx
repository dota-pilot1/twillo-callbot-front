"use client";

import Link from "next/link";
import { ArrowRight, CalendarCheck, ClipboardCheck, Home, MessageSquareText, Stethoscope, UsersRound } from "lucide-react";
import { RequireAuth } from "@/widgets/guards/RequireAuth";

export default function DashboardPage() {
  return (
    <RequireAuth>
      <main className="mx-auto flex min-h-[calc(100vh-3.5rem)] w-full max-w-3xl flex-col justify-center px-4 py-10">
        <section className="border-b border-border pb-6">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-primary">
            <ClipboardCheck className="h-4 w-4" />
            예약형 병원 홈페이지
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight">병원 홍보·예약 홈페이지 운영</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            병원 소개, 시술/프로그램 안내, 예약 상담 신청, 고객 문의 관리를 한 흐름으로 정리합니다.
          </p>
        </section>

        <section className="mt-6 grid gap-3">
          <DashboardLink
            href="/"
            icon={Home}
            title="홈페이지 미리보기"
            text="고객에게 보이는 병원 소개, 프로그램, 예약 상담 CTA 흐름을 확인합니다."
          />
          <DashboardLink
            href="/clinic-settings"
            icon={Stethoscope}
            title="병원 소개 관리"
            text="홈페이지에 노출될 병원 소개, 위치, 진료시간, 대표 프로그램 정보를 정리합니다."
          />
          <DashboardLink
            href="/appointments"
            icon={CalendarCheck}
            title="예약 상담 관리"
            text="홈페이지와 챗봇에서 들어온 예약 상담 요청을 확인하고 처리합니다."
          />
          <DashboardLink
            href="/customers"
            icon={UsersRound}
            title="고객 문의 관리"
            text="전화번호 기반 고객 문의, 상담 메모, 예약 이력을 관리합니다."
          />
          <DashboardLink
            href="/messages"
            icon={MessageSquareText}
            title="안내 메시지 발송"
            text="예약 확정, 내원 전 안내, 이벤트 소식을 SMS·이메일로 발송합니다."
          />
        </section>
      </main>
    </RequireAuth>
  );
}

function DashboardLink({
  href,
  icon: Icon,
  title,
  text,
}: {
  href: string;
  icon: typeof Stethoscope;
  title: string;
  text: string;
}) {
  return (
    <Link href={href} className="flex items-start gap-4 rounded-lg border border-border bg-card p-5 hover:bg-accent/40">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-emerald-600 text-white">
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-lg font-bold tracking-tight">{title}</span>
        <span className="mt-1 block text-sm leading-6 text-muted-foreground">{text}</span>
      </span>
      <ArrowRight className="mt-3 h-4 w-4 text-muted-foreground" />
    </Link>
  );
}
