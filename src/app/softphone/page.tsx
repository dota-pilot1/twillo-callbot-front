"use client";

import { RequireAuth } from "@/widgets/guards/RequireAuth";
import { SoftphoneConsole } from "@/features/softphone/SoftphoneConsole";

export default function SoftphonePage() {
  return (
    <RequireAuth>
      <SoftphoneConsole
        initialTab="inbound"
        eyebrow="Inbound Call"
        title="전화 받기"
        description={`${process.env.NEXT_PUBLIC_SOFTPHONE_NUMBER ?? "+1 814 402 8603"}로 들어오는 전화를 상담원 브라우저에서 받습니다.`}
      />
    </RequireAuth>
  );
}
