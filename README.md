# 📅 Calendario RRHH

Aplicación web para gestionar fechas importantes de Recursos Humanos, con Airtable como base de datos y deploy en Vercel.

---

## 🚀 Setup paso a paso

### 1. Crear la base en Airtable

1. Entrá a [airtable.com](https://airtable.com) y creá una cuenta (gratis)
2. Creá una nueva **Base** llamada `RRHH Calendar`
3. Renombrá la tabla por defecto a `Eventos`
4. Configurá los campos de la tabla así:

| Nombre del campo | Tipo           |
|-----------------|----------------|
| `Fecha`         | Date           |
| `Titulo`        | Single line text |
| `Tipo`          | Single select  |
| `Descripcion`   | Long text      |

> ⚠️ Los nombres de los campos deben ser **exactamente** iguales (con mayúscula inicial).

Para el campo **Tipo**, agregá estas opciones en el Single select:
- Vacaciones / Ausencias
- Capacitaciones
- Fechas de pago / Liquidaciones
- Eventos / Celebraciones
- Vencimientos / Plazos legales

### 2. Obtener las credenciales de Airtable

**Personal Access Token:**
1. Andá a [airtable.com/create/tokens](https://airtable.com/create/tokens)
2. Hacé clic en "Create new token"
3. Dale un nombre (ej: `hr-calendar`)
4. En **Scopes**, agregá: `data.records:read` y `data.records:write`
5. En **Access**, seleccioná la base `RRHH Calendar`
6. Copiá el token generado

**Base ID:**
1. Abrí tu base en Airtable
2. En la URL vas a ver algo así: `https://airtable.com/appXXXXXXXXXXXXXX/...`
3. El `appXXXXXXXXXXXXXX` es tu Base ID

### 3. Configurar variables de entorno

Copiá el archivo `.env.local.example` a `.env.local` y completá:

```bash
cp .env.local.example .env.local
```

```env
AIRTABLE_API_KEY=tu_personal_access_token
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
ADMIN_PASSWORD=la_contraseña_que_elijas
NEXT_PUBLIC_APP_NAME=Calendario RRHH
```

### 4. Correr localmente

```bash
npm install
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000)

---

## ☁️ Deploy en Vercel

### Opción A: Desde GitHub (recomendada)

1. Subí este proyecto a un repositorio en GitHub
2. Entrá a [vercel.com](https://vercel.com) y conectá tu cuenta de GitHub
3. Importá el repositorio
4. En el paso de configuración, agregá las **Environment Variables**:
   - `AIRTABLE_API_KEY`
   - `AIRTABLE_BASE_ID`
   - `ADMIN_PASSWORD`
   - `NEXT_PUBLIC_APP_NAME`
5. Hacé clic en **Deploy**

### Opción B: Con Vercel CLI

```bash
npm i -g vercel
vercel
# Seguí los pasos del wizard
# Acordate de agregar las env vars en el dashboard de Vercel
```

---

## 🔐 Cómo funciona el acceso

- **Cualquier persona** puede ver el calendario y los eventos (sin contraseña)
- **El equipo de RRHH** usa la contraseña compartida para agregar o eliminar eventos
- La sesión se recuerda mientras el navegador esté abierto

---

## 🎨 Tipos de eventos

| Tipo | Ícono | Color |
|------|-------|-------|
| Vacaciones / Ausencias | 🏖️ | Azul |
| Capacitaciones | 📚 | Violeta |
| Fechas de pago / Liquidaciones | 💰 | Verde |
| Eventos / Celebraciones | 🎉 | Amarillo |
| Vencimientos / Plazos legales | ⚖️ | Rojo |

---

## 📁 Estructura del proyecto

```
hr-calendar/
├── pages/
│   ├── api/
│   │   ├── events.js          # GET y POST eventos
│   │   └── events/[id].js     # DELETE evento
│   ├── _app.js
│   └── index.js               # Página principal
├── components/
│   ├── CalendarView.js        # Vista mensual
│   ├── ListView.js            # Vista lista
│   ├── EventChip.js           # Chip de evento en calendario
│   ├── EventDetail.js         # Modal de detalle
│   └── AddEventModal.js       # Modal para agregar evento
├── lib/
│   └── airtable.js            # Integración con Airtable
├── styles/
│   └── globals.css
├── .env.local.example
└── README.md
```
