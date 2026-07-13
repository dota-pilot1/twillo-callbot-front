"use client";

import { useEffect } from "react";
import { useAuth } from "@/entities/user/model/authStore";
import { createConsultationStatusWebSocket } from "@/entities/consultation/api/consultationApi";

/**
 * 로그인 상태인 동안 상담 상태 WebSocket을 앱 전역에서 상시 연결한다.
 * 이 연결 자체가 "상담원 온라인(접속)" presence 신호가 된다.
 * 어느 화면에 있든 앱이 켜져 있으면 온라인, 앱을 닫거나 로그아웃하면 오프라인.
 */
export function PresenceConnector() {
  const { status } = useAuth();

  useEffect(() => {
    if (status !== "authenticated") return;

    let closed = false;
    let socket: WebSocket | null = null;
    let reconnectTimer: number | null = null;
    let pingTimer: number | null = null;

    const clearTimers = () => {
      if (reconnectTimer !== null) window.clearTimeout(reconnectTimer);
      if (pingTimer !== null) window.clearInterval(pingTimer);
      reconnectTimer = null;
      pingTimer = null;
    };

    const connect = () => {
      socket = createConsultationStatusWebSocket();
      if (!socket) return;

      socket.onopen = () => {
        // Cloud Run 유휴 종료 방지용 keepalive ping (서버는 pong 응답)
        pingTimer = window.setInterval(() => {
          if (socket?.readyState === WebSocket.OPEN) socket.send("ping");
        }, 25000);
      };
      socket.onclose = () => {
        if (pingTimer !== null) window.clearInterval(pingTimer);
        pingTimer = null;
        if (closed) return;
        reconnectTimer = window.setTimeout(connect, 3000);
      };
      socket.onerror = () => {
        socket?.close();
      };
    };

    connect();

    return () => {
      closed = true;
      clearTimers();
      socket?.close();
    };
  }, [status]);

  return null;
}
