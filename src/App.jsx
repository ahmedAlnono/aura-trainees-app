import { useEffect, useMemo, useState } from "react";
import { loadTrainees, saveTrainees, emptyTrainee, STATUSES } from "./data.js";
import TraineeCard from "./components/TraineeCard.jsx";
import TraineeForm from "./components/TraineeForm.jsx";

export default function App() {
  const [trainees, setTrainees] = useState(loadTrainees);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null); // null = add mode

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

  /**
   * Export the whole page to PDF.
   *
   * Uses the browser's native print pipeline ("Save as PDF"), which is the
   * only client-side way to get a PDF that:
   *   - keeps the exact same styles (same DOM, same stylesheet)
   *   - keeps real, selectable text
   *   - keeps <a href> links clickable (Chrome / Edge / Firefox all preserve
   *     link annotations when printing to PDF)
   */
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
    // Fallback for browsers that don't fire `afterprint`.
    setTimeout(restore, 1500);
  }

  return (
    <div className="app">
      {/* ---- Print / PDF rules (kept inline so nothing else has to change) ---- */}
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 12mm 10mm;
          }

          html, body {
            background: #fff !important;
          }

          /* Force backgrounds / brand colors to be printed */
          *,
          *::before,
          *::after {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* UI-only chrome that must not appear in the PDF */
          .no-print,
          .toolbar,
          .grid button,
          .empty button,
          .app button:not(.print-keep) {
            display: none !important;
          }

          /* Remove screen-only spacing so the printed page is edge-to-edge */
          .app {
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          /* Keep blocks intact across page breaks */
          .hero,
          .hero-stats,
          .app-footer {
            break-inside: avoid;
            page-break-inside: avoid;
          }

          .grid > * {
            break-inside: avoid;
            page-break-inside: avoid;
          }

          /* Links: keep them real anchors so the PDF keeps working links.
             Chrome/Edge/Firefox turn these into clickable PDF annotations. */
          a {
            color: inherit !important;
            text-decoration: none !important;
          }

          /* Make sure nothing relies on hover/scroll in the printed doc */
          .grid {
            overflow: visible !important;
            max-height: none !important;
          }
        }
      `}</style>

      {/* ---- Header, exactly like PDF page 1 ---- */}
      <header className="hero">
        <img
          className="hero-logo"
          src="/encodec-logo.png"
          alt="Encodec — Tailored Engineering"
        />

        <p className="hero-eyebrow">
          PILOT PROGRAM &middot; JULY &ndash; DECEMBER 2026
        </p>
        <h1 className="hero-title">AURA REMOTE WORK</h1>

        <div className="hero-copy">
          <p className="lede">
            A program to enhance the English fluency and professional presence
            it takes to work in remote international teams.
          </p>
          <p>
            Aura Remote Work is Encodec&rsquo;s social impact program, built for
            people who face structural barriers to the international remote job
            market. The technical skills a role needs can be trained fast, on
            the job. What&rsquo;s scarce is fluent English and the professional
            posture that multicultural, remote-first teams expect from day one.
          </p>
          <p>
            This cohort brings together {trainees.length} trainees from Brazil
            and Palestine — professionals in business, engineering, design and
            technology — now building the language and soft skills to take that
            experience global.
          </p>
        </div>

        <div className="hero-stats">
          <div>
            <strong>{trainees.length}</strong>
            <span>TRAINEES</span>
          </div>
          <div>
            <strong>6</strong>
            <span>MONTHS</span>
          </div>
          <div>
            <strong>100%</strong>
            <span>REMOTE FORMAT</span>
          </div>
          <div>
            <strong>{countryCount}</strong>
            <span>COUNTRIES REPRESENTED</span>
          </div>
        </div>
      </header>

      {/* ---- Manager toolbar ---- */}
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

      <footer className="app-footer">
        <img
          src="/tailored-engineering.png"
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
