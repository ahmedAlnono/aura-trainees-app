import { useState } from "react";
import { ENGLISH_LEVELS, STATUSES } from "../data.js";

/* Shared input styling */
const field =
  "w-full rounded-[10px] border-[1.5px] border-line bg-white px-3 py-2.5 font-sans text-sm font-normal tracking-normal text-ink normal-case focus:border-gold focus:outline-none";

/* Shared label styling */
const label =
  "flex flex-col gap-1.5 text-[10px] font-semibold tracking-[1.4px] text-ink-soft uppercase";

function Field({ children, className = "" }) {
  return <label className={`${label} ${className}`}>{children}</label>;
}

export default function TraineeForm({ initial, isEdit, onSave, onClose }) {
  const [form, setForm] = useState({ ...initial });
  const [skillsText, setSkillsText] = useState(
    (initial.skills || []).join(", "),
  );
  const [error, setError] = useState("");

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }
    if (form.qrLink && !isValidUrl(form.qrLink)) {
      setError("QR link must be a valid URL (https://…).");
      return;
    }
    const data = {
      ...form,
      name: form.name.trim(),
      skills: skillsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 12),
    };
    onSave(data);
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {/* ---------- header ---------- */}
        <div className="mb-[18px] flex items-center justify-between">
          <h2 className="m-0 font-serif text-[26px] font-medium">
            {isEdit ? "Edit trainee" : "Add trainee"}
          </h2>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* ---------- form ---------- */}
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <Field>
              Full name *
              <input
                className={field}
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
              />
            </Field>
            <Field>
              Status
              <select
                className={field}
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
              >
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <Field>
              From
              <input
                className={field}
                value={form.from}
                onChange={(e) => set("from", e.target.value)}
                placeholder="Palestine"
              />
            </Field>
            <Field>
              Living in
              <input
                className={field}
                value={form.livingIn}
                onChange={(e) => set("livingIn", e.target.value)}
                placeholder="Spain"
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <Field>
              English level
              <select
                className={field}
                value={form.englishLevel}
                onChange={(e) => set("englishLevel", e.target.value)}
              >
                {ENGLISH_LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </Field>
            <Field>
              Communication ({form.communication}/10)
              <input
                type="range"
                min="1"
                max="10"
                value={form.communication}
                onChange={(e) => set("communication", Number(e.target.value))}
                className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-cream-3 accent-gold-deep"
              />
            </Field>
          </div>

          <Field>
            Skills (comma-separated)
            <input
              className={field}
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              placeholder="React, English, Project Management"
            />
          </Field>

          <Field>
            Short intro
            <textarea
              className={field}
              rows="3"
              value={form.shortIntro}
              onChange={(e) => set("shortIntro", e.target.value)}
            />
          </Field>

          <Field>
            Work experience
            <textarea
              className={field}
              rows="4"
              value={form.experience}
              onChange={(e) => set("experience", e.target.value)}
              placeholder="2021–2024 · Frontend Developer @ …"
            />
          </Field>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <Field>
              Email
              <input
                className={field}
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
              />
            </Field>
            <Field>
              Phone
              <input
                className={field}
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <Field>
              LinkedIn
              <input
                className={field}
                value={form.linkedin}
                onChange={(e) => set("linkedin", e.target.value)}
                placeholder="https://linkedin.com/in/…"
              />
            </Field>
            <Field>
              GitHub
              <input
                className={field}
                value={form.github}
                onChange={(e) => set("github", e.target.value)}
                placeholder="https://github.com/…"
              />
            </Field>
          </div>

          <Field>
            Portfolio / other link
            <input
              className={field}
              value={form.portfolio}
              onChange={(e) => set("portfolio", e.target.value)}
              placeholder="https://…"
            />
          </Field>

          <Field>
            QR code link (scans to this URL)
            <input
              className={field}
              value={form.qrLink}
              onChange={(e) => set("qrLink", e.target.value)}
              placeholder="https://linkedin.com/in/…"
            />
          </Field>

          <Field>
            Internal notes (not on the card)
            <textarea
              className={field}
              rows="2"
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
            />
          </Field>

          {error && (
            <p className="m-0 text-[13px] text-danger" role="alert">
              {error}
            </p>
          )}

          <div className="mt-2 flex justify-end gap-2.5">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {isEdit ? "Save changes" : "Add trainee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function isValidUrl(str) {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}
