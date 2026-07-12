"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { RequireAuth } from "@/widgets/guards/RequireAuth";
import { SoftphoneConsole } from "@/features/softphone/SoftphoneConsole";
import { useTauriRuntime } from "@/shared/tauri/useIsTauri";

export default function SoftphonePage() {
  const router = useRouter();
  const { isReady, isTauri } = useTauriRuntime();

  useEffect(() => {
    if (isReady && !isTauri) {
      router.replace("/");
    }
  }, [isReady, isTauri, router]);

  if (!isReady || !isTauri) return null;

  return (
    <RequireAuth>
      <SoftphoneConsole
        eyebrow="Clinic Softphone"
        title="소프트폰 상담 콘솔"
        description="대표번호로 들어오는 예약 문의를 받고, 필요하면 고객에게 바로 전화합니다."
      />
    </RequireAuth>
  );
}
