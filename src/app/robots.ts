import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://prixo.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /app is behind login (nothing to index); /api is data, not pages;
        // /page/ is a defensive block in case pagination is ever added later.
        disallow: ["/app", "/api/", "/page/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
