import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CalendarCheck,
  Clock,
  HeartPulse,
  MapPin,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import { clinicProfile } from "@/shared/config/clinic";

const programs = [
  {
    title: "피부 상담",
    text: "피부 고민과 이전 시술 이력을 확인해 적합한 진료 상담으로 연결합니다.",
  },
  {
    title: "리프팅·탄력",
    text: "얼굴 라인, 탄력, 회복 기간을 기준으로 맞춤 상담 예약을 받습니다.",
  },
  {
    title: "색소·여드름",
    text: "증상, 치료 경험, 희망 일정을 접수해 상담원이 빠르게 확인합니다.",
  },
  {
    title: "비만클리닉",
    text: "바디라인 관리 목표와 방문 가능 주기를 기반으로 상담 일정을 제안합니다.",
  },
];

const steps = [
  { title: "프로그램 확인", text: "홈페이지에서 병원 소개와 대표 프로그램을 확인합니다." },
  { title: "예약 상담 신청", text: "전화번호와 관심 시술, 희망 시간을 남깁니다." },
  { title: "상담원 확인", text: "관리자가 요청을 확인하고 전화·SMS로 예약을 확정합니다." },
  { title: "내원 안내 발송", text: "방문 전 주의사항과 위치 안내를 메시지로 전달합니다." },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="relative isolate overflow-hidden bg-stone-950 text-white">
        <Image
          src="/images/clinic/clinic-reception.png"
          alt={`${clinicProfile.shortName} 상담 공간`}
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-20 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-stone-950/92 via-stone-950/58 to-stone-950/12" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-stone-950/82 to-transparent" />

        <div className="mx-auto flex min-h-[560px] w-full max-w-6xl flex-col justify-center px-4 py-14 lg:min-h-[620px] lg:px-6">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/12 px-3 py-1 text-xs font-bold text-white shadow-sm backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" />
              {clinicProfile.category}
            </p>
            <h1 className="mt-6 text-5xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              {clinicProfile.shortName}
            </h1>
            <p className="mt-5 max-w-2xl text-2xl font-extrabold leading-snug tracking-tight text-white sm:text-3xl">
              피부 고민과 체형 관리 상담을 차분하게 안내합니다.
            </p>
            <p className="mt-5 max-w-xl text-base font-medium leading-8 text-white/82">
              도산공원 인근 프라이빗 클리닉에서 피부·리프팅·스킨케어 상담을 신청하고, 상담원이 전화 또는 메시지로 예약 가능 시간을 안내합니다.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/booking"
                className="inline-flex h-12 items-center gap-2 rounded-md bg-white px-5 text-sm font-extrabold text-stone-950 shadow-lg shadow-stone-950/20 hover:bg-white/90"
              >
                예약 상담 신청
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/"
                className="inline-flex h-12 items-center gap-2 rounded-md border border-white/35 bg-white/10 px-5 text-sm font-bold backdrop-blur hover:bg-white/20"
              >
                병원 소개 보기
              </Link>
            </div>
          </div>

          <div className="mt-12 grid max-w-3xl gap-3 text-white sm:grid-cols-3">
            <HeroPoint icon={MapPin} label="위치" value="도산공원 인근" />
            <HeroPoint icon={ShieldCheck} label="상담 방식" value="1:1 확인 후 확정" />
            <HeroPoint icon={HeartPulse} label="진료 분야" value="피부·리프팅·비만" />
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-4 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
        <ActionCard href="/" icon={Stethoscope} title="병원 소개" text="병원 정보와 대표 프로그램 확인" />
        <ActionCard href="/services" icon={Sparkles} title="시술 소개" text="피부·리프팅·비만클리닉 안내" />
        <ActionCard href="/location" icon={MapPin} title="약도 안내" text="주소와 길찾기 확인" />
        <ActionCard href="/booking" icon={CalendarCheck} title="예약 신청" text="홈페이지에서 바로 상담 예약" />
      </section>

      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:px-6">
          <div>
            <p className="text-sm font-bold text-primary">대표 프로그램</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight">상담 전환에 필요한 정보만 선명하게</h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              병원 소개, 대표 프로그램, 위치 정보를 먼저 보여주고 고객 행동은 예약 상담 신청으로 자연스럽게 모읍니다.
            </p>
            <Image
              src="/images/clinic/clinic-device.png"
              alt="대표 장비"
              width={1024}
              height={1024}
              className="mt-6 h-72 w-full rounded-lg object-cover"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {programs.map((program) => (
              <article key={program.title} className="rounded-lg border border-border bg-background p-5">
                <Stethoscope className="h-5 w-5 text-primary" />
                <h3 className="mt-4 text-lg font-bold">{program.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{program.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 lg:px-6">
        <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold text-primary">예약 흐름</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight">정확한 예약 전, 먼저 상담 요청을 받습니다</h2>
          </div>
          <Link href="/booking" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">
            예약 상담 신청하기
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {steps.map((step, index) => (
            <article key={step.title} className="rounded-lg border border-border bg-card p-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-sm font-black text-primary-foreground">
                {index + 1}
              </span>
              <h3 className="mt-4 font-bold">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-zinc-950 text-white">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 md:grid-cols-[1fr_auto] md:items-center lg:px-6">
          <div>
            <p className="flex items-center gap-2 text-sm font-bold text-emerald-300">
              <PhoneCall className="h-4 w-4" />
              상담 예약 {clinicProfile.phone}
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight">상담 요청을 놓치지 않도록 전화·챗봇·메시지를 한 흐름으로 묶습니다.</h2>
            <p className="mt-3 flex items-center gap-2 text-sm text-white/70">
              <Clock className="h-4 w-4" />
              {clinicProfile.hours[0]}
            </p>
          </div>
          <Link
            href="/booking"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-emerald-500 px-5 text-sm font-extrabold text-white hover:bg-emerald-600"
          >
            예약 상담 신청
            <CalendarCheck className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}

function HeroPoint({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 border-l border-white/30 bg-white/10 px-4 py-3 backdrop-blur-md">
      <Icon className="h-5 w-5 shrink-0 text-white" />
      <span>
        <span className="block text-xs font-bold text-white/65">{label}</span>
        <span className="mt-0.5 block text-sm font-extrabold">{value}</span>
      </span>
    </div>
  );
}

function ActionCard({
  href,
  icon: Icon,
  title,
  text,
}: {
  href: string;
  icon: typeof CalendarCheck;
  title: string;
  text: string;
}) {
  return (
    <Link href={href} className="rounded-lg border border-border bg-card p-5 hover:bg-accent/40">
      <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <Icon className="h-5 w-5" />
      </span>
      <span className="mt-4 block text-lg font-bold">{title}</span>
      <span className="mt-1 block text-sm leading-6 text-muted-foreground">{text}</span>
    </Link>
  );
}
