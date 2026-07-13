"use client";

import { cn } from "@/shared/lib/utils";
import type { ChatRoom } from "@/entities/chat/model/types";

type Props = {
  rooms: ChatRoom[];
  activeRoomId: number | null;
  loading?: boolean;
  error?: string | null;
  onSelect: (roomId: number) => void;
};

export function RoomList({ rooms, activeRoomId, loading, error, onSelect }: Props) {
  if (loading) {
    return <p className="px-5 py-6 text-sm text-muted-foreground">불러오는 중…</p>;
  }
  if (error) {
    return <p className="px-5 py-6 text-sm text-destructive">{error}</p>;
  }
  if (rooms.length === 0) {
    return (
      <p className="px-5 py-6 text-sm leading-6 text-muted-foreground">
        아직 대화가 없습니다.
        <br />
        상담 직원 탭에서 대화를 시작하세요.
      </p>
    );
  }

  return (
    <ul className="flex-1 overflow-y-auto">
      {rooms.map((room) => {
        const active = room.id === activeRoomId;
        return (
          <li key={room.id}>
            <button
              type="button"
              onClick={() => onSelect(room.id)}
              className={cn(
                "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-accent",
                active && "bg-accent",
              )}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white">
                {room.counterpart.name.charAt(0)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-bold">{room.counterpart.name}</span>
                  {room.unread > 0 && (
                    <span className="shrink-0 rounded-full bg-emerald-600 px-1.5 py-0.5 text-[11px] font-bold text-white">
                      {room.unread}
                    </span>
                  )}
                </span>
                <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                  {room.lastMessagePreview ?? "메시지가 없습니다"}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
