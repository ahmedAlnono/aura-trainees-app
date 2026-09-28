import { QRCodeSVG } from "qrcode.react";
import { STATUSES } from "../data.js";

const statusClass = (s) => `status status-${s}`;

export default function TraineeCard({ trainee: t, onEdit, onDelete }) {
  const status = STATUSES.find((s) => s.value === t.status);

  return (
    <article className="card">
      <div className="card-top">
        <div>
          <h2 className="card-name">{t.name}</h2>
          <p className="card-loc">
            <span className="muted">FROM</span> {t.from || "—"}
            <br />
            <span className="muted">LIVING IN</span> {t.livingIn || "—"}
          </p>
          <span className={statusClass(t.status)}>
            {status?.label || t.status}
          </span>
        </div>

        <div className="qr" title={t.qrLink ? t.qrLink : "No link set"}>
          {t.qrLink ? (
            <QRCodeSVG value={t.qrLink} size={76} level="M" fgColor="#3b2a20" />
          ) : (
            <div className="qr-placeholder">
              QR —<br />
              LINKEDIN
            </div>
          )}
        </div>
      </div>

      <div className="levels">
        <div>
          <span className="muted">ENGLISH LEVEL</span>
          <div className="level-bar">
            <i style={{ width: `${levelToPct(t.englishLevel)}%` }} />
          </div>
          <small>{t.englishLevel}</small>
        </div>
        <div>
          <span className="muted">COMMUNICATION</span>
          <div className="level-bar">
            <i style={{ width: `${t.communication * 10}%` }} />
          </div>
          <small>{t.communication}/10</small>
        </div>
      </div>

      {(t.skills || []).length > 0 && (
        <div className="skills">
          {t.skills.map((s) => (
            <span className="pill" key={s}>
              {s}
            </span>
          ))}
        </div>
      )}

      {t.shortIntro && <p className="intro">{t.shortIntro}</p>}
      {t.experience && (
        <details className="exp">
          <summary>Work experience</summary>
          <p>{t.experience}</p>
        </details>
      )}

      <div className="contact">
        {t.email && (
          <a href={`mailto:${t.email}`} title={t.email}>
            ✉ Email
          </a>
        )}
        {t.phone && (
          <a href={`tel:${t.phone}`} title={t.phone}>
            ☎ Phone
          </a>
        )}
        {t.linkedin && (
          <a href={t.linkedin} target="_blank" rel="noreferrer">
            in LinkedIn
          </a>
        )}
        {t.github && (
          <a href={t.github} target="_blank" rel="noreferrer">
            ⧉ GitHub
          </a>
        )}
        {t.portfolio && (
          <a href={t.portfolio} target="_blank" rel="noreferrer">
            ➤ Portfolio
          </a>
        )}
      </div>

      <div className="card-actions">
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
    </article>
  );
}

function levelToPct(level) {
  const map = { A1: 15, A2: 30, B1: 50, B2: 65, C1: 82, C2: 100 };
  return map[level] ?? 0;
}
