"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/entities/user/model/authStore";
import { api } from "@/shared/api/axios";
import { tokenStorage } from "@/shared/api/tokenStorage";
import { ConfirmDialog } from "@/shared/ui/ConfirmDialog";
import { toast, toastError } from "@/shared/lib/toast";
import { Phone, PhoneCall, PhoneIncoming, CheckCircle, HelpCircle, Loader2, AlertCircle, Volume2, List, Trash2, X, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface CallbotConsoleConfig {
  /** outbound: 우리가 거는 발신 콘솔 / inbound: 고객이 거는 수신 안내 콘솔 */
  variant: "outbound" | "inbound";
  /** 상단 큰 제목 */
  pageTitle: string;
  /** 제목 아래 설명 문구 */
  pageSubtitle: string;
  /** 좌측 카드 제목 */
  formTitle: string;
  /** 발신 기록 섹션 제목 */
  recentLogsTitle: string;
  /** [outbound] 발신 버튼 라벨 */
  submitLabel?: string;
  /** [outbound] 메시지 textarea 기본값 */
  defaultMessage?: string;
  /** [inbound] 고객이 전화 거는 매장 대표번호 (안내용) */
  dialInNumber?: string;
  /** [inbound] 번호 아래 거는 방법 안내 (국제전화 등) */
  dialHint?: string;
}

interface CallLog {
  sid: string;
  toNumber: string;
  message: string;
  timestamp: string;
  status: CallStatus;
  selectedDigit?: string | null;
  recordingS3Url?: string | null;
  recordingDurationSeconds?: number | null;
  recordingStatus?: string | null;
  recordingTranscript?: string | null;
  recordingSummary?: string | null;
  recordingSummaryStatus?: string | null;
  summarizedAt?: string | null;
  createdAt: string;
}

type CallStatus =
  | "queued"
  | "initiated"
  | "ringing"
  | "in-progress"
  | "answered"
  | "completed"
  | "busy"
  | "failed"
  | "no-answer"
  | "canceled"
  | "unknown";

interface CallStatusResponse {
  callSid: string;
  status: CallStatus;
  selectedDigit?: string | null;
}

interface CallLogResponse {
  callSid: string;
  toNumber: string;
  message: string;
  status: CallStatus;
  selectedDigit?: string | null;
  recordingS3Url?: string | null;
  recordingDurationSeconds?: number | null;
  recordingStatus?: string | null;
  recordingTranscript?: string | null;
  recordingSummary?: string | null;
  recordingSummaryStatus?: string | null;
  summarizedAt?: string | null;
  createdAt: string;
}

interface RecordingSummaryResponse {
  callSid: string;
  status: string;
  transcript?: string | null;
  summary?: string | null;
  summarizedAt?: string | null;
}

const TERMINAL_CALL_STATUSES: CallStatus[] = ["completed", "busy", "failed", "no-answer", "canceled"];

const callStatusLabels: Record<CallStatus, string> = {
  queued: "대기 중",
  initiated: "발신 시작",
  ringing: "벨 울림",
  "in-progress": "통화 진행 중",
  answered: "응답됨",
  completed: "통화 종료",
  busy: "통화 중",
  failed: "실패",
  "no-answer": "무응답",
  canceled: "취소됨",
  unknown: "상태 확인 중",
};

const callOptionLabels: Record<string, string> = {
  "1": "예약 녹음",
  "2": "예약 링크·디자이너 번호 문자",
  "3": "미용실 소개·위치 문자",
  "4": "프로모션 안내",
  "5": "미용실 소개 및 영업 시간 안내",
};

function formatSelectedOption(selectedDigit?: string | null) {
  if (!selectedDigit) {
    return "미선택";
  }
  return `${selectedDigit}번 · ${callOptionLabels[selectedDigit] ?? "알 수 없는 선택"}`;
}

function formatCallTimestamp(value: string) {
  return new Date(value).toLocaleTimeString("ko-KR", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function CallbotConsole({ config }: { config: CallbotConsoleConfig }) {
  const { user } = useAuth();
  const isAdmin = user?.role?.code === "ROLE_ADMIN";
  const [toNumber, setToNumber] = useState("");
  const [message, setMessage] = useState(config.defaultMessage ?? "");
  const [loading, setLoading] = useState(false);
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [allCallLogs, setAllCallLogs] = useState<CallLog[]>([]);
  const [activeCallSid, setActiveCallSid] = useState<string | null>(null);
  const [activeCallStatus, setActiveCallStatus] = useState<CallStatus>("unknown");
  const [allLogsOpen, setAllLogsOpen] = useState(false);
  const [allLogsLoading, setAllLogsLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CallLog | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [summaryTarget, setSummaryTarget] = useState<CallLog | null>(null);
  const [summaryLoadingSid, setSummaryLoadingSid] = useState<string | null>(null);

  const mapCallLog = (log: CallLogResponse): CallLog => ({
    sid: log.callSid,
    toNumber: log.toNumber,
    message: log.message,
    timestamp: formatCallTimestamp(log.createdAt),
    status: log.status ?? "unknown",
    selectedDigit: log.selectedDigit,
    recordingS3Url: log.recordingS3Url,
    recordingDurationSeconds: log.recordingDurationSeconds,
    recordingStatus: log.recordingStatus,
    recordingTranscript: log.recordingTranscript,
    recordingSummary: log.recordingSummary,
    recordingSummaryStatus: log.recordingSummaryStatus,
    summarizedAt: log.summarizedAt,
    createdAt: log.createdAt,
  });

  const direction = config.variant === "inbound" ? "inbound" : "outbound";

  const loadCallLogs = useCallback(async () => {
    try {
      const response = await api.get<CallLogResponse[]>("/api/v1/callbot/calls", {
        params: { direction },
      });
      setCallLogs(response.data.map(mapCallLog));
    } catch (err) {
      console.error("Failed to load call logs", err);
    }
  }, [direction]);

  const loadAllCallLogs = useCallback(async () => {
    setAllLogsLoading(true);
    try {
      const response = await api.get<CallLogResponse[]>("/api/v1/callbot/calls/all", {
        params: { direction },
      });
      setAllCallLogs(response.data.map(mapCallLog));
    } catch (err) {
      toastError(err, "전체 통화 기록을 불러오지 못했습니다.");
    } finally {
      setAllLogsLoading(false);
    }
  }, [direction]);

  useEffect(() => {
    void loadCallLogs();
  }, [loadCallLogs]);

  const applyCallStatus = useCallback((response: CallStatusResponse) => {
    const callSid = response.callSid;
    const nextStatus = response.status ?? "unknown";

    setActiveCallStatus(nextStatus);
    setCallLogs((prev) =>
      prev.map((log) =>
        log.sid === callSid
          ? {
              ...log,
              status: nextStatus,
              selectedDigit: response.selectedDigit ?? log.selectedDigit,
            }
          : log
      )
    );

    if (TERMINAL_CALL_STATUSES.includes(nextStatus)) {
      setActiveCallSid(null);
      [700, 1800, 3500].forEach((delay) => {
        window.setTimeout(() => {
          void loadCallLogs();
        }, delay);
      });
    }
  }, [loadCallLogs]);

  const openAllLogs = () => {
    setAllLogsOpen(true);
    void loadAllCallLogs();
  };

  const handleDeleteCallLog = async () => {
    if (!deleteTarget) {
      return;
    }
    setDeleting(true);
    try {
      await api.delete(`/api/v1/callbot/calls/${deleteTarget.sid}`);
      toast.success("발신 기록을 삭제했습니다.");
      setDeleteTarget(null);
      setCallLogs((prev) => prev.filter((log) => log.sid !== deleteTarget.sid));
      setAllCallLogs((prev) => prev.filter((log) => log.sid !== deleteTarget.sid));
      if (activeCallSid === deleteTarget.sid) {
        setActiveCallSid(null);
      }
      void loadCallLogs();
    } catch (err) {
      toastError(err, "발신 기록 삭제에 실패했습니다.");
    } finally {
      setDeleting(false);
    }
  };

  const handleSummarizeRecording = async (log: CallLog) => {
    if (log.recordingSummaryStatus === "completed" && log.recordingTranscript && log.recordingSummary) {
      setSummaryTarget(log);
      return;
    }

    setSummaryLoadingSid(log.sid);
    try {
      const response = await api.post<RecordingSummaryResponse>(`/api/v1/callbot/calls/${log.sid}/summary`);
      const updatedLog: CallLog = {
        ...log,
        recordingTranscript: response.data.transcript,
        recordingSummary: response.data.summary,
        recordingSummaryStatus: response.data.status,
        summarizedAt: response.data.summarizedAt,
      };
      setCallLogs((prev) => prev.map((item) => item.sid === log.sid ? updatedLog : item));
      setAllCallLogs((prev) => prev.map((item) => item.sid === log.sid ? updatedLog : item));
      setSummaryTarget(updatedLog);
      toast.success("녹음 요약이 완료되었습니다.");
    } catch (err) {
      toastError(err, "녹음 문자 변환에 실패했습니다.");
      void loadCallLogs();
      if (allLogsOpen) {
        void loadAllCallLogs();
      }
    } finally {
      setSummaryLoadingSid(null);
    }
  };

  // Phone number formatter: 01012345678 -> 010-1234-5678
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/[^0-9]/g, "");
    if (rawVal.length <= 3) {
      setToNumber(rawVal);
    } else if (rawVal.length <= 7) {
      setToNumber(`${rawVal.slice(0, 3)}-${rawVal.slice(3)}`);
    } else {
      setToNumber(`${rawVal.slice(0, 3)}-${rawVal.slice(3, 7)}-${rawVal.slice(7, 11)}`);
    }
  };

  // Convert local formatted number to E.164 (e.g. 010-1234-5678 -> +821012345678)
  const toE164 = (numStr: string) => {
    const cleaned = numStr.replace(/[^0-9]/g, "");
    if (cleaned.startsWith("0")) {
      return `+82${cleaned.slice(1)}`;
    }
    return `+${cleaned}`;
  };

  const handleMakeCall = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!toNumber) {
      toast.error("수신자 전화번호를 입력해 주세요.");
      return;
    }
    if (!message) {
      toast.error("전화 수신 시 재생할 메시지를 입력해 주세요.");
      return;
    }

    const e164Number = toE164(toNumber);
    setLoading(true);

    try {
      const response = await api.post<string>("/api/v1/callbot/make-call", {
        toNumber: e164Number,
        message,
      });

      const callSid = response.data;
      toast.success("Twilio 서버로 자동 전화를 성공적으로 발신했습니다!");

      const newLog: CallLog = {
        sid: callSid,
        toNumber: e164Number,
        message,
        timestamp: new Date().toLocaleTimeString(),
        status: "initiated",
        selectedDigit: null,
        recordingS3Url: null,
        recordingDurationSeconds: null,
        recordingStatus: null,
        recordingTranscript: null,
        recordingSummary: null,
        recordingSummaryStatus: null,
        summarizedAt: null,
        createdAt: new Date().toISOString(),
      };

      setCallLogs((prev) => [newLog, ...prev]);
      setActiveCallSid(callSid);
      setActiveCallStatus("initiated");
    } catch (err: unknown) {
      toastError(err, "전화 발신에 실패했습니다. 백엔드 서버나 .env 설정을 확인해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!activeCallSid) {
      return;
    }

    const abortController = new AbortController();

    const handleStatusResponse = (response: CallStatusResponse) => {
      applyCallStatus(response);
    };

    const streamCallStatus = async () => {
      try {
        const token = tokenStorage.getAccess();
        const baseUrl = api.defaults.baseURL ?? "";
        const response = await fetch(`${baseUrl}/api/v1/callbot/calls/${activeCallSid}/status-stream`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          signal: abortController.signal,
        });

        if (!response.ok || !response.body) {
          throw new Error(`status stream failed: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (!abortController.signal.aborted) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const events = buffer.split("\n\n");
          buffer = events.pop() ?? "";

          for (const event of events) {
            const dataLine = event
              .split("\n")
              .find((line) => line.startsWith("data:"));

            if (!dataLine) continue;
            handleStatusResponse(JSON.parse(dataLine.slice(5).trim()) as CallStatusResponse);
          }
        }
      } catch (err) {
        if (!abortController.signal.aborted) {
          console.error("Failed to stream call status", err);
          const response = await api.get<CallStatusResponse>(`/api/v1/callbot/calls/${activeCallSid}/status`);
          handleStatusResponse(response.data);
        }
      }
    };

    streamCallStatus();
    return () => abortController.abort();
  }, [activeCallSid, applyCallStatus]);

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl min-h-[calc(100vh-3.5rem)]">
      {/* Header section with modern gradient */}
      <div className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
            {config.pageTitle}
          </h1>
          <p className="text-muted-foreground mt-2">
            {config.pageSubtitle}
          </p>
        </div>
        <div className="flex items-center gap-2 self-center md:self-auto bg-card px-4 py-2 rounded-full border border-border shadow-sm">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-muted-foreground">서버 연동 상태 양호</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Panel */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-card rounded-2xl border border-border p-6 shadow-md transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                {config.variant === "inbound" ? (
                  <PhoneIncoming className="h-5 w-5" />
                ) : (
                  <PhoneCall className="h-5 w-5" />
                )}
              </div>
              <h2 className="text-xl font-bold">{config.formTitle}</h2>
            </div>

            {config.variant === "inbound" ? (
              <div className="space-y-5">
                <div className="rounded-xl border border-border bg-background p-5 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    예약 문의 대표번호
                  </p>
                  <a
                    href={`tel:${(config.dialInNumber ?? "").replace(/[^\d+]/g, "")}`}
                    className="mt-2 block text-2xl font-extrabold tracking-wider text-foreground select-all hover:text-primary hover:underline"
                  >
                    {config.dialInNumber ?? "매장 번호 미설정"}
                  </a>
                  <p className="mt-2 text-xs text-muted-foreground">
                    1번 예약 녹음, 2번 예약 링크, 3번 매장 안내 문자입니다.
                  </p>
                  {config.dialHint && (
                    <p className="mt-3 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs leading-relaxed text-amber-700 dark:text-amber-300">
                      {config.dialHint}
                    </p>
                  )}
                </div>
                <div className="rounded-xl bg-muted/30 p-4 text-sm leading-relaxed text-muted-foreground">
                  <p className="font-semibold text-foreground mb-3">예약 전화 메뉴</p>
                  <ol className="space-y-2 list-decimal list-inside">
                    <li>고객이 대표번호로 전화</li>
                    <li><strong>1번</strong> 예약 희망 일시·시술·성함 녹음</li>
                    <li><strong>2번</strong> 예약 홈페이지·오현석 디자이너 번호 문자</li>
                    <li><strong>3번</strong> 미용실 소개·위치 정보 문자</li>
                    <li>아래 기록에서 녹음·요약 확인</li>
                  </ol>
                </div>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <AlertCircle className="h-3.5 w-3.5" />
                  이 화면은 고객이 남긴 예약 녹음을 확인하는 곳입니다.
                </p>
              </div>
            ) : (
            <form onSubmit={handleMakeCall} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2 text-muted-foreground">
                  수신자 전화번호
                </label>
                <div className="flex rounded-xl border border-border bg-background overflow-hidden focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                  <span className="flex items-center gap-1.5 px-4 border-r border-border bg-muted/70 text-sm font-bold text-card-foreground shrink-0">
                    <span aria-hidden="true">🇰🇷</span>
                    <span>+82</span>
                  </span>
                  <input
                    type="text"
                    value={toNumber}
                    onChange={handlePhoneChange}
                    placeholder="010-1234-5678"
                    className="min-w-0 flex-1 px-4 py-3 bg-background focus:outline-none text-base font-semibold tracking-wider"
                    maxLength={13}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  트라이얼 계정은 인증된 본인 번호로만 발신이 제한될 수 있습니다.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-muted-foreground">
                  전달할 음성 안내 메시지 (TTS)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="고객이 전화를 받았을 때 한국어 음성(TTS)으로 자동으로 들려줄 메시지를 작성해 주세요."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/95 transition-all shadow-md shadow-primary/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>전화 발신 처리 중...</span>
                  </>
                ) : (
                  <>
                    <Phone className="h-5 w-5 group-hover:animate-bounce" />
                    <span>{config.submitLabel}</span>
                  </>
                )}
              </button>
            </form>
            )}
          </div>

          {/* Quick Guide Card */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
                <HelpCircle className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold">로컬 테스트 체크</h2>
            </div>
            <div className="text-sm space-y-3.5 leading-relaxed text-muted-foreground">
              <div className="flex gap-2">
                <span className="flex items-center justify-center h-5 w-5 rounded-full bg-indigo-500/10 text-indigo-500 font-bold text-xs shrink-0 mt-0.5">1</span>
                <div>
                  <strong>백엔드 실행</strong>
                  <p className="text-xs mt-0.5">서버를 <code className="px-1.5 py-0.5 bg-muted rounded text-primary font-mono text-[10px]">4101</code> 포트로 켭니다.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="flex items-center justify-center h-5 w-5 rounded-full bg-indigo-500/10 text-indigo-500 font-bold text-xs shrink-0 mt-0.5">2</span>
                <div>
                  <strong>ngrok 연결</strong>
                  <p className="text-xs mt-0.5"><code className="px-1.5 py-0.5 bg-muted rounded text-primary font-mono text-[10px]">ngrok http 4101</code> 실행 후 공개 URL을 준비합니다.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="flex items-center justify-center h-5 w-5 rounded-full bg-indigo-500/10 text-indigo-500 font-bold text-xs shrink-0 mt-0.5">3</span>
                <div>
                  <strong>Twilio 웹훅 저장</strong>
                  <p className="text-xs mt-0.5">Voice Webhook URL을 <code className="px-1.5 py-0.5 bg-muted rounded text-primary font-mono text-[10px]">https://[ngrok].ngrok-free.app/api/v1/callbot/webhook/inbound</code>로 설정합니다.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Active status and logs */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Active Call Live Status Monitor */}
          <AnimatePresence>
            {activeCallSid && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-6 shadow-md relative overflow-hidden"
              >
                <div className="absolute right-[-20px] bottom-[-20px] text-emerald-500/10 shrink-0">
                  <Volume2 className="h-32 w-32" />
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    Live Call Status
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                    {callStatusLabels[activeCallStatus]}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-emerald-200">실시간 통화 {callStatusLabels[activeCallStatus]}</h3>
                <p className="text-xs text-emerald-400 font-mono mt-1 select-all">SID: {activeCallSid}</p>

                {/* Animated Soundwave */}
                <div className="flex items-center justify-center gap-1 my-6 h-8">
                  {[...Array(9)].map((_, i) => (
                    <span
                      key={i}
                      className="w-1.5 bg-emerald-500 rounded-full animate-pulse"
                      style={{
                        height: `${[40, 90, 60, 100, 30, 80, 50, 90, 40][i]}%`,
                        animationDuration: `${[1.2, 0.8, 1.4, 0.6, 1.5, 0.9, 1.3, 0.7, 1.1][i]}s`,
                      }}
                    />
                  ))}
                </div>

                <div className="space-y-2.5">
                  <p className="text-xs text-emerald-300 leading-relaxed bg-emerald-500/5 p-3 rounded-lg border border-emerald-500/10">
                    <strong>재생 중인 시나리오:</strong> <br />
                    {callLogs.find((l) => l.sid === activeCallSid)?.message}
                  </p>
                  <p className="text-xs text-emerald-300 leading-relaxed bg-emerald-500/5 p-3 rounded-lg border border-emerald-500/10">
                    <strong>고객 선택:</strong> {formatSelectedOption(callLogs.find((l) => l.sid === activeCallSid)?.selectedDigit)}
                  </p>
                  <button
                    onClick={() => setActiveCallSid(null)}
                    className="w-full py-1.5 rounded-lg border border-emerald-500/20 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/10 transition-colors"
                  >
                    모니터창 닫기
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Call Logs History */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-md flex-1 flex flex-col min-h-[350px]">
            <div className="flex items-center justify-between gap-3 mb-4 border-b border-border pb-3">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-muted-foreground" />
                {config.recentLogsTitle}
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-semibold">
                  총 {callLogs.length}건
                </span>
                <button
                  type="button"
                  onClick={openAllLogs}
                  className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-accent"
                >
                  <List className="h-3.5 w-3.5" />
                  전체 보기
                </button>
              </div>
            </div>

            {callLogs.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <Volume2 className="h-10 w-10 text-muted-foreground/30 mb-3" />
                <p className="text-sm font-medium text-muted-foreground">통화 내역이 없습니다.</p>
                <p className="text-xs text-muted-foreground/75 mt-1">
                  {config.variant === "inbound"
                    ? "고객이 대표번호로 전화해 예약을 남기면 여기에 표시됩니다."
                    : "상단의 발신 폼을 통해 첫 통화를 걸어보세요!"}
                </p>
              </div>
            ) : (
              <div className="space-y-3.5 overflow-y-auto max-h-[400px] flex-1 pr-1">
                {callLogs.map((log) => (
                  <CallLogCard
                    key={log.sid}
                    log={log}
                    isAdmin={isAdmin}
                    onDelete={() => setDeleteTarget(log)}
                    onSummarize={() => void handleSummarizeRecording(log)}
                    summarizing={summaryLoadingSid === log.sid}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <CallLogsDialog
        open={allLogsOpen}
        logs={allCallLogs}
        loading={allLogsLoading}
        isAdmin={isAdmin}
        onClose={() => setAllLogsOpen(false)}
        onRefresh={loadAllCallLogs}
        onDelete={(log) => setDeleteTarget(log)}
        onSummarize={(log) => void handleSummarizeRecording(log)}
        summaryLoadingSid={summaryLoadingSid}
      />

      <RecordingSummaryDialog
        log={summaryTarget}
        onClose={() => setSummaryTarget(null)}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="발신 기록을 삭제할까요?"
        description={deleteTarget ? `${deleteTarget.toNumber}\nSID: ${deleteTarget.sid}\n연결된 녹음 파일도 함께 삭제를 시도합니다.` : undefined}
        confirmText="삭제"
        cancelText="취소"
        variant="destructive"
        loading={deleting}
        onConfirm={handleDeleteCallLog}
        onCancel={() => !deleting && setDeleteTarget(null)}
      />
    </main>
  );
}

function CallLogCard({
  log,
  isAdmin,
  onDelete,
  onSummarize,
  summarizing,
}: {
  log: CallLog;
  isAdmin: boolean;
  onDelete: () => void;
  onSummarize: () => void;
  summarizing: boolean;
}) {
  return (
    <div className="p-3.5 rounded-xl border border-border bg-background/50 text-xs flex flex-col gap-2 hover:border-primary/20 transition-colors">
      <div className="flex items-center justify-between gap-2">
        <span className="font-bold tracking-wider text-card-foreground">
          {log.toNumber}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground font-mono">
            {log.timestamp}
          </span>
          {isAdmin && (
            <button
              type="button"
              onClick={onDelete}
              aria-label="발신 기록 삭제"
              className="inline-flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
      <p className="text-muted-foreground leading-relaxed italic bg-muted/40 p-2 rounded">
        &ldquo;{log.message}&rdquo;
      </p>
      <div className="flex items-center justify-between rounded-lg bg-muted/30 px-2 py-1.5">
        <span className="text-muted-foreground">고객 선택</span>
        <span className="font-semibold text-card-foreground">
          {formatSelectedOption(log.selectedDigit)}
        </span>
      </div>
      {log.selectedDigit === "1" && (
        <div className="rounded-lg bg-muted/30 px-2 py-2">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-muted-foreground">녹음</span>
            <span className="font-semibold text-card-foreground">
              {log.recordingS3Url
                ? `${log.recordingDurationSeconds ?? "-"}초`
                : log.recordingStatus === "failed"
                  ? "저장 실패"
                  : "저장 대기"}
            </span>
          </div>
          {log.recordingS3Url && (
            <div className="space-y-2">
              <audio
                controls
                preload="none"
                src={log.recordingS3Url}
                className="h-9 w-full"
              >
                녹음 파일을 재생할 수 없습니다.
              </audio>
              {isAdmin && (
                <button
                  type="button"
                  onClick={onSummarize}
                  disabled={summarizing}
                  className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-2.5 text-xs font-semibold transition-colors hover:bg-accent disabled:opacity-60"
                >
                  {summarizing ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <FileText className="h-3.5 w-3.5" />
                  )}
                  {summarizing
                    ? "요약 중..."
                    : log.recordingSummaryStatus === "completed"
                      ? "요약 보기"
                      : log.recordingSummaryStatus === "failed"
                        ? "재시도"
                        : "요약"}
                </button>
              )}
            </div>
          )}
        </div>
      )}
      <div className="flex items-center justify-between mt-1 text-[10px] text-muted-foreground font-mono">
        <span className="truncate max-w-[150px]">SID: {log.sid}</span>
        <span className="font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
          {callStatusLabels[log.status]}
        </span>
      </div>
    </div>
  );
}

function CallLogsDialog({
  open,
  logs,
  loading,
  isAdmin,
  onClose,
  onRefresh,
  onDelete,
  onSummarize,
  summaryLoadingSid,
}: {
  open: boolean;
  logs: CallLog[];
  loading: boolean;
  isAdmin: boolean;
  onClose: () => void;
  onRefresh: () => void;
  onDelete: (log: CallLog) => void;
  onSummarize: (log: CallLog) => void;
  summaryLoadingSid: string | null;
}) {
  if (!open) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="call-logs-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[86vh] w-full max-w-5xl flex-col rounded-lg border border-border bg-background shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 id="call-logs-dialog-title" className="text-lg font-bold">
              전체 발신 기록
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">총 {logs.length}건</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onRefresh}
              disabled={loading}
              className="h-8 rounded-md border border-border px-3 text-xs font-semibold transition-colors hover:bg-accent disabled:opacity-60"
            >
              {loading ? "불러오는 중" : "새로고침"}
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="전체 기록 닫기"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border transition-colors hover:bg-accent"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          {loading && logs.length === 0 ? (
            <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
              전체 기록을 불러오는 중입니다.
            </div>
          ) : logs.length === 0 ? (
            <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
              발신 기록이 없습니다.
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {logs.map((log) => (
                <CallLogCard
                  key={log.sid}
                  log={log}
                  isAdmin={isAdmin}
                  onDelete={() => onDelete(log)}
                  onSummarize={() => onSummarize(log)}
                  summarizing={summaryLoadingSid === log.sid}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RecordingSummaryDialog({
  log,
  onClose,
}: {
  log: CallLog | null;
  onClose: () => void;
}) {
  if (!log) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="recording-summary-dialog-title"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/45 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[84vh] w-full max-w-2xl flex-col rounded-lg border border-border bg-background shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 id="recording-summary-dialog-title" className="text-lg font-bold">
              녹음 문자 변환
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {log.toNumber} · {log.timestamp}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="요약 닫기"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border transition-colors hover:bg-accent"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
          <section>
            <h3 className="text-sm font-bold">예약 문의 요약</h3>
            <pre className="mt-2 whitespace-pre-wrap rounded-lg border border-border bg-muted/30 p-3 text-sm leading-6 text-foreground">
              {log.recordingSummary || "요약 결과가 없습니다."}
            </pre>
          </section>
          <section>
            <h3 className="text-sm font-bold">전체 내용</h3>
            <pre className="mt-2 whitespace-pre-wrap rounded-lg border border-border bg-muted/30 p-3 text-sm leading-6 text-muted-foreground">
              {log.recordingTranscript || "문자 변환 결과가 없습니다."}
            </pre>
          </section>
        </div>
      </div>
    </div>
  );
}
