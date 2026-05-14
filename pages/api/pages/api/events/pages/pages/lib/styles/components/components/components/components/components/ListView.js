import { parseISO, format, isAfter, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { EVENT_TYPES } from '../lib/airtable';

export default function ListView({ events, onEventClick }) {
  const today = startOfDay(new Date());

  const upcoming = events
    .filter((e) => e.fecha && !isAfter(today, parseISO(e.fecha)))
    .sort((a, b) => a.fecha.localeCompare(b.fecha));

  const past = events
    .filter((e) => e.fecha && isAfter(today, parseISO(e.fecha)))
    .sort((a, b) => b.fecha.localeCompare(a.fecha));

  function renderEvent(event) {
    const type = EVENT_TYPES[event.tipo] || { color: '#6B7280', bg: '#F9FAFB', border: '#E5E7EB', icon: '📌', label: event.tipo };
    return (
      <div key={event.id} className="list-event-card" onClick={() => onEventClick && onEventClick(event)}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div style={{ textAlign: 'center', minWidth: 48 }}>
            <div style={{ fontSize: 22, fontFamily: 'var(--font-display)', fontWeight: 700, color: type.color, lineHeight: 1 }}>
              {event.fecha ? format(parseISO(event.fecha), 'd') : ''}
            </div>
            <div style={{ fontSize: 10, textTransform: 'uppercase', fontWeight: 700, color: 'var(--ink-muted)', letterSpacing: '0.06em' }}>
              {event.fecha ? format(parseISO(event.fecha), 'MMM', { locale: es }) : ''}
            </div>
          </div>
          <div style={{ width: 2, alignSelf: 'stretch', background: type.color, borderRadius: 2, opacity: 0.6, minHeight: 40 }} />
          <div style={{ flex: 1 }}>
            <div className="tag" style={{ background: type.bg, color: type.color, border: `1px solid ${type.border}`, marginBottom: 6 }}>
              {type.icon} {type.label}
            </div>
            <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--ink)', marginBottom: event.descripcion ? 4 : 0 }}>{event.titulo}</div>
            {event.descripcion && <div style={{ fontSize: 13, color: 'var(--ink-muted)', lineHeight: 1.5 }}>{event.descripcion}</div>}
          </div>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--ink-muted)' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
        <div style={{ fontSize: 16, fontWeight: 500 }}>No hay eventos cargados</div>
        <div style={{ fontSize: 14, marginTop: 4 }}>Agregá el primer evento con el botón +</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {upcoming.length > 0 && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-muted)', marginBottom: 12 }}>Próximos eventos</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{upcoming.map(renderEvent)}</div>
        </div>
      )}
      {past.length > 0 && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-faint)', marginBottom: 12 }}>Eventos pasados</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, opacity: 0.6 }}>{past.map(renderEvent)}</div>
        </div>
      )}
    </div>
  );
}
