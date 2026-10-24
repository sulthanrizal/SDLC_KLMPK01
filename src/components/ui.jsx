/* ============================================================
   ui.jsx — komponen presentasional yang dipakai berulang
   ============================================================ */

import { useEffect, useId, cloneElement, isValidElement } from 'react';
import Icon from './Icon.jsx';
import { STATUS, ITEM_STATUS, STATUS_FLOW } from '../data/seed.js';

/* ---------- Card ---------- */

export function Card({ title, sub, actions, children, tight = false }) {
  return (
    <section className="card">
      {(title || actions) && (
        <header className="card-head">
          {title && <h2>{title}</h2>}
          <div className="spacer" />
          {actions}
          {sub && <p className="sub">{sub}</p>}
        </header>
      )}
      <div className={`card-body${tight ? ' tight' : ''}`}>{children}</div>
    </section>
  );
}

/* ---------- Traceability chips ----------
   Menampilkan ID requirement/story/AC yang dipenuhi layar ini,
   supaya dosen bisa menelusuri layar → dokumen P9–P12.           */

export function TraceChips({ req = [], story = [], ac = [] }) {
  return (
    <div className="trace">
      <span>Traceability:</span>
      {story.map((s) => (
        <span key={s} className="chip">{s}</span>
      ))}
      {req.map((r) => (
        <span key={r} className="chip chip-r">{r}</span>
      ))}
      {ac.map((a) => (
        <span key={a} className="chip chip-ac">{a}</span>
      ))}
    </div>
  );
}

/* ---------- Page header ---------- */

export function PageHead({ title, desc, trace, actions }) {
  return (
    <div className="stack" style={{ gap: 10, marginBottom: 18 }}>
      <div className="row" style={{ alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ fontSize: 20 }}>{title}</h2>
          {desc && <p className="muted small" style={{ marginTop: 4 }}>{desc}</p>}
        </div>
        {actions}
      </div>
      {trace && <TraceChips {...trace} />}
    </div>
  );
}

/* ---------- Badge status ---------- */

const REPORT_TONE = {
  [STATUS.DILAPORKAN]: 'badge',
  [STATUS.COCOK]: 'badge badge-info',
  [STATUS.TUNGGU]: 'badge badge-warn',
  [STATUS.SIAP]: 'badge badge-brand',
  [STATUS.SELESAI]: 'badge badge-ok',
  [STATUS.DITOLAK]: 'badge badge-danger'
};

const ITEM_TONE = {
  [ITEM_STATUS.DISIMPAN]: 'badge',
  [ITEM_STATUS.DICOCOKKAN]: 'badge badge-info',
  [ITEM_STATUS.TUNGGU]: 'badge badge-warn',
  [ITEM_STATUS.DISERAHKAN]: 'badge badge-ok'
};

export function StatusBadge({ status, kind = 'report' }) {
  const cls = (kind === 'item' ? ITEM_TONE : REPORT_TONE)[status] || 'badge';
  return (
    <span className={cls}>
      <span className="dot" />
      {status}
    </span>
  );
}

export function HighValueBadge() {
  return (
    <span className="badge badge-warn" title="Barang high-value — verifikasi lebih ketat (C2, C3)">
      <Icon name="lock" size={12} />
      High-value
    </span>
  );
}

/* ---------- Empty state ---------- */

export function EmptyState({ icon = 'inbox', title, children }) {
  return (
    <div className="empty">
      <Icon name={icon} size={28} />
      <strong>{title}</strong>
      {children && <p className="small">{children}</p>}
    </div>
  );
}

/* ---------- Callout ---------- */

export function Callout({ tone = '', icon = 'info', title, children }) {
  return (
    <div className={`callout${tone ? ` callout-${tone}` : ''}`}>
      <Icon name={icon} size={17} />
      <div>
        {title && <strong>{title}</strong>}
        {title && children ? ' ' : null}
        {children}
      </div>
    </div>
  );
}

/* ---------- Field ---------- */

