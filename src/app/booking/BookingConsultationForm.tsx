"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Send } from "lucide-react";

const programs = ["피부 상담", "리프팅·탄력", "색소·여드름", "비만클리닉", "기타 상담"];
const timeSlots = ["상담원과 조율", "평일 오전", "평일 오후", "평일 저녁", "토요일"];

type FormState = {
  name: string;
  phone: string;
  program: string;
  preferredTime: string;
  memo: string;
};

const initialForm: FormState = {
  name: "",
  phone: "",
  program: programs[0],
  preferredTime: timeSlots[0],
  memo: "",
};

export function BookingConsultationForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [submittedName, setSubmittedName] = useState("");

  const canSubmit = useMemo(() => {
    return form.name.trim().length >= 2 && form.phone.trim().length >= 8;
  }, [form.name, form.phone]);

  const update = (key: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    const request = {
      id: crypto.randomUUID(),
      ...form,
      status: "NEW",
      createdAt: new Date().toISOString(),
    };

    const storageKey = "twillo-pilot-booking-requests";
    const previous = JSON.parse(window.localStorage.getItem(storageKey) ?? "[]") as unknown[];
    window.localStorage.setItem(storageKey, JSON.stringify([request, ...previous]));

    setSubmittedName(form.name.trim());
    setForm(initialForm);
  };

  return (
    <section className="rounded-lg border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="border-b border-border pb-5">
        <h2 className="text-xl font-extrabold tracking-tight">상담 정보 입력</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          필수 정보만 먼저 받고, 상세 문진은 전화 상담이나 챗봇에서 이어갑니다.
        </p>
      </div>

      {submittedName && (
        <div className="mt-5 flex gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-200">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          <p className="text-sm font-bold">
            {submittedName}님 상담 요청이 mock 접수되었습니다. 관리자 예약 목록 API 연결 전까지 브라우저에 임시 저장됩니다.
          </p>
        </div>
      )}

      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-bold">이름</span>
            <input
              value={form.name}
              onChange={(event) => update("name", event.target.value)}
              placeholder="홍길동"
              className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-bold">연락처</span>
            <input
              value={form.phone}
              onChange={(event) => update("phone", event.target.value)}
              placeholder="010-0000-0000"
              inputMode="tel"
              className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-bold">관심 프로그램</span>
            <select
              value={form.program}
              onChange={(event) => update("program", event.target.value)}
              className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary"
            >
              {programs.map((program) => (
                <option key={program} value={program}>
                  {program}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-bold">희망 시간</span>
            <select
              value={form.preferredTime}
              onChange={(event) => update("preferredTime", event.target.value)}
              className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary"
            >
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block space-y-2">
          <span className="text-sm font-bold">상담 메모</span>
          <textarea
            value={form.memo}
            onChange={(event) => update("memo", event.target.value)}
            placeholder="희망 시술, 고민 부위, 방문 가능 날짜 등을 남겨주세요."
            rows={5}
            className="w-full resize-none rounded-md border border-input bg-background px-3 py-3 text-sm leading-6 outline-none focus:border-primary"
          />
        </label>

        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-extrabold text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45"
        >
          상담 요청 접수
          <Send className="h-4 w-4" />
        </button>
      </form>
    </section>
  );
}
