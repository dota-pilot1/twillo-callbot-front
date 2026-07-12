import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

const services = [
  { title: "피부 상담", text: "피부 고민, 이전 시술 경험, 내원 가능 시간을 확인합니다." },
  { title: "리프팅·탄력", text: "상담 후 적합한 관리 프로그램과 예약 가능 시간을 안내합니다." },
  { title: "색소·여드름", text: "증상과 희망 일정에 맞춰 상담 예약으로 연결합니다." },
  { title: "비만클리닉", text: "바디라인 관리 목표와 방문 주기를 기반으로 상담을 접수합니다." },
];

export default function ServicesPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <p className="flex items-center gap-2 text-sm font-bold text-primary">
        <Sparkles className="h-4 w-4" />
        Programs
      </p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight">시술/프로그램</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
        고객은 프로그램을 보고 상담을 신청하고, 상담원은 전화와 메시지로 예약까지 연결합니다.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {services.map((service) => (
          <section key={service.title} className="rounded-lg border border-border bg-background p-5">
            <h2 className="text-lg font-bold">{service.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{service.text}</p>
            <Link href="/booking" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">
              상담 신청
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        ))}
      </div>
    </main>
  );
}
