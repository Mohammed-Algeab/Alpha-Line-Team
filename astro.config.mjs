// هوية «أطلس المسارات»: رابط المعاينة ثابت ومركزي؛ SITE_URL يتجاوزه فقط عند ربط الدومين النهائي.
import { defineConfig } from "astro/config";

const previewUrl = "https://alpha-line-team.pages.dev";
const siteUrl = process.env.SITE_URL?.trim().replace(/\/$/, "") || previewUrl;

export default defineConfig({
  output: "static",
  build: { format: "directory" },
  server: { host: true, port: 3000 },
  vite: {
    server: {
      allowedHosts: [
        ".us2.manus.computer",
        "3000-i79o5koq814zl2a6pbtwe-74a07b40.us2.manus.computer",
      ],
    },
  },
  site: siteUrl,
});
