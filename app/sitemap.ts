import type { MetadataRoute } from "next";
import { INDEX, loadPref, cityList } from "@/lib/data";

export const dynamic = "force-static";

const BASE = "https://sodachi-map.com";
const LASTMOD = "2026-10-01";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: string[] = [
    "",
    "/area",
    "/saturday",
    "/late",
    "/guide",
    "/service/houkago-day",
    "/service/jidou-hattatsu",
    "/about",
    "/terms",
    "/privacy",
  ];
  for (const p of INDEX.prefs) {
    routes.push(`/area/${p.slug}`);
    for (const c of cityList(loadPref(p.slug))) {
      routes.push(`/area/${p.slug}/${encodeURIComponent(c.city)}`);
    }
  }
  return routes.map((r) => ({
    url: `${BASE}${r}/`.replace(/\/\/$/, "/"),
    lastModified: LASTMOD,
  }));
}