export function Field({ label, required, help, error, children, htmlFor }) {
  /* Aksesibilitas (ST-01): hubungkan teks bantuan & pesan error ke input
     lewat aria-describedby, tandai input invalid, dan umumkan error ke
     screen reader dengan role="alert". Atribut disuntikkan ke child tunggal
     (input/select/textarea) sehingga pemakaian Field di halaman lain tetap
     otomatis ikut membaik tanpa perubahan apa pun. */
  const uid = useId();
  const helpId = help && !error ? `${uid}-help` : undefined;
  const errId = error ? `${uid}-err` : undefined;
  const describedBy = [helpId, errId].filter(Boolean).join(' ') || undefined;

  const control = isValidElement(children)
    ? cloneElement(children, {
        'aria-invalid': error ? 'true' : undefined,
        'aria-describedby': describedBy
      })
    : children;

  return (
    <div className={`field${error ? ' invalid' : ''}`}>
      {label && (
        <label htmlFor={htmlFor}>
          {label} {required && <span className="req" title="Wajib diisi">*</span>}
        </label>
      )}
      {control}
      {help && !error && <span className="help" id={helpId}>{help}</span>}
      {error && <span className="error" id={errId} role="alert">{error}</span>}
    </div>
  );
}

/* ---------- Timeline status laporan (AC2.1) ---------- */

export function StatusTimeline({ report, highValue = false }) {
  /* Alur yang ditampilkan menyesuaikan high-value atau tidak:
     status "Menunggu Verifikasi Bukti" hanya berlaku untuk high-value (P11). */
  const flow = highValue ? STATUS_FLOW : STATUS_FLOW.filter((s) => s !== STATUS.TUNGGU);

  if (report.status === STATUS.DITOLAK) {
    return (
      <ul className="timeline">
        <li className="done">
          <div className="tl-rail"><span className="tl-dot" /><span className="tl-line" /></div>
          <div className="tl-body">
            <div className="tl-title">{STATUS.DILAPORKAN}</div>
          </div>
        </li>
        <li className="current">
          <div className="tl-rail"><span className="tl-dot" /></div>
          <div className="tl-body">
            <div className="tl-title">{STATUS.DITOLAK}</div>
            <div className="tl-meta">Klaim belum memenuhi syarat verifikasi. Barang tetap disimpan.</div>
          </div>
        </li>
      </ul>
    );
  }

  const idx = flow.indexOf(report.status);

  return (
    <ul className="timeline">
      {flow.map((s, i) => (
        <li key={s} className={i < idx ? 'done' : i === idx ? 'current' : ''}>
          <div className="tl-rail">
            <span className="tl-dot" />
            <span className="tl-line" />
          </div>
          <div className="tl-body">
            <div className="tl-title">{s}</div>
            {i === idx && <div className="tl-meta">Status saat ini</div>}
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ---------- Riwayat ---------- */

export function Riwayat({ items }) {
  return (
    <ul className="timeline">
      {items.map((r, i) => (
        <li key={i} className="done">
          <div className="tl-rail">
            <span className="tl-dot" />
            <span className="tl-line" />
          </div>
          <div className="tl-body">
            <div className="tl-title">{r.teks}</div>
            <div className="tl-meta">{fmtDateTime(r.waktu)} · {r.oleh}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ---------- Modal ---------- */

export function Modal({ title, onClose, children, footer }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="modal-root">
      <div className="modal-scrim" onClick={onClose} />
      <div className="modal" role="dialog" aria-modal="true" aria-label={title}>
        <header className="modal-head">
          <h2>{title}</h2>
          <button type="button" className="btn btn-ghost btn-icon" onClick={onClose} aria-label="Tutup">
            <Icon name="x" />
          </button>
        </header>
        <div className="modal-body">{children}</div>
        {footer && <footer className="modal-foot">{footer}</footer>}
      </div>
    </div>
  );
}

/* ---------- Toast ---------- */

export function ToastStack({ toasts, onDismiss }) {
  return (
    <div className="toast-stack" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.tone}`} onClick={() => onDismiss(t.id)}>
          <Icon name={t.tone === 'danger' ? 'alert' : t.tone === 'ok' ? 'check' : 'info'} />
          <div>
            <div className="t">{t.title}</div>
            {t.message && <div className="m">{t.message}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Format ---------- */

const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

export function fmtDate(iso) {
  if (!iso) return '-';
  const [y, m, d] = iso.slice(0, 10).split('-');
  if (!y || !m || !d) return iso;
  return `${Number(d)} ${BULAN[Number(m) - 1]} ${y}`;
}

export function fmtDateTime(iso) {
  if (!iso) return '-';
  const date = fmtDate(iso);
  const time = iso.slice(11, 16);
  return time ? `${date}, ${time}` : date;
}

export function fmtRentang(dari, sampai) {
  if (dari && sampai) return `${dari}–${sampai}`;
  if (dari) return `sekitar ${dari}`;
  return 'tidak diketahui';
}
