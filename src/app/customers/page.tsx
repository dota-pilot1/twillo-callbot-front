"use client";

import { UsersRound } from "lucide-react";
import { RequireAuth } from "@/widgets/guards/RequireAuth";
import { AdminPlaceholderPage } from "@/shared/ui/AdminPlaceholderPage";

export default function CustomersPage() {
  return (
    <RequireAuth>
      <AdminPlaceholderPage
        title="고객 관리"
        description="전화번호 기반 고객 프로필, 상담 이력, 예약 이력, 발송 이력을 관리합니다."
        icon={UsersRound}
        tasks={["고객 목록/검색", "고객 상세", "상담·예약 이력", "SMS/이메일 발송 이력"]}
      />
    </RequireAuth>
  );
}
