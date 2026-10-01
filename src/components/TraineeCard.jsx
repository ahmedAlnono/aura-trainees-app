import { useState } from "react";
import { createPortal } from "react-dom";
import { QRCodeSVG } from "qrcode.react";
import { STATUSES } from "../data.js";

function getStatusColor(status) {
  const colors = {
    active: "bg-green-100 text-green-800 border-green-200",
    graduated: "bg-blue-100 text-blue-800 border-blue-200",
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    default: "bg-gray-100 text-gray-800 border-gray-200",
  };
  return colors[status] || colors.default;
}

/* ------------------------------------------------------------------ *
 * Expand icon
 * ------------------------------------------------------------------ */
function ExpandIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
    </svg>
  );
}

function CloseIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

/* ------------------------------------------------------------------ *
 * Shared contact link row
 * ------------------------------------------------------------------ */
function ContactLinks({ t, size = "sm" }) {
  const cls =
    size === "lg"
      ? "link-sweep text-[13px] font-semibold text-gold-deep no-underline hover:opacity-80"
      : "link-sweep text-[12px] font-semibold text-gold-deep no-underline hover:opacity-80";

  const hasAny = t.email || t.linkedin || t.github || t.portfolio;
  if (!hasAny) return null;

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-line/30 pt-4">
      {t.email && (
        <a href={`mailto:${t.email}`} className={cls}>
          ✉ Email
        </a>
      )}
      {t.linkedin && (
        <a href={t.linkedin} target="_blank" rel="noreferrer" className={cls}>
          in LinkedIn
        </a>
      )}
      {t.github && (
        <a href={t.github} target="_blank" rel="noreferrer" className={cls}>
          ⧉ GitHub
        </a>
      )}
      {t.portfolio && (
        <a href={t.portfolio} target="_blank" rel="noreferrer" className={cls}>
          ➤ Portfolio
        </a>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Full-screen expanded view
 * ------------------------------------------------------------------ */
function ExpandedCard({ t, onClose }) {
  return createPortal(
    <div
      className="expanded-backdrop fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-[rgba(61,48,39,0.55)] p-4 backdrop-blur-sm sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${t.name} — full profile`}
    >
      <div
        className="expanded-panel relative my-6 w-full max-w-[720px] overflow-hidden rounded-[22px] border border-line bg-card shadow-[0_24px_70px_rgba(61,48,39,0.35)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-line bg-card text-ink-soft transition-colors duration-200 hover:border-gold hover:bg-gold hover:text-white"
          aria-label="Close"
        >
          <CloseIcon className="h-4 w-4" />
        </button>

        {/* ---------- Header ---------- */}
        <div className="border-b border-line/30 p-6 pb-5 sm:p-8 sm:pb-6">
          <div className="flex items-start gap-5">
            <div className="relative h-20 w-20 flex-shrink-0">
              <img
                src={t.photo || "/default-avatar.svg"}
                alt={t.name}
                className="h-full w-full rounded-full border-2 border-cream-2 object-cover"
              />
              <div
                className={`absolute -right-1 -bottom-1 h-5 w-5 rounded-full border-2 border-white ${
                  t.status === "active"
                    ? "bg-green-500"
                    : t.status === "graduated"
                      ? "bg-blue-500"
                      : t.status === "pending"
                        ? "bg-yellow-500"
                        : "bg-gray-400"
                }`}
                title={STATUSES.find((s) => s.value === t.status)?.label}
              />
            </div>

            <div className="min-w-0 flex-1 pr-10">
              <h2 className="m-0 mb-1.5 font-serif text-[26px] leading-[1.15] font-semibold tracking-[-0.2px] text-gold-deep sm:text-[30px]">
                {t.name}
              </h2>
              <p className="m-0 text-[14px] leading-[1.5] text-ink-soft">
                {t.from} {t.livingIn ? `• ${t.livingIn}` : ""}
              </p>
              {t.status && (
                <span
                  className={`mt-2.5 inline-block rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${getStatusColor(
                    t.status,
                  )}`}
                >
                  {STATUSES.find((s) => s.value === t.status)?.label ||
                    t.status}
                </span>
              )}
            </div>

            {/* QR */}
            <div className="hidden flex-shrink-0 sm:block">
              <div
                className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-xl border border-line/50 bg-cream-2"
                title={t.qrLink || "No link set"}
              >
                {t.qrLink ? (
                  <QRCodeSVG
                    value={t.qrLink}
                    size={112}
                    level="M"
                    fgColor="#2f251d"
                    bgColor="#f1e7d4"
                  />
                ) : (
                  <span className="text-center text-[10px] leading-none font-bold text-gold-deep/50 uppercase">
                    No
                    <br />
                    QR
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ---------- Body ---------- */}
        <div className="flex flex-col gap-5 p-6 sm:p-8">
          {/* Levels */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <span className="mb-1 block text-[11px] font-bold tracking-wider text-ink/60 uppercase">
                English level
              </span>
              <span className="text-[15px] font-medium text-ink">
                {t.englishLevel || "—"}
              </span>
            </div>
            <div>
              <span className="mb-1 block text-[11px] font-bold tracking-wider text-ink/60 uppercase">
                Communication
              </span>
              <span className="text-[15px] font-medium text-ink">
                {t.communication ? `${t.communication}/10` : "—"}
              </span>
            </div>
          </div>

          {/* Skills */}
          {(t.skills || []).length > 0 && (
            <div>
              <h3 className="mb-2.5 font-sans text-[12px] font-bold tracking-wider text-ink/70 uppercase">
                Core Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {t.skills.map((s) => (
                  <span
                    key={s}
                    className="pill rounded-md border border-line/50 bg-cream-2 px-3 py-1.5 text-[12.5px] font-medium text-ink-soft"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Short intro — full, no clamp */}
          {t.shortIntro && (
            <div>
              <h3 className="mb-2.5 font-sans text-[12px] font-bold tracking-wider text-ink/70 uppercase">
                About
              </h3>
              <p className="m-0 text-[14px] leading-[1.7] text-ink">
                {t.shortIntro}
              </p>
            </div>
          )}

          {/* Experience */}
          {t.experience && (
            <div>
              <h3 className="mb-2.5 font-sans text-[12px] font-bold tracking-wider text-ink/70 uppercase">
                Work experience
              </h3>
              <p className="m-0 border-l-2 border-cream-2 pl-4 text-[13.5px] leading-[1.7] whitespace-pre-wrap text-ink-soft">
                {t.experience}
              </p>
            </div>
          )}

          {/* Contact links */}
          <ContactLinks t={t} size="lg" />
        </div>
      </div>
    </div>,
    document.body,
  );
}

/* ------------------------------------------------------------------ *
 * TraineeCard
 * ------------------------------------------------------------------ */
export default function TraineeCard({ trainee: t, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <article className="card group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line/50 bg-card transition-all duration-300 hover:border-gold/30 hover:shadow-lg">
        {/* ---------- Expand button — absolute top-right ---------- */}
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="expand-btn absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-line bg-card/80 text-ink-soft opacity-70 backdrop-blur-sm transition-all duration-200 hover:border-gold hover:bg-gold hover:text-white hover:opacity-100"
          aria-label={`Expand ${t.name}'s profile`}
          title="View full profile"
        >
          <ExpandIcon className="h-4 w-4" />
        </button>

        {/* ---------- Header: Avatar, Identity & QR ---------- */}
        <div className="border-b border-line/30 p-5 pb-4">
          <div className="flex items-start gap-4">
            {/* Small Avatar */}
            <div className="relative h-16 w-16 flex-shrink-0">
              <img
                src={t.photo || "/default-avatar.svg"}
                alt={t.name}
                className="h-full w-full rounded-full border-2 border-cream-2 object-cover"
              />
              <div
                className={`absolute -right-1 -bottom-1 h-4 w-4 rounded-full border-2 border-white ${
                  t.status === "active"
                    ? "bg-green-500"
                    : t.status === "graduated"
                      ? "bg-blue-500"
                      : t.status === "pending"
                        ? "bg-yellow-500"
                        : "bg-gray-400"
                }`}
                title={STATUSES.find((s) => s.value === t.status)?.label}
              />
            </div>

            {/* Name & Location — padded right so it doesn't collide with expand btn */}
            <div className="min-w-0 flex-1 pt-1 pr-9">
              <h2 className="m-0 mb-1 truncate font-serif text-[20px] leading-[1.2] font-semibold tracking-[-0.1px] text-gold-deep">
                {t.name}
              </h2>
              <p className="m-0 truncate text-[13px] leading-[1.4] text-ink-soft">
                {t.from} {t.livingIn ? `• ${t.livingIn}` : ""}
              </p>
            </div>

            {/* QR Code */}
            <div className="flex flex-shrink-0 items-start">
              <div
                className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg border border-line/50 bg-cream-2 transition-transform duration-300 group-hover:scale-105"
                title={t.qrLink || "No link set"}
              >
                {t.qrLink ? (
                  <QRCodeSVG
                    value={t.qrLink}
                    size={70}
                    level="M"
                    fgColor="#2f251d"
                    bgColor="#f1e7d4"
                  />
                ) : (
                  <span className="text-center text-[9px] leading-none font-bold text-gold-deep/50 uppercase">
                    No
                    <br />
                    QR
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5 pt-4">
          {/* ---------- Levels Grid ---------- */}
          <div className="mb-4 grid grid-cols-2 gap-x-4 gap-y-3">
            <div>
              <span className="mb-0.5 block text-[11px] font-bold tracking-wider text-ink/60 uppercase">
                English
              </span>
              <span className="text-sm font-medium text-ink">
                {t.englishLevel || "—"}
              </span>
            </div>
            <div>
              <span className="mb-0.5 block text-[11px] font-bold tracking-wider text-ink/60 uppercase">
                Communication
              </span>
              <span className="text-sm font-medium text-ink">
                {t.communication ? `${t.communication}/10` : "—"}
              </span>
            </div>
          </div>

          {/* ---------- Skills ---------- */}
          {(t.skills || []).length > 0 && (
            <div className="mb-4">
              <h3 className="mb-2 font-sans text-[12px] font-bold tracking-wider text-ink/70 uppercase">
                Core Skills
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {t.skills.map((s) => (
                  <span
                    key={s}
                    className="pill rounded-md border border-line/50 bg-cream-2 px-2.5 py-1 text-[11.5px] font-medium text-ink-soft"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ---------- Short Intro (clamped) ---------- */}
          {t.shortIntro && (
            <p className="m-0 mb-4 line-clamp-3 text-[13.5px] leading-[1.6] text-ink">
              {t.shortIntro}
            </p>
          )}

          {/* ---------- Experience (collapsible) ---------- */}
          {t.experience && (
            <details className="exp group/exp mb-auto">
              <summary className="flex cursor-pointer list-none items-center gap-1 text-[12.5px] font-bold text-ink transition-colors duration-200 hover:text-gold-deep [&::-webkit-details-marker]:hidden">
                <span className="inline-block text-gold-deep transition-transform duration-300 group-open/exp:rotate-90">
                  ▸
                </span>
                Work experience
              </summary>
              <p className="mt-2 mb-0 border-l-2 border-cream-2 pl-4 text-[13px] leading-[1.6] whitespace-pre-wrap text-ink-soft">
                {t.experience}
              </p>
            </details>
          )}

          {/* ---------- Footer: Contact Links ---------- */}
          <ContactLinks t={t} />
        </div>
      </article>

      {expanded && <ExpandedCard t={t} onClose={() => setExpanded(false)} />}
    </>
  );
}
