import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  // Absolute URLs need a known domain; emit nothing until NEXT_PUBLIC_SITE_URL is set.
  return site.url ? [{ url: site.url, changeFrequency: "monthly", priority: 1 }] : [];
}
