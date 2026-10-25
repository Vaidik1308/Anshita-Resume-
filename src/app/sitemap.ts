import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// One page: the sections are apps opened in place, so crawlers see a single URL
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: SITE_URL, lastModified: new Date(), changeFrequency: "monthly", priority: 1 }];
}
