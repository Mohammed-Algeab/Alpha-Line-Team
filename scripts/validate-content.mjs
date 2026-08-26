import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const projectsDir = path.join(root, "src", "content", "projects");

const stageSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  note: z.string().min(1),
  state: z.enum(["complete", "active", "upcoming"]),
});

const assetReferenceSchema = z.string().min(1).refine(
  (value) => value.startsWith("/") || /^https?:\/\//.test(value),
  "يجب أن يكون مرجع الأصل رابط HTTP(S) أو مسارًا عامًا يبدأ بـ /."
);

const previewTestDownloadSchema = z.object({
  enabled: z.boolean(),
  fileLabel: z.string().min(1),
  notice: z.string().min(1),
  sources: z.array(z.object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    label: z.string().min(1),
    url: z.string().url(),
    verification: z.enum(["verified", "manual_check", "access_check"]),
    note: z.string().min(1),
  })).min(1),
});

const projectV2Schema = z.object({
  schemaVersion: z.literal(2),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  route: z.object({ code: z.string().min(1), order: z.number().int().positive() }),
  game: z.object({
    title: z.string().min(1),
    arabicTitle: z.string().min(1),
    series: z.object({ key: z.string().min(1), label: z.string().min(1), slug: z.string().min(1) }),
    platforms: z.array(z.string().min(1)).min(1),
    artwork: z.object({ coverUrl: assetReferenceSchema }),
    summary: z.string().min(1),
    story: z.string().min(1),
  }),
  project: z.object({
    status: z.enum(["planned", "in_progress", "completed", "postponed", "paused", "cancelled"]),
    statusLabel: z.string().min(1),
    featured: z.boolean(),
    visible: z.boolean(),
    stage: z.object({ key: z.string().min(1), label: z.string().min(1), summary: z.string().min(1) }),
    scope: z.object({ included: z.array(z.string()), excluded: z.array(z.string()), knownLimits: z.array(z.string()) }),
    progress: z.array(stageSchema).min(1),
    compatibility: z.object({
      platform: z.string().min(1),
      gameVersion: z.string().min(1),
      patchBase: z.string().min(1),
      verification: z.enum(["pending", "verified", "unsupported"]),
      note: z.string().min(1),
    }),
  }),
  release: z.object({
    published: z.boolean(),
    versions: z.array(z.object({ version: z.string().min(1), date: z.string().min(1), notes: z.array(z.string()).min(1) })),
    downloads: z.array(z.object({ label: z.string().min(1), url: z.string().url(), primary: z.boolean() })),
    installation: z.array(z.string().min(1)),
  }),
  previewTestDownloads: previewTestDownloadSchema.optional(),
  seo: z.object({ indexable: z.boolean(), aliases: z.array(z.string().min(1)).min(1), updatedLabel: z.string().min(1) }),
});

const files = (await readdir(projectsDir)).filter((file) => file.endsWith(".json"));
let v2Count = 0;

for (const file of files) {
  const fullPath = path.join(projectsDir, file);
  const raw = JSON.parse(await readFile(fullPath, "utf8"));

  if (raw.slug === "steins-gate" && raw.schemaVersion !== 2) {
    throw new Error("Steins;Gate يجب أن يستخدم schemaVersion: 2.");
  }

  if (raw.schemaVersion !== 2) continue;
  v2Count += 1;
  const project = projectV2Schema.parse(raw);

  if (!project.release.published && (project.release.versions.length > 0 || project.release.downloads.length > 0)) {
    throw new Error(`${project.slug}: لا يجوز إدخال إصدار أو تنزيل قبل نشر إصدار حقيقي.`);
  }

  if (!project.release.published && project.release.installation.length === 0) {
    throw new Error(`${project.slug}: يجب أن توضح مرحلة ما قبل الإصدار أن تعليمات التثبيت لم تُنشر بعد.`);
  }

  if (project.release.published && project.previewTestDownloads?.enabled) {
    throw new Error(`${project.slug}: لا تخلط نافذة تنزيل تجريبية مع إصدار منشور.`);
  }

  if (project.project.compatibility.verification === "pending" && project.project.compatibility.note.includes("متوافق")) {
    throw new Error(`${project.slug}: لا تصف التوافق بأنه مؤكد قبل الاختبار العملي.`);
  }
}

console.log(`✓ تم التحقق من ${v2Count} ملف/ملفات مشروع بنموذج V2.`);
