Pegá este código:
javascriptimport Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
);

export const TABLE_NAME = 'Eventos';

export const EVENT_TYPES = {
  'Vacaciones / Ausencias': { color: '#3B82F6', bg: '#EFF6FF', border: '#BFDBFE', icon: '🏖️', label: 'Vacaciones / Ausencias' },
  'Capacitaciones': { color: '#8B5CF6', bg: '#F5F3FF', border: '#DDD6FE', icon: '📚', label: 'Capacitaciones' },
  'Fechas de pago / Liquidaciones': { color: '#10B981', bg: '#ECFDF5', border: '#A7F3D0', icon: '💰', label: 'Fechas de pago / Liquidaciones' },
  'Eventos / Celebraciones': { color: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A', icon: '🎉', label: 'Eventos / Celebraciones' },
  'Vencimientos / Plazos legales': { color: '#EF4444', bg: '#FEF2F2', border: '#FECACA', icon: '⚖️', label: 'Vencimientos / Plazos legales' },
};

export async function getEvents() {
  const records = [];
  await base(TABLE_NAME)
    .select({ sort: [{ field: 'Fecha', direction: 'asc' }] })
    .eachPage((pageRecords, fetchNextPage) => {
      pageRecords.forEach((record) => {
        records.push({
          id: record.id,
          fecha: record.get('Fecha'),
          titulo: record.get('Titulo'),
          tipo: record.get('Tipo'),
          descripcion: record.get('Descripcion') || '',
        });
      });
      fetchNextPage();
    });
  return records;
}

export async function createEvent({ fecha, titulo, tipo, descripcion }) {
  const record = await base(TABLE_NAME).create({
    Fecha: fecha,
    Titulo: titulo,
    Tipo: tipo,
    Descripcion: descripcion || '',
  });
  return {
    id: record.id,
    fecha: record.get('Fecha'),
    titulo: record.get('Titulo'),
    tipo: record.get('Tipo'),
    descripcion: record.get('Descripcion') || '',
  };
}

export async function deleteEvent(id) {
  await base(TABLE_NAME).destroy(id);
  return { success: true };
}
