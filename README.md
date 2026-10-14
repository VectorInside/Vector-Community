# 🚀 Vector Community — Sistema Operativo Multi-Tenant & Performance AI Engine

> **Vector Inside Operations** — Documento Maestro de Arquitectura, Frontend Control Panel & Gobernanza Human-in-the-Loop (HITL).

![Vector Inside Logo](public/vector-inside-logo.svg)

---

## 📖 1. Visión General del Proyecto

**Vector Community** es un sistema operativo multi-tenant y motor de performance marketing diseñado bajo la gobernanza **"Agencia Primero" (Agency Co-Pilot)**. 

Transforma el Community Management tradicional en un motor automatizado por IA que:
1. **Filtra con Human-in-the-Loop (HITL):** Ninguna cita, propuesta o interacción crítica llega al dueño del negocio sin la aprobación previa en 1 clic de un operador de la agencia.
2. **Atribución Backend Server-to-Server (Meta CAPI):** Calcula el ROAS y CAC real cruzando las ventas en base de datos contra el gasto de Meta Ads con datos hasheados en SHA-256.
3. **Parrilla de Contenido & Content Ops:** Planifica y despacha posts de Reels, Carruseles y Stories con previsualización de ganchos (Hooks) generados por IA (DeepSeek R1).
4. **Adaptabilidad a 5 Verticales:** Hospitality, Clínicas/Salud, E-Commerce, B2B High-Ticket y Creator Economy (Redes Sociales Meta).

---

## 📚 2. Documentos de Arquitectura & Diseño (ADR & SDD)

Los registros de decisiones de arquitectura y especificaciones del sistema se encuentran en el directorio [`/docs`](docs/):

- 🏛️ **[ADR-001: Arquitectura Maestra, Gobernanza Multi-Tenant & Reglas de Negocio](docs/ADR_001_MASTER_ARCHITECTURE_AND_BUSINESS_RULES.md)**
- 📐 **[SDD: Documento de Diseño de Sistema (System Design Document)](docs/SDD_SYSTEM_DESIGN_DOCUMENT.md)**

---

## 🛠️ 3. Tech Stack & Estándares Visuales

| Capa | Tecnología / Herramienta | Propósito |
| :--- | :--- | :--- |
| **Framework UI** | React 18 / Next.js 14+ (App Router) | Renderizado SSR, cliente reactivo y revalidación de datos. |
| **Estilos CSS** | Tailwind CSS | Estilizado declarativo con tokens de diseño Vector Inside (`#0D0F12`, `#D4FF00`). |
| **Iconografía** | Lucide React | Iconos vectoriales ultraligeros. |
| **Estado Global** | Zustand & Context API | Manejo reactivo de `activeTenantId`, roles RBAC y modales interactivos. |
| **Comunicación Backend** | Axios + Interceptores JWT | Inyección obligatoria de cabeceras `X-Tenant-ID` y `Authorization: Bearer`. |
| **Gráficos & Telemetría** | Recharts | Visualización de ROAS Real, CAC, Curvas de Retención y Logs CAPI en vivo. |

---

## 🎨 Sistema de Diseño (Design Tokens)

- **Fondo Base (Dark Base):** `#0D0F12` (Negro técnico Vector).
- **Contenedores & Superficies:** `#12151A` y `#1A1E26`.
- **Color Neón Oficial (Brand Primary):** `#D4FF00` (Amarillo Neón Vector Inside).
- **Bordes & Divisores:** `#1F242D`.
- **Estados Semánticos:**
  - 🟢 **Success / Active:** `#10B981` (Emerald-500)
  - 🟡 **Warning / Pending:** `#F59E0B` (Amber-500)
  - 🔴 **Critical / Danger:** `#EF4444` (Rose-500)

---

## 📂 4. Estructura del Repositorio

