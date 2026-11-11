# 🚀 Vector Community — Sistema Operativo Multi-Tenant & Performance AI Engine

> **Vector Inside Operations** — Documento Maestro de Arquitectura, Frontend Control Panel & Gobernanza Human-in-the-Loop (HITL).  
> *Soberanía de Datos, Aislamiento Multi-Tenant Inviolable (RLS), Gobernanza Zero-State, Cifrado BYOK AES-256-GCM y Monetización Pay-Per-Qualified-Lead ($\ge \$350.00\text{ MXN}$).*

![Vector Inside Logo](public/vector-inside-logo.svg)

---

## 📖 1. Visión General del Proyecto

**Vector Community** es un sistema operativo multi-tenant y motor de performance marketing diseñado bajo la doctrina **"Agencia Primero" (Agency Co-Pilot)**. 

Transforma el Community Management tradicional en un ecosistema automatizado de alta fidelidad que:
1. **Filtra con Human-in-the-Loop (HITL):** La IA opera con autonomía en el 95%+ de interacciones rutinarias (Regla 95/5). Ninguna cita, propuesta VIP o crisis de reputación se ejecuta sin la aprobación humana en 1 clic de un operador de la agencia (**Sutura Arcángel**).
2. **Atribución Backend Server-to-Server (Meta CAPI):** Calcula el ROAS y CAC real cruzando las ventas registradas en base de datos contra la inversión de Meta Ads, con telemetría SHA-256 sin dependencia exclusiva de cookies ni del píxel web del navegador.
3. **Master Agenda Dinámica Multigiro:** Gestión inteligente de citas y turnos con disponibilidad determinista, bloqueo atómico en PostgreSQL (`pg_advisory_xact_lock`), sincronización bidireccional con Google Calendar, visualización móvil instantánea vía **Código QR** y protocolo universal **WebCal (Apple / iOS / Mac / Outlook)**, y despacho de correos transaccionales con adjunto `.ics` (RFC 5545).
4. **Aislamiento Multi-Tenant Estricto:** Segregación matemática en PostgreSQL mediante **Row-Level Security (RLS)** y enrutamiento en Frontend mediante `useTenant` e inyección automática del encabezado `X-Tenant-ID`. Cada negocio cuenta con su propio membrete, avatar, reglas arancelarias y políticas de cancelación sin riesgo de contaminación cruzada.
5. **Ontología Operativa de Módulos:** Arquitectura estructurada en 3 Pilares de Negocio: **Operación**, **Inteligencia** y **Administración**, más la Guía Oficial de Medición con 13 métricas estandarizadas.
6. **Centro de Configuración & Políticas de 4 Submódulos con Zero-State Limpio:** Wizard RAG de 6 pasos con bloqueo estricto en Paso 1 (`hasPendingAnalysis`) y sanitización (`sanitizeField`), Motores IA con configuración contextual inline de API Keys cifradas (`AES-256-GCM`), Reglas de Negocio con vista dual (`Negocio Activo` vs. `Gobernanza Global & Matriz`) sin Layout Shift, y Canales Oficiales.
7. **Tutor IA Contextual (`OnboardingTour.jsx`) & Gobernanza IAM sin Caducidad (`/team`):** Recorridos guiados interactivos por módulo/submódulo desde el Header, y gestión de colaboradores con detección automática de `Invitación Pendiente` y reenvío en 1 clic por Correo/WhatsApp.

---

## 📚 2. Matriz de Documentos de Arquitectura & Diseño (ADRs & SDD)

La suite de decisiones de arquitectura y especificaciones del sistema se encuentra completamente formalizada en el directorio [`/docs`](docs/):

