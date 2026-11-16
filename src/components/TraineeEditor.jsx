import { useState } from "react";
import { createPortal } from "react-dom";
import { ENGLISH_LEVELS, STATUSES } from "../data.js";

const inputCls =
  "w-full rounded-lg border border-line bg-card px-3 py-2 text-sm text-ink focus:border-gold focus:outline-none";

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-bold tracking-wider text-ink/60 uppercase">
        {label}
      </span>
      {children}
    </label>
  );
}

export default function TraineeEditor({ trainee, onSave, onClose }) {
  const [form, setForm] = useState({
    ...trainee,
    skillsText: (trainee.skills || []).join(", "),
  });

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  function handleSubmit(e) {
    e.preventDefault();
    const { skillsText, ...rest } = form;
    onSave({
      ...rest,
      communication: Number(rest.communication) || 0,
      skills: skillsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      // keep QR in sync with LinkedIn if left empty
      qrLink: rest.qrLink || rest.linkedin || "",
    });
    onClose();
  }

  const text = (key, label, type = "text") => (
    <Field label={label}>
      <input
        type={type}
        className={inputCls}
        value={form[key] || ""}
        onChange={set(key)}
      />
    </Field>
  );

  return createPortal(
    <div
      className="fixed inset-0 z-[110] flex items-start justify-center overflow-y-auto bg-[rgba(61,48,39,0.55)] p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="my-6 w-full max-w-[720px] rounded-[22px] border border-line bg-card p-6 shadow-xl sm:p-8"
      >
        <h2 className="m-0 mb-5 font-serif text-[26px] text-gold-deep">
          Edit {trainee.name || "trainee"}
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {text("name", "Name")}
          {text("photo", "Photo file (e.g. abed.jpeg)")}
          {text("from", "From")}
          {text("livingIn", "Living in")}

          <Field label="English level">
            <select
              className={inputCls}
              value={form.englishLevel}
              onChange={set("englishLevel")}
            >
              {ENGLISH_LEVELS.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </Field>

          <Field label="Communication (0–10)">
            <input
              type="number"
              min="0"
              max="10"
              className={inputCls}
              value={form.communication}
              onChange={set("communication")}
            />
          </Field>

          <Field label="Status">
            <select
              className={inputCls}
              value={form.status}
              onChange={set("status")}
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </Field>

          {text("email", "Email", "email")}
          {text("phone", "Phone")}
          {text("linkedin", "LinkedIn URL")}
          {text("github", "GitHub URL")}
          {text("portfolio", "Portfolio URL")}
          {text("qrLink", "QR link")}
        </div>

        <div className="mt-4 flex flex-col gap-4">
          <Field label="Skills (comma separated)">
            <input
              className={inputCls}
              value={form.skillsText}
              onChange={set("skillsText")}
            />
          </Field>
          <Field label="Short intro">
            <textarea
              rows={4}
              className={inputCls}
              value={form.shortIntro || ""}
              onChange={set("shortIntro")}
            />
          </Field>
          <Field label="Work experience">
            <textarea
              rows={4}
              className={inputCls}
              value={form.experience || ""}
              onChange={set("experience")}
            />
          </Field>
          <Field label="Notes">
            <textarea
              rows={2}
              className={inputCls}
              value={form.notes || ""}
              onChange={set("notes")}
            />
          </Field>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" className="btn" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Save
          </button>
        </div>
      </form>
    </div>,
    document.body,
  );
}
