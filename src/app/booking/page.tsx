import type { Metadata } from "next";
import Link from "next/link";
import { Bot, CalendarCheck, PhoneCall } from "lucide-react";
import { BookingConsultationForm } from "./BookingConsultationForm";

export const metadata: Metadata = {
  title: "예약 상담 신청",
  description:
    "밀라의원 피부과·리프팅·비만클리닉 예약 상담을 신청하세요. 이름, 연락처, 관심 프로그램, 희망 방문 시간을 남기면 상담원이 확인합니다.",
  alternates: {
    canonical: "/booking",
  },
  openGraph: {
    title: "밀라의원 예약 상담 신청",
    description: "신사동 피부과·비만클리닉 전화 상담 및 예약 신청.",
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
          관심 프로그램과 연락처를 남기면 상담원이 확인 후 전화 또는 SMS로 예약 가능 시간을 안내합니다. 지금 단계에서는 서버 연결 전 mock 접수로 저장합니다.
        </p>

        <div className="mt-8 space-y-3">
          <GuideCard
            icon={PhoneCall}
            title="전화 상담 우선"
            text="상담원이 남겨진 번호로 연락해 예약을 확정합니다."
          />
          <GuideCard
            icon={Bot}
            title="챗봇 사전 상담"
            text="궁금한 내용을 먼저 남기고 상담 신청으로 이어갈 수 있습니다."
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