| Documento | Título & Alcance Oficial | Estado |
| :--- | :--- | :---: |
| 🏛️ **[ADR-001](docs/ADR_001_MASTER_ARCHITECTURE_AND_BUSINESS_RULES.md)** | Arquitectura Maestra, Gobernanza Multi-Tenant & Reglas de Negocio (Regla 95/5) | `ACEPTADO` |
| 🏷️ **[ADR-002](docs/ADR_002_UNIVERSAL_BUSINESS_TAXONOMY_AND_RAG_PILLARS.md)** | Taxonomía Universal de 17 Giros Comerciales, Protocolo de Reacción & 4 Pilares RAG | `ACEPTADO` |
| 🎯 **[ADR-003](docs/ADR_003_META_GRAPH_INTELLIGENCE_AND_HITL_TRIAGE.md)** | Meta Graph Intelligence, Keyword-to-DM, Moderación Anti-Hate & Triage HITL | `ACEPTADO` |
| 🧠 **[ADR-004](docs/ADR_004_MODEL_ROUTING_AND_AGENT_SPECIALIZATION.md)** | Enrutamiento de Modelos (DeepSeek V3 <800ms vs. DeepSeek R1 Cognitivo) | `ACEPTADO` |
| 🌐 **[ADR-005](docs/ADR_005_UNIVERSAL_MULTI_PROVIDER_AI_TAXONOMY.md)** | Taxonomía Multi-Proveedor de Modelos AI (OpenAI, Anthropic, Gemini, DeepSeek, Groq) | `ACEPTADO` |
| 🔗 **[ADR-006](docs/ADR_006_TRI_DIMENSIONAL_COUPLING_MATRIX.md)** | Matriz Tridimensional de Acoplamiento (Giro × Canal × Fase de Conversión) | `ACEPTADO` |
| 💰 **[ADR-007](docs/ADR_007_OFFICIAL_COMMERCIAL_PRICING_AND_BILLING_RULES.md)** | Modelo Comercial Vector Deal: Setup $20,000 MXN + Mensualidad $5,000 + Piso Mínimo $\ge \$350.00\text{ MXN}$ por Lead Calificado + Presupuesto Mensual de Meta Ads (`monthlyAdBudget`) | `ACEPTADO` |
| ⚡ **[ADR-008](docs/ADR_008_PAY_PER_QUALIFIED_LEAD_STATE_MACHINE_AND_KANBAN_TRIAGE.md)** | Máquina de Estados Pay-Per-Qualified-Lead ($\ge \$350.00\text{ MXN}$ + `monthlyAdBudget`), 4 Criterios AND & Kanban Triage | `ACEPTADO` |
| 🎨 **[ADR-009](docs/ADR_009_DUAL_THEME_DESIGN_SYSTEM_RULES.md)** | Sistema de Diseño Dual-Theme (Modo Oscuro & Modo Claro) y Guardrail de la Lima | `ACEPTADO` |
| 📅 **[ADR-010](docs/ADR_010_MICRO_LANDING_TELEMETRY_AND_DYNAMIC_MASTER_AGENDA.md)** | Micro-Landing Dual, Master Agenda Semanal, QR Móvil, WebCal y Email Studio .ICS | `ACEPTADO` |
| 💼 **[ADR-011](docs/ADR_011_UX_UI_BRAND_AND_OPERATIONAL_TAXONOMY.md)** | Ontología de Módulos Operativos, Identidad de Marca y Principios UX-01 a UX-10 | `ACEPTADO` |
| 🚀 **[ADR-012](docs/ADR_012_UNIFIED_COMMERCIAL_GROWTH_SUITE_AND_OMNICHANNEL_MATRIX.md)** | Suite de Crecimiento Comercial Unificada (`/crm` + `/planner`), Catálogo de Paquetes con Precios transparentes y Matriz Omnicanal | `ACEPTADO` |
| 🛡️ **[ADR-013](docs/ADR_013_ZERO_STATE_GOVERNANCE_CONTEXTUAL_AI_TUTOR_AND_IAM_INVITATION_ARCHITECTURE.md)** | Gobernanza Zero-State, Wizard 6 Pasos con Bloqueo IA, BYOK Inline `AES-256-GCM`, Tutor IA Contextual (`OnboardingTour.jsx`) e Invitaciones IAM sin Caducidad | `ACEPTADO` |
| 📐 **[SDD v4.2](docs/SDD_SYSTEM_DESIGN_DOCUMENT.md)** | Documento Maestro de Diseño de Sistema (Zero-State Governance, Contextual AI Tutor, Inline BYOK AES-256 & IAM Invitation Lifecycle Edition), Esquemas SQL RLS V1–V9 y Contratos Backend | `ACEPTADO` |

---

## 🏛️ 3. Diagrama de Arquitectura Global & Aislamiento Multi-Tenant

El siguiente diagrama detalla la interacción desacoplada entre el Frontend en Next.js 14 (incluyendo el Tutor IA Contextual, los 4 submódulos de `/connections` y la gobernanza de equipo en `/team`), el API Gateway con inyección de cabeceras multi-tenant, el Core Backend en Spring Boot 3 con sus servicios transaccionales reales, el Motor Cognitivo de IA y la persistencia en PostgreSQL 17 con Row-Level Security:

