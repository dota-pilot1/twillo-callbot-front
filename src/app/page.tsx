import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CalendarCheck,
  Clock,
  MapPin,
  PhoneCall,
  Sparkles,
  Stethoscope,
} from "lucide-react";

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
      <section className="relative isolate overflow-hidden bg-zinc-950 text-white">
        <Image
          src="/images/clinic/clinic-hero.jpg"
          alt="병원 전경"
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-20 object-cover opacity-80"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-zinc-950 via-zinc-950/70 to-zinc-950/10" />
        <div className="mx-auto grid min-h-[620px] w-full max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-6">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-bold backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              피부과·비만클리닉
            </p>
            <h1 className="mt-6 max-w-2xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              병원 소개부터 예약 상담까지 한 번에 연결합니다.
            </h1>
            <p className="mt-5 max-w-xl text-base font-medium leading-8 text-white/85">
              홈페이지는 병원 신뢰와 프로그램을 보여주고, 고객 예약 신청은 전화·SMS 운영 앱으로 이어지는 홍보형 병원 홈페이지 파일럿입니다.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/booking"
                className="inline-flex h-12 items-center gap-2 rounded-md bg-white px-5 text-sm font-extrabold text-zinc-950 hover:bg-white/90"
              >
                예약 상담 신청
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/services"
                className="inline-flex h-12 items-center gap-2 rounded-md border border-white/35 bg-white/10 px-5 text-sm font-bold backdrop-blur hover:bg-white/20"
              >
                시술/프로그램 보기
              </Link>
            </div>
          </div>

          <div className="hidden rounded-lg border border-white/20 bg-white/90 p-4 text-zinc-950 shadow-2xl backdrop-blur md:block">
            <Image
              src="/images/clinic/clinic-reception.png"
              alt="예약 상담 접수"
              width={1672}
              height={941}
              className="h-64 w-full rounded-md object-cover"
            />
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <QuickStat label="상담 채널" value="전화·예약폼" />
              <QuickStat label="예약 관리" value="관리자 확인" />
              <QuickStat label="안내 발송" value="SMS·이메일" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-4 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
        <ActionCard href="/clinic" icon={Stethoscope} title="병원 소개" text="병원 정보와 대표 프로그램 확인" />
        <ActionCard href="/services" icon={Sparkles} title="시술 소개" text="피부·리프팅·비만클리닉 안내" />
        <ActionCard href="/location" icon={MapPin} title="약도 안내" text="주소와 길찾기 확인" />
        <ActionCard href="/booking" icon={CalendarCheck} title="예약 신청" text="홈페이지에서 바로 상담 예약" />
      </section>

      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:px-6">
          <div>
            <p className="text-sm font-bold text-primary">대표 프로그램</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight">홍보 페이지에서 바로 예약으로 이어지는 구성</h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              병원 소개, 시술 정보, 장비 이미지, 위치 정보를 한 화면에서 신뢰감 있게 보여주고 고객 행동은 상담 신청으로 모읍니다.
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
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight">미용실 예약 앱처럼 단순한 고객 여정</h2>
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
              상담 예약 02-715-0328
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight">상담 요청을 놓치지 않도록 전화·챗봇·메시지를 한 흐름으로 묶습니다.</h2>
            <p className="mt-3 flex items-center gap-2 text-sm text-white/70">
              <Clock className="h-4 w-4" />
              진료시간은 상담 예약 후 확정 안내
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

function QuickStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-zinc-100 p-3">
      <p className="text-xs font-bold text-zinc-500">{label}</p>
      <p className="mt-1 text-sm font-extrabold">{value}</p>
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
