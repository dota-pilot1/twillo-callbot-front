import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://twillo-callbot.web.app";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/services", "/booking", "/chatbot", "/location", "/privacy"],
      disallow: [
        "/dashboard",
        "/clinic-settings",
        "/appointments",
        "/customers",
        "/messages",
        "/users",
        "/roles",
        "/menu-management",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
