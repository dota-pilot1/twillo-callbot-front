import type { Metadata } from "next";
import Link from "next/link";
import { clinicProfile } from "@/shared/config/clinic";

export const metadata: Metadata = {
  title: "개인정보 처리방침",
  description: `${clinicProfile.shortName} 홈페이지 개인정보 처리방침`,
};

const sections = [
  {
    title: "1. 개인정보의 처리 목적",
    body: [
      `${clinicProfile.shortName} 홈페이지는 병원 소개, 시술 안내, 예약 상담 신청, 상담 문의 응대, 내원 안내, 서비스 품질 개선을 위해 필요한 범위에서 개인정보를 처리합니다.`,
      "수집한 개인정보는 안내된 목적 외 용도로 이용하지 않으며, 이용 목적이 변경되는 경우 별도의 동의를 받습니다.",
    ],
  },
  {
    title: "2. 처리하는 개인정보 항목",
    body: [
      "예약 상담 및 문의: 이름, 연락처, 관심 시술 또는 프로그램, 희망 상담 시간, 상담 내용, 예약 및 문의 이력",
      "회원가입 및 로그인: 이메일, 이름 또는 사용자명, 비밀번호 등 계정 생성과 인증에 필요한 정보",
      "서비스 이용 과정에서 자동 생성될 수 있는 정보: 접속 로그, 접속 IP, 브라우저 정보, 기기 정보, 쿠키",
    ],
  },
  {
    title: "3. 개인정보의 보유 및 이용 기간",
    body: [
      "개인정보는 수집 및 이용 목적이 달성되면 지체 없이 파기합니다.",
      "다만 상담 이력 확인, 분쟁 대응, 법령상 보존 의무 이행을 위해 필요한 경우에는 관련 법령 또는 내부 운영 기준에 따라 일정 기간 보관할 수 있습니다.",
      "회원 계정 정보는 회원 탈퇴 또는 계정 삭제 요청 시까지 보관하며, 탈퇴 후에는 관계 법령에 따라 필요한 정보만 제한적으로 보관합니다.",
    ],
  },
  {
    title: "4. 개인정보의 제3자 제공",
    body: [
      `${clinicProfile.shortName} 홈페이지는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다.`,
      "단, 이용자가 사전에 동의한 경우 또는 법령에 따라 제공 의무가 발생한 경우에는 필요한 범위에서 제공할 수 있습니다.",
    ],
  },
  {
    title: "5. 개인정보 처리의 위탁",
    body: [
      "서비스 운영을 위해 웹 호스팅, 문자 또는 이메일 발송, 지도 및 위치 안내, 데이터 저장 등 일부 업무를 외부 서비스에 위탁할 수 있습니다.",
      "위탁이 발생하는 경우 개인정보가 안전하게 처리되도록 필요한 관리와 감독을 수행하며, 실제 운영 단계에서 위탁 업체와 업무 내용을 고지합니다.",
    ],
  },
  {
    title: "6. 이용자의 권리",
    body: [
      "이용자는 본인의 개인정보에 대해 열람, 정정, 삭제, 처리 정지를 요청할 수 있습니다.",
      "요청은 홈페이지 내 문의, 예약 상담 채널 또는 병원 대표 연락처를 통해 접수할 수 있으며, 본인 확인 후 관련 법령에 따라 처리합니다.",
    ],
  },
  {
    title: "7. 개인정보의 파기",
    body: [
      "보유 기간이 경과하거나 처리 목적이 달성된 개인정보는 복구 또는 재생되지 않도록 안전한 방법으로 파기합니다.",
      "전자 파일은 복구가 어려운 방식으로 삭제하고, 출력물은 분쇄 또는 이에 준하는 방식으로 파기합니다.",
    ],
  },
  {
    title: "8. 개인정보의 안전성 확보 조치",
    body: [
      "개인정보 접근 권한 관리, 전송 구간 보호, 접속 기록 관리, 보안 업데이트 등 개인정보 보호를 위한 기술적·관리적 조치를 적용합니다.",
      "운영자는 개인정보를 처리하는 담당자를 최소화하고, 개인정보가 불필요하게 노출되지 않도록 관리합니다.",
    ],
  },
  {
    title: "9. 개인정보 보호 문의",
    body: [
      "개인정보 처리와 관련한 문의, 열람, 정정, 삭제 요청은 아래 연락처로 접수할 수 있습니다.",
      `병원명: ${clinicProfile.name}`,
      `문의 전화: ${clinicProfile.phone}`,
      `주소: ${clinicProfile.address}`,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="bg-white">
      <section className="mx-auto max-w-4xl px-5 pb-24 pt-20 sm:px-6 lg:px-8">
        <div className="border-b border-zinc-200 pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
            Privacy Policy
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">
            개인정보 처리방침
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-600">
            {clinicProfile.shortName} 홈페이지는 이용자의 개인정보를 보호하고 관련 법령을 준수하기 위해
            다음과 같이 개인정보 처리방침을 공개합니다.
          </p>
          <p className="mt-3 text-sm text-zinc-500">시행일: 2026년 7월 13일</p>
        </div>

        <div className="divide-y divide-zinc-200">
          {sections.map((section) => (
            <section key={section.title} className="py-8">
              <h2 className="text-lg font-semibold text-zinc-950">{section.title}</h2>
              <div className="mt-4 space-y-3 text-sm leading-7 text-zinc-650">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-8 rounded-lg border border-zinc-200 bg-zinc-50 p-5 text-sm leading-7 text-zinc-600">
          본 방침은 홈페이지 파일럿 운영 기준으로 작성되었습니다. 실제 진료 예약, 결제,
          마케팅 수신 동의 등 추가 기능을 운영하는 경우 수집 항목과 보유 기간을 서비스
          흐름에 맞춰 갱신합니다.
        </div>

        <div className="mt-10">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-zinc-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            병원 소개로 돌아가기
          </Link>
        </div>
      </section>
    </main>
  );
}
