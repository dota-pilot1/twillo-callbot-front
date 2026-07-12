"use client";

import Link from "next/link";
import { BotMessageSquare, CalendarCheck, MapPinned, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";
import { useIsTauri } from "@/shared/tauri/useIsTauri";
import { cn } from "@/shared/lib/utils";

const actions = [
  { href: "/booking", label: "예약", icon: CalendarCheck, primary: true },
  { href: "/chatbot", label: "상담", icon: BotMessageSquare },
  { href: "/location", label: "길찾기", icon: MapPinned },
  { href: "/services", label: "시술", icon: Sparkles },
];

export function PublicActionNav() {
  const isTauri = useIsTauri();
  const pathname = usePathname();

  if (isTauri) return null;

  return (
    <>
      <aside className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 md:block">
        <nav className="flex flex-col gap-3">
          {actions.map((action) => (
            <ActionLink
              key={action.href ?? action.label}
              action={action}
              active={!!action.href && pathname.startsWith(action.href)}
              variant="rail"
            />
          ))}
        </nav>
      </aside>

      <nav className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-4 overflow-hidden rounded-md border border-border bg-background/94 shadow-xl shadow-stone-950/15 backdrop-blur-xl md:hidden">
        {actions.map((action) => (
          <ActionLink
            key={action.href ?? action.label}
            action={action}
            active={!!action.href && pathname.startsWith(action.href)}
            variant="bottom"
          />
        ))}
      </nav>
    </>
  );
}

function ActionLink({
  action,
  active,
  variant,
}: {
  action: (typeof actions)[number];
  active: boolean;
  variant: "rail" | "bottom";
}) {
  const Icon = action.icon;
  const className = cn(
    "group flex items-center justify-center transition-all",
    variant === "rail"
      ? "h-16 w-16 flex-col gap-1 rounded-2xl border text-xs font-bold shadow-lg shadow-stone-950/10 backdrop-blur-xl hover:-translate-x-0.5"
      : "min-h-[62px] flex-col gap-1 px-1 py-2 text-[11px] font-bold",
    active
      ? "border-stone-950 bg-stone-950 text-white"
      : variant === "rail"
        ? "border-white/50 bg-white/85 text-stone-700 hover:border-stone-300 hover:text-stone-950"
        : "text-stone-600 hover:bg-stone-100 hover:text-stone-950"
  );

  const content = (
    <>
      <Icon className="h-5 w-5" />
      <span>{action.label}</span>
    </>
  );

  return (
    <Link href={action.href} className={className} aria-label={action.label}>
      {content}
    </Link>
  );
}
