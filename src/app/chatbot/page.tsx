import Link from "next/link";
import { ArrowRight, CalendarCheck, ShieldCheck } from "lucide-react";
import { FaqChat } from "@/features/faq/FaqChat";

const quickQuestions = ["진료시간이 궁금해요", "주차가 가능한가요?", "예약을 변경하고 싶어요", "시술 상담을 받고 싶어요"];

export default function ChatbotPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6 md:py-8">
      <h1 className="sr-only">FAQ 상담 챗봇</h1>
      <section>
        <FaqChat quickQuestions={quickQuestions} />
      </section>

      <section className="mt-5 flex flex-col items-center justify-between gap-4 rounded-lg border border-border bg-muted/30 p-4 sm:flex-row">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-background text-foreground shadow-sm">
            <CalendarCheck className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-sm font-extrabold">FAQ로 해결되지 않으셨나요?</h2>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">연락처와 상담 내용을 남기면 상담원이 확인 후 연락드립니다.</p>
          </div>
        </div>
        <Link href="/booking" className="inline-flex h-10 w-full shrink-0 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-bold text-primary-foreground hover:opacity-90 sm:w-auto">
          상담원 연결
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5" />
        챗봇은 의료진의 진단을 대신하지 않습니다.
      </p>
    </main>
  );
}
