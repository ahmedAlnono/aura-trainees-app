import { useEffect, useMemo, useState } from "react";
import { loadTrainees, saveTrainees, emptyTrainee, STATUSES } from "./data.js";
import TraineeCard from "./components/TraineeCard.jsx";
import TraineeForm from "./components/TraineeForm.jsx";
import useInView from "./useInView.js";

/* ------------------------------------------------------------------ *
 * Stat tile watermarks
 * ------------------------------------------------------------------ */
function StatIcon({ name }) {
  const common = {
    viewBox: "0 0 64 64",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 3,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className:
      "pointer-events-none absolute -right-2 -bottom-2.5 h-[84px] w-[84px] text-gold opacity-30 transition-[transform,opacity] duration-[600ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:rotate-[-6deg] group-hover:scale-105 group-hover:opacity-45",
    "aria-hidden": "true",
  };

  switch (name) {
    case "trainees":
      return (
        <svg {...common}>
          <circle cx="24" cy="22" r="10" />
          <path d="M6 54c0-9.4 8-16 18-16s18 6.6 18 16" />
          <circle cx="46" cy="24" r="7" />
          <path d="M38 54c0-8 5-13 12-13s12 5 12 13" />
        </svg>
      );
    case "months":
      return (
        <svg {...common}>
          <rect x="8" y="12" width="48" height="44" rx="6" />
          <path d="M8 24h48M20 8v8M44 8v8" />
          <path d="M18 34h6M30 34h6M42 34h6M18 44h6M30 44h6M42 44h6" />
        </svg>
      );
    case "remote":
      return (
        <svg {...common}>
          <circle cx="32" cy="32" r="22" />
          <path d="M10 32h44" />
          <path d="M32 10c6 6 9 13.7 9 22s-3 16-9 22c-6-6-9-13.7-9-22s3-16 9-22z" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M6 18l17-6 18 6 17-6v34l-17 6-18-6-17 6z" />
          <path d="M23 12v34M41 18v34" />
        </svg>
      );
  }
}

/* ------------------------------------------------------------------ *
 * Reveal-on-scroll wrapper
 * ------------------------------------------------------------------ */
