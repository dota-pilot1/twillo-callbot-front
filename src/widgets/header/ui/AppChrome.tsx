"use client";

import { Header } from "./Header";
import { useAuth } from "@/entities/user/model/authStore";
import { cn } from "@/shared/lib/utils";
import { useIsTauri } from "@/shared/tauri/useIsTauri";
import { PublicFooter } from "@/shared/ui/PublicFooter";

export function AppChrome({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const isTauri = useIsTauri();

  return (
    <>
      <Header />
      <div
        className={cn(
          status === "authenticated" && isTauri && "lg:pl-[76px]",
          isTauri && "bg-background",
          !isTauri && "pb-20 md:pb-0"
        )}
      >
        {children}
      </div>
      {!isTauri && <PublicFooter />}
    </>
  );
}
