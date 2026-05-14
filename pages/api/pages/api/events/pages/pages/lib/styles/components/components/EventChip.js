Pegá este código:
javascriptimport { EVENT_TYPES } from '../lib/airtable';

export default function EventChip({ event, onClick }) {
  const type = EVENT_TYPES[event.tipo] || {
    color: '#6B7280', bg: '#F9FAFB', border: '#E5E7EB', icon: '📌',
  };
  return (
    <div
      className="event-chip"
      style={{ backgroundColor: type.bg, borderLeftColor: type.color, color: type.color }}
      onClick={(e) => { e.stopPropagation(); onClick && onClick(event); }}
      title={event.titulo}
    >
      {type.icon} {event.titulo}
    </div>
  );
}
