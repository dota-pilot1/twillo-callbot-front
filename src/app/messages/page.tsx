"use client";

import { Mail } from "lucide-react";
import { RequireAuth } from "@/widgets/guards/RequireAuth";
import { AdminPlaceholderPage } from "@/shared/ui/AdminPlaceholderPage";

export default function MessagesPage() {
  return (
    <RequireAuth>
      <AdminPlaceholderPage
        title="SMS·이메일 발송"
        description="선택 고객에게 안내 문자, 예약 리마인드, 이벤트 이메일을 발송합니다."
        icon={Mail}
        tasks={["고객 선택 발송", "SMS 발송", "이메일 발송", "발송 결과/실패 로그"]}
      />
    </RequireAuth>
  );
}
