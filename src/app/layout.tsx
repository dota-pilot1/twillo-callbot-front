import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { QueryProvider } from "./QueryProvider";
import { AuthInitializer } from "./AuthInitializer";
import { PresenceConnector } from "./PresenceConnector";
import { AppChrome } from "@/widgets/header";
import { ThemeInitializer } from "@/shared/ui/theme/ThemeInitializer";
import { I18nProvider } from "@/shared/i18n/I18nProvider";
import { PublicActionNav } from "@/shared/ui/PublicActionNav";
import { clinicProfile } from "@/shared/config/clinic";

const themeNoFlashScript = `(function(){try{var t=localStorage.getItem("theme-color");if(t&&t!=="default")document.documentElement.setAttribute("data-theme",t);}catch(e){}})();`;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://twillo-callbot.web.app"),
  title: {
    default: `${clinicProfile.shortName} | 도산 피부과·미용클리닉 상담 예약`,
    template: `%s | ${clinicProfile.shortName}`,
  },
  description: "피부과·비만클리닉 병원 홍보·예약 홈페이지 파일럿",
  openGraph: {
    title: `${clinicProfile.shortName} | 도산 피부과·미용클리닉 상담 예약`,
    description: "도산 피부과·미용클리닉 상담 예약, 위치, 진료시간, 대표 프로그램 안내.",
    images: ["/images/clinic/milla-cover.webp"],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeNoFlashScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeInitializer />
        <I18nProvider>
          <QueryProvider>
            <AuthInitializer>
              <PresenceConnector />
              <AppChrome>{children}</AppChrome>
              <PublicActionNav />
            </AuthInitializer>
          </QueryProvider>
        </I18nProvider>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
