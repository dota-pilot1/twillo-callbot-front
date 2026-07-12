"use client";

import { History } from "lucide-react";
import { RequireAuth } from "@/widgets/guards/RequireAuth";
import { AdminPlaceholderPage } from "@/shared/ui/AdminPlaceholderPage";

export default function CallHistoryPage() {
  return (
    <RequireAuth>
      <AdminPlaceholderPage
        title="통화 기록"
        description="Twilio 인바운드/아웃바운드 통화, 녹취, 상담 요약을 고객과 연결합니다."
        icon={History}
        tasks={["통화 목록", "녹취 재생", "상담 요약", "고객 상세 연결"]}
      />
    </RequireAuth>
  );
}