```mermaid
flowchart TB
    subgraph FrontendTier ["CAPA CLIENTE & PRESENTACIÓN (Next.js 14 App Router)"]
        direction TB
        Switch["Tenant Switcher (useTenant + Zero-State Guard)"]
        Tour["Tutor IA Contextual (OnboardingTour.jsx - 12 Rutas + 4 Submódulos)"]
        UI_Dash["Centro de Mando (/dashboard)"]
        UI_CRM["Suite Comercial Unificada: CRM Triage (/crm) & Planner (/planner)"]
        UI_Agenda["Master Agenda Semanal, QR Móvil & Email Studio .ICS (/agenda)"]
        subgraph UI_Conn ["Centro de Configuración & Políticas (/connections - 4 Submódulos)"]
            Sub_Wizard["1. Ingestión RAG & Briefing (Wizard 6 Pasos + Bloqueo IA)"]
            Sub_AI["2. Motores IA & Enrutamiento (BYOK Inline AES-256)"]
            Sub_Rules["3. Reglas de Negocio & Taxonomía (Vista Dual sin Layout Shift)"]
            Sub_Meta["4. Canales Oficiales (Meta Graph / WhatsApp / CAPI)"]
        end
        UI_Team["Gobierno de Equipo & Accesos IAM (/team - AgencyStaffView)"]
        UI_Public["Micro-Landings Dinámicas (/m/[slug])"]
        Interceptor["Axios Interceptor: Inyecta X-Tenant-ID & JWT"]
    end

    subgraph SecurityTier ["GATEWAY DE SEGURIDAD & INGESTIÓN"]
        Cloudflare["Cloudflare Tunnels (SSL & Webhooks HTTPS)"]
        Nginx["Nginx Reverse Proxy & Load Balancer"]
        AuthFilter["JwtAuthenticationFilter + TenantContextFilter (app.current_tenant_id)"]
    end

    subgraph BackendCore ["CORE TRANSACCIONAL (Spring Boot 3.4 / Java 21)"]
        TenantService["TenantService (CRUD Multi-Tenant, Tarifa >= $350 MXN, monthlyAdBudget)"]
        IamService["IamService (RBAC 4 Roles, Vec#Auth2026!, Invitaciones sin Caducidad)"]
        AiService["AiService + AesEncryptionService (AES-256-GCM BYOK & DeepSeek Semantic Parser)"]
        DocExtractor["DocumentTextExtractor (Apache PDFBox 3.0.3 / Apache POI DOCX)"]
        LeadService["LeadService 4-Guard (4 Criterios Booleanos AND + Billing Ledger >= $350 MXN)"]
        AppointmentService["AppointmentService Advisory Lock (pg_advisory_xact_lock + Google Calendar & WebCal)"]
        MetaCapiService["MetaCapiService Server-to-Server Engine (SHA-256)"]
    end

    subgraph AIEngine ["MOTOR COGNITIVO & MULTI-AGENTE (DeepSeek & Multi-Provider)"]
        RouterAI["Model Router Determinista (Pool Oficial vs BYOK Tenant)"]
        V3["DeepSeek V3 (deepseek-chat): Chat Operativo & Extracción JSON (<800ms)"]
        R1["DeepSeek R1 (deepseek-reasoner): Razonamiento CoT & Auditoría Cognitiva"]
        AntiHate["Moderador Anti-Hate & Clasificador de Intención"]
    end

    subgraph DataStorage ["PERSISTENCIA MULTI-TENANT & EVENTOS"]
        Postgres[("PostgreSQL 17 (Flyway V1-V9 + Row-Level Security RLS)")]
        PgVector[("pgvector: RAG Chunks Aislados por tenant_id")]
        Redis[("Upstash Redis: Colas Asíncronas & Re-engagement 24h")]
    end

    Switch & Tour --> Interceptor
    UI_Dash & UI_CRM & UI_Agenda & UI_Conn & UI_Team & UI_Public --> Interceptor
    Interceptor -->|HTTP REST + Header X-Tenant-ID| Nginx
    Cloudflare -->|Webhooks Meta WhatsApp / IG| Nginx
    Nginx --> AuthFilter
    AuthFilter --> TenantService
    AuthFilter --> IamService
    AuthFilter --> AiService
    AuthFilter --> DocExtractor
    AuthFilter --> LeadService
    AuthFilter --> AppointmentService
    AuthFilter --> MetaCapiService

    DocExtractor --> AiService
    AiService --> RouterAI
    RouterAI --> V3
    RouterAI --> R1
    RouterAI --> AntiHate

    LeadService <--> Redis
    AppointmentService --> GoogleWS["Google Calendar API v3 & WebCal"]
    MetaCapiService --> MetaGraph["Meta Graph API & CAPI S2S"]

    TenantService & IamService & AiService & LeadService & AppointmentService <-->|SET LOCAL app.current_tenant_id| Postgres
    AiService <--> PgVector
```

---

## 🏊 4. Diagramas de Carriles (Swimlanes) Operativos y Arquitectónicos

A continuación se documentan los **3 Diagramas de Carriles (Swimlanes)** principales que rigen el ciclo de vida comercial, la configuración multi-tenant con IA y la gobernanza de identidad (IAM) del sistema.

---

