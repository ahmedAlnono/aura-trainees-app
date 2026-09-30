import { QRCodeSVG } from "qrcode.react";

export default function TraineeCard({ trainee: t, onEdit, onDelete }) {
  return (
    <article className="card h-full">
      {/* ---------- top: QR + identity ---------- */}
      <div className="flex items-start gap-[18px]">
        <div
          className="flex h-28 w-28 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-cream-2 transition-[transform,box-shadow] duration-[450ms] ease-[cubic-bezier(.22,1,.36,1)]"
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
            <div className="flex h-28 w-28 items-center justify-center rounded-xl border border-line bg-cream-2 text-center font-serif text-[12px] leading-tight tracking-[0.5px] text-gold-deep">
              QR
              <br />
              CODE
            </div>
          )}
        </div>

        <div className="min-w-0 pt-0.5">
          <h2 className="m-0 mb-2.5 font-serif text-[22px] leading-[1.2] font-semibold tracking-[-0.1px] text-gold-deep">
            {t.name}
          </h2>

          <p className="m-0 mb-[3px] text-[13.5px] leading-[1.55] text-ink">
            <span className="mr-0.5 font-bold text-ink">From:</span>{" "}
            {t.from || "—"}
          </p>
          <p className="m-0 mb-[3px] text-[13.5px] leading-[1.55] text-ink">
            <span className="mr-0.5 font-bold text-ink">Living in:</span>{" "}
            {t.livingIn || "—"}
          </p>

          {t.linkedin && (
            <p className="mt-2 mb-0 text-[12.5px] leading-normal break-all">
              <a
                href={t.linkedin}
                target="_blank"
                rel="noreferrer"
                className="link-sweep text-ink-soft no-underline transition-colors duration-300 hover:text-gold-deep"
              >
                {t.linkedin.replace(/^https?:\/\//, "")}
              </a>
            </p>
          )}
        </div>
      </div>

      {/* ---------- inline levels ---------- */}
      <div className="grid grid-cols-2 gap-x-5 gap-y-2">
        <p className="m-0 text-[13.5px] leading-normal text-ink">
          <span className="mr-0.5 font-bold text-ink">English level:</span>{" "}
          <span className="font-medium text-ink-soft">
            {t.englishLevel || "???"}
          </span>
        </p>
        <p className="m-0 text-[13.5px] leading-normal text-ink">
          <span className="mr-0.5 font-bold text-ink">Communication:</span>{" "}
          <span className="font-medium text-ink-soft">
            {t.communication ? `${t.communication}/10` : "???"}
          </span>
        </p>
      </div>

      {/* ---------- skills ---------- */}
      {(t.skills || []).length > 0 && (
        <div className="flex flex-col">
          <h3 className="mb-2 font-sans text-[13.5px] font-bold text-ink">
            Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {t.skills.map((s) => (
              <span className="pill" key={s}>
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ---------- short intro ---------- */}
      {t.shortIntro && (
        <div className="flex flex-col">
          <h3 className="mb-2 font-sans text-[13.5px] font-bold text-ink">
            Short intro
          </h3>
          <p className="m-0 text-[13.5px] leading-[1.6] text-ink">
            {t.shortIntro}
          </p>
        </div>
      )}

      {/* ---------- experience (collapsible) ---------- */}
      {t.experience && (
        <details className="exp group/exp">
          <summary className="cursor-pointer list-none text-[12.5px] font-bold text-ink transition-colors duration-200 hover:text-gold-deep [&::-webkit-details-marker]:hidden">
            <span className="inline-block text-gold-deep transition-transform duration-300 group-open/exp:rotate-90">
              ▸
            </span>{" "}
            Work experience
          </summary>
          <p className="mt-2 mb-0 text-[13px] leading-[1.6] whitespace-pre-wrap text-ink-soft">
            {t.experience}
          </p>
        </details>
      )}

      {/* ---------- pinned footer: contact + actions ---------- */}
      <div className="mt-auto flex flex-col gap-4 pt-1">
        {(t.email || t.phone || t.linkedin || t.github || t.portfolio) && (
          <div className="flex flex-wrap gap-4 border-t border-cream-2 pt-3.5">
            {t.email && (
              <a
                href={`mailto:${t.email}`}
                title={t.email}
                className="link-sweep text-[12.5px] font-semibold break-all text-gold-deep no-underline"
              >
                ✉ Email
              </a>
            )}
            {t.phone && (
              <a
                href={`tel:${t.phone}`}
                title={t.phone}
                className="link-sweep text-[12.5px] font-semibold break-all text-gold-deep no-underline"
              >
                ☎ Phone
              </a>
            )}
            {t.linkedin && (
              <a
                href={t.linkedin}
                target="_blank"
                rel="noreferrer"
                className="link-sweep text-[12.5px] font-semibold break-all text-gold-deep no-underline"
              >
                in LinkedIn
              </a>
            )}
            {t.github && (
              <a
                href={t.github}
                target="_blank"
                rel="noreferrer"
                className="link-sweep text-[12.5px] font-semibold break-all text-gold-deep no-underline"
              >
                ⧉ GitHub
              </a>
            )}
            {t.portfolio && (
              <a
                href={t.portfolio}
                target="_blank"
                rel="noreferrer"
                className="link-sweep text-[12.5px] font-semibold break-all text-gold-deep no-underline"
              >
                ➤ Portfolio
              </a>
            )}
          </div>
        )}

        <div className="no-print flex justify-end gap-2 border-t border-cream-2 pt-3">
          <button className="btn btn-ghost btn-sm" onClick={() => onEdit(t)}>
            Edit
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => onDelete(t.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
