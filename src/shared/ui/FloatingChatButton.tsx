"use client";

import Link from "next/link";
import { BotMessageSquare } from "lucide-react";
import { useIsTauri } from "@/shared/tauri/useIsTauri";

export function FloatingChatButton() {
  const isTauri = useIsTauri();

  if (isTauri) return null;

  return (
    <Link
      href="/chatbot"
      aria-label="상담 챗봇 열기"
      className="fixed bottom-5 right-5 z-50 inline-flex h-12 items-center gap-2 rounded-full border border-emerald-200 bg-emerald-600 px-4 text-sm font-bold text-white shadow-lg shadow-emerald-900/20 transition-transform hover:-translate-y-0.5 hover:bg-emerald-700"
    >
      <BotMessageSquare className="h-5 w-5" />
      <span className="hidden sm:inline">상담 챗봇</span>
    </Link>
  );
}
