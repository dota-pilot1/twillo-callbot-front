"use client";

import { RequireAuth } from "@/widgets/guards/RequireAuth";
import { CallbotConsole } from "@/features/callbot/CallbotConsole";

export default function ReservationPage() {
  return (
    <RequireAuth>
      <CallbotConsole
        config={{
          variant: "inbound",
          pageTitle: "미용실 예약 (인바운드)",
          pageSubtitle:
            "고객이 대표번호로 전화하면 1번 예약 녹음, 2번 예약 링크, 3번 매장 안내 문자로 처리합니다.",
          formTitle: "예약 녹음 받기",
          recentLogsTitle: "접수된 예약 콜 기록",
          // Twilio 구입 번호 (Voice Webhook 을 /api/v1/callbot/webhook/inbound 로 설정)
          dialInNumber: "+1 859-350-2029",
          dialHint: "한국에서 걸 땐 0을 길게 눌러 + 입력",
        }}
      />
    </RequireAuth>
  );
}
