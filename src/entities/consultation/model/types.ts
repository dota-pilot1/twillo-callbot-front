export type ConsultationAgentStatus =
  | "OFFLINE"
  | "AVAILABLE"
  | "RINGING"
  | "IN_CALL"
  | "AFTER_CALL"
  | "ERROR";

export type ConsultationCallDirection = "INBOUND" | "OUTBOUND";

export type ConsultationAgentStatusResponse = {
  agentId: number;
  agentName: string;
  agentIdentity: string;
  extension: string;
  status: ConsultationAgentStatus;
  statusLabel: string;
  direction: ConsultationCallDirection | null;
  phoneNumber: string | null;
  callSid: string | null;
  message: string | null;
  updatedAt: string;
};

export type ConsultationStatusSnapshotResponse = {
  type: "SNAPSHOT";
  agents: ConsultationAgentStatusResponse[];
};

export type UpdateConsultationAgentStatusRequest = {
  status: ConsultationAgentStatus;
  direction?: ConsultationCallDirection | null;
  phoneNumber?: string | null;
  callSid?: string | null;
  message?: string | null;
};