### 4.1. Carriles 1 — Ciclo de Vida del Prospecto, 4 Criterios AND, Master Agenda & Atribución Meta CAPI ($\ge \$350\text{ MXN}$)

#### A. Diagrama de Secuencia Inter-Carril (End-to-End)

```mermaid
sequenceDiagram
    autonumber
    actor U as Carril 1: Prospecto / Cliente
    participant M as Carril 2: Meta Ads / IG / WhatsApp
    participant IA as Carril 3: Motor IA & RAG (DeepSeek V3)
    participant HITL as Carril 4: Operador HITL & Master Agenda (/agenda)
    participant CAPI as Carril 5: Facturación (>= $350 MXN) & Meta CAPI

    Note over U,M: Fase 1: Captura Publicitaria & Keyword Trigger
    U->>M: Interactúa con anuncio (monthlyAdBudget) o comenta Keyword ("VALORACION" / "RESERVA")
    M->>IA: Webhook entrante en tiempo real (0ms) + Payload Meta Graph
    IA->>IA: Valida RLS del tenant + Carga 4 Pilares RAG del negocio activo

    Note over U,IA: Fase 2: Calificación Determinista (4 Criterios Booleanos AND)
    IA->>U: Responde en <800ms con gancho comercial y resuelve dudas de catálogo/aranceles
    U->>IA: Entrega Nombre, WhatsApp E.164, Servicio de interés y Aceptación de rango de precio
    IA->>IA: Evalúa 4/4 Criterios AND (Identity, Need, Budget, Booking Intent)
    IA->>HITL: Promueve Lead a LEAD_HOT_PREQUAL y notifica en Tablero Kanban (/crm)

    Note over HITL,CAPI: Fase 3: Dictamen Pre-Cita, Advisory Lock & Master Agenda
    HITL->>HITL: Abre Drawer Lateral "Dictamen Pre-Cita" y verifica resumen BANT
    HITL->>HITL: Clic en [Aprobar Cita & Sincronizar Google Calendar]
    HITL->>HITL: Ejecuta pg_advisory_xact_lock en PostgreSQL (Cero Double-Booking)
    HITL->>U: Envía invitación Google Calendar v3 + Enlace WebCal + Correo Membretado .ICS (RFC 5545)

    Note over HITL,CAPI: Fase 4: Monetización Pay-Per-Qualified-Lead (>= $350 MXN) & CAPI S2S
    HITL->>CAPI: LeadService 4-Guard valida 4/4 criterios y registra cargo >= $350.00 MXN en billing_ledger
    CAPI->>M: Despacho Server-to-Server (Lead_Qualified / Purchase con Hash SHA-256)
    M-->>CAPI: Optimización de pauta y reconciliación de ROAS Real vs monthlyAdBudget
```

#### B. Diagrama de Flujo por Carriles (Swimlanes Horizontales)

```mermaid
flowchart LR
    subgraph Lane1 ["Carril 1: Prospecto"]
        P1(["Ve Anuncio / Reel en IG o FB"])
        P2["Comenta Keyword o abre WhatsApp"]
        P3["Proporciona Identidad, Necesidad, Presupuesto e Intención"]
        P4(["Recibe Correo .ICS + Invitación Google Calendar / QR"])
    end

    subgraph Lane2 ["Carril 2: Meta Ads & WhatsApp"]
        M1["Campaña Activa (monthlyAdBudget)"]
        M2["Dispara Webhook Graph API / WhatsApp Cloud"]
        M3["Recibe Evento S2S SHA-256 y Optimiza Algoritmo"]
    end

    subgraph Lane3 ["Carril 3: Motor IA & RAG"]
        AI1["Aísla Tenant (RLS) + Recupera 4 Pilares RAG"]
        AI2["Atiende en <800ms (DeepSeek V3) y Filtra 95% Curiosos"]
        AI3{"¿Cumple 4 Criterios AND?"}
        AI4["Cola Redis Re-engagement 24h ($0 MXN)"]
    end

    subgraph Lane4 ["Carril 4: Operador HITL & Master Agenda"]
        H1["Revisa Dictamen Pre-Cita en Kanban (/crm)"]
        H2["Aprueba Cita en 1 Clic (Sutura Arcángel)"]
        H3["Bloquea Horario (pg_advisory_xact_lock) en /agenda"]
        H4["Sincroniza Google Calendar, WebCal & Email Studio"]
    end

    subgraph Lane5 ["Carril 5: Facturación >= $350 MXN & Meta CAPI"]
        B1["LeadService 4-Guard Verifica Invariantes"]
        B2["Asienta Cargo >= $350.00 MXN en billing_ledger"]
        B3["MetaCapiService Despacha Evento CAPI S2S"]
    end

    M1 --> P1 --> P2 --> M2 --> AI1 --> AI2 --> P3 --> AI3
    AI3 -- "No (Out-of-Market)" --> AI4
    AI3 -- "Sí (4/4 True)" --> H1 --> H2 --> H3 --> H4 --> P4
    H2 --> B1 --> B2 --> B3 --> M3
```

