"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Building2,
  BookOpenCheck,
  CalendarCheck,
  ClipboardList,
  Headset,
  LayoutDashboard,
  LogIn,
  LogOut,
  Mail,
  MapPinned,
  Menu,
  Radio,
  Stethoscope,
  Settings,
  UserCircle,
  UserPlus,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { authActions, useAuth } from "@/entities/user/model/authStore";
import { LanguageSelect } from "@/shared/ui/LanguageSelect";
import { ThemeSwitcher } from "@/shared/ui/theme/ThemeSwitcher";
import { cn } from "@/shared/lib/utils";
import { useIsTauri } from "@/shared/tauri/useIsTauri";
import { clinicProfile } from "@/shared/config/clinic";
import { ApiEnvironmentToggle } from "@/shared/ui/ApiEnvironmentToggle";
import { WindowControls } from "./WindowControls";

type SidebarItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
};

const navItems: SidebarItem[] = [
  { href: "/softphone", label: "소프트폰", icon: Headset },
  { href: "/appointments", label: "예약", icon: CalendarCheck },
  { href: "/customers", label: "고객", icon: UsersRound },
  { href: "/consultation-management", label: "상담", icon: Radio },
  { href: "/messages", label: "발송", icon: Mail },
  { href: "/clinic-settings", label: "병원", icon: Building2 },
  { href: "/location", label: "약도", icon: MapPinned },
  { href: "/dashboard", label: "운영", icon: LayoutDashboard, exact: true },
];

const adminItems: SidebarItem[] = [
  { href: "/faqs", label: "FAQ", icon: BookOpenCheck },
  { href: "/users", label: "직원", icon: UserCircle },
  { href: "/roles", label: "권한", icon: ClipboardList },
  { href: "/menu-management", label: "메뉴", icon: Settings },
];

function SidebarLink({ item }: { item: SidebarItem }) {
  const pathname = usePathname();
  const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        "relative group flex flex-col items-center gap-1 rounded-lg px-1 py-2.5 transition-colors",
        isActive
          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
          : "text-muted-foreground hover:bg-accent hover:text-foreground"
      )}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-r-full bg-emerald-600" />
      )}
      <Icon className="h-5 w-5" />
      <span className="text-[10px] font-semibold leading-tight">{item.label}</span>
    </Link>
  );
}

function AuthHeader({
  authenticatedName,
  onLogout,
}: {
  authenticatedName?: string;
  onLogout?: () => void;
} = {}) {
  const { t } = useTranslation("nav");

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div data-tauri-drag-region className="flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex min-w-0 items-center gap-2 text-sm font-extrabold tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-stone-950 text-white">
            <Stethoscope className="h-4 w-4" />
          </span>
          <span className="min-w-0">
            <span className="block truncate leading-tight">{clinicProfile.shortName}</span>
            <span className="hidden text-[11px] font-semibold leading-tight text-muted-foreground sm:block">
              {clinicProfile.category}
            </span>
          </span>
        </Link>
        <nav className="hidden items-center gap-5 md:flex">
          <Link href="/" className="text-sm font-semibold text-muted-foreground hover:text-foreground">
            병원 소개
          </Link>
          <Link href="/services" className="text-sm font-semibold text-muted-foreground hover:text-foreground">
            시술 안내
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <ApiEnvironmentToggle />
          <LanguageSelect />
          <ThemeSwitcher />
          {authenticatedName ? (
            <>
              <Link
                href="/profile"
                className="hidden h-9 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-semibold hover:bg-accent sm:inline-flex"
              >
                <UserCircle className="h-4 w-4 text-muted-foreground" />
                {authenticatedName}
              </Link>
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-semibold hover:bg-accent"
              >
                <LogOut className="h-4 w-4" />
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                href="/register"
                className="hidden h-9 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-semibold hover:bg-accent sm:inline-flex"
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
            </>
          )}
          <WindowControls />
        </div>
      </div>
    </header>
  );
}

