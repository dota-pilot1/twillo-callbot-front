import Link from "next/link";
import { ArrowRight, BotMessageSquare, CalendarCheck, MessageSquareText, PhoneCall } from "lucide-react";

const flows = [
  {
    icon: PhoneCall,
    title: "상담 전 질문 정리",
    text: "고객의 피부 고민, 비만클리닉 상담 목표, 방문 가능 시간을 먼저 수집합니다.",
  },
  {
    icon: CalendarCheck,
    title: "예약 상담 연결",
    text: "챗봇 상담 결과를 상담원 콜백 또는 내원 예약 요청으로 넘깁니다.",
  },
  {
    icon: MessageSquareText,
    title: "안내 메시지 발송",
    text: "상담 후 주의사항, 위치, 준비사항을 SMS·이메일 템플릿으로 발송합니다.",
  },
];

export default function ChatbotPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <p className="flex items-center gap-2 text-sm font-bold text-primary">
            <BotMessageSquare className="h-4 w-4" />
            Clinic Consultation Bot
          </p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight">예약 전 상담을 정리하는 챗봇</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
            초기 단계에서는 실제 진단이 아니라 상담 접수에 필요한 정보를 정리합니다. 고객 답변은 관리자 화면에서 확인하고 전화 상담, 예약, 안내 메시지로 이어집니다.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/booking" className="inline-flex h-11 items-center gap-2 rounded-md bg-primary px-4 text-sm font-bold text-primary-foreground hover:opacity-90">
              예약 상담 신청
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/services" className="inline-flex h-11 items-center rounded-md border border-border bg-background px-4 text-sm font-bold hover:bg-accent">
              프로그램 보기
            </Link>
          </div>
        </div>

        <section className="rounded-lg border border-border bg-muted/30 p-5">
          <div className="rounded-lg border border-border bg-background">
            <div className="border-b border-border p-4">
              <h2 className="font-bold">챗봇 접수 예시</h2>
              <p className="mt-1 text-sm text-muted-foreground">상담원이 보기 좋은 형태로 요약합니다.</p>
            </div>
            <div className="space-y-3 p-4 text-sm">
              <Bubble from="bot" text="어떤 상담을 원하시나요? 피부 상담, 비만클리닉, 예약 변경 중 선택해 주세요." />
              <Bubble from="user" text="비만클리닉 상담이요. 평일 저녁 가능해요." />
              <Bubble from="bot" text="상담원이 확인 후 전화드릴 수 있도록 성함과 연락처를 남겨주세요." />
            </div>
          </div>
        </section>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {flows.map((flow) => (
          <div key={flow.title} className="rounded-lg border border-border bg-background p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <flow.icon className="h-5 w-5" />
            </span>
            <h2 className="mt-4 font-bold">{flow.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{flow.text}</p>
          </div>
        ))}
      </section>
    </main>
  );
}

function Bubble({ from, text }: { from: "bot" | "user"; text: string }) {
  const mine = from === "user";
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <p className={`max-w-[80%] rounded-lg px-3 py-2 ${mine ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
        {text}
      </p>
    </div>
  );
}
