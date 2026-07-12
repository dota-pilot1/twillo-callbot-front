"use client";

import { MessageSquareText } from "lucide-react";
import { RequireAuth } from "@/widgets/guards/RequireAuth";
import { AdminPlaceholderPage } from "@/shared/ui/AdminPlaceholderPage";

export default function MessageTemplatesPage() {
  return (
    <RequireAuth>
      <AdminPlaceholderPage
        title="메시지 템플릿"
        description="예약 확정, 내원 전 안내, 시술 후 주의사항, 이벤트 발송 문구를 관리합니다."
        icon={MessageSquareText}
        tasks={["SMS 템플릿", "이메일 템플릿", "상담 후 자동 안내", "광고성 문구 정책"]}
      />
    </RequireAuth>
  );
}