function DesktopAuthHeader() {
  const { t } = useTranslation("nav");
  const isTauri = useIsTauri();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="flex h-14 items-center justify-between px-4">
        <div
          onMouseDown={(event) => startWindowDrag(event, isTauri)}
          onDoubleClick={() => toggleWindowMaximize(isTauri)}
          className="min-w-0 flex-1 self-stretch py-2"
        >
          <p className="truncate text-sm font-extrabold tracking-tight">
            Twillo Clinic 운영 콘솔
          </p>
          <p className="hidden truncate text-xs text-muted-foreground sm:block">
            예약·상담·발송 관리 데스크톱 앱
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ApiEnvironmentToggle />
          <LanguageSelect />
          <ThemeSwitcher />
          <Link
            href="/login"
            className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            <LogIn className="h-4 w-4" />
            <span className="hidden sm:inline">{t("login")}</span>
          </Link>
          <WindowControls />
        </div>
      </div>
    </header>
  );
}

export function Header() {
  const { status, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isTauri = useIsTauri();

  if (status !== "authenticated") {
    if (isTauri) {
      return <DesktopAuthHeader />;
    }
    return <AuthHeader />;
  }

  const displayName = user?.username ?? user?.email ?? "?";
  const showAdmin = user?.role?.code === "ROLE_ADMIN";

  const handleLogout = async () => {
    await authActions.logout();
    router.replace("/login");
  };

  if (!isTauri) {
    return <AuthHeader authenticatedName={displayName} onLogout={handleLogout} />;
  }

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-[76px] border-r border-border bg-sidebar lg:flex lg:flex-col">
        <div className="flex h-14 items-center justify-center border-b border-border">
          <Link
            href="/softphone"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white"
          >
            <Headset className="h-4.5 w-4.5" />
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

        <div className="flex flex-col items-center gap-1.5 border-t border-border py-2">
          <Link
            href="/profile"
            aria-label="내 프로필"
            title={displayName}
            className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-[10px] font-bold text-primary-foreground"
          >
            {(displayName ?? "?").slice(0, 2).toUpperCase()}
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            aria-label="로그아웃"
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm lg:ml-[76px]">
        <div className="flex h-14 items-center justify-between px-4">
          <div
            onMouseDown={(event) => startWindowDrag(event, isTauri)}
            onDoubleClick={() => toggleWindowMaximize(isTauri)}
            className="flex min-w-0 flex-1 items-center gap-3 self-stretch"
          >
            <Menu className="h-5 w-5 text-muted-foreground lg:hidden" />
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold tracking-tight">{getPageTitle(pathname)}</p>
              <p className="hidden truncate text-xs text-muted-foreground sm:block">
                {isTauri ? "예약·상담·발송 관리 데스크톱 앱" : "병원 홍보·예약 홈페이지"}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <ApiEnvironmentToggle />
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
  if (pathname.startsWith("/appointments")) return "예약 관리";
  if (pathname.startsWith("/customers")) return "고객 관리";
  if (pathname.startsWith("/call-history")) return "통화 기록";
  if (pathname.startsWith("/messages")) return "SMS·이메일 발송";
  if (pathname.startsWith("/message-templates")) return "메시지 템플릿";
  if (pathname.startsWith("/clinic-settings")) return "병원 소개";
  if (pathname.startsWith("/location")) return "약도";
  if (pathname.startsWith("/softphone")) return "소프트폰";
  if (pathname.startsWith("/consultation-management")) return "상담 관리";
  if (pathname.startsWith("/faqs")) return "FAQ 관리";
  if (pathname.startsWith("/consultation")) return "전화 걸기";
  if (pathname.startsWith("/dashboard")) return "운영 대시보드";
  if (pathname.startsWith("/users")) return "직원 관리";
  if (pathname.startsWith("/roles")) return "역할 관리";
  if (pathname.startsWith("/permissions")) return "권한 관리";
  if (pathname.startsWith("/menu-management")) return "메뉴 관리";
  return "Twillo Pilot";
}

function startWindowDrag(event: MouseEvent<HTMLElement>, enabled: boolean) {
  if (!enabled || event.button !== 0 || event.detail > 1) return;

  void import("@tauri-apps/api/window").then(({ getCurrentWindow }) => {
    void getCurrentWindow().startDragging();
  });
}

function toggleWindowMaximize(enabled: boolean) {
  if (!enabled) return;

  void import("@tauri-apps/api/window").then(({ getCurrentWindow }) => {
    void getCurrentWindow().toggleMaximize();
  });
}
