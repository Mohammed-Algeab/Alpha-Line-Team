/**
 * Alpha Line / أطلس المسارات: واجهة Mobile-first هادئة، حبرية، وتحريرية.
 * تستخدم البطاقات والمسارات الرفيعة لقيادة العين نحو المحتوى بدل واجهة تسويقية مركزية.
 */
import { useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowUpLeft,
  Bell,
  BookOpenText,
  ChevronLeft,
  Compass,
  Grid2X2,
  Menu,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";
import content from "@/data/site-content.json";

const approvedLogo = "/manus-storage/alpha-line-mark_bfab14bb.png";

type Project = (typeof content.projects)[number];

const filters = ["الكل", "SciADV", "مستقلة"] as const;

function statusClass(status: string) {
  if (status === "على المسار") return "status-live";
  if (status === "قريبًا") return "status-soon";
  return "status-plan";
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("الكل");
  const carousel = useRef<HTMLDivElement>(null);

  const visibleProjects = useMemo(() => {
    if (activeFilter === "الكل") return content.projects;
    if (activeFilter === "SciADV") return content.projects.filter((project) => project.series === "SCIENCE ADVENTURE");
    return content.projects.filter((project) => project.series === "INDEPENDENT");
  }, [activeFilter]);

  const scrollProjects = () => {
    carousel.current?.scrollBy({ left: -272, behavior: "smooth" });
  };

  return (
    <div className="alpha-app" dir="rtl">
      <div className="ambient-grid" aria-hidden="true" />

      <header className="site-header">
        <a className="brand-lockup" href="#top" aria-label="Alpha Line - الصفحة الرئيسية">
          <span className="brand-mark-wrap">
            <img src={approvedLogo} alt="رمز Alpha Line" className="brand-mark" />
          </span>
          <span className="brand-text">
            <strong>ALPHA <b>LINE</b></strong>
            <em>ألفا لاين <i>AL–00</i></em>
          </span>
        </a>

        <nav className="desktop-nav" aria-label="التنقل الرئيسي">
          <a className="active" href="#top">الرئيسية</a>
          <a href="#translations">التعريبات</a>
          <a href="#updates">التحديثات</a>
          <a href="#about">حول الفريق</a>
        </nav>

        <div className="header-actions">
          <button
            className="icon-button search-button"
            type="button"
            onClick={() => toast("سيُضاف البحث الشامل عند ربط صفحات التعريبات.")}
            aria-label="بحث"
          >
            <Search size={19} />
          </button>
          <button
            className="icon-button menu-button"
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="فتح القائمة"
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="mobile-menu-layer" role="dialog" aria-modal="true" aria-label="قائمة الموقع">
          <button className="menu-backdrop" aria-label="إغلاق القائمة" type="button" onClick={() => setMenuOpen(false)} />
          <aside className="mobile-menu-panel">
            <div className="menu-panel-top">
              <span className="micro-label">ALPHA LINE / NAVIGATION</span>
              <button className="icon-button" type="button" onClick={() => setMenuOpen(false)} aria-label="إغلاق القائمة">
                <X size={21} />
              </button>
            </div>
            <div className="mobile-nav-links">
              <a href="#top" onClick={() => setMenuOpen(false)}>الرئيسية <ArrowLeft size={18} /></a>
              <a href="#translations" onClick={() => setMenuOpen(false)}>كل التعريبات <ArrowLeft size={18} /></a>
              <a href="#updates" onClick={() => setMenuOpen(false)}>التحديثات <ArrowLeft size={18} /></a>
              <a href="#about" onClick={() => setMenuOpen(false)}>حول الفريق <ArrowLeft size={18} /></a>
            </div>
            <div className="menu-note">
              <Compass size={18} />
              <p>الأرشيف يبنى مشروعًا بعد مشروع. هذه الواجهة هي بداية المسار.</p>
            </div>
          </aside>
        </div>
      )}

      <main id="top">
        <section className="prototype-note" aria-label="حالة النموذج">
          <span className="pulse-dot" />
          <span>نسخة استكشافية</span>
          <span className="note-separator" />
          <span>الأرشيف قيد التأسيس · تُسجّل العلامات هنا</span>
        </section>

        <section className="featured-section" aria-labelledby="featured-title">
          <div className="section-kicker">
            <span className="kicker-orbit" aria-hidden="true" />
            <span className="route-code">ROUTE / AL–01</span>
            <span>{content.featured.eyebrow}</span>
            <span className="section-index">35.68°N</span>
          </div>

          <article className="featured-card">
            <span className="featured-route-line" aria-hidden="true"><i /></span>
            <div className="featured-image-wrap">
              <img src={content.featured.image} alt="مشهد خيالي لمختبر هادئ يمثل المشروع المميز" className="featured-image" />
              <div className="featured-image-overlay" />
              <div className="featured-image-meta">
                <span className="signal-dot" />
                <span>SCIENCE ADVENTURE</span>
              </div>
            </div>
            <div className="featured-content">
              <div className="status-row">
                <span className={`status-chip ${statusClass(content.featured.status)}`}>{content.featured.status}</span>
                <span className="edition-label">PROJECT / 001</span>
              </div>
              <h1 className="featured-arabic-title" id="featured-title">{content.featured.arabicTitle}</h1>
              <p className="featured-title-en">{content.featured.title}</p>
              <p className="featured-summary">{content.featured.summary}</p>
              <div className="feature-ledger" aria-label="بيانات المشروع">
                <span><b>المسار</b> AL–01</span>
                <span><b>المنصة</b> Windows</span>
                <span><b>الإصدار</b> —</span>
              </div>
              <div className="featured-footer">
                <div>
                  <span>آخر علامة</span>
                  <strong>{content.featured.release}</strong>
                </div>
                <a className="solid-cta" href="#translations">
                  سجل المشروع
                  <ArrowUpLeft size={17} />
                </a>
              </div>
            </div>
          </article>
        </section>

        <section className="catalog-section" id="translations" aria-labelledby="catalog-title">
          <div className="catalog-head">
            <div>
              <span className="micro-label">ROUTE / AL–02 · CATALOG</span>
              <h2 id="catalog-title">على المسار الآن</h2>
            </div>
            <button className="round-next" type="button" onClick={scrollProjects} aria-label="استعراض مزيد من المشاريع">
              <ChevronLeft size={20} />
            </button>
          </div>

          <div className="filter-row" aria-label="تصنيف المشاريع">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                className={activeFilter === filter ? "filter-pill is-active" : "filter-pill"}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="project-rail" ref={carousel}>
            {visibleProjects.map((project, index) => (
              <ProjectCard project={project} index={index + 1} key={project.id} />
            ))}
          </div>
        </section>

        <section className="updates-section" id="updates" aria-labelledby="updates-title">
          <div className="section-kicker inverse-kicker">
            <span className="kicker-orbit" aria-hidden="true" />
            <span className="route-code">ROUTE / AL–03</span>
            <span>الإشارة الأخيرة</span>
            <span className="section-index">51.42°E</span>
          </div>
          <div className="updates-head">
            <h2 id="updates-title">تحديثات من الخط</h2>
            <a href="#about" className="text-link">كل السجل <ArrowLeft size={16} /></a>
          </div>
          <div className="timeline">
            {content.updates.map((update) => (
              <article className="timeline-item" key={update.title}>
                <div className="timeline-date">
                  <strong>{update.date}</strong>
                  <span>{update.month}</span>
                </div>
                <div className="timeline-node" aria-hidden="true"><i /></div>
                <div className="timeline-copy">
                  <h3>{update.title}</h3>
                  <p>{update.body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="about-section" id="about" aria-labelledby="about-title">
          <div className="about-orbit" aria-hidden="true"><span /></div>
          <span className="micro-label">ALPHA LINE / ABOUT</span>
          <h2 id="about-title">نحو نسخة عربية تحفظ<br />إيقاع الحكاية.</h2>
          <p>فريق ناشئ يبني أرشيفًا صغيرًا ومنظمًا للتعريبات، بدايةً من الأعمال السردية ثم أبعد من ذلك.</p>
          <a href="mailto:hello@alphaline.example" className="outline-cta">تواصل مع ألفا لاين <ArrowLeft size={17} /></a>
        </section>
      </main>

      <nav className="bottom-nav" aria-label="تنقل الهاتف">
        <a className="bottom-nav-item is-current" href="#top"><Grid2X2 size={19} /><span>الرئيسية</span></a>
        <a className="bottom-nav-item" href="#translations"><Compass size={19} /><span>التعريبات</span></a>
        <a className="bottom-nav-center" href="#translations" aria-label="استكشف المشاريع"><span><Sparkles size={19} /></span></a>
        <a className="bottom-nav-item" href="#updates"><BookOpenText size={19} /><span>المدونة</span></a>
        <button className="bottom-nav-item" type="button" onClick={() => toast("ستصلك إشعارات الإصدارات عند إطلاق هذه الميزة.")}><Bell size={19} /><span>تنبيهات</span></button>
      </nav>
    </div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <article className={`project-card tone-${project.tone}`}>
      <div className="project-cover">
        <img src={project.image} alt={`غلاف فني تمهيدي لمشروع ${project.arabicTitle}`} loading="lazy" />
        <div className="cover-shade" />
        <span className="card-number">0{index}</span>
        <span className={`status-chip ${statusClass(project.status)}`}>{project.status}</span>
      </div>
      <div className="project-card-body">
        <span className="card-series">{project.series}</span>
        <h3>{project.arabicTitle}</h3>
        <p className="card-title-en">{project.title}</p>
        <div className="card-bottom-line">
          <span>{project.updated}</span>
          <button type="button" aria-label={`تفاصيل ${project.arabicTitle}`} onClick={() => toast("ستُربط هذه البطاقة بصفحة التعريبة عند بنائها.")}>
            <ArrowUpLeft size={17} />
          </button>
        </div>
      </div>
    </article>
  );
}
