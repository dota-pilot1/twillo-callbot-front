"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Info, Send } from "lucide-react";

const programs = [
  "상담 후 추천",
  "리프팅",
  "스킨케어",
  "색소·잡티",
  "레이저 제모",
  "쁘띠·주사",
  "기타 상담",
];
const timeSlots = ["가장 빠른 가능 시간", "상담원과 조율", "평일 오전", "평일 오후", "평일 저녁", "토요일"];

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
          확정 예약이 아닌 상담 접수입니다. 데스크 확인 후 실제 예약 가능 시간을 안내합니다.
        </p>
      </div>

      {submittedName && (
        <div className="mt-5 flex gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-200">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          <p className="text-sm font-bold">
            {submittedName}님 상담 요청이 접수되었습니다. 상담원이 확인 후 연락처로 예약 가능 시간을 안내합니다.
          </p>
        </div>
      )}

      <div className="mt-5 flex gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-zinc-700">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-zinc-950" />
        <p className="text-sm leading-6">
          희망 시간대는 상담원이 일정을 조율하기 위한 참고 정보입니다. 시술 종류, 상담 내용,
          장비와 담당자 일정에 따라 실제 예약 시간이 달라질 수 있습니다.
        </p>
      </div>

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
            <span className="text-sm font-bold">관심 시술·상담</span>
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
            <span className="text-sm font-bold">희망 시간대</span>
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
            placeholder="고민 부위, 이전 시술 경험, 선호하는 방문 요일이나 피해야 하는 시간대를 남겨주세요."
            rows={5}
            className="w-full resize-none rounded-md border border-input bg-background px-3 py-3 text-sm leading-6 outline-none focus:border-primary"
          />
        </label>

        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-extrabold text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45"
        >
          상담 접수 남기기
          <Send className="h-4 w-4" />
        </button>
      </form>
    </section>
  );
}
