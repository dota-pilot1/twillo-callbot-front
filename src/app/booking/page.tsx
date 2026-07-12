import type { Metadata } from "next";
import Link from "next/link";
import { Bot, CalendarCheck, ClipboardCheck, PhoneCall } from "lucide-react";
import { BookingConsultationForm } from "./BookingConsultationForm";
import { clinicProfile } from "@/shared/config/clinic";

export const metadata: Metadata = {
  title: "예약 상담 신청",
  description:
    `${clinicProfile.shortName} 예약 상담을 신청하세요. 이름, 연락처, 관심 프로그램, 희망 시간대를 남기면 상담원이 확인 후 연락드립니다.`,
  alternates: {
    canonical: "/booking",
  },
  openGraph: {
    title: `${clinicProfile.shortName} 예약 상담 신청`,
    description: "도산 피부과·미용클리닉 전화 상담 및 예약 신청.",
    url: "/booking",
    images: ["/images/clinic/milla-cover.webp"],
  },
};

export default function BookingPage() {
  return (
    <main className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 lg:grid-cols-[0.85fr_1.15fr] lg:px-6">
      <section>
        <p className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
          <CalendarCheck className="h-3.5 w-3.5" />
          Appointment Request
        </p>
        <h1 className="mt-5 text-4xl font-black tracking-tight">예약 상담 신청</h1>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          병원 예약은 미용실처럼 빈 시간을 바로 확정하기보다, 상담원이 시술 목적과 가능 시간대를 확인한 뒤 전화 또는 메시지로 최종 예약을 조율합니다.
        </p>
        <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold leading-6 text-amber-900">
          입력한 시간은 확정 예약 시간이 아닙니다. 상담원이 확인 후 실제 내원 가능 시간을 안내합니다.
        </p>

        <div className="mt-8 space-y-3">
          <GuideCard
            icon={ClipboardCheck}
            title="간단 접수"
            text="이름, 연락처, 관심 시술과 가능한 시간대만 먼저 남깁니다."
          />
          <GuideCard
            icon={PhoneCall}
            title="상담원 확인"
            text="상담원이 시술 목적과 일정, 준비사항을 확인한 뒤 예약 시간을 조율합니다."
          />
          <GuideCard
            icon={Bot}
            title="챗봇 사전 상담"
            text="고민 부위나 이전 시술 경험을 먼저 남기고 상담 신청으로 이어갈 수 있습니다."
            href="/chatbot"
          />
        </div>
      </section>

      <BookingConsultationForm />
    </main>
  );
}

function GuideCard({
  icon: Icon,
  title,
  text,
  href,
}: {
  icon: typeof PhoneCall;
  title: string;
  text: string;
  href?: string;
}) {
  const content = (
    <div className="flex gap-4 rounded-lg border border-border bg-card p-5">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <Icon className="h-5 w-5" />
      </span>
      <span>
        <span className="block text-base font-extrabold">{title}</span>
        <span className="mt-1 block text-sm leading-6 text-muted-foreground">{text}</span>
      </span>
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}
