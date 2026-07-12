import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  CalendarCheck,
  Clock,
  MapPin,
  PhoneCall,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import { HospitalLocationPanel } from "@/shared/ui/HospitalLocationPanel";

export const metadata: Metadata = {
  title: "신사동 피부과·비만클리닉 병원 소개",
  description:
    "밀라의원은 서울 강남구 가로수길에 위치한 피부과·비만클리닉입니다. 여성 의사 진료, 1인 1실, 17년 경력 대표원장 디자인 시술과 예약 상담을 안내합니다.",
  alternates: {
    canonical: "/clinic",
  },
  openGraph: {
    title: "밀라의원 병원 소개",
    description: "신사동 피부과·비만클리닉 상담 예약, 위치, 진료시간, 대표 프로그램 안내.",
    url: "/clinic",
    images: ["/images/clinic/milla-cover.webp"],
  },
};

const programs = [
  { title: "피부클리닉", items: ["피코하이300", "프락셀듀얼", "보톡스", "실리프팅"] },
  { title: "디자인 리프팅", items: ["울쎄라", "브이로", "슈링크", "리프테라"] },
  { title: "바디클리닉", items: ["종아리/승모근 보톡스", "스피드슬림", "스컬프슈어", "3MAX 바디관리"] },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalClinic",
  name: "밀라의원",
  medicalSpecialty: ["Dermatology", "PlasticSurgery"],
  url: "https://twillo-callbot.web.app/clinic",
  telephone: "02-715-0328",
  image: "https://twillo-callbot.web.app/images/clinic/milla-cover.webp",
  address: {
    "@type": "PostalAddress",
    streetAddress: "가로수길 18 약산빌딩 3층",
    addressLocality: "강남구",
    addressRegion: "서울특별시",
    addressCountry: "KR",
  },
};

export default function ClinicPage() {
  return (
    <main className="bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="border-b border-border bg-zinc-950 text-white">
        <div className="mx-auto grid min-h-[620px] w-full max-w-6xl items-center gap-10 px-4 py-12 lg:grid-cols-[0.95fr_1.05fr] lg:px-6">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs font-extrabold text-amber-200">
              <Sparkles className="h-3.5 w-3.5" />
              Private Luxury Clinic
            </p>
            <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">
              밀라의원
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-white/75">
              신사동 피부과·비만클리닉 상담 예약. 고급스러운 브랜드 이미지는 표지로 보여주고, 검색에 필요한 병원명·위치·진료시간·프로그램 정보는 텍스트로 함께 제공합니다.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/booking"
                className="inline-flex h-11 items-center gap-2 rounded-md bg-amber-500 px-5 text-sm font-extrabold text-zinc-950 hover:bg-amber-400"
              >
                예약 상담 신청
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/chatbot"
                className="inline-flex h-11 items-center gap-2 rounded-md border border-white/20 bg-white/10 px-5 text-sm font-bold hover:bg-white/15"
              >
                <Bot className="h-4 w-4" />
                상담 챗봇
              </Link>
            </div>
          </div>
          <div className="mx-auto w-full max-w-[460px] overflow-hidden rounded-lg border border-white/10 bg-white/5 p-3 shadow-2xl">
            <Image
              src="/images/clinic/milla-private-luxury.png"
              alt="밀라의원 피부과 비만클리닉 표지 이미지"
              width={1080}
              height={1080}
              priority
              className="aspect-square w-full rounded-md object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 lg:grid-cols-[0.95fr_1.05fr] lg:px-6">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-xs font-extrabold text-rose-700">
            <Sparkles className="h-3.5 w-3.5" />
            신사동 피부과·비만클리닉
          </p>
          <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
            밀라의원
          </h1>
          <p className="mt-5 text-base leading-8 text-muted-foreground">
            여성 의사 진료, 1인 1실, 17년 경력 대표원장의 디자인 시술, 만족도 높은 케어와 고급스러운 시술 환경을 제공합니다.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/booking"
              className="inline-flex h-11 items-center gap-2 rounded-md bg-primary px-5 text-sm font-extrabold text-primary-foreground hover:opacity-90"
            >
              예약 상담 신청
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/chatbot"
              className="inline-flex h-11 items-center gap-2 rounded-md border border-border bg-background px-5 text-sm font-bold hover:bg-accent"
            >
              <Bot className="h-4 w-4" />
              상담 챗봇
            </Link>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Info icon={MapPin} label="위치" value="서울특별시 강남구 가로수길 18 약산빌딩 3층" />
          <Info icon={PhoneCall} label="진료문의" value="02-715-0328" />
          <Info icon={Clock} label="진료시간" value="상담 예약 후 방문 시간 확정" />
          <Info icon={CalendarCheck} label="예약 방식" value="전화·챗봇 상담 후 예약 확정" />
        </div>
      </section>

      <section className="border-y border-border bg-white">
        <Image
          src="/images/clinic/milla-blog-hero.png"
          alt="밀라의원 피부클리닉 리프팅 바디클리닉 브랜드 배너"
          width={2000}
          height={700}
          className="h-auto w-full"
        />
      </section>

      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 lg:px-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold text-primary">대표 프로그램</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight">상담 가능한 주요 클리닉</h2>
            </div>
            <Link href="/services" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">
              전체 프로그램 보기
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {programs.map((program) => (
              <article key={program.title} className="rounded-lg border border-border bg-card p-6">
                <Stethoscope className="h-6 w-6 text-primary" />
                <h3 className="mt-4 text-xl font-extrabold">{program.title}</h3>
                <ul className="mt-4 space-y-2 text-sm font-semibold text-muted-foreground">
                  {program.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:px-6">
        <Image
          src="/images/clinic/clinic-lounge.jpg"
          alt="밀라의원 상담 공간"
          width={1672}
          height={941}
          className="h-80 w-full rounded-lg object-cover"
        />
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="text-sm font-bold text-primary">예약 안내</p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight">방문 전 상담 정보를 먼저 남겨주세요.</h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            관심 프로그램, 희망 방문 시간, 연락처를 남기면 상담원이 확인 후 전화 또는 SMS로 예약을 안내합니다.
          </p>
          <Link
            href="/booking"
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-md bg-primary px-5 text-sm font-extrabold text-primary-foreground hover:opacity-90"
          >
            예약 상담 신청하기
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-14 lg:px-6">
        <HospitalLocationPanel />
      </section>
    </main>
  );
}

function Info({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <Icon className="h-5 w-5 text-primary" />
      <p className="mt-4 text-xs font-bold text-muted-foreground">{label}</p>
      <p className="mt-1 text-base font-extrabold leading-7">{value}</p>
    </div>
  );
}