---

### 4.2. Carriles 2 — Alta de Negocio (Wizard 6 Pasos con Bloqueo IA), BYOK Inline AES-256-GCM y Gobernanza Dual Zero-State

Este diagrama modela la creación limpia de un negocio desde estado cero (`Zero-State`), la extracción documental real con bloqueo estricto en el Paso 1 mientras la IA procesa, el cifrado de llaves propias (`BYOK`) y la separación sin *Layout Shift* en Reglas de Negocio:

```mermaid
flowchart TB
    subgraph L_Admin ["Carril 1: Super Admin / Agencia"]
        A1(["Inicia en Zero-State Limpio (0 Tenants)"])
        A2["Abre Wizard 6 Pasos y Sube PDF / DOCX / TXT en Paso 1"]
        A3["Espera Fin de Análisis IA y Revisa Campos Autocompletados"]
        A4["Configura Piso >= $350 MXN + monthlyAdBudget (Paso 4) y Guarda"]
        A5["Activa BYOK Inline o Alterna Vista Dual en Reglas de Negocio"]
    end

    subgraph L_Front ["Carril 2: Frontend (/connections - 4 Submódulos)"]
        F1["Zero-State Guard: Oculta Demos y Muestra CTA 'Dar de Alta Primer Negocio'"]
        F2["Submódulo 1 (Wizard Paso 1): Activa hasPendingAnalysis = true y Bloquea 'Siguiente'"]
        F3["Aplica sanitizeField() (Filtra 'No especificado' / placeholders) e Hidrata Pasos 1-6"]
        F4["Submódulo 2 (Motores IA): Modal Inline BYOK para Proveedor sin Llave"]
        F5["Submódulo 3 (Reglas): Selector Dual ('Negocio Activo' vs 'Gobernanza Global & Matriz')"]
    end

    subgraph L_Back ["Carril 3: Backend Spring Boot (RAG & AES-256)"]
        S1["DocumentTextExtractor: Extrae Texto Real con Apache PDFBox 3.0.3 / POI DOCX"]
        S2["AiService.analyzeOnboardingDocument(): Construye Prompt Estructurado"]
        S3["TenantService: Valida Invariante >= $350 MXN y Persiste Configuración"]
        S4["AesEncryptionService: Cifra API Key con AES-256-GCM (IV 96-bit + Tag 128-bit)"]
    end

    subgraph L_LLM ["Carril 4: DeepSeek Semantic Parser / Pool Oficial"]
        D1["Resuelve Credencial: BYOK Desencriptada del Tenant -> Fallback Pool Oficial Agencia"]
        D2["DeepSeek V3 (temperature: 0.1): Extrae JSON Semántico (Identidad, 4 Pilares, Precios, Horarios)"]
    end

    subgraph L_DB ["Carril 5: PostgreSQL 17 (Migraciones V1-V9)"]
        DB1[("Tabla tenants (V8/V9): legal_name, rfc_tax_id, monthly_ad_budget, target_roas")]
        DB2[("Tabla rag_knowledge_chunks: 4 Pilares RAG Aislados por tenant_id")]
        DB3[("Tabla tenant_ai_configs: encrypted_api_key (AES-256-GCM) + maskedKeyHint")]
    end

    A1 --> F1 --> A2 --> F2 --> S1 --> S2 --> D1 --> D2
    D2 -->|JSON Estructurado| F3
    F3 -->|Desbloquea Botón 'Siguiente'| A3 --> A4 --> S3 --> DB1 & DB2
    A5 --> F4 --> S4 --> DB3
    A5 --> F5
```

---

### 4.3. Carriles 3 — Gobierno de Equipo IAM, Invitaciones sin Caducidad y Reenvío en 1 Clic (`/team`)

