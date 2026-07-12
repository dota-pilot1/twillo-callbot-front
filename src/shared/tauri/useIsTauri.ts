"use client";

import { useEffect, useState } from "react";

function isTauriRuntime() {
  if (typeof window === "undefined") return false;

  const candidate = window as Window & {
    __TAURI__?: unknown;
    __TAURI_INTERNALS__?: unknown;
  };

  return Boolean(candidate.__TAURI__ || candidate.__TAURI_INTERNALS__);
}

export function useIsTauri() {
  const [isTauri, setIsTauri] = useState(false);

  useEffect(() => {
    setIsTauri(isTauriRuntime());
  }, []);

  return isTauri;
}

export function useTauriRuntime() {
  const [runtime, setRuntime] = useState({ isReady: false, isTauri: false });

  useEffect(() => {
    setRuntime({ isReady: true, isTauri: isTauriRuntime() });
  }, []);

  return runtime;
}
