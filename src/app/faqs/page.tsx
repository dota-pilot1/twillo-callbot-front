"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { BookOpenCheck, Download, Pencil, Plus, RefreshCw, Search, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { faqApi, type Faq, type FaqInput, type UnresolvedFaqInquiry } from "@/entities/faq/api/faqApi";
import { RequireAuth } from "@/widgets/guards/RequireAuth";
import { TagInput } from "@/shared/ui/TagInput";
import { Button } from "@/shared/ui/Button";

const emptyForm: FaqInput = { category: "예약", question: "", answer: "", tags: [], priority: 0 };

export default function FaqManagementPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [unresolved, setUnresolved] = useState<UnresolvedFaqInquiry[]>([]);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Faq | null>(null);
  const [form, setForm] = useState<FaqInput>(emptyForm);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [faqList, inquiryList] = await Promise.all([faqApi.list(), faqApi.unresolved()]);
      setFaqs(faqList);
      setUnresolved(inquiryList);
    } catch {
      toast.error("FAQ 목록을 불러오지 못했습니다. 관리자 권한을 확인해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return faqs;
    return faqs.filter((faq) => `${faq.category} ${faq.question} ${faq.answer} ${faq.tags.join(" ")}`.toLowerCase().includes(keyword));
  }, [faqs, query]);

  const startCreate = (question = "") => {
    setEditing(null);
    setForm({ ...emptyForm, question });
    setOpen(true);
  };

  const startEdit = (faq: Faq) => {
    setEditing(faq);
    setForm({ category: faq.category, question: faq.question, answer: faq.answer, tags: faq.tags, priority: faq.priority });
    setOpen(true);
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      if (editing) await faqApi.update(editing.id, form);
      else await faqApi.create(form);
      toast.success(editing ? "FAQ를 수정했습니다." : "FAQ를 등록했습니다.");
      setOpen(false);
      await load();
    } catch {
      toast.error("FAQ를 저장하지 못했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (faq: Faq) => {
    if (!window.confirm(`‘${faq.question}’ FAQ를 삭제할까요?`)) return;
    try {
      await faqApi.remove(faq.id);
      toast.success("FAQ를 삭제했습니다.");
      await load();
    } catch { toast.error("FAQ를 삭제하지 못했습니다."); }
  };

  return (
    <RequireAuth>
      <main className="mx-auto w-full max-w-6xl px-4 py-8 lg:px-6">
        <header className="flex flex-col justify-between gap-4 border-b border-border pb-6 sm:flex-row sm:items-end">
          <div>
            <p className="flex items-center gap-2 text-sm font-bold text-emerald-600"><BookOpenCheck className="h-4 w-4" /> 상담 지식</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight">FAQ 관리</h1>
            <p className="mt-2 text-sm text-muted-foreground">웹 챗봇과 상담원 앱이 함께 사용하는 답변 원본입니다.</p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="secondary"><a href="/templates/faq-import-template.xlsx" download><Download className="h-4 w-4" /> 엑셀 템플릿</a></Button>
            <Button variant="secondary" onClick={() => void load()}><RefreshCw className="h-4 w-4" /> 새로고침</Button>
            <Button onClick={() => startCreate()}><Plus className="h-4 w-4" /> FAQ 등록</Button>
          </div>
        </header>

        <section className="mt-6 grid gap-5 lg:grid-cols-[1fr_320px]">
          <div>
            <label className="flex h-11 items-center gap-2 rounded-md border border-input bg-background px-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="질문, 답변, 키워드 검색" className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
            </label>
            <div className="mt-3 space-y-3">
              {loading && <p className="rounded-lg border border-border p-8 text-center text-sm text-muted-foreground">FAQ를 불러오고 있습니다.</p>}
              {!loading && filtered.length === 0 && <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">등록된 FAQ가 없습니다. 첫 FAQ를 등록해 주세요.</p>}
              {filtered.map((faq) => (
                <article key={faq.id} className="rounded-lg border border-border bg-card p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                        <span className="rounded-full bg-muted px-2.5 py-1">{faq.category}</span>
                      </div>
                      <h2 className="mt-3 font-extrabold">{faq.question}</h2>
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{faq.answer}</p>
                      {faq.tags.length > 0 && <div className="mt-3 flex flex-wrap gap-1.5">{faq.tags.map((tag) => <span key={tag} className="rounded-md bg-muted px-2 py-1 text-[11px] font-bold text-muted-foreground">#{tag}</span>)}</div>}
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <Button variant="ghost" size="icon" aria-label="수정" onClick={() => startEdit(faq)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="danger" size="icon" aria-label="삭제" onClick={() => void remove(faq)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="h-fit rounded-lg border border-border bg-card p-5 lg:sticky lg:top-20">
            <h2 className="font-extrabold">답변하지 못한 질문</h2>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">챗봇이 FAQ 근거를 찾지 못한 최근 질문입니다.</p>
            <div className="mt-4 space-y-2">
              {unresolved.length === 0 && <p className="rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">아직 미응답 질문이 없습니다.</p>}
              {unresolved.map((item) => (
                <button key={item.id} onClick={() => startCreate(item.question)} className="w-full rounded-md border border-border p-3 text-left hover:bg-accent">
                  <span className="block text-sm font-bold">{item.question}</span>
                  <span className="mt-1 block text-[11px] text-muted-foreground">FAQ 후보로 등록</span>
                </button>
              ))}
            </div>
          </aside>
        </section>
      </main>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-4" role="dialog" aria-modal="true">
          <form onSubmit={save} className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-border bg-background p-6 shadow-2xl">
            <div className="flex items-center justify-between"><h2 className="text-xl font-black">{editing ? "FAQ 수정" : "FAQ 등록"}</h2><Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="닫기"><X className="h-5 w-5" /></Button></div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="카테고리"><input required maxLength={100} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="field" /></Field>
              <Field label="검색 태그"><TagInput value={form.tags} onChange={(tags) => setForm({ ...form, tags })} placeholder="주차, 교통 입력 후 Enter" /></Field>
              <div className="sm:col-span-2"><Field label="대표 질문"><input required maxLength={500} value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} className="field" /></Field></div>
              <div className="sm:col-span-2"><Field label="승인된 답변"><textarea required rows={6} maxLength={10000} value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} className="field h-auto resize-y py-2" /></Field></div>
            </div>
            <div className="mt-6 flex justify-end gap-2"><Button variant="secondary" onClick={() => setOpen(false)}>취소</Button><Button type="submit" disabled={saving}>{saving ? "저장 중" : "저장"}</Button></div>
          </form>
        </div>
      )}
    </RequireAuth>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block"><span className="mb-1.5 block text-xs font-bold">{label}</span>{children}</label>; }
