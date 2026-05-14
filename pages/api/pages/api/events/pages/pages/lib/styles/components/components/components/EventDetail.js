Pegá este código:
javascriptimport { EVENT_TYPES } from '../lib/airtable';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export default function EventDetail({ event, onClose, onDelete, isAdmin }) {
  if (!event) return null;
  const type = EVENT_TYPES[event.tipo] || { color: '#6B7280', bg: '#F9FAFB', border: '#E5E7EB', icon: '📌', label: event.tipo };
  const fecha = event.fecha ? format(parseISO(event.fecha), "EEEE d 'de' MMMM, yyyy", { locale: es }) : '';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div style={{ background: type.color, height: 6 }} />
        <div style={{ padding: '28px 28px 24px' }}>
          <div className="tag" style={{ background: type.bg, color: type.color, border: `1px solid ${type.border}`, marginBottom: 16 }}>
            <span>{type.icon}</span><span>{type.label}</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, margin: '0 0 8px', color: 'var(--ink)', lineHeight: 1.2 }}>{event.titulo}</h2>
          <p style={{ color: 'var(--ink-muted)', fontSize: 14, margin: '0 0 16px', textTransform: 'capitalize' }}>📅 {fecha}</p>
          {event.descripcion && (
            <p style={{ color: 'var(--ink)', fontSize: 14, lineHeight: 1.6, margin: '0 0 24px', padding: '14px 16px', background: 'var(--bg)', borderRadius: 8, border: '1px solid var(--border)' }}>
              {event.descripcion}
            </p>
          )}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            {isAdmin && (
              <button className="btn-ghost" style={{ color: '#EF4444', borderColor: '#FECACA' }} onClick={() => onDelete(event)}>Eliminar</button>
            )}
            <button className="btn-ghost" onClick={onClose}>Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
