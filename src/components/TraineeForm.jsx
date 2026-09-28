import { useState } from 'react'
import { ENGLISH_LEVELS, STATUSES } from '../data.js'

export default function TraineeForm({ initial, isEdit, onSave, onClose }) {
  const [form, setForm] = useState({ ...initial })
  const [skillsText, setSkillsText] = useState((initial.skills || []).join(', '))
  const [error, setError] = useState('')

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) { setError('Name is required.'); return }
    if (form.qrLink && !isValidUrl(form.qrLink)) { setError('QR link must be a valid URL (https://…).'); return }
    const data = {
      ...form,
      name: form.name.trim(),
      skills: skillsText.split(',').map(s => s.trim()).filter(Boolean).slice(0, 12),
    }
    onSave(data)
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <h2>{isEdit ? 'Edit trainee' : 'Add trainee'}</h2>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <div className="row">
            <label>Full name *<input value={form.name} onChange={e => set('name', e.target.value)} /></label>
            <label>Status
              <select value={form.status} onChange={e => set('status', e.target.value)}>
                {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </label>
          </div>

          <div className="row">
            <label>From<input value={form.from} onChange={e => set('from', e.target.value)} placeholder="Palestine" /></label>
            <label>Living in<input value={form.livingIn} onChange={e => set('livingIn', e.target.value)} placeholder="Spain" /></label>
          </div>

          <div className="row">
            <label>English level
              <select value={form.englishLevel} onChange={e => set('englishLevel', e.target.value)}>
                {ENGLISH_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </label>
            <label>Communication ({form.communication}/10)
              <input type="range" min="1" max="10" value={form.communication}
                onChange={e => set('communication', Number(e.target.value))} />
            </label>
          </div>

          <label>Skills (comma-separated)
            <input value={skillsText} onChange={e => setSkillsText(e.target.value)} placeholder="React, English, Project Management" />
          </label>

          <label>Short intro
            <textarea rows="3" value={form.shortIntro} onChange={e => set('shortIntro', e.target.value)} />
          </label>

          <label>Work experience
            <textarea rows="4" value={form.experience} onChange={e => set('experience', e.target.value)}
              placeholder="2021–2024 · Frontend Developer @ …" />
          </label>

          <div className="row">
            <label>Email<input type="email" value={form.email} onChange={e => set('email', e.target.value)} /></label>
            <label>Phone<input value={form.phone} onChange={e => set('phone', e.target.value)} /></label>
          </div>

          <div className="row">
            <label>LinkedIn<input value={form.linkedin} onChange={e => set('linkedin', e.target.value)} placeholder="https://linkedin.com/in/…" /></label>
            <label>GitHub<input value={form.github} onChange={e => set('github', e.target.value)} placeholder="https://github.com/…" /></label>
          </div>

          <label>Portfolio / other link<input value={form.portfolio} onChange={e => set('portfolio', e.target.value)} placeholder="https://…" /></label>

          <label>QR code link (scans to this URL)
            <input value={form.qrLink} onChange={e => set('qrLink', e.target.value)} placeholder="https://linkedin.com/in/…" />
          </label>

          <label>Internal notes (not on the card)
            <textarea rows="2" value={form.notes} onChange={e => set('notes', e.target.value)} />
          </label>

          {error && <p className="error">{error}</p>}

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">{isEdit ? 'Save changes' : 'Add trainee'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function isValidUrl(str) {
  try { new URL(str); return true } catch { return false }
}
