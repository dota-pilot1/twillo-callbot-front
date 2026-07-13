// 서버 com.cj.beautybook.chat 의 DTO와 1:1 대응

export type ChatCounterpart = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export type ChatRoom = {
  id: number;
  counterpart: ChatCounterpart;
  lastMessagePreview: string | null;
  lastMessageAt: string | null;
  messageCount: number;
  unread: number;
};

export type ChatMessageType = "TEXT" | "IMAGE" | "SYSTEM";

export type ChatMessage = {
  id: number;
  roomId: number;
  senderId: number;
  senderName: string;
  content: string;
  messageType: ChatMessageType;
  payload: string | null;
  createdAt: string;
};

export type ChatAgent = {
  id: number;
  name: string;
  role: string;
  online: boolean;
};

export type RoomUnread = {
  roomId: number;
  unread: number;
};

// WebSocket 서버→클라 이벤트
export type ChatWsEvent =
  | { type: "CHAT_MESSAGE"; roomId: number; data: ChatMessage }
  | { type: "CHAT_INBOX"; roomId: number; data: ChatMessage }
  | { type: "CHAT_ROOM_DELETED"; roomId: number }
  | { type: "PONG" };
