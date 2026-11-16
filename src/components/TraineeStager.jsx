import { useEffect, useState } from "react";
import { ExpandedCard } from "./TraineeCard.jsx";
import TraineeEditor from "./TraineeEditor.jsx";

const SQRT_5000 = Math.sqrt(5000);
const mod = (a, n) => ((a % n) + n) % n;

function Arrow({ dir }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path d={dir === "left" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
    </svg>
  );
}

function StaggerCard({ trainee: t, position, size, onMove, onExpand, onEdit }) {
  const isCenter = position === 0;
  const skills = t.skills || [];
  const shown = skills.slice(0, 3);
  const extra = skills.length - shown.length;

  return (
    <div
      onClick={() => onMove(position)}
      className={`absolute top-1/2 left-1/2 cursor-pointer border-2 p-6 transition-all duration-500 ease-in-out ${
        isCenter
          ? "z-10 border-gold-deep bg-gold-deep text-white"
          : "z-0 border-line bg-card text-ink hover:border-gold"
      }`}
      style={{
        width: size.w,
        height: size.h,
        clipPath:
          "polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)",
        transform: `
          translate(-50%, -50%)
          translateX(${(size.w / 1.5) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        boxShadow: isCenter
          ? "0px 8px 0px 4px rgba(193,154,91,0.35)"
          : "0px 0px 0px 0px transparent",
      }}
    >
      {/* diagonal line along the cut corner */}
      <span
        className={`absolute block origin-top-right rotate-45 ${
          isCenter ? "bg-white/40" : "bg-line"
        }`}
        style={{ right: -2, top: 48, width: SQRT_5000, height: 2 }}
      />

      <img
        src={t.photo || "/default-avatar.svg"}
        alt={t.name}
        className="mb-4 h-16 w-14 bg-cream-2 object-cover object-top"
        style={{ boxShadow: "3px 3px 0px rgba(47,37,29,0.25)" }}
      />

      <h3
        className={`m-0 mb-1 font-serif text-[22px] leading-[1.15] font-semibold ${
          isCenter ? "text-white" : "text-gold-deep"
        }`}
      >
        {t.name}
      </h3>
      <p
        className={`m-0 mb-3 text-[13px] ${
          isCenter ? "text-white/80" : "text-ink-soft"
        }`}
      >
        {t.from} {t.livingIn ? `• ${t.livingIn}` : ""}
      </p>

      <p
        className={`m-0 mb-3 text-[12px] font-semibold tracking-wider uppercase ${
          isCenter ? "text-white/80" : "text-ink/60"
        }`}
      >
        English {t.englishLevel || "—"} · Comm.{" "}
        {t.communication ? `${t.communication}/10` : "—"}
      </p>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {shown.map((s) => (
          <span
            key={s}
            className={`rounded-md border px-2 py-1 text-[11px] font-medium ${
              isCenter
                ? "border-white/30 bg-white/15 text-white"
                : "border-line/50 bg-cream-2 text-ink-soft"
            }`}
          >
            {s}
          </span>
        ))}
        {extra > 0 && (
          <span
            className={`px-1 py-1 text-[11px] font-medium ${
              isCenter ? "text-white/80" : "text-ink-soft"
            }`}
          >
            +{extra}
          </span>
        )}
      </div>

      {t.shortIntro && (
        <p
          className={`m-0 line-clamp-3 text-[13px] leading-[1.55] ${
            isCenter ? "text-white/90" : "text-ink"
          }`}
        >
          {t.shortIntro}
        </p>
      )}

      {isCenter && (
        <div className="absolute right-6 bottom-6 left-6 flex gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onExpand(t.id);
            }}
            className="flex-1 rounded-full border border-white/50 px-3 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-white hover:text-gold-deep"
          >
            View profile
          </button>
          {onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(t.id);
              }}
              className="rounded-full border border-white/50 px-4 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-white hover:text-gold-deep"
            >
              Edit
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function TraineeStagger({ trainees, onEdit }) {
  const [size, setSize] = useState({ w: 340, h: 440 });
  const [offset, setOffset] = useState(0);
  const [expandedId, setExpandedId] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const update = () =>
      setSize(mq.matches ? { w: 340, h: 440 } : { w: 280, h: 420 });
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const n = trainees.length;
  if (n === 0) return null;

  const c = Math.floor(n / 2); // index that sits in the center
  const move = (steps) => setOffset((o) => o + steps);

  const expanded = trainees.find((t) => t.id === expandedId);
  const editing = trainees.find((t) => t.id === editingId);

  return (
    <>
      <div
        className="relative w-full overflow-hidden rounded-[22px] bg-cream-2/40"
        style={{ height: 640 }}
      >
        {trainees.map((t, j) => {
          const idx = j - offset + c;
          const position = mod(idx, n) - c;
          // "lap" changes when a card wraps around, so it remounts
          // instead of sweeping across the whole carousel
          const lap = Math.floor(idx / n);
          return (
            <StaggerCard
              key={`${t.id}-${lap}`}
              trainee={t}
              position={position}
              size={size}
              onMove={move}
              onExpand={setExpandedId}
              onEdit={onEdit ? setEditingId : undefined}
            />
          );
        })}

        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {[
            { dir: "left", step: -1, label: "Previous trainee" },
            { dir: "right", step: 1, label: "Next trainee" },
          ].map(({ dir, step, label }) => (
            <button
              key={dir}
              type="button"
              onClick={() => move(step)}
              aria-label={label}
              className="flex h-14 w-14 items-center justify-center border-2 border-line bg-card text-ink transition-colors hover:bg-gold-deep hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              <Arrow dir={dir} />
            </button>
          ))}
        </div>
      </div>

      {expanded && (
        <ExpandedCard t={expanded} onClose={() => setExpandedId(null)} />
      )}
      {editing && (
        <TraineeEditor
          trainee={editing}
          onSave={onEdit}
          onClose={() => setEditingId(null)}
        />
      )}
    </>
  );
}