function Reveal({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={`reveal h-full ${inView ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function App() {
  const [trainees, setTrainees] = useState(loadTrainees);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => saveTrainees(trainees), [trainees]);

  const [footerRef, footerInView] = useInView({ threshold: 0.2 });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return trainees.filter((t) => {
      const matchesStatus = statusFilter === "all" || t.status === statusFilter;
      if (!matchesStatus) return false;
      if (!q) return true;
      const haystack = [
        t.name,
        t.from,
        t.livingIn,
        t.shortIntro,
        t.experience,
        t.email,
        ...(t.skills || []),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [trainees, query, statusFilter]);

  const stats = useMemo(
    () => [
      { icon: "trainees", value: trainees.length || "—", label: "Trainees" },
      { icon: "months", value: 6, label: "Months" },
      { icon: "remote", value: "100%", label: "Remote format" },
      {
        icon: "countries",
        value: 2,
        label: "Countries represented",
      },
    ],
    [trainees.length],
  );

  function handleSave(data) {
    if (editing) {
      setTrainees((prev) =>
        prev.map((t) => (t.id === editing.id ? { ...t, ...data } : t)),
      );
    } else {
      setTrainees((prev) => [...prev, { ...data, id: crypto.randomUUID() }]);
    }
    setFormOpen(false);
    setEditing(null);
  }

  function handleDelete(id) {
    const t = trainees.find((x) => x.id === id);
    if (
      window.confirm(
        `Delete ${t?.name || "this trainee"}? This cannot be undone.`,
      )
    ) {
      setTrainees((prev) => prev.filter((x) => x.id !== id));
    }
  }

  function openEdit(t) {
    setEditing(t);
    setFormOpen(true);
  }

  function exportPdf() {
    const previousTitle = document.title;
    document.title = `AURA-Remote-Work-Trainees-${new Date()
      .toISOString()
      .slice(0, 10)}`;

    let restored = false;
    const restore = () => {
      if (restored) return;
      restored = true;
      document.title = previousTitle;
      window.removeEventListener("afterprint", restore);
    };

    window.addEventListener("afterprint", restore);
    window.print();
    setTimeout(restore, 1500);
  }

  return (
    <div className="app mx-auto max-w-[940px] px-5 pt-[30px] pb-14 md:px-7 md:pt-10 md:pb-16 print:max-w-none print:p-0">
      {/* ===================================================
          PAGE 1
      =================================================== */}
      <div className="page-one print:break-after-page">
        {/* ---------- HERO ---------- */}
        <header className="hero grid grid-cols-1 items-start gap-[22px] md:grid-cols-[minmax(0,1fr)_minmax(0,1.02fr)] md:gap-5 print:grid-cols-[minmax(0,1fr)_minmax(0,1.02fr)] print:gap-5 print:break-inside-avoid">
          {/* LEFT: badge + cream card */}
          <div className="hero-left flex min-w-0 flex-col print:break-inside-avoid">
            <div className="brand-badge animate-pop-in">
              <span className="font-serif text-[22px] leading-none font-medium italic tracking-[0.2px] text-white">
                encodec
              </span>
              <span className="font-sans text-[7px] font-medium tracking-[2.4px] text-white/85 uppercase">
                Tailored Engineering
              </span>
            </div>

            <div className="hero-card">
              <h1 className="m-0 flex flex-col font-serif text-[clamp(80px,8.6vw,98px)] leading-[0.95] font-medium tracking-[0.5px] text-gold uppercase">
                <span
                  className="animate-fade-up"
                  style={{ animationDelay: "120ms" }}
                >
                  Aura
                </span>
                <span
                  className="animate-fade-up"
                  style={{ animationDelay: "220ms" }}
                >
                  Remote
                </span>
                <span
                  className="animate-fade-up"
                  style={{ animationDelay: "320ms" }}
                >
                  Work
                </span>
              </h1>
              <p
                className="hero-pill animate-fade-up"
                style={{ animationDelay: "440ms" }}
              >
                Pilot Program: July – December 2026
              </p>
            </div>
          </div>

          {/* RIGHT: photo + lede */}
          <div className="hero-right flex min-w-0 flex-col gap-[18px] print:break-inside-avoid">
            <img
              src="team-work.webp"
              alt="Remote team collaborating around a laptop"
              className="animate-photo-in block aspect-[16/10] w-full rounded-[18px] bg-cream-2 object-cover object-center md:aspect-[3/4] print:aspect-[3/4] print:break-inside-avoid"
              style={{ animationDelay: "180ms" }}
            />
            <p
              className="animate-fade-up m-0 max-w-[40ch] font-serif text-base leading-[1.45] font-normal text-ink print:break-inside-avoid"
              style={{ animationDelay: "520ms" }}
            >
              A program to enhance English fluency and professional presence
              that it takes to work in remote international teams.
            </p>
          </div>
        </header>

        {/* ---------- ABOUT ---------- */}
        <section className="about-section mx-auto mt-12 flex max-w-[110ch] flex-col gap-3 border-t border-line pt-[30px] print:break-inside-avoid">
          <p
            className="animate-fade-up m-0 text-[20px] leading-[1.7] text-ink-soft"
            style={{ animationDelay: "620ms" }}
          >
            Aura Remote Work is Encodec&rsquo;s social impact program, built for
            people who face structural barriers to the international remote job
            market. The technical skills a role needs can be trained fast, on
            the job. What&rsquo;s scarce is fluent English and the professional
            posture that multicultural, remote-first teams expect from day one.
          </p>
          <p
            className="animate-fade-up m-0 text-[20px] leading-[1.7] text-ink-soft"
            style={{ animationDelay: "700ms" }}
          >
            This cohort brings together {trainees.length} trainees from Brazil
            and Palestine &mdash; professionals in business, engineering, design
            and technology &mdash; now building the language and soft skills to
            take that experience global.
          </p>
        </section>

        {/* ---------- STATS ---------- */}
        <section className="stats-section mt-10 grid grid-cols-2 gap-3.5 md:grid-cols-4 print:grid-cols-4 print:break-inside-avoid">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="stat-tile group animate-fade-up print:break-inside-avoid"
              style={{ animationDelay: `${780 + i * 80}ms` }}
            >
              <strong className="font-serif text-[36px] leading-[0.95] font-normal tracking-[-0.5px] text-gold-deep md:text-[44px]">
                {s.value}
              </strong>
              <span className="mt-2 max-w-[92px] text-[12.5px] leading-[1.3] text-ink">
                {s.label}
              </span>
              <StatIcon name={s.icon} />
            </div>
          ))}
        </section>
      </div>

      {/* ===================================================
          PAGE 2+ — roster
      =================================================== */}
      <div className="toolbar no-print my-12 flex flex-wrap items-center gap-3">
        <input
          type="search"
          placeholder="Search by name, country, skill…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-w-[240px] flex-1 rounded-full border-[1.5px] border-line bg-card px-4 py-2.5 font-sans text-sm text-ink transition-[border-color,box-shadow] duration-300 placeholder:text-[#a4937e] focus:border-gold focus:shadow-[0_0_0_4px_rgba(193,154,91,0.15)] focus:outline-none"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-full border-[1.5px] border-line bg-card px-3.5 py-2.5 font-sans text-sm text-ink transition-[border-color,box-shadow] duration-300 focus:border-gold focus:shadow-[0_0_0_4px_rgba(193,154,91,0.15)] focus:outline-none"
        >
          <option value="all">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <span className="flex-1" />
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          + Add trainee
        </button>
        <button className="btn btn-primary" onClick={exportPdf}>
          Export PDF
        </button>
      </div>

      <section className="roster mt-2">
        <h2 className="mb-[22px] font-serif text-[38px] leading-[1.1] font-medium tracking-[-0.4px] text-ink">
          Meet the trainees
        </h2>

        {filtered.length === 0 ? (
          <div className="empty animate-fade-in py-[72px] text-center text-ink-soft">
            <p>No trainees match your search.</p>
            <button
              className="btn btn-primary"
              onClick={() => {
                setEditing(null);
                setFormOpen(true);
              }}
            >
              Add the first one
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:items-stretch print:grid-cols-2 print:gap-[6mm]">
            {filtered.map((t, i) => (
              <Reveal key={t.id} delay={(i % 2) * 90}>
                <TraineeCard
                  trainee={t}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* ===================================================
          FOOTER
      =================================================== */}
      <footer
        ref={footerRef}
        className="app-footer mt-14 flex flex-col-reverse items-start gap-5 md:flex-row md:items-center md:gap-[34px] print:flex-row print:items-center print:break-inside-avoid"
      >
        <div
          className={`footer-panel w-full md:w-auto print:break-inside-avoid ${
            footerInView ? "is-visible" : ""
          }`}
        >
          <p className="relative m-0 font-serif text-[19px] leading-[1.25] font-semibold tracking-[0.1px] text-white md:text-[23px]">
            Talent is everywhere; opportunity should be too.
          </p>
          <p className="relative m-0 max-w-[62ch] font-sans text-[13.5px] leading-normal text-white/95 md:text-[14.5px]">
            Come meet our trainees and our team, and together we will create a
            more connected, inclusive and promising future of work to our world.
          </p>
        </div>

        <img
          src="encodec-logo.webp"
          alt="Tailored Engineering"
          className="h-8 w-auto flex-shrink-0 opacity-100 md:h-[38px]"
        />
      </footer>

      {formOpen && (
        <TraineeForm
          initial={editing || emptyTrainee}
          isEdit={!!editing}
          onSave={handleSave}
          onClose={() => {
            setFormOpen(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}