Este flujo detalla el ciclo de vida de los colaboradores en `/team`, garantizando que las invitaciones **no caduquen por tiempo**, se identifiquen automáticamente como `Invitación Pendiente` hasta el primer inicio de sesión real y permitan el reenvío de credenciales en 1 clic:

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Carril 1: Super Admin / Dueño (/team)
    participant UI as Carril 2: Frontend IAM (AgencyStaffView.jsx)
    participant IAM as Carril 3: Backend IamService (/api/v1/team)
    participant Mail as Carril 4: Despachador (/api/send-invitation & WhatsApp)
    actor User as Carril 5: Colaborador Invitado

    Note over Admin,Mail: Fase 1: Alta de Colaborador e Invitación Inicial sin Caducidad
    Admin->>UI: Completa modal "Invitar Colaborador" (Nombre, Email, Rol RBAC, Tenants)
    UI->>IAM: POST /api/v1/team/members
    IAM->>IAM: Asigna contraseña temporal institucional (Vec#Auth2026!) con BCrypt
    IAM->>IAM: Establece mustChangePassword = true y lastLoginAt = null (Sin TTL de expiración)
    IAM-->>UI: Retorna MemberDto persistido en PostgreSQL (user_accounts + tenant_memberships)
    UI->>Mail: POST /api/send-invitation (Envía Email HTML Membretado con credenciales)
    Mail-->>User: Recibe correo oficial de bienvenida (y/o enlace por WhatsApp)

    Note over Admin,UI: Fase 2: Detección Automática de "Invitación Pendiente"
    UI->>IAM: GET /api/v1/team/members
    IAM-->>UI: Lista miembros con campos lastLoginAt y mustChangePassword
    UI->>UI: Evalúa (lastLoginAt == null || mustChangePassword == true)
    UI-->>Admin: Renderiza Badge Ámbar "Invitación Pendiente" + Botón [Reenviar Invitación]

    Note over Admin,User: Fase 3: Reenvío en 1 Clic (Correo Transaccional + WhatsApp)
    Admin->>UI: Clic en [Reenviar Invitación] sobre colaborador pendiente
    UI->>Mail: POST /api/send-invitation (Reenvía Email con Vec#Auth2026! sin invalidar cuenta)
    UI->>User: Abre modal de confirmación con opción de envío directo por WhatsApp en 1 clic

    Note over User,IAM: Fase 4: Primer Login Real y Transición a Estado "Activo"
    User->>IAM: Inicia sesión con Vec#Auth2026! y completa cambio de contraseña
    IAM->>IAM: Actualiza lastLoginAt = NOW() y mustChangePassword = false
    IAM-->>UI: En siguiente lectura, el colaborador pasa automáticamente a Badge Verde "Activo"
```

---

## 📅 5. Master Agenda Dinámica & Email Studio Membretado

El módulo de **Agenda y Citas (`/agenda`)** resuelve integralmente la sincronización y la comunicación transaccional con el cliente:

```mermaid
graph TD
    subgraph MasterAgendaCore ["MASTER AGENDA ENGINE (/agenda)"]
        ViewSwitcher{"Selector de Modo de Vista"}
        View_Week["📅 Semana Completa (Lunes a Domingo)"]
        View_Grid["⏱️ Vista Horas & Turnos Dinámicos"]
        View_List["📋 Lista Resumen Secuencial"]
        
        ViewSwitcher --> View_Week
        ViewSwitcher --> View_Grid
        ViewSwitcher --> View_List
    end

    subgraph MobileAndCalendarSync ["SINCRONIZACIÓN MÓVIL & GOOGLE CALENDAR"]
        Btn_Mobile["Botón Hero: 'Ver en Celular & Google Calendar'"]
        Modal_Sync["Modal MobileSyncModal"]
        QR["Código QR Dinámico SVG para Cámara Móvil"]
        Google_Sub["Suscripción 1-Clic: calendar.google.com/calendar/render?cid=webcal..."]
        WebCal["Protocolo Universal WebCal: webcal://api.vectorinside.app/..."]
        WA_Share["Compartir Enlace Seguro por WhatsApp"]
        
        Btn_Mobile --> Modal_Sync
        Modal_Sync --> QR
        Modal_Sync --> Google_Sub
        Modal_Sync --> WebCal
        Modal_Sync --> WA_Share
    end

    subgraph EmailStudioTransaction ["EMAIL STUDIO MEMBRETADO & RFC 5545"]
        Apt_Card["Tarjeta de Cita Confirmada"]
        Email_Modal["Modal AppointmentConfirmationEmailModal"]
        Vars_Engine["Motor de Variables Dinámicas: {{cliente}}, {{servicio}}, {{fecha}}, {{ubicacion}}"]
        ICS_Gen["Generador RFC 5545 .ics Client-Side Blob"]
        Google_Template["URL Template Autocompletado Google Calendar"]
        WYSIWYG["Previsualizador Dual WYSIWYG (Desktop / Móvil)"]
        Send_Confetti["Despacho Transaccional con Feedback & Confeti"]
        
        Apt_Card --> Email_Modal
        Email_Modal --> Vars_Engine
        Email_Modal --> ICS_Gen
        Email_Modal --> Google_Template
        Vars_Engine & ICS_Gen & Google_Template --> WYSIWYG
        WYSIWYG --> Send_Confetti
    end

    subgraph TenantIsolation ["BLINDAJE MULTI-TENANT DE PLANTILLAS"]
        Dict["TENANT_EMAIL_TEMPLATES & tenantEmailConfigs[activeKey]"]
        T_Custom["🏢 Negocios Reales en PostgreSQL: Membrete, Color Primario, Políticas y Ubicación Aislados"]
        Dict --> T_Custom
        Dict -.-> Vars_Engine
    end
```

---

## 💼 6. Ontología de Módulos Operativos (3 Pilares + Soporte Transversal)

La interfaz se estructura en tres pilares de valor comercial y una capa de soporte transversal que incluye la **Guía Oficial de Medición** y el **Tutor IA Contextual (`OnboardingTour.jsx`)**:

```mermaid
graph TD
    subgraph Pillar1["💼 PILAR 1: OPERACIÓN (Día a Día & Suite Comercial Unificada)"]
        M01["1. Centro de Mando (/dashboard) - Visión Ejecutiva, Zero-State y Tareas Inmediatas"]
        M02["2. Contactabilidad (/contactability) - Embudo, Tiempos de Respuesta y SLAs"]
        M03["3. Campañas (/campaigns) - Ofertas, Audiencias y monthlyAdBudget vs Gasto"]
        M04["4. Estudio de Contenido (/planner) - Parrilla Editorial, Paquetes con Precios y Aprobación"]
        M05["5. Conversaciones (/inbox) - Bandeja Omnicanal y Calificación Inmediata"]
        M06["6. Prospectos y Ventas CRM (/crm) - Kanban 4-Guard (>= $350 MXN), BANT y Dictamen Pre-Cita"]
        M07["7. Agenda y Citas (/agenda) - Advisory Lock, QR Móvil, WebCal, Google Calendar y Email .ICS"]
    end

    subgraph Pillar2["📊 PILAR 2: INTELIGENCIA (Auditoría y Crecimiento)"]
        M08["8. Resultados (/results) - Reconciliación Inversión Meta/Google, ROAS Real y CAC"]
        M09["9. Pruebas y Aprendizaje Lab (/lab) - Simulador RAG, Hipótesis A/B y Fatiga Creativa"]
    end

    subgraph Pillar3["⚙️ PILAR 3: ADMINISTRACIÓN (Gobernanza Multi-Tenant, RAG & IAM)"]
        M10["10. Perfil de Marca (/profile) - Identidad Corporativa, Voz y Guardrails"]
        M11["11. Configuración & Políticas (/connections) - 4 Submódulos: (1) Wizard RAG 6 Pasos, (2) Motores IA BYOK AES-256, (3) Reglas Duales sin Layout Shift, (4) Canales Meta/CAPI"]
        M12["12. Equipo y Control IAM (/team) - RBAC 4 Roles, Invitaciones sin Caducidad, Reenvío 1-Clic y Auditoría"]
    end

    subgraph Pillar4["📖 SOPORTE TRANSVERSAL & HABILITACIÓN"]
        M13["13. Guía de Medición (Modal / Drawer) - 13 Fórmulas Oficiales y Glosario"]
        M14["14. Tutor IA Contextual (OnboardingTour.jsx) - Recorridos Guiados Interactivos por Ruta y Submódulo desde el Header"]
    end
```

---

## 💰 7. Reglas de Negocio Inviolables (Vector Deal, RAG, BYOK & Gobernanza IAM)

| Regla de Negocio | Condición Técnica | Impacto en el Sistema |
| :--- | :--- | :--- |
| **Setup de Implementación** | $20,000 MXN + IVA (Pago Único Mes 1) | Cubre ingestión de los 4 Pilares RAG, calibración del Lobo Vectorial y conexión CAPI S2S. |
| **Mensualidad Base** | $5,000 MXN + IVA (A partir del Día 31) | Corre estrictamente al terminar el mes de implementación. Garantiza mantenimiento y soporte continuo. |
| **Piso Mínimo por Lead Calificado + `monthlyAdBudget`** | $\ge \$350.00\text{ MXN}$ por evento + Presupuesto Mensual Meta Ads (`monthlyAdBudget`) | El sistema bloquea cualquier tarifa $< \$350.00\text{ MXN}$ en UI y Backend. El cargo se asienta en `billing_ledger` solo al cumplir los 4 criterios booleanos AND, y el `monthlyAdBudget` alimenta el cálculo de ROAS Real. |
| **Bloqueo Estricto en Paso 1 del Wizard (`hasPendingAnalysis`)** | `hasPendingAnalysis === true` durante extracción PDF/DOCX/TXT e inferencia DeepSeek | Si el usuario adjunta documentos pero no los ha procesado con IA, el botón **"Siguiente"** permanece bloqueado con aviso ámbar; los campos se limpian con `sanitizeField()` antes de hidratar el formulario. |
| **BYOK Inline con Cifrado `AES-256-GCM`** | Cifrado autenticado en `AesEncryptionService` (`IV 96-bit` + `Tag 128-bit`) | Las API Keys propias del cliente nunca se exponen en texto plano tras guardarse (solo `maskedKeyHint`). Permite configurar la llave inline al seleccionar un proveedor sin credencial o usar el Pool Oficial de la Agencia. |
| **Separación Dual sin *Layout Shift* en Reglas de Negocio** | Selector de alcance en Submódulo 3 (`Negocio Activo` vs. `Gobernanza Global & Matriz`) | Separa las políticas operativas del cliente activo de la matriz maestra de 17 giros de la agencia, manteniendo un contenedor de ancho estable sin saltos de layout. |
| **Zero-State Limpio (`tenantsList.length === 0`)** | Guardas de renderizado cuando no existen negocios en PostgreSQL | Prohibido inyectar tenants ficticios o datos mock cuando la base de datos está vacía; se presenta un estado vacío guiado hacia el alta del primer negocio. |
| **Invitaciones IAM sin Caducidad (`/team`)** | `lastLoginAt == null \|\| mustChangePassword == true` con contraseña inicial `Vec#Auth2026!` | Las invitaciones a colaboradores nunca caducan por tiempo. El sistema muestra el badge **"Invitación Pendiente"** y habilita el botón **[Reenviar Invitación]** en 1 clic por Correo/WhatsApp hasta que el usuario inicie sesión por primera vez. |
| **Regla 95/5 (Ehrenberg-Bass)** | 95% Out-of-Market / 5% In-Market | El 95% de evasivas no se cobran; se encolan en Redis para re-engagement a las 24h a costo $0 USD. |
| **Aislamiento Multi-Tenant** | `tenant_id` obligatorio en DB & Header `X-Tenant-ID` | Políticas RLS de PostgreSQL activadas. Ningún dato de un negocio es visible por otro. |
| **Guardrail de la Lima (`#C3F400`)** | Contraste de Color WCAG AA/AAA | Texto sobre claro usa `#506500` (6.5:1). Botones usan `#C3F400` con texto negro (14.8:1). |

---

## 🛠️ 8. Tech Stack & Estándares Visuales

| Capa | Tecnología / Herramienta | Propósito en el Sistema |
| :--- | :--- | :--- |
| **Framework UI** | React 18 / Next.js 14+ (App Router) | Renderizado SSR, cliente reactivo, rutas públicas `/m/[slug]`, Tutor IA Contextual y layouts modulares. |
| **Core Backend** | Java 21 LTS + Spring Boot 3.4 | Servicios transaccionales (`TenantService`, `IamService`, `AiService`, `LeadService`, `AppointmentService`). |
| **Seguridad & Cifrado** | Spring Security + JWT + `AES-256-GCM` | Autenticación RBAC, aislamiento multi-tenant y bóveda criptográfica para llaves BYOK. |
| **Ingestión Documental** | Apache PDFBox 3.0.3 + Apache POI 5.3.0 | Extracción real de texto desde archivos `.pdf`, `.docx`, `.txt` y `.md` para los 4 Pilares RAG. |
| **Base de Datos** | PostgreSQL 17 + Flyway (V1–V9) + RLS | Persistencia relacional multi-tenant con Row-Level Security y bloqueos `pg_advisory_xact_lock`. |
| **Estilos CSS** | Tailwind CSS + Variables CSS Dual-Theme | Soporte nativo modo oscuro (`#101114`) y modo claro (`#F5F5F8`) según ADR-009. |
| **Estado Global & HTTP** | Context API (`useTenant`) + Axios Interceptors | Sincronización con PostgreSQL, Zero-State limpio e inyección de `X-Tenant-ID` y `Authorization: Bearer`. |

---

## 🚀 9. Guía de Ejecución Local

### 1. Clonar el repositorio e instalar dependencias Frontend:
```bash
git clone https://github.com/VectorInside/Vector-Community.git
cd Vector-Community
npm install
```

### 2. Iniciar PostgreSQL 17 y el Backend Spring Boot (`vector-core`):
```bash
cd ../vector-core
./mvnw spring-boot:run
```

### 3. Iniciar el servidor de desarrollo Frontend:
```bash
cd ../Vector-Community
npm run dev
```

### 4. Abrir en el navegador:
Accede a [http://localhost:3000](http://localhost:3000) para operar el panel multi-tenant, ejecutar el Wizard RAG de 6 pasos, configurar llaves BYOK o activar el **Tutor IA Contextual** desde la barra superior.

---

## 📄 10. Licencia & Propiedad Intelectual

Desarrollado y operado por el equipo de ingeniería y estrategia de producto de **Vector Inside**.  
Todos los derechos reservados © 2026. Prohibida la reproducción parcial o total sin autorización previa.
