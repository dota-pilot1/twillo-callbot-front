import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://twillo-callbot.web.app";
  const now = new Date();

  return [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/clinic`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${siteUrl}/services`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${siteUrl}/booking`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/chatbot`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${siteUrl}/location`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];
}
