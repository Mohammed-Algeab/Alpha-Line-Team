import type { APIRoute } from "astro";
import { publication, site } from "../data/content";

export const GET: APIRoute = () => new Response(
  publication.indexable
    ? `User-agent: *\nAllow: /\nSitemap: ${site.origin}/sitemap.xml\n`
    : "User-agent: *\nDisallow: /\n",
  { headers: { "Content-Type": "text/plain; charset=utf-8" } },
);