```text
Vector-Community/
├── docs/                     # Registros de Arquitectura (ADR) y Diseño de Sistema (SDD)
│   ├── ADR_001_MASTER_ARCHITECTURE_AND_BUSINESS_RULES.md
│   └── SDD_SYSTEM_DESIGN_DOCUMENT.md
├── public/                   # Logotipos y recursos estáticos
│   ├── favicon.ico
│   └── vector-inside-logo.svg
├── src/
│   ├── app/                  # Vistas Principales (Next.js App Router)
│   │   ├── layout.jsx        # Layout global con tema oscuro y fuentes Google
│   │   ├── page.jsx          # Redirección a Dashboard
│   │   ├── login/page.jsx    # Autenticación JWT y selector de perfiles RBAC
│   │   ├── dashboard/page.jsx# Centro de Mando Multi-Tenant
│   │   ├── triage/page.jsx   # Protocolo de Triage, HITL y moderación de crisis
│   │   ├── planner/page.jsx  # Parrilla de Contenidos & Aprobación Editorial
│   │   ├── agenda/page.jsx   # Master Agenda (Google Calendar 2-Way Sync)
│   │   ├── metrics/page.jsx  # Soberanía Financiera & Reportes Ejecutivos
│   │   ├── agents/page.jsx   # Orquestación Multi-Agente (LangGraph / CrewAI)
│   │   └── settings/page.jsx # Configuración de Sub-Bots RAG para 5 Verticales
│   ├── components/           # Componentes Modulares Reutilizables
│   │   ├── common/           # Botones, Badges, Modales, StatCards
│   │   ├── layout/           # Header, Sidebar, TenantSwitcher
│   │   ├── hitl/             # Tarjetas de aprobación HITL en 1 Clic
│   │   ├── planner/          # Calendario de publicaciones y generador IA
│   │   ├── calendar/         # Vista de Master Agenda
│   │   ├── metrics/          # Paneles de ROAS real y telemetría CAPI
│   │   ├── agents/           # Visualizador de grafo de supervisión
│   │   └── settings/         # Formularios adaptativos por vertical
│   ├── context/              # Contexto de Autenticación y Switcher de Tenants
│   ├── hooks/                # Hooks personalizados (useTenant, useHITLAlerts)
│   ├── services/             # Cliente API Axios y llamadas a endpoints
│   ├── styles/               # globals.css y utilidades Tailwind
│   └── utils/                # Constantes, formateadores y mock data
├── .env.example              # Variables de entorno de ejemplo
├── .env.local                # Variables de desarrollo local
├── next.config.mjs           # Configuración de Next.js
├── tailwind.config.js        # Configuración de diseño Tailwind
└── package.json              # Dependencias y scripts de ejecución
```

---

## 🎯 5. Matriz de las 5 Verticales de Negocio

1. 🏨 **Hospitality (Restaurantes & Bares):** Menú Digital PDF, capacidad de comensales, reservas automáticas con pre-autorización (>8 pax requieren HITL manual).
2. 🏥 **Service Appointments (Clínicas & Salud):** Calificación médica RAG, Google Calendar API v3 y confirmación de citas con anticipo.
3. 🛒 **E-Commerce (Retail & Moda):** Catálogo de productos, recuperación de carritos abandonados por DM y eventos `Purchase` en Meta CAPI.
4. 💼 **B2B Sales (High-Ticket & SaaS):** Calificación BANT, Discovery Calls y sincronización bidireccional de deals en HubSpot / Salesforce.
5. 🎬 **Creator Economy (Redes Sociales Meta):** Conversión de comentarios a DM (*Keyword Triggers*), filtro de brand deals de marcas y blindaje anti-toxicidad.

---

## 🚀 6. Guía de Ejecución Local

### 1. Instalar dependencias:
```bash
npm install
```

### 2. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

