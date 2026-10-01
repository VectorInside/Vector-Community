# 🚀 Vector Comunity - Frontend Control Panel Architecture ("La Puerta Trasera")

Este repositorio contiene la arquitectura y código de interfaz de usuario para **Vector Comunity**, la plataforma de gestión de comunidad y motor de Performance Marketing impulsada por **Vector Inside**.

La aplicación está diseñada bajo una arquitectura **Multi-Tenant** (multiempresa) con gobernanza **Human-in-the-Loop (HITL)**, permitiendo a la agencia controlar alertas, aprobar agendamientos y monitorear el ROAS/CAC real antes de sincronizar datos con los clientes finales.

---

## 🛠️ 1. Tech Stack & Estándares Visuales

| Capa | Tecnología / Herramienta | Propósito |
| :--- | :--- | :--- |
| **Framework UI** | React 18 / Next.js 14+ (App Router) | Renderizado reactivo, SSR para paneles y revalidación de datos. |
| **Estilos CSS** | Tailwind CSS | Estilizado declarativo con tokens personalizados de Vector Inside. |
| **Iconografía** | Lucide React | Conjunto de iconos vectoriales ultraligeros. |
| **Estado Global** | Zustand | Manejo de estado ligero para `activeTenantId` y caché de peticiones HTTP. |
| **Comunicación Backend** | Axios + EventSource (SSE) | Conexión con la API REST de Spring Boot y streaming de alertas en vivo. |
| **Gráficos** | Recharts | Visualización de ROAS Real, CAC, Curvas de Ingreso y Hook Rate. |

---

## 🎨 Sistema de Diseño (Design Tokens & Theme)

- **Fondo Principal (Dark Base):** `#0D0F12` (Gris ultra oscuro / negro técnico).
- **Fondo Contenedores (Surface):** `#12151A` y `#1A1E26`.
- **Color de Acento (Brand Primary):** `#D4FF00` (Amarillo Neón oficial de Vector Inside).
- **Bordes & Divisores:** `#1F242D` / `border-slate-800`.
- **Estados:**
  - 🟢 **Success / Active:** `#10B981` (Emerald-500)
  - 🟡 **Warning / Pending:** `#F59E0B` (Amber-500)
  - 🔴 **Critical / Danger:** `#EF4444` (Rose-500)

---

## 📂 2. Estructura del Proyecto (Directory Tree)

```text
vector-comunity-frontend/
├── public/
│   ├── favicon.ico
│   └── vector-inside-logo.svg
├── src/
│   ├── assets/               # Modulos estáticos e imágenes
│   ├── components/           # Componentes UI Reutilizables
│   │   ├── common/           # Botones, Modales, Badges, Loaders, StatCards
│   │   ├── layout/           # Header, Sidebar, TenantSwitcher, ConnectionStatusBadge
│   │   ├── hitl/             # Tarjetas de aprobación en 1 Clic (Agency Inbox)
│   │   ├── calendar/         # Vistas de Master Agenda (Google Calendar API Sync)
│   │   ├── metrics/          # Cards de ROAS Real, CAC, Hook Rate Chart, CAPI Logs
│   │   └── settings/         # Configuración Sub-Bots RAG & Verticales
│   ├── context/              # Contexto de Autenticación JWT y RBAC Guard
│   ├── hooks/                # Custom Hooks (useTenant, useHITLAlerts, useSSE, useAuth)
│   ├── app/                  # Vistas Principales (Next.js App Router)
│   │   ├── layout.jsx        # Layout global con diseño oscuro y fuentes
│   │   ├── page.jsx          # Redirección a Dashboard
│   │   ├── login/page.jsx    # Pantalla de Autenticación JWT y Roles de Prueba
│   │   ├── dashboard/page.jsx# Vista Principal (HITL Inbox + KPIs)
│   │   ├── agenda/page.jsx   # Master Calendar View (Google Calendar Sync)
│   │   ├── performance/page.jsx # Atribución Backend Real & CAPI Logs
│   │   └── settings/page.jsx # Configuración de Sub-Bots RAG & Verticales
│   ├── services/             # Cliente API Axios conectado a Spring Boot
│   │   ├── api.js            # Instancia Axios con Interceptores JWT y X-Tenant-ID
│   │   ├── tenantService.js  # CRUD de Clientes/Tenants
│   │   ├── calendarService.js# Integración con Google Calendar Endpoints
│   │   ├── performanceService.js # Métricas de ROAS/CAC y Hook Rate
│   │   └── hitlService.js    # Aprobaciones HITL (POST /appointments/{id}/approve)
│   ├── styles/               # Globals.css y utilidades de Tailwind
│   └── utils/                # Formateadores, constantes de roles y mock database
├── .env.example              # Variables de entorno requeridas
├── .env.local                # Variables de desarrollo local
├── tailwind.config.js        # Paleta de colores e inyección del #D4FF00
└── package.json
```

---

