import { useState, useEffect } from 'react';
import Head from 'next/head';
import { format, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { EVENT_TYPES } from '../lib/airtable';
import CalendarView from '../components/CalendarView';
import ListView from '../components/ListView';
import EventDetail from '../components/EventDetail';
import AddEventModal from '../components/AddEventModal';

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('calendar');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [defaultDate, setDefaultDate] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchEvents();
    const saved = sessionStorage.getItem('hr_admin_pw');
    if (saved) { setAdminPassword(saved); setIsAdmin(true); }
  }, []);

  async function fetchEvents() {
    setLoading(true);
    const res = await fetch('/api/events');
    const data = await res.json();
    setEvents(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  function handleDayClick(day) {
    setDefaultDate(format(day, 'yyyy-MM-dd'));
    setShowAdd(true);
  }

  function handleEventSaved(newEvent) {
    setEvents((prev) => [...prev, newEvent].sort((a, b) => a.fecha?.localeCompare(b.fecha)));
  }

  async function handleDelete(event) {
    if (!confirm(`¿Eliminar "${event.titulo}"?`)) return;
    const res = await fetch(`/api/events/${event.id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: adminPassword }),
    });
    if (res.ok) {
      setEvents((prev) => prev.filter((e) => e.id !== event.id));
      setSelectedEvent(null);
    }
  }

  const monthLabel = format(currentDate, "MMMM yyyy", { locale: es });
  const capitalMonth = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);

  return (
    <>
      <Head>
        <title>Calendario RRHH</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div style={{ minHeight: '100vh', padding: '0 0 60px' }}>
        <header style={{ borderBottom: '1.5px solid var(--border)', background: 'var(--surface)', position: 'sticky', top: 0, zIndex: 40 }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, background: 'var(--accent)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>📅</div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--ink)', lineHeight: 1 }}>Calendario RRHH</div>
                <div style={{ fontSize: 10, color: 'var(--ink-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Recursos Humanos</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: 10, padding: 3 }}>
                {[{ key: 'calendar', label: '📆 Calendario' }, { key: 'list', label: '☰ Lista' }].map(({ key, label }) => (
                  <button key={key} onClick={() => setView(key)} style={{ border: 'none', borderRadius: 7, padding: '6px 14px', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-body)', background: view === key ? 'var(--surface)' : 'transparent', color: view === key ? 'var(--ink)' : 'var(--ink-muted)', boxShadow: view === key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.15s' }}>{label}</button>
                ))}
              </div>
              <button className="btn-primary" onClick={() => setShowAdd(true)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 18, lineHeight: 1 }}>+</span>
                <span>Nuevo evento</span>
              </button>
            </div>
          </div>
        </header>
        <main style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
          {view === 'calendar' && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, margin: 0, color: 'var(--ink)' }}>{capitalMonth}</h1>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn-ghost" onClick={() => setCurrentDate(subMonths(currentDate, 1))} style={{ padding: '8px 14px' }}>←</button>
                <button className="btn-ghost" onClick={() => setCurrentDate(new Date())} style={{ padding: '8px 14px', fontSize: 13 }}>Hoy</button>
                <button className="btn-ghost" onClick={() => setCurrentDate(addMonths(currentDate, 1))} style={{ padding: '8px 14px' }}>→</button>
              </div>
            </div>
          )}
          {view === 'list' && <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, margin: '0 0 20px', color: 'var(--ink)' }}>Todos los eventos</h1>}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
            {Object.entries(EVENT_TYPES).map(([key, t]) => (
              <div key={key} className="tag" style={{ background: t.bg, color: t.color, border: `1px solid ${t.border}` }}>{t.icon} {t.label}</div>
            ))}
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--ink-muted)' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
              <div>Cargando eventos...</div>
            </div>
          ) : view === 'calendar' ? (
            <CalendarView currentDate={currentDate} events={events} onDayClick={handleDayClick} onEventClick={setSelectedEvent} />
          ) : (
            <ListView events={events} onEventClick={setSelectedEvent} />
          )}
        </main>
      </div>
      {selectedEvent && <EventDetail event={selectedEvent} onClose={() => setSelectedEvent(null)} onDelete={handleDelete} isAdmin={isAdmin} />}
      {showAdd && <AddEventModal onClose={() => setShowAdd(false)} onSave={handleEventSaved} defaultDate={defaultDate} />}
    </>
  );
}
