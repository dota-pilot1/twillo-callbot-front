"use client";

import { Header } from "./Header";
import { useAuth } from "@/entities/user/model/authStore";
import { cn } from "@/shared/lib/utils";

export function AppChrome({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();

  return (
    <>
      <Header />
      <div className={cn(status === "authenticated" && "lg:pl-[76px]")}>{children}</div>
    </>
  );
}
