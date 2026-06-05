# Sistema de Tickets Web

Panel de gestión de tickets de soporte técnico (HelpDesk) construido con React, Tailwind CSS y Supabase como backend.

## Características

- **Panel Administrador** — vista completa de todos los tickets, reasignación de agentes, KPIs del sistema
- **Panel Agente** — vista filtrada con solo los tickets asignados al agente, actualización de estado
- **Modo oscuro / claro** con persistencia en `localStorage` y detección automática del sistema
- **Conexión a Supabase** — datos en tiempo real desde PostgreSQL
- **Actualizaciones optimistas** — cambios reflejados inmediatamente en la UI, con rollback automático si falla la BD
- **Búsqueda y filtros** por estado (`en proceso`, `pendiente`, `finalizado`, `bloqueado`) y prioridad

## Tecnologías

| Tecnología | Uso |
|---|---|
| [React 18](https://react.dev) | UI y manejo de estado con hooks |
| [Vite](https://vitejs.dev) | Bundler y servidor de desarrollo |
| [Tailwind CSS](https://tailwindcss.com) | Estilos utilitarios + dark mode |
| [Lucide React](https://lucide.dev) | Iconos |
| [Supabase](https://supabase.com) | Base de datos PostgreSQL + API REST |

## Estructura del proyecto

```
Web/src/
├── App.jsx                          # Punto de entrada — enrutado por rol
├── data/
│   └── credentials.js               # Credenciales mock (temporal)
├── hooks/
│   ├── useDarkMode.js               # Tema oscuro/claro con localStorage
│   ├── useTickets.js                # Fetch, filtros y actualización de tickets
│   └── useAgents.js                 # Lista de agentes desde Supabase
├── utils/
│   └── ticketUtils.js               # getInitials, mapDbTicket
├── lib/
│   └── supabase.js                  # Cliente de Supabase
├── components/
│   ├── auth/
│   │   └── LoginScreen.jsx
│   ├── dashboard/
│   │   └── KpiCard.jsx
│   ├── layout/
│   │   ├── AppLayout.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Topbar.jsx
│   │   └── NavItem.jsx
│   ├── tickets/
│   │   ├── TicketTable.jsx
│   │   ├── TicketDetail.jsx
│   │   ├── StatusBadge.jsx
│   │   └── PriorityBadge.jsx
│   └── ui/
│       ├── LoadingSpinner.jsx
│       └── ErrorBanner.jsx
├── panels/
│   ├── AdminPanel.jsx               # Panel completo para administradores
│   └── AgentPanel.jsx               # Panel reducido para agentes
└── views/
    ├── DashboardView.jsx
    ├── AgentDashboardView.jsx
    ├── TicketsView.jsx
    └── PlaceholderView.jsx
```

## Instalación y uso

**Requisitos:** Node.js 18+

```bash
cd Web
npm install
```

Crear el archivo `.env.local` dentro de la carpeta `Web/`:

```env
VITE_SUPABASE_URL=https://<tu-proyecto>.supabase.co
VITE_SUPABASE_KEY=<tu-clave-anon>
```

> **Seguridad:** usar la clave `anon` (no `service_role`) junto con políticas RLS configuradas en Supabase antes de desplegar a producción.

```bash
npm run dev       # Inicia el servidor en http://localhost:5173
npm run build     # Genera la build de producción en /dist
```

## Esquema de base de datos (Supabase)

### Tabla `Tickets`
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | int8 (PK) | Identificador único |
| `Usuario` | int8 (FK → Usuarios.id) | Usuario que abrió el ticket |
| `Departamento` | text | Departamento del solicitante |
| `Status` | text | `open` / `pending` / `resolved` / `closed` |
| `Incidente_ID` | int8 (FK → Incidentes.id) | Tipo de incidente asociado |
| `Fecha` | timestamptz | Fecha de creación |
| `Descripcion` | text | Descripción del problema |
| `Prioridad` | text | `urgent` / `high` / `medium` / `low` |
| `Agente` | text | Nombre del agente asignado |

### Tabla `Usuarios`
| Campo | Tipo |
|---|---|
| `id` | int8 (PK) |
| `Usuario` | text |
| `Contraseña` | text |
| `Rol` | text |
| `Correo` | text |
| `Departmento` | text |

### Tabla `Incidentes`
| Campo | Tipo |
|---|---|
| `id` | int8 (PK) |
| `Categoria` | text |
| `Incidente` | text |
| `Tiempo` | text |

## Usuarios de prueba (mock)

| Correo | Rol | Acceso |
|---|---|---|
| `admin1@empresa.com` | Administrador | Panel completo: todos los tickets, reasignación de agentes, KPIs |
| `agente1@empresa.com` | Agente | Solo los tickets asignados a "Ana García", sin reasignación |

> El login es temporal (mock hardcodeado). Próximamente se integrará con Supabase Auth y la tabla `Usuarios`.

## Roadmap

- [ ] Autenticación real con Supabase Auth
- [ ] Reemplazar clave `service_role` por `anon` + políticas RLS
- [ ] Formulario "Nuevo Ticket" conectado a Supabase
- [ ] Vista **Usuarios** — gestión de agentes y solicitantes
- [ ] Vista **Reportes** — gráficas y métricas con datos reales
- [ ] Vista **Configuración** — SLAs, categorías, notificaciones
