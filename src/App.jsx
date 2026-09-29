import { useEffect, useMemo, useState } from "react";
import { loadTrainees, saveTrainees, emptyTrainee, STATUSES } from "./data.js";
import TraineeCard from "./components/TraineeCard.jsx";
import TraineeForm from "./components/TraineeForm.jsx";

/* Random-ish team photo used for the hero (same mood as the reference). */
const HERO_PHOTO =
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80";

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
    className: "stat-icon",
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

export default function App() {
  const [trainees, setTrainees] = useState(loadTrainees);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => saveTrainees(trainees), [trainees]);

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

  const countryCount = useMemo(() => {
    const set = new Set();
    trainees.forEach((t) =>
      [t.from, t.livingIn].forEach((v) =>
        (v || "").split("/").forEach((c) => {
          c = c.trim();
          if (c) set.add(c);
        }),
      ),
    );
    return set.size || "—";
  }, [trainees]);

  const stats = useMemo(
    () => [
      { icon: "trainees", value: trainees.length || "—", label: "Trainees" },
      { icon: "months", value: 6, label: "Months" },
      { icon: "remote", value: "100%", label: "Remote format" },
      {
        icon: "countries",
        value: countryCount,
        label: "Countries represented",
      },
    ],
    [trainees.length, countryCount],
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
    <div className="app">
      {/* ================= PRINT / PDF RULES ================= */}
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 11mm 11mm 12mm;
          }

          html, body {
            background: #faf6ed !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          *,
          *::before,
          *::after {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Hide UI-only chrome */
          .no-print,
          .toolbar,
          .card-actions,
          .modal-backdrop,
          .empty button,
          .app button {
            display: none !important;
          }

          .app {
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          /* Page 1 = hero + about + stats; page 2+ = roster */
          .page-one {
            break-after: page;
            page-break-after: always;
          }

          .hero,
          .hero-left,
          .hero-card,
          .hero-right,
          .brand-badge,
          .hero-photo,
          .hero-lede,
          .about-section,
          .stats-section,
          .stat-tile,
          .app-footer,
          .grid > * {
            break-inside: avoid;
            page-break-inside: avoid;
          }

          .grid {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 6mm !important;
            overflow: visible !important;
            max-height: none !important;
          }

          .card {
            box-shadow: none !important;
          }

          a {
            color: inherit !important;
            text-decoration: none !important;
          }
          @media print {
            /* ... existing rules ... */

            .app-footer,
            .footer-panel {
              break-inside: avoid;
              page-break-inside: avoid;
            }
          }

        }
      `}</style>

      {/* ===================================================
          PAGE 1
      =================================================== */}
      <div className="page-one">
        {/* ---------- HERO (matches the flyer exactly) ---------- */}
        <header className="hero">
          {/* LEFT: badge + cream card */}
          <div className="hero-left">
            <div className="brand-badge">
              <span className="brand-name">encodec</span>
              <span className="brand-sub">Tailored Engineering</span>
            </div>

            <div className="hero-card">
              <h1 className="hero-title">
                <span>Aura</span>
                <span>Remote</span>
                <span>Work</span>
              </h1>
              <p className="hero-pill">Pilot Program: July – December 2026</p>
            </div>
          </div>

          {/* RIGHT: photo + lede */}
          <div className="hero-right">
            <img
              className="hero-photo"
              src={HERO_PHOTO}
              alt="Remote team collaborating around a laptop"
            />
            <p className="hero-lede">
              A program to enhance English fluency and professional presence
              that it takes to work in remote international teams.
            </p>
          </div>
        </header>

        {/* ---------- ABOUT ---------- */}
        <section className="about-section">
          <p>
            Aura Remote Work is Encodec&rsquo;s social impact program, built for
            people who face structural barriers to the international remote job
            market. The technical skills a role needs can be trained fast, on
            the job. What&rsquo;s scarce is fluent English and the professional
            posture that multicultural, remote-first teams expect from day one.
          </p>
          <p>
            This cohort brings together {trainees.length} trainees from Brazil
            and Palestine &mdash; professionals in business, engineering, design
            and technology &mdash; now building the language and soft skills to
            take that experience global.
          </p>
        </section>

        {/* ---------- STATS ---------- */}
        <section className="stats-section">
          {stats.map((s) => (
            <div className="stat-tile" key={s.label}>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
              <StatIcon name={s.icon} />
            </div>
          ))}
        </section>
      </div>

      {/* ===================================================
          PAGE 2+ — roster
      =================================================== */}
      <div className="toolbar no-print">
        <input
          className="search"
          type="search"
          placeholder="Search by name, country, skill…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <span className="toolbar-spacer" />
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

      <section className="roster">
        <h2 className="section-title">Meet the trainees</h2>

        {filtered.length === 0 ? (
          <div className="empty">
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
          <div className="grid">
            {filtered.map((t) => (
              <TraineeCard
                key={t.id}
                trainee={t}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </section>

      <footer className="app-footer">
        <div className="footer-panel">
          <p className="footer-tagline">
            Talent is everywhere; opportunity should be too.
          </p>
          <p className="footer-note">
            Come meet our trainees and our team, and together we will create a
            more connected, inclusive and promising future of work to our world.
          </p>
        </div>

        <img
          src="encodec-logo.png"
          alt="Tailored Engineering"
          className="footer-wordmark"
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
