"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/shared/lib/utils";
import { useAuth } from "@/entities/user/model/authStore";
import { chatApi, createChatWebSocket } from "@/entities/chat/api/chatApi";
import type { ChatAgent, ChatMessage, ChatRoom, ChatWsEvent } from "@/entities/chat/model/types";
import { ConfirmDialog } from "@/shared/ui/ConfirmDialog";
import { RoomList } from "./RoomList";
import { AgentList } from "./AgentList";
import { ChatView } from "./ChatView";

type Tab = "rooms" | "agents";

export function ChatMessenger() {
  const { user } = useAuth();

  const [tab, setTab] = useState<Tab>("rooms");
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [roomsError, setRoomsError] = useState<string | null>(null);
  const [roomsLoading, setRoomsLoading] = useState(false);

  const [agents, setAgents] = useState<ChatAgent[]>([]);
  const [agentsError, setAgentsError] = useState<string | null>(null);
  const [agentsLoading, setAgentsLoading] = useState(false);
  const [startingId, setStartingId] = useState<number | null>(null);

  const [activeRoomId, setActiveRoomId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const [confirmLeaveOpen, setConfirmLeaveOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const activeRoomIdRef = useRef<number | null>(null);
  activeRoomIdRef.current = activeRoomId;

  const activeRoom = rooms.find((r) => r.id === activeRoomId) ?? null;

  const loadRooms = useCallback(async () => {
    try {
      setRoomsLoading(true);
      setRooms(await chatApi.listRooms());
    } catch {
      setRoomsError("대화 목록을 불러오지 못했습니다.");
    } finally {
      setRoomsLoading(false);
    }
  }, []);

  // 최초 대화 목록 로드
  useEffect(() => {
    void loadRooms();
  }, [loadRooms]);

  // 상담 직원 탭 최초 진입 시 로드
  useEffect(() => {
    if (tab !== "agents" || agents.length > 0) return;
    (async () => {
      try {
        setAgentsLoading(true);
        setAgents(await chatApi.listAgents());
      } catch {
        setAgentsError("상담 직원 목록을 불러오지 못했습니다.");
      } finally {
        setAgentsLoading(false);
      }
    })();
  }, [tab, agents.length]);

  // WebSocket 연결 (마운트 시 1회) — 재연결 포함
  useEffect(() => {
    if (!user) return;
    let closed = false;
    let pingTimer: ReturnType<typeof setInterval> | null = null;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;

    const connect = () => {
      const ws = createChatWebSocket();
      if (!ws) return;
      wsRef.current = ws;

      ws.onopen = () => {
        const rid = activeRoomIdRef.current;
        if (rid != null) ws.send(JSON.stringify({ type: "SUBSCRIBE", roomId: rid }));
        pingTimer = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: "PING" }));
        }, 25_000);
      };

      ws.onmessage = (ev) => {
        let msg: ChatWsEvent;
        try {
          msg = JSON.parse(ev.data);
        } catch {
          return;
        }
        if (msg.type === "CHAT_MESSAGE") {
          if (msg.roomId === activeRoomIdRef.current) {
            setMessages((prev) =>
              prev.some((m) => m.id === msg.data.id) ? prev : [...prev, msg.data],
            );
          }
          void loadRooms();
        } else if (msg.type === "CHAT_INBOX") {
          void loadRooms();
        } else if (msg.type === "CHAT_ROOM_DELETED") {
          if (msg.roomId === activeRoomIdRef.current) {
            setActiveRoomId(null);
            setMessages([]);
          }
          setRooms((prev) => prev.filter((r) => r.id !== msg.roomId));
        }
      };

      ws.onclose = () => {
        if (pingTimer) clearInterval(pingTimer);
        if (!closed) retryTimer = setTimeout(connect, 3_000);
      };
    };

    connect();
    return () => {
      closed = true;
      if (pingTimer) clearInterval(pingTimer);
      if (retryTimer) clearTimeout(retryTimer);
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [user, loadRooms]);

  // 방 선택 → 메시지 로드 + 읽음 처리 + 구독
  const selectRoom = useCallback(
    async (roomId: number) => {
      setActiveRoomId(roomId);
      setMessages([]);
      const ws = wsRef.current;
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "SUBSCRIBE", roomId }));
      }
      try {
        setMessages(await chatApi.getMessages(roomId));
        await chatApi.markRead(roomId);
        void loadRooms();
      } catch {
        /* 무시 — 목록/메시지 로드 실패는 조용히 */
      }
    },
    [loadRooms],
  );

  // 상담 직원 클릭 → DM 시작(있으면 재사용)
  const startDm = useCallback(
    async (agentId: number) => {
      try {
        setStartingId(agentId);
        const room = await chatApi.startDm(agentId);
        setRooms((prev) => (prev.some((r) => r.id === room.id) ? prev : [room, ...prev]));
        setTab("rooms");
        await selectRoom(room.id);
      } catch {
        setAgentsError("대화를 시작하지 못했습니다.");
      } finally {
        setStartingId(null);
      }
    },
    [selectRoom],
  );

  // 나가기 (대화 내용 양쪽 삭제) — 공통 ConfirmDialog로 확인
  const confirmLeave = useCallback(async () => {
    if (activeRoomId == null) return;
    try {
      setLeaving(true);
      await chatApi.leaveRoom(activeRoomId);
      setRooms((prev) => prev.filter((r) => r.id !== activeRoomId));
      setActiveRoomId(null);
      setMessages([]);
      setConfirmLeaveOpen(false);
    } catch {
      /* 무시 */
    } finally {
      setLeaving(false);
    }
  }, [activeRoomId]);

  // 메시지 전송
  const sendMessage = useCallback(
    async (content: string) => {
      if (activeRoomId == null) return;
      try {
        setSending(true);
        const saved = await chatApi.sendMessage(activeRoomId, content);
        setMessages((prev) => (prev.some((m) => m.id === saved.id) ? prev : [...prev, saved]));
        void loadRooms();
      } catch {
        /* 전송 실패 — 조용히 (재시도는 사용자가) */
      } finally {
        setSending(false);
      }
    },
    [activeRoomId, loadRooms],
  );

  return (
    <div className="flex h-[640px] overflow-hidden rounded-xl border border-border bg-background">
      {/* 사이드바 */}
      <aside className="flex w-[280px] shrink-0 flex-col border-r border-border">
        <div className="flex border-b border-border">
          {(
            [
              ["rooms", "대화"],
              ["agents", "상담 직원"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={cn(
                "flex-1 border-b-2 py-3 text-[13px] font-semibold transition-colors",
                tab === key
                  ? "border-emerald-600 text-emerald-600"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "rooms" ? (
          <RoomList
            rooms={rooms}
            activeRoomId={activeRoomId}
            loading={roomsLoading}
            error={roomsError}
            onSelect={selectRoom}
          />
        ) : (
          <AgentList
            agents={agents}
            loading={agentsLoading}
            error={agentsError}
            startingId={startingId}
            onSelect={startDm}
          />
        )}
      </aside>

      {/* 대화창 */}
      <main className="flex min-w-0 flex-1 flex-col bg-muted/10">
        {activeRoom && user ? (
          <ChatView
            room={activeRoom}
            messages={messages}
            currentUserId={user.id}
            sending={sending}
            onSend={sendMessage}
            onLeave={() => setConfirmLeaveOpen(true)}
          />
        ) : (
          <div className="flex flex-1 items-center justify-center px-6 text-center text-sm leading-6 text-muted-foreground">
            대화를 선택하거나
            <br />
            상담 직원 탭에서 대화를 시작하세요.
          </div>
        )}
      </main>

      <ConfirmDialog
        open={confirmLeaveOpen}
        title="대화 나가기"
        description="이 대화를 나가면 대화 내용이 양쪽 모두에서 삭제됩니다. 계속할까요?"
        variant="destructive"
        confirmText="나가기"
        loading={leaving}
        onConfirm={confirmLeave}
        onCancel={() => setConfirmLeaveOpen(false)}
      />
    </div>
  );
}
