// هوية «أطلس المسارات»: البيانات تبقى صادقة وقابلة للنقل؛ الأصول العامة تُبدل من هذا المصدر المركزي فقط.
export type ProjectVersion = { translation: string; game: string; date: string; notes: string; current: boolean; };
export type ProgressState = "complete" | "active" | "upcoming";
export type ProjectStatus = "planned" | "in_progress" | "completed" | "postponed" | "paused" | "cancelled";
export type ProjectV2 = {
  schemaVersion: 2;
  slug: string;
  route: { code: string; order: number };
  game: { title: string; arabicTitle: string; series: { key: string; label: string; slug: string }; platforms: string[]; artworkKey: keyof typeof assets; summary: string; story: string; };
  project: {
    status: ProjectStatus; statusLabel: string; featured: boolean; visible: boolean;
    stage: { key: string; label: string; summary: string };
    scope: { included: string[]; excluded: string[]; knownLimits: string[] };
    progress: { key: string; label: string; note: string; state: ProgressState }[];
    compatibility: { platform: string; gameVersion: string; patchBase: string; verification: "pending" | "verified" | "unsupported"; note: string };
  };
  release: { published: boolean; versions: { version: string; date: string; notes: string[] }[]; downloads: { label: string; url: string; primary: boolean }[]; installation: string[] };
  seo: { indexable: boolean; aliases: string[]; updatedLabel: string };
};
export type Project = { slug: string; routeCode: string; order: number; title: string; arabicTitle: string; series: string; seriesLabel: string; status: string; statusKey: "planning" | "progress" | "soon"; platforms: string[]; shortDescription: string; story: string; translationStory: string; installation: string[]; heroImage: string; coverImage: string; ogImage?: string; feature: boolean; visible?: boolean; hasPublishedRelease?: boolean; updatedAt: string; versions: ProjectVersion[]; v2?: ProjectV2; };
export type Post = { slug: string; title: string; excerpt: string; date: string; category: string; body: string[]; published?: boolean; };

const projectFiles = import.meta.glob("../content/projects/*.json", { eager: true, import: "default" }) as Record<string, Project | ProjectV2>;
const postFiles = import.meta.glob("../content/blog/*.json", { eager: true, import: "default" }) as Record<string, Post>;

// رابط Pages هو المرجع الآمن للـcanonical وOpen Graph في المعاينة؛ SITE_URL يُغيَّر مرة واحدة عند إطلاق النطاق النهائي.
const previewOrigin = "https://alpha-line-team.pages.dev";
const configuredOrigin = import.meta.env.SITE_URL?.replace(/\/$/, "") || previewOrigin;
const publicationMode = import.meta.env.ALPHA_LINE_SITE_MODE === "public" ? "public" : "preview";

export const publication = { mode: publicationMode, indexable: publicationMode === "public" };
export const deployment = { previewOrigin, configuredOrigin };
export const assets = {
  steinsGateCover: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663093354307/vwxKDbLyaLvdyLJI.jpg",
  defaultOgImage: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663093354307/alpha-line-open-graph_0b289904.jpg",
  logo: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663093354307/nEIYYuhsbYLvaGda.png",
};
export const site = { name: "Alpha Line", arabicName: "ألفا لاين", routeCode: "AL–00", logo: assets.logo, description: "فريق عربي يطوّر ويجمع تعريبات الألعاب والروايات المرئية في أرشيف منظّم.", origin: configuredOrigin };

const statusKeys: Record<ProjectStatus, Project["statusKey"]> = {
  planned: "planning", in_progress: "progress", completed: "soon", postponed: "planning", paused: "planning", cancelled: "planning",
};

const isProjectV2 = (project: Project | ProjectV2): project is ProjectV2 => "schemaVersion" in project && project.schemaVersion === 2;

const normalizeV2Project = (project: ProjectV2): Project => {
  const image = assets[project.game.artworkKey];
  return {
    slug: project.slug,
    routeCode: project.route.code,
    order: project.route.order,
    title: project.game.title,
    arabicTitle: project.game.arabicTitle,
    series: project.game.series.key,
    seriesLabel: project.game.series.label,
    status: project.project.statusLabel,
    statusKey: statusKeys[project.project.status],
    platforms: project.game.platforms,
    shortDescription: project.game.summary,
    story: project.game.story,
    translationStory: project.project.stage.summary,
    installation: project.release.installation,
    heroImage: image,
    coverImage: image,
    ogImage: image,
    feature: project.project.featured,
    visible: project.project.visible,
    hasPublishedRelease: project.release.published,
    updatedAt: project.seo.updatedLabel,
    versions: project.release.published
      ? project.release.versions.map((version, index) => ({ translation: version.version, game: project.project.compatibility.gameVersion, date: version.date, notes: version.notes.join(" "), current: index === 0 }))
      : [],
    v2: project,
  };
};

const allProjects = Object.values(projectFiles).map((project) => isProjectV2(project) ? normalizeV2Project(project) : project);

export const projects = allProjects.filter((project) => project.visible !== false).sort((a, b) => a.order - b.order);
export const posts = Object.values(postFiles).filter((post) => post.published === true).sort((a, b) => b.date.localeCompare(a.date));
export const featuredProject = projects.find((project) => project.feature) ?? projects[0];
export const series = [{ slug: "sciadv", name: "SciADV", description: "مسارات من عوالم Science Adventure." }, { slug: "independent", name: "تعريبات مستقلة", description: "مشاريع خارج السلاسل الرئيسية." }]
  .filter((item) => projects.some((project) => item.slug === "sciadv" ? project.series === "SCIENCE ADVENTURE" : project.series === "INDEPENDENT"));
export const getProjectsBySeries = (seriesSlug: string) => seriesSlug === "sciadv" ? projects.filter((project) => project.series === "SCIENCE ADVENTURE") : projects.filter((project) => project.series === "INDEPENDENT");
