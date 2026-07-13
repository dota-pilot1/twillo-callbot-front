export type ApiEnvironment = "local" | "production";

const BUILD_MODE = process.env.NODE_ENV === "production" ? "release" : "development";
const STORAGE_KEY = `twilio.apiEnvironment.${BUILD_MODE}`;
const LOCAL_URL = "http://localhost:4101";
const PRODUCTION_URL =
  process.env.NEXT_PUBLIC_PRODUCTION_API_URL ??
  "https://twillo-callbot-22483063703.asia-northeast3.run.app";

function defaultEnvironment(): ApiEnvironment {
  return process.env.NODE_ENV === "production" ? "production" : "local";
}

export function getApiEnvironment(): ApiEnvironment {
  if (typeof window === "undefined") return defaultEnvironment();
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "local" || stored === "production" ? stored : defaultEnvironment();
}

export function getApiBaseUrl(environment = getApiEnvironment()): string {
  return environment === "local" ? LOCAL_URL : PRODUCTION_URL;
}

export function setApiEnvironment(environment: ApiEnvironment) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, environment);
  window.dispatchEvent(new CustomEvent("api-environment:change", { detail: environment }));
}

export function subscribeApiEnvironment(callback: () => void) {
  if (typeof window === "undefined") return () => undefined;
  window.addEventListener("api-environment:change", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("api-environment:change", callback);
    window.removeEventListener("storage", callback);
  };
}
