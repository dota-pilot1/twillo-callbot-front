import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const isGithubPages = process.env.GITHUB_PAGES === "true";
const githubPagesBasePath = "/BeautyBook";

const nextConfig: NextConfig = {
  ...(isProd && { output: "export" }),
  ...(isGithubPages && {
    basePath: githubPagesBasePath,
    assetPrefix: githubPagesBasePath,
  }),
  devIndicators: {
    position: "bottom-right",
  },
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
