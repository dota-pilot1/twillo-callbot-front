import { ChatMessenger } from "@/features/chat/ChatMessenger";

export default function ConsultationChatPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-6">
        <p className="text-sm font-bold text-emerald-600">상담사 연결</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">실시간 상담</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          상담 직원을 선택해 1:1 대화를 시작하고, 실시간으로 메시지를 주고받는 상담 화면입니다.
        </p>
      </div>

      <ChatMessenger />
    </main>
  );
}
