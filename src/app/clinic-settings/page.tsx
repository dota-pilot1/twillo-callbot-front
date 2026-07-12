"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  Clock,
  MapPin,
  MessageSquareText,
  PhoneCall,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import { RequireAuth } from "@/widgets/guards/RequireAuth";

const profileItems = [
  { label: "진료 분야", value: "피부과 · 비만클리닉" },
  { label: "위치", value: "서울 강남구 가로수길 18 약산빌딩 3층" },
  { label: "운영시간", value: "실제 운영시간 확인 후 확정" },
  { label: "대표번호", value: "02-715-0328" },
];

const programs = [
  "피부 상담",
  "리프팅·탄력",
  "색소·여드름",
  "비만클리닉",
];

export default function ClinicSettingsPage() {
  return (
    <RequireAuth>
      <main className="mx-auto w-full max-w-6xl px-4 py-8 lg:px-6">
        <section className="overflow-hidden rounded-lg border border-border bg-card">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="p-6 sm:p-8 lg:p-10">
              <p className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                <Sparkles className="h-3.5 w-3.5" />
                홈페이지 첫 번째 메뉴
              </p>
              <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
                병원 소개
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
                고객이 처음 보는 병원 신뢰 정보입니다. 소개 문구, 위치, 진료시간, 대표 프로그램, 예약 CTA를 한 화면에서 정리해 홍보 페이지의 기준 콘텐츠로 사용합니다.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/"
                  className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-bold text-primary-foreground hover:opacity-90"
                >
                  홈페이지 미리보기
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/booking"
                  className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-bold hover:bg-accent"
                >
                  예약 상담 화면
                </Link>
              </div>
            </div>
            <div className="relative min-h-72 border-t border-border lg:border-l lg:border-t-0">
              <Image
                src="/images/clinic/clinic-reception.png"
                alt="병원 접수 공간"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-[0.75fr_1.25fr]">
          <aside className="space-y-4">
            <section className="rounded-lg border border-border bg-card p-5">
              <h2 className="flex items-center gap-2 text-lg font-extrabold">
                <Stethoscope className="h-5 w-5 text-primary" />
                밀라의원
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                신사동 피부과·비만클리닉 상담을 위한 홍보형 홈페이지 프로토타입입니다.
              </p>
              <dl className="mt-5 space-y-3">
                {profileItems.map((item) => (
                  <div key={item.label} className="rounded-md bg-muted/40 p-3">
                    <dt className="text-xs font-bold text-muted-foreground">{item.label}</dt>
                    <dd className="mt-1 text-sm font-extrabold">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="rounded-lg border border-border bg-card p-5">
              <h2 className="flex items-center gap-2 text-base font-extrabold">
                <Clock className="h-4 w-4 text-primary" />
                빠른 운영 체크
              </h2>
              <div className="mt-4 grid gap-2 text-sm">
                <StatusLine label="병원 소개" value="작성됨" />
                <StatusLine label="대표 프로그램" value="4개" />
                <StatusLine label="예약 CTA" value="연결됨" />
                <StatusLine label="상담 챗봇" value="노출중" />
              </div>
            </section>
          </aside>

          <div className="space-y-4">
            <section className="rounded-lg border border-border bg-card p-5">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <p className="text-sm font-bold text-primary">대표 프로그램</p>
                  <h2 className="mt-1 text-xl font-extrabold tracking-tight">홈페이지에 먼저 보여줄 상담 카테고리</h2>
                </div>
                <Link href="/services" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">
                  프로그램 화면 보기
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {programs.map((program) => (
                  <article key={program} className="rounded-lg border border-border bg-background p-4">
                    <p className="text-base font-extrabold">{program}</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      고객 문의를 예약 상담으로 연결하기 위한 소개 문구와 CTA를 정리합니다.
                    </p>
                  </article>
                ))}
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2">
              <InfoCard
                icon={CalendarCheck}
                title="예약 상담 흐름"
                text="홈페이지와 챗봇에서 들어온 요청을 예약 관리 메뉴에서 확인합니다."
                href="/appointments"
                action="예약 관리"
              />
              <InfoCard
                icon={MessageSquareText}
                title="안내 메시지"
                text="예약 확정, 내원 전 안내, 이벤트 소식을 SMS·이메일로 발송합니다."
                href="/messages"
                action="발송 관리"
              />
              <InfoCard
                icon={PhoneCall}
                title="전화 상담"
                text="전화번호 기반 상담 메모와 고객 이력을 고객 메뉴에서 이어서 관리합니다."
                href="/customers"
                action="고객 관리"
              />
              <InfoCard
                icon={MapPin}
                title="위치 안내"
                text="주소, 진료시간, 오시는 길을 공개 홈페이지에서 확인할 수 있습니다."
                href="/location"
                action="위치 화면"
              />
            </section>
          </div>
        </section>
      </main>
    </RequireAuth>
  );
}

function StatusLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-extrabold">{value}</span>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  title,
  text,
  href,
  action,
}: {
  icon: typeof CalendarCheck;
  title: string;
  text: string;
  href: string;
  action: string;
}) {
  return (
    <Link href={href} className="rounded-lg border border-border bg-card p-5 hover:bg-accent/40">
      <span className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-600 text-white">
        <Icon className="h-5 w-5" />
      </span>
      <span className="mt-4 block text-lg font-extrabold">{title}</span>
      <span className="mt-2 block text-sm leading-6 text-muted-foreground">{text}</span>
      <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary">
        {action}
        <ArrowRight className="h-4 w-4" />
      </span>
    </Link>
  );
}
