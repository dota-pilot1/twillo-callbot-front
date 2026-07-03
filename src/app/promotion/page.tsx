"use client";

import { RequireAuth } from "@/widgets/guards/RequireAuth";
import { CallbotConsole } from "@/features/callbot/CallbotConsole";

export default function PromotionPage() {
  return (
    <RequireAuth>
      <CallbotConsole
        config={{
          variant: "outbound",
          pageTitle: "프로모션 아웃바운드 콜",
          pageSubtitle:
            "수신 동의한 고객에게 프로모션·이벤트 안내를 자동 음성으로 발신합니다. (마케팅 수신 동의 고객 대상)",
          formTitle: "프로모션 전화 발신 (Outbound Call)",
          submitLabel: "프로모션 자동 전화 발신",
          defaultMessage:
            "안녕하세요. 마포 미용실입니다. 이번 달 특별 프로모션 안내를 위해 연락드렸습니다. 자세한 내용은 안내에 따라 주세요.",
          recentLogsTitle: "최근 프로모션 발신 기록",
        }}
      />
    </RequireAuth>
  );
}
