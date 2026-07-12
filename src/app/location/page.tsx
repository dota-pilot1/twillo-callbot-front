import type { Metadata } from "next";
import { Building2, Car, Clock, MapPin, Train } from "lucide-react";
import { HospitalLocationPanel } from "@/shared/ui/HospitalLocationPanel";
import { clinicProfile } from "@/shared/config/clinic";

export const metadata: Metadata = {
  title: "약도와 오시는 길",
  description: `${clinicProfile.shortName} 주소, 약도, 지하철, 주차 확인, 전화번호, 지도 길찾기 안내입니다.`,
  alternates: {
    canonical: "/location",
  },
};

export default function LocationPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 lg:px-6">
      <p className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
        <MapPin className="h-3.5 w-3.5" />
        Directions
      </p>
      <h1 className="mt-5 text-4xl font-black tracking-tight">약도/오시는 길</h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
        도산공원 인근에 위치한 {clinicProfile.shortName}입니다. 주소를 복사하거나 외부 지도 앱에서 길찾기를 바로 확인할 수 있습니다.
      </p>

      <section className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <section className="rounded-lg border border-border bg-card p-5">
          <h2 className="flex items-center gap-2 font-bold">
            <MapPin className="h-4 w-4 text-primary" />
            주소
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{clinicProfile.address}</p>
        </section>
        <section className="rounded-lg border border-border bg-card p-5">
          <h2 className="flex items-center gap-2 font-bold">
            <Clock className="h-4 w-4 text-primary" />
            진료시간
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{clinicProfile.hours.join(" / ")}</p>
        </section>
        <section className="rounded-lg border border-border bg-card p-5">
          <h2 className="flex items-center gap-2 font-bold">
            <Train className="h-4 w-4 text-primary" />
            지하철
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{clinicProfile.subway}</p>
        </section>
        <section className="rounded-lg border border-border bg-card p-5">
          <h2 className="flex items-center gap-2 font-bold">
            <Car className="h-4 w-4 text-primary" />
            주차
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{clinicProfile.parking}</p>
        </section>
      </section>

      <div className="mt-6">
        <HospitalLocationPanel />
      </div>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <article className="rounded-lg border border-border bg-card p-5">
          <Building2 className="h-5 w-5 text-primary" />
          <h2 className="mt-4 font-extrabold">건물 확인</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{clinicProfile.building}의 {clinicProfile.shortName} 표기를 확인하고 방문합니다.</p>
        </article>
        <article className="rounded-lg border border-border bg-card p-5">
          <PhoneCallFallback />
        </article>
        <article className="rounded-lg border border-border bg-card p-5">
          <Clock className="h-5 w-5 text-primary" />
          <h2 className="mt-4 font-extrabold">방문 전 확인</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">방문 전 예약 시간과 진료 가능 시간을 한 번 더 확인해 주세요.</p>
        </article>
      </section>
    </main>
  );
}

function PhoneCallFallback() {
  return (
    <>
      <MapPin className="h-5 w-5 text-primary" />
      <h2 className="mt-4 font-extrabold">주변 기준</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">도산공원, 압구정로데오역, 도산대로45길을 기준으로 길찾기하면 편합니다.</p>
    </>
  );
}
