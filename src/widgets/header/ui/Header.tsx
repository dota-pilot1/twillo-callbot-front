"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ClipboardCheck,
  Headset,
  LogIn,
  LogOut,
  Menu,
  PhoneCall,
  PhoneIncoming,
  Radio,
  Settings,
  UserCircle,
  UserPlus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { authActions, useAuth } from "@/entities/user/model/authStore";
import { LanguageSelect } from "@/shared/ui/LanguageSelect";
import { ThemeSwitcher } from "@/shared/ui/theme/ThemeSwitcher";
import { cn } from "@/shared/lib/utils";
import { WindowControls } from "./WindowControls";

type SidebarItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
};

const navItems: SidebarItem[] = [
  { href: "/softphone", label: "소프트폰", icon: PhoneIncoming, exact: true },
  { href: "/dashboard", label: "안내", icon: ClipboardCheck, exact: true },
  { href: "/consultation", label: "전화 걸기", icon: PhoneCall, exact: true },
  { href: "/consultation-management", label: "상담 관리", icon: Radio },
];

const adminItems: SidebarItem[] = [
  { href: "/menu-management", label: "설정", icon: Settings },
];

function UserAvatar({ name }: { name: string }) {
  const initials = (name ?? "?").slice(0, 2).toUpperCase();
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
      {initials}
    </span>
  );
}

function SidebarLink({ item }: { item: SidebarItem }) {
  const pathname = usePathname();
  const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        "group flex flex-col items-center gap-1 rounded-lg px-1 py-2.5 transition-colors",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-accent hover:text-foreground"
      )}
    >
      <Icon className="h-5 w-5" />
      <span className="text-[10px] font-semibold leading-tight">{item.label}</span>
    </Link>
  );
}

function AuthHeader() {
  const { t } = useTranslation("nav");
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="flex h-14 items-center justify-between px-4">
        <Link href="/" className="text-sm font-extrabold tracking-tight">
          마포 미용실
        </Link>
        <div className="flex items-center gap-2">
          <LanguageSelect />
          <ThemeSwitcher />
          <Link
            href="/register"
            className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-semibold hover:bg-accent"
          >
            <UserPlus className="h-4 w-4" />
            <span className="hidden sm:inline">{t("register")}</span>
          </Link>
          <Link
            href="/login"
            className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            <LogIn className="h-4 w-4" />
            <span className="hidden sm:inline">{t("login")}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

export function Header() {
  const { status, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  if (status !== "authenticated") {
    return <AuthHeader />;
  }

  const displayName = user?.username ?? user?.email ?? "?";
  const showAdmin = user?.role?.code === "ROLE_ADMIN";

  const handleLogout = async () => {
    await authActions.logout();
    router.replace("/login");
  };

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-[76px] border-r border-border bg-sidebar lg:flex lg:flex-col">
        <div className="flex justify-center border-b border-border py-3">
          <Link
            href="/softphone"
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 text-white"
          >
            <Headset className="h-5 w-5" />
          </Link>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-3">
          {navItems.map((item) => (
            <SidebarLink key={item.href} item={item} />
          ))}
          {showAdmin && (
            <>
              <div className="my-2 border-t border-border" />
              {adminItems.map((item) => (
                <SidebarLink key={item.href} item={item} />
              ))}
            </>
          )}
        </nav>

        <div className="flex flex-col items-center gap-2 border-t border-border py-3">
          <UserAvatar name={displayName} />
          <button
            type="button"
            onClick={handleLogout}
            aria-label="로그아웃"
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm lg:ml-[76px]">
        <div className="flex h-14 items-center justify-between px-4">
          <div data-tauri-drag-region className="flex min-w-0 flex-1 items-center gap-3 self-stretch">
            <Menu className="h-5 w-5 text-muted-foreground lg:hidden" />
            <div data-tauri-drag-region className="min-w-0">
              <p data-tauri-drag-region className="truncate text-sm font-extrabold tracking-tight">{getPageTitle(pathname)}</p>
              <p data-tauri-drag-region className="hidden truncate text-xs text-muted-foreground sm:block">소프트폰 중심 Step 1 구현</p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/profile"
              className="hidden h-9 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-semibold hover:bg-accent sm:inline-flex"
            >
              <UserCircle className="h-4 w-4 text-muted-foreground" />
              {displayName}
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-semibold hover:bg-accent lg:hidden"
            >
              <LogOut className="h-4 w-4" />
              로그아웃
            </button>
            <WindowControls />
          </div>
        </div>
      </header>
    </>
  );
}

function getPageTitle(pathname: string) {
  if (pathname.startsWith("/softphone")) return "소프트폰";
  if (pathname.startsWith("/consultation-management")) return "상담 관리";
  if (pathname.startsWith("/consultation")) return "전화 걸기";
  if (pathname.startsWith("/dashboard")) return "Step 1 안내";
  if (pathname.startsWith("/menu-management")) return "메뉴 관리";
  return "미니 콜센터";
}