### 3. Abrir en el navegador:
Accede a [http://localhost:3000](http://localhost:3000) e interactúa con cualquiera de los perfiles de la agencia o de los clientes.

### 4. Compilar para producción:
```bash
npm run build
```

---

## 🏊 7. Diagrama de Carriles del Comportamiento del Sistema (Swimlane Diagram)

El siguiente diagrama de carriles ilustra el ciclo de vida completo de un prospecto, desde el impacto publicitario en Meta Ads hasta la monetización del lead calificado ($350 MXN), la sincronización con Google Workspace y la atribución server-to-server en Meta CAPI:

```mermaid
sequenceDiagram
    autonumber
    actor U as Prospecto / Usuario
    participant M as Meta Ads & Graph API
    participant VC as Vector Core & RAG Swarm
    participant HITL as Operador Humano (HITL)
    participant GW as Google Workspace (Calendar & Gmail)
    participant CAPI as Meta Conversions API

    Note over U,M: Fase 1: Ingestión & Captura
    U->>M: Clic en Anuncio o Comentario en Reel ("VALORACION")
    M->>VC: Webhook Event (Mensaje / Comentario entrante)
    VC->>VC: Routing Tier 1 (DeepSeek V3 <800ms) + Blindaje RLS

    Note over U,VC: Fase 2: Cualificación Determinista (4 Criterios AND)
    VC->>U: Despacho de oferta comercial y gancho del mes
    U->>VC: Proporciona teléfono E.164, interés y resuelve dudas de precio
    VC->>VC: Valida 4/4 Criterios AND (Identidad, Catálogo, Finanzas, Agenda)
    VC->>HITL: Escalamiento a Kanban Triage (LEAD_HOT_PREQUAL)

    Note over HITL,GW: Fase 3: Dictamen Pre-Cita & Aprobación en 1 Clic
    HITL->>HITL: Abre Drawer Lateral "Dictamen Pre-Cita" (3 Tarjetas)
    HITL->>GW: Clic en [Aprobar Cita, Agendar Google & Enviar Gmail]
    GW-->>HITL: Cita creada en Calendar v3 + ICS adjunto despachado por Gmail
    
    Note over HITL,CAPI: Fase 4: Monetización & Atribución CAPI Server-to-Server
    HITL->>VC: Transición atómica a BILLABLE_LEAD ($350 MXN facturados)
    VC->>CAPI: Telemetría SHA-256 (Lead_Prequalified / Purchase_Attributed)
    CAPI-->>M: Optimización del algoritmo publicitario sin fuga de píxel
```

---

## 🏛️ 8. Diagrama de Arquitectura de Software & Telemetría Backend

Arquitectura modular desacoplada del sistema operativo multi-tenant:

```mermaid
graph TB
    subgraph Frontend ["CAPA FRONTEND (Next.js 14 App Router)"]
        UI_Triage["Bandeja Triage HITL (PreCitaDrawer.jsx)"]
        UI_Agenda["Master Agenda Interactiva (MasterAgenda.jsx)"]
        UI_Planner["Estudio de Contenido & ADN (ContentPlanner.jsx)"]
        UI_Metrics["Performance Dashboard & Fricción Web (PerformanceDashboard.jsx)"]
        UI_RAG["RAG Wizard Multi-Giro (RAGWizard.jsx)"]
    end

    subgraph Core ["CAPA MOTOR COGNITIVO & SUPERVISOR"]
        Router["LangGraph Model Router"]
        D_V3["DeepSeek V3 (Operativo <800ms)"]
        D_R1["DeepSeek R1 (Cognitivo & Reversión Viral)"]
        RLS_Engine["Aislamiento Multi-Tenant (PostgreSQL RLS)"]
    end

    subgraph Integrations ["CAPA DE INTEGRACIONES EXTERNAS"]
        Meta_Graph["Meta Graph API (Instagram / Facebook Webhooks)"]
        Meta_CAPI["Meta CAPI Server-to-Server (SHA-256)"]
        Google_WS["Google Workspace (Calendar v3 + Gmail API)"]
        GA4_API["Google Analytics 4 Measurement API"]
    end

    UI_Triage --> Router
    UI_Agenda --> Google_WS
    UI_Planner --> D_R1
    UI_Metrics --> Meta_CAPI
    UI_Metrics --> GA4_API
    UI_RAG --> RLS_Engine

    Router --> D_V3
    Router --> D_R1
    D_V3 --> Meta_Graph
    D_R1 --> RLS_Engine
    RLS_Engine --> Meta_CAPI
```


