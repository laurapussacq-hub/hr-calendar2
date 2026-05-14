javascriptimport { getEvents, createEvent } from '../../lib/airtable';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const events = await getEvents();
      res.status(200).json(events);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener eventos' });
    }
  } else if (req.method === 'POST') {
    const { password, fecha, titulo, tipo, descripcion } = req.body;
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }
    if (!fecha || !titulo || !tipo) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    try {
      const event = await createEvent({ fecha, titulo, tipo, descripcion });
      res.status(201).json(event);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al crear evento' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
