import { api } from "@/shared/api/axios";
import { tokenStorage } from "@/shared/api/tokenStorage";
import { getApiBaseUrl } from "@/shared/api/apiEnvironment";
import type { ChatAgent, ChatMessage, ChatRoom, RoomUnread } from "../model/types";

export const chatApi = {
  listRooms: () => api.get<ChatRoom[]>("/api/chat/rooms").then((r) => r.data),

  startDm: (otherUserId: number) =>
    api.post<ChatRoom>("/api/chat/dms", { otherUserId }).then((r) => r.data),

  getMessages: (roomId: number, limit = 100) =>
    api
      .get<ChatMessage[]>(`/api/chat/rooms/${roomId}/messages`, { params: { limit } })
      .then((r) => r.data),

  sendMessage: (roomId: number, content: string) =>
    api
      .post<ChatMessage>(`/api/chat/rooms/${roomId}/messages`, { content })
      .then((r) => r.data),

  markRead: (roomId: number) =>
    api.post<void>(`/api/chat/rooms/${roomId}/read`).then((r) => r.data),

  leaveRoom: (roomId: number) =>
    api.post<void>(`/api/chat/rooms/${roomId}/leave`).then((r) => r.data),

  unreadCounts: () => api.get<RoomUnread[]>("/api/chat/unread-counts").then((r) => r.data),

  listAgents: () => api.get<ChatAgent[]>("/api/chat/agents").then((r) => r.data),
};

// 실시간 수신용 WebSocket. consultation-status 와 동일하게 ?access_token= 로 인증.
export function createChatWebSocket(): WebSocket | null {
  const token = tokenStorage.getAccess();
  if (!token) return null;

  const url = new URL("/ws/chat", getApiBaseUrl());
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  url.searchParams.set("access_token", token);
  return new WebSocket(url.toString());
}
