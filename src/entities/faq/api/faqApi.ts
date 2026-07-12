import { api } from "@/shared/api/axios";

export type Faq = {
  id: number;
  category: string;
  question: string;
  answer: string;
  tags: string[];
  priority: number;
  createdAt: string;
  updatedAt: string;
};

export type FaqInput = Omit<Faq, "id" | "createdAt" | "updatedAt">;

export type FaqAnswer = {
  matched: boolean;
  faqId: number | null;
  category: string | null;
  answer: string;
};

export type UnresolvedFaqInquiry = { id: number; question: string; createdAt: string };

export const faqApi = {
  list: () => api.get<Faq[]>("/api/faqs").then((response) => response.data),
  listPublic: () => api.get<Faq[]>("/api/faqs/public").then((response) => response.data),
  ask: (question: string) =>
    api.post<FaqAnswer>("/api/faqs/ask", { question }).then((response) => response.data),
  create: (input: FaqInput) => api.post<Faq>("/api/faqs", input).then((response) => response.data),
  update: (id: number, input: FaqInput) =>
    api.put<Faq>(`/api/faqs/${id}`, input).then((response) => response.data),
  remove: (id: number) => api.delete(`/api/faqs/${id}`),
  unresolved: () =>
    api.get<UnresolvedFaqInquiry[]>("/api/faqs/unresolved").then((response) => response.data),
};
