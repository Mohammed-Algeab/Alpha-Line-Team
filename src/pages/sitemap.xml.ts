import type { APIRoute } from "astro";
import { posts, projects, publication, series, site } from "../data/content";

export const GET: APIRoute = () => {
  const routes = publication.indexable
    ? ["/", "/translations/", ...projects.filter((project) => project.hasPublishedRelease).map((project) => `/translations/${project.slug}/`), ...series.map((item) => `/categories/${item.slug}/`), ...posts.map((post) => `/blog/${post.slug}/`)]
    : [];
  const body = routes.map((route) => `<url><loc>${site.origin}${route}</loc></url>`).join("");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