## 🔒 3. Reglas de Arquitectura & Seguridad Frontend

### **R1. Inyección Obligatoria del Header `X-Tenant-ID`**
* **Regla:** Ninguna petición a los endpoints protegidos del backend en Spring Boot puede realizarse sin el encabezado HTTP `X-Tenant-ID`.
* **Implementación:** El cliente Axios intercepta cada petición saliente y adjunta automáticamente el `tenant_id` seleccionado en la barra superior:
```javascript
// src/services/api.js
import axios from 'axios';
import { useTenantStore } from '@/hooks/useTenant';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1',
});

api.interceptors.request.use((config) => {
  const { activeTenantId } = useTenantStore.getState();
  const token = typeof window !== 'undefined' ? localStorage.getItem('jwt_token') : null;
  if (activeTenantId) {
    config.headers['X-Tenant-ID'] = activeTenantId;
  }
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

---

### **R2. Control de Acceso Basado en Roles (RBAC Guard)**
El frontend restringe vistas y controles según el rol del usuario autenticado:
1. **`SUPER_ADMIN_AGENCY` (Vector Inside):** Acceso total a todas las vistas, cambio libre de `tenant_id`, edición de prompts RAG, llaves CAPI y vista global agregada.
2. **`COMMUNITY_MANAGER` (Agencia):** Acceso a Agency HITL Inbox, Master Agenda y Sub-Bots Config.
3. **`CLIENT_READ_ONLY` (Dueño del Negocio):** Vista bloqueada exclusivamente a su `tenant_id`. Las pestañas de edición de prompts y llaves API permanecen ocultas; solo puede consultar la Master Agenda y el panel de Performance Backend.

---

### **R3. Flujo Real-Time de Alertas (Server-Sent Events / SSE)**
Para evitar el polling continuo, el cliente se suscribe a un canal de eventos en vivo mediante SSE conectado a Spring Boot.
```javascript
// src/hooks/useSSE.js
import { useEffect } from 'react';

export const useSSE = (tenantId, onNewAlert) => {
  useEffect(() => {
    if (!tenantId) return;
    const eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_API_URL}/alerts/stream?tenantId=${tenantId}`
    );
    eventSource.onmessage = (event) => {
      const newAlert = JSON.parse(event.data);
      onNewAlert(newAlert);
    };
    eventSource.onerror = () => {
      eventSource.close();
    };
    return () => eventSource.close();
  }, [tenantId, onNewAlert]);
};
```

---

## 🖥️ 4. Módulos & Pantallas Implementadas

1. **Master Header (`/src/components/layout/Header.jsx`)**:
   - Emblema Vector Inside en `#D4FF00`.
   - **Tenant Switcher**: Desplegable con búsqueda y cambio instantáneo de marca.
   - **Indicador de Conexión**: Webhooks de Meta, WhatsApp API y Google Calendar.
   - **User Profile & RBAC Switcher**: Avatar, selector rápido de roles para pruebas y botón de Cerrar Sesión JWT.

2. **Agency Co-Pilot Inbox (`/src/app/dashboard/page.jsx`)**:
   - Lista de alertas en estado `PENDING_AGENCY_APPROVAL`.
   - **Acción Directa en 1 Clic**: Botón `[✅ Aprobar & Sincronizar]` que dispara `POST /api/v1/appointments/{id}/approve` y cambia a estado deshabilitado `✅ Aprobado & Sincronizado`.
   - Botón `⚡ Test SSE Live` para simular alertas entrantes en tiempo real.

3. **Adaptabilidad por Vertical (`vertical_tipo`) (`/src/app/settings/page.jsx`)**:
   - **`hospitality`**: Carga de Menú Digital PDF, capacidad de mesas y depósitos de reserva.
   - **`service_appointments`**: Sincronización con Google Calendar API, duración de citas y buffers de descanso.
   - **`ecommerce`**: Catálogo de productos, Pixel ID y Meta CAPI Conversion Token.

4. **Master Agenda (`/src/app/agenda/page.jsx`)**:
   - Vista centralizada de citas y sincronización 2-way con Google Calendar.

5. **Performance Backend (`/src/app/performance/page.jsx`)**:
   - ROAS Real Backend vs Meta Pixel, CAC, Hook Rate e historial de eventos CAPI en vivo.

---

## ⚙️ 5. Variables de Entorno (`.env.local`)

```bash
# URL de la API REST de Spring Boot
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1

# WebSockets / SSE Endpoint
NEXT_PUBLIC_SSE_URL=http://localhost:8080/api/v1/alerts/stream

# Nombre de la Aplicación y Entorno
NEXT_PUBLIC_APP_NAME="Vector Comunity Control Panel"
NEXT_PUBLIC_ENV=development
```

---

## 🚀 6. Guía de Ejecución Local

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

3. Abrir en el navegador:
   Acceder a [http://localhost:3000](http://localhost:3000) e ingresar con cualquiera de los perfiles de prueba de la agencia.
