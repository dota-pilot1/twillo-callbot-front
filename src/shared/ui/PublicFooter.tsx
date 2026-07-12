import Link from "next/link";
import { Instagram, MessageCircle, Play, SquareArrowOutUpRight } from "lucide-react";
import { clinicProfile } from "@/shared/config/clinic";

const quickLinks = [
  { label: "카카오톡문의", href: clinicProfile.links.kakao, tone: "bg-yellow-300 text-stone-950" },
  { label: "네이버예약", href: clinicProfile.links.naverReservation, tone: "bg-green-500 text-white" },
  { label: "인스타그램", href: clinicProfile.links.instagram, tone: "bg-pink-600 text-white", icon: Instagram },
  { label: "유튜브", href: clinicProfile.links.youtube, tone: "bg-red-600 text-white", icon: Play },
];

export function PublicFooter() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-900 text-zinc-100">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[1fr_1.6fr] lg:px-6">
        <div>
          <p className="font-serif text-4xl leading-tight tracking-[0.08em] text-white">
            DOSAN
            <br />
            MILI CLINIC
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-[1.25fr_1fr]">
          <div className="space-y-3 text-sm leading-7 text-zinc-400">
            <p>
              <span className="font-bold text-white">주소</span> : {clinicProfile.address}
            </p>
            <p>
              <span className="font-bold text-white">전화</span> : {clinicProfile.phone}
            </p>
            <div>
              <span className="font-bold text-white">Time</span> :{" "}
              <span>{clinicProfile.hours[0]}</span>
              <br />
              <span>{clinicProfile.hours.slice(1).join(" / ")}</span>
            </div>
          </div>

          <div className="space-y-3 text-sm leading-7 text-zinc-400">
            <p>
              <span className="font-bold text-white">상호명</span> : {clinicProfile.name} |{" "}
              <span className="font-bold text-white">대표</span> : {clinicProfile.representative}
            </p>
            <p>
              <span className="font-bold text-white">사업자등록번호</span> :{" "}
              {clinicProfile.businessNumber}
            </p>
            <p>
              <span className="font-bold text-white">개인정보관리자</span> :{" "}
              {clinicProfile.privacyManager} |{" "}
              <Link href="/privacy" className="font-semibold underline underline-offset-4 hover:text-white">
                개인정보 처리방침
              </Link>{" "}
              |{" "}
              <a
                href={clinicProfile.links.sourceNonCovered}
                target="_blank"
                rel="noreferrer"
                className="font-semibold underline underline-offset-4 hover:text-white"
              >
                비급여항목
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 border-t border-zinc-800 px-4 py-6 lg:flex-row lg:items-center lg:justify-between lg:px-6">
        <div className="flex flex-wrap gap-2">
          {quickLinks.map((link) => {
            const Icon = link.icon ?? MessageCircle;
            return (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex h-9 items-center gap-2 rounded-none px-3 text-xs font-extrabold ${link.tone}`}
              >
                <Icon className="h-3.5 w-3.5" />
                {link.label}
                <SquareArrowOutUpRight className="h-3 w-3" />
              </a>
            );
          })}
        </div>
        <p className="text-xs font-semibold text-zinc-500">© 2023 MILI CLINIC DOSAN. ALL RIGHTS RESERVED</p>
      </div>
    </footer>
  );
}
