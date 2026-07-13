"use client";

import { useEffect, useRef, useState } from "react";
import { LogOut, SendHorizontal } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/Button";
import type { ChatMessage, ChatRoom } from "@/entities/chat/model/types";

type Props = {
  room: ChatRoom;
  messages: ChatMessage[];
  currentUserId: number;
  sending?: boolean;
  onSend: (content: string) => void;
  onLeave: () => void;
};

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
}

export function ChatView({ room, messages, currentUserId, sending, onSend, onLeave }: Props) {
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  function submit() {
    const text = draft.trim();
    if (!text || sending) return;
    onSend(text);
    setDraft("");
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* 헤더 */}
      <div className="flex items-center gap-3 border-b border-border px-5 py-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
          {room.counterpart.name.charAt(0)}
        </span>
        <span className="text-sm font-bold">{room.counterpart.name}</span>
        <button
          type="button"
          onClick={onLeave}
          className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive"
        >
          <LogOut className="h-3.5 w-3.5" />
          나가기
        </button>
      </div>

      {/* 메시지 스트림 */}
      <div ref={scrollRef} className="flex-1 space-y-2 overflow-y-auto px-5 py-4">
        {messages.length === 0 ? (
          <p className="pt-10 text-center text-sm text-muted-foreground">
            첫 메시지를 보내 상담을 시작하세요.
          </p>
        ) : (
          messages.map((m) => {
            const mine = m.senderId === currentUserId;
            return (
              <div key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
                <div className={cn("max-w-[72%]", mine ? "items-end" : "items-start")}>
                  {!mine && (
                    <p className="mb-0.5 text-xs font-semibold text-muted-foreground">
                      {m.senderName}
                    </p>
                  )}
                  <div
                    className={cn(
                      "inline-block whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2 text-sm",
                      mine
                        ? "bg-emerald-600 text-white"
                        : "bg-muted text-foreground",
                    )}
                  >
                    {m.content}
                  </div>
                  <p
                    className={cn(
                      "mt-0.5 text-[11px] text-muted-foreground",
                      mine ? "text-right" : "text-left",
                    )}
                  >
                    {formatTime(m.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 입력창 */}
      <div className="border-t border-border p-3">
        <div className="flex items-end gap-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            rows={1}
            placeholder="메시지를 입력하세요"
            className="max-h-32 min-h-[2.75rem] flex-1 resize-none rounded-md border border-input bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <Button
            size="icon"
            className="h-11 w-11"
            onClick={submit}
            disabled={sending || !draft.trim()}
            aria-label="전송"
          >
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
