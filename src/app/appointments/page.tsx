"use client";

import { CalendarCheck } from "lucide-react";
import { RequireAuth } from "@/widgets/guards/RequireAuth";
import { AdminPlaceholderPage } from "@/shared/ui/AdminPlaceholderPage";

export default function AppointmentsPage() {
  return (
    <RequireAuth>
      <AdminPlaceholderPage
        title="예약 관리"
        description="상담 후 예약 요청, 확정, 취소, 노쇼 상태를 관리합니다."
        icon={CalendarCheck}
        tasks={["예약 요청 목록", "예약 확정/취소/노쇼 처리", "상담 기록과 예약 연결", "방문 전 SMS 안내"]}
      />
    </RequireAuth>
  );
}
