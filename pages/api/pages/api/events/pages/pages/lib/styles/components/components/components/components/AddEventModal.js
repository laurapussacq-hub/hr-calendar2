Pegá este código:
javascriptimport { useState } from 'react';
import { EVENT_TYPES } from '../lib/airtable';

const TYPES = Object.keys(EVENT_TYPES);

export default function AddEventModal({ onClose, onSave, defaultDate }) {
  const [step, setStep] = useState('auth');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fecha, setFecha] = useState(defaultDate || '');
  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState(TYPES[0]);
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState('');

  async function handleAuth(e) {
    e.preventDefault();
    setLoading(true);
    setAuthError('');
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, fecha: '2000-01-01', titulo: '__test__', tipo: TYPES[0] }),
    });
    setLoading(false);
    if (res.status === 401) {
      setAuthError('Contraseña incorrecta');
    } else {
      const data = await res.json();
      if (data.id) {
        await fetch(`/api/events/${data.id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password }),
        });
      }
      setStep('form');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!fecha || !titulo || !tipo) { setError('Completá los campos requeridos'); return; }
    setLoading(true);
    setError('');
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, fecha, titulo, tipo, descripcion }),
    });
    setLoading(false);
    if (!res.ok) { const data = await res.json(); setError(data.error || 'Error al guardar'); return; }
    const newEvent = await res.json();
    onSave(newEvent);
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div style={{ background: 'var(--accent)', height: 6 }} />
        <div style={{ padding: '28px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, margin: '0 0 20px', color: 'var(--ink)' }}>
            {step === 'auth' ? '🔒 Acceso de edición' : '+ Nuevo evento'}
          </h2>
          {step === 'auth' ? (
            <form onSubmit={handleAuth}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--ink-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contraseña</label>
                <input type="password" className="field" placeholder="Ingresá la contraseña de RRHH" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus />
                {authError && <p style={{ color: '#EF4444', fontSize: 13, marginTop: 6 }}>{authError}</p>}
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" className="btn-ghost" onClick={onClose}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={loading || !password}>{loading ? 'Verificando...' : 'Continuar'}</button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--ink-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fecha *</label>
                  <input type="date" className="field" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--ink-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Título *</label>
                  <input type="text" className="field" placeholder="Nombre del evento" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--ink-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tipo *</label>
                  <select className="field" value={tipo} onChange={(e) => setTipo(e.target.value)}>
                    {TYPES.map((t) => <option key={t} value={t}>{EVENT_TYPES[t].icon} {t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--ink-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Descripción (opcional)</label>
                  <textarea className="field" placeholder="Detalles adicionales..." value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={3} style={{ resize: 'vertical', minHeight: 72 }} />
                </div>
                {error && <p style={{ color: '#EF4444', fontSize: 13, margin: 0 }}>{error}</p>}
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
                  <button type="button" className="btn-ghost" onClick={onClose}>Cancelar</button>
                  <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Guardando...' : 'Guardar evento'}</button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
