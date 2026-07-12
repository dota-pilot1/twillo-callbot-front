"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authActions, useAuth } from "@/entities/user/model/authStore";
import { checkForUpdates } from "@/shared/tauri/checkForUpdates";
import { useIsTauri } from "@/shared/tauri/useIsTauri";

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isTauri = useIsTauri();
  const normalizedPathname =
    pathname && pathname !== "/" ? pathname.replace(/\/+$/, "") || "/" : pathname;

  useEffect(() => {
    authActions.restore();
    void checkForUpdates();
  }, []);

  useEffect(() => {
    if (isTauri && normalizedPathname === "/") {
      router.replace("/softphone");
    }
  }, [isTauri, normalizedPathname, router]);

  useEffect(() => {
    const onLogout = () => {
      authActions.forceAnonymous();
      if (normalizedPathname !== "/login") {
        router.replace("/login");
      }
    };
    window.addEventListener("auth:logout", onLogout);
    return () => window.removeEventListener("auth:logout", onLogout);
  }, [normalizedPathname, router]);

  return <>{children}</>;
}
