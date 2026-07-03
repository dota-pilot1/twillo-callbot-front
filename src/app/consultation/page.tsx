"use client";

import { RequireAuth } from "@/widgets/guards/RequireAuth";
import { SoftphoneConsole } from "@/features/softphone/SoftphoneConsole";

export default function ConsultationPage() {
  return (
    <RequireAuth>
      <SoftphoneConsole
        initialTab="outbound"
        eyebrow="Outbound Call"
        title="전화 걸기"
        description="고객 번호로 전화를 걸고 이번 세션의 통화 기록을 확인합니다."
      />
    </RequireAuth>
  );
}
