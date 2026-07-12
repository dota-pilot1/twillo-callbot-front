"use client";

import { useState } from "react";
import {
  Building2,
  Check,
  Copy,
  ExternalLink,
  MapPin,
  Navigation,
  PhoneCall,
  Train,
} from "lucide-react";
import { clinicProfile as clinic } from "@/shared/config/clinic";

const mapLinks = [
  {
    label: "네이버 지도",
    href: `https://map.naver.com/p/search/${encodeURIComponent(clinic.address + " " + clinic.name)}`,
  },
  {
    label: "카카오맵",
    href: `https://map.kakao.com/?q=${encodeURIComponent(clinic.address + " " + clinic.name)}`,
  },
];

const googleMapUrl = `https://www.google.com/maps?q=${encodeURIComponent(
  `${clinic.name} ${clinic.address}`
)}&hl=ko&region=KR&z=17&output=embed`;

export function HospitalLocationPanel() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(clinic.address);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <div className="grid lg:grid-cols-[minmax(0,1fr)_340px]">
        <GoogleLocationMap />

        <aside className="border-t border-border bg-background p-5 lg:border-l lg:border-t-0">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Location</p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight">오시는 길</h2>
          <div className="mt-4 rounded-md border border-border bg-card px-3 py-3">
            <p className="text-xs font-bold text-muted-foreground">병원 위치</p>
            <p className="mt-1 text-base font-extrabold">{clinic.name}</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{clinic.shortAddress}</p>
          </div>
          <dl className="mt-5 space-y-3">
            <InfoRow icon={MapPin} label="주소" value={clinic.address} />
            <InfoRow icon={Building2} label="건물" value={clinic.building} />
            <InfoRow icon={Train} label="대중교통" value={clinic.subway} />
            <InfoRow icon={PhoneCall} label="진료문의" value={clinic.phone} />
            <InfoRow icon={Navigation} label="좌표" value={`${clinic.lat}, ${clinic.lng}`} />
          </dl>

          <button
            type="button"
            onClick={handleCopy}
            className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-border bg-card text-sm font-bold hover:bg-accent"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
            {copied ? "주소 복사됨" : "주소 복사"}
          </button>

          <div className="mt-3 grid gap-2">
            {mapLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 items-center justify-between rounded-md bg-primary px-3 text-sm font-extrabold text-primary-foreground hover:opacity-90"
              >
                {link.label}
                <ExternalLink className="h-4 w-4" />
              </a>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

function GoogleLocationMap() {
  return (
    <div className="relative min-h-[520px] overflow-hidden bg-[#edf3f6]">
      <iframe
        title={`${clinic.name} 지도`}
        src={googleMapUrl}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute inset-0 h-full w-full border-0"
      />
      <div className="pointer-events-none absolute left-3 top-3 rounded-md border border-border bg-background/95 px-3 py-2 text-xs font-bold shadow-sm">
        Google 지도 · 한국어 표시
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md border border-border bg-card px-3 py-3">
      <dt className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
        <Icon className="h-4 w-4 text-primary" />
        {label}
      </dt>
      <dd className="mt-1 text-sm font-extrabold leading-6">{value}</dd>
    </div>
  );
}
