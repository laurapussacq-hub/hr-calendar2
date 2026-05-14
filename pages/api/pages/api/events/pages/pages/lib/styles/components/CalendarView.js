import { useMemo } from 'react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, format, isToday } from 'date-fns';
import EventChip from './EventChip';

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export default function CalendarView({ currentDate, events, onDayClick, onEventClick }) {
  const weeks = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const start = startOfWeek(monthStart, { weekStartsOn: 0 });
    const end = endOfWeek(monthEnd, { weekStartsOn: 0 });
    const weeks = [];
    let day = start;
    while (day <= end) {
      const week = [];
      for (let i = 0; i < 7; i++) { week.push(new Date(day)); day = addDays(day, 1); }
      weeks.push(week);
    }
    return weeks;
  }, [currentDate]);

  function getEventsForDay(day) {
    const dayStr = format(day, 'yyyy-MM-dd');
    return events.filter((e) => e.fecha === dayStr);
  }

  return (
    <div style={{ background: 'var(--surface)', borderRadius: 16, border: '1.5px solid var(--border)', overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1.5px solid var(--border)' }}>
        {DAYS.map((d) => (
          <div key={d} style={{ padding: '10px 8px', textAlign: 'center', fontSize: 11, fontWeight: 700, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{d}</div>
        ))}
      </div>
      {weeks.map((week, wi) => (
        <div key={wi} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: wi < weeks.length - 1 ? '1px solid var(--border)' : 'none' }}>
          {week.map((day, di) => {
            const dayEvents = getEventsForDay(day);
            const inMonth = isSameMonth(day, currentDate);
            const today = isToday(day);
            return (
              <div key={di} className={`calendar-day${today ? ' today' : ''}`} style={{ borderRight: di < 6 ? '1px solid var(--border)' : 'none', padding: '8px 6px', opacity: inMonth ? 1 : 0.35, cursor: 'pointer' }} onClick={() => onDayClick && onDayClick(day)}>
                <div style={{ fontSize: 12, fontWeight: today ? 700 : 500, color: today ? 'var(--accent)' : 'var(--ink)', marginBottom: 4, width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: today ? 'var(--accent-light)' : 'transparent' }}>
                  {format(day, 'd')}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {dayEvents.slice(0, 3).map((ev) => <EventChip key={ev.id} event={ev} onClick={onEventClick} />)}
                  {dayEvents.length > 3 && <div style={{ fontSize: 10, color: 'var(--ink-muted)', paddingLeft: 4 }}>+{dayEvents.length - 3} más</div>}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
