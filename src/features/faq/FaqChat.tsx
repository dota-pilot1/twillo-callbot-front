"use client";

import { FormEvent, useState } from "react";
import { LoaderCircle, Send } from "lucide-react";
import { faqApi } from "@/entities/faq/api/faqApi";

type Message = { from: "bot" | "user"; text: string; category?: string | null };

export function FaqChat({ quickQuestions = [] }: { quickQuestions?: string[] }) {
  const [messages, setMessages] = useState<Message[]>([
    { from: "bot", text: "궁금한 내용을 질문해 주세요. 확인된 병원 FAQ를 기준으로 안내해 드립니다." },
  ]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const ask = async (value: string) => {
    if (!value || loading) return;
    setMessages((current) => [...current, { from: "user", text: value }]);
    setQuestion("");
    setLoading(true);
    try {
      const result = await faqApi.ask(value);
      setMessages((current) => [...current, { from: "bot", text: result.answer, category: result.category }]);
    } catch {
      setMessages((current) => [
        ...current,
        { from: "bot", text: "지금은 안내를 불러오지 못했습니다. 잠시 후 다시 시도하거나 상담원 연결을 이용해 주세요." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const value = question.trim();
    await ask(value);
  };

  return (
    <div className="flex min-h-[480px] flex-col overflow-hidden rounded-xl border border-border bg-background shadow-sm">
      <div className="border-b border-border p-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <h2 className="font-bold">상담 챗봇</h2>
          <span className="text-xs text-muted-foreground">FAQ 안내</span>
        </div>
      </div>
      <div aria-live="polite" className="flex-1 space-y-3 overflow-y-auto p-4 text-sm sm:p-5">
        {messages.map((message, index) => (
          <Bubble key={`${message.from}-${index}`} {...message} />
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <LoaderCircle className="h-4 w-4 animate-spin" />
            FAQ를 확인하고 있습니다.
          </div>
        )}
      </div>
      {messages.length === 1 && quickQuestions.length > 0 && (
        <div className="flex flex-wrap gap-2 px-4 pb-4 sm:px-5">
          {quickQuestions.map((item) => (
            <button key={item} type="button" onClick={() => void ask(item)} className="rounded-full border border-border bg-background px-3 py-2 text-xs font-bold hover:bg-accent">
              {item}
            </button>
          ))}
        </div>
      )}
      <form onSubmit={submit} className="flex gap-2 border-t border-border bg-muted/20 p-3">
        <input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          maxLength={1000}
          placeholder="예: 주차가 가능한가요?"
          aria-label="FAQ 질문"
          className="h-10 min-w-0 flex-1 rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary"
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-bold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          질문
        </button>
      </form>
    </div>
  );
}

function Bubble({ from, text, category }: Message) {
  const mine = from === "user";
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[86%] rounded-lg px-3 py-2 ${mine ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
        {category && <p className="mb-1 text-[11px] font-bold text-muted-foreground">{category}</p>}
        <p className="whitespace-pre-wrap leading-6">{text}</p>
      </div>
    </div>
  );
}
