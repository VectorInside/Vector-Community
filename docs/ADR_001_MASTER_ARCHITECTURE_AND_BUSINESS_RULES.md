# 🏛️ ADR-001: Arquitectura Maestra, Gobernanza Multi-Tenant & Motor de IA

- **Estado:** ACEPTADO (v2.5)
- **Fecha:** 2026-10-01
- **Autor:** Lead Software Architect & Product Strategist — Vector Inside
- **Contexto:** Vector Community ("La Puerta Trasera")

---

## 1. Contexto & Planteamiento del Problema
El Community Management tradicional presenta deficiencias críticas: alta dependencia de personal manual, riesgo de respuestas erróneas que comprometen la reputación de marcas, falta de atribución financiera real (ROAS real vs métricas vanidosas del Pixel) y nula escalabilidad multi-cliente.

**Vector Community** requiere una arquitectura desacoplada que combine:
1. Automatización extrema con agentes de Inteligencia Artificial (LangGraph / DeepSeek / Groq).
2. Seguridad estricta multi-empresa con aislamiento de datos.
3. Gobernanza de agencia con filtro humano obligatorio previo a cualquier impacto en el cliente final (**Human-in-the-Loop - HITL**).
4. Adaptabilidad a 5 verticales de negocio: **Hospitality**, **Service Appointments (Salud/Clínicas)**, **E-Commerce**, **B2B Sales (High-Ticket)** y **Creator Economy (Redes Sociales Meta)**.

---

## 2. Decisiones de Arquitectura (Decisions)

### 2.1. Gobernanza "Agencia Primero" (Agency Co-Pilot & HITL)
- **Decisión:** Ninguna cita, propuesta de presupuesto, recomendación de campaña o interacción sensible se sincroniza con el dueño del negocio ni con herramientas de terceros sin la aprobación previa en **1 clic** de un operador de la agencia.
- **Estado de Transición:** Todo evento extraído por IA se almacena en estado inicial `PENDING_AGENCY_APPROVAL`.

### 2.2. Aislamiento Multi-Tenant Estricto (Supabase PostgreSQL RLS)
- **Decisión:** Todo registro en base de datos e índice vectorial `pgvector` incluye la clave foránea obligatoria `tenant_id`.
- **Implementación:** Políticas de PostgreSQL **Row Level Security (RLS)** activadas para que sea matemáticamente imposible la fuga o cruce de datos entre marcas competidoras. En el frontend, el interceptor Axios inyecta automáticamente el encabezado HTTP `X-Tenant-ID`.

### 2.3. Desacople de Microservicios: Spring Boot (Core) + Python AI Worker
- **Decisión:** 
  - **Backend Core (Spring Boot / Java 21):** Responsable de la seguridad JWT, gestión de Webhooks entrantes, persistencia transaccional, sincronización con Google Calendar API v3 y despacho server-to-server a Meta Conversions API (CAPI).
  - **AI Worker (Python LangGraph / CrewAI):** Microservicio dedicado al procesamiento denso de grafos de agentes, embeddings vectoriales y orquestación LLM (DeepSeek R1/V3 vía Groq Cloud).
  - **Cola Asíncrona (Redis / Upstash):** Desacopla las llamadas masivas concurrentes de WhatsApp Cloud API e Instagram Graph API.

### 2.4. Atribución Backend Real & Sincronización Meta CAPI
- **Decisión:** Los cálculos de **ROAS Real**, **MER** y **CAC** no dependen de las estimaciones del navegador (Pixel), sino del cruce exacto de ventas registradas en base de datos contra el gasto real de Meta Graph API.
- **Transmisión:** Los eventos confirmados se transmiten vía Meta Conversions API con datos de contacto hasheados en **SHA-256**.

### 2.5. Ecosistema Adaptativo por Verticales (`vertical_tipo`)
El sistema adapta su comportamiento, herramientas RAG y flujos de cierre según la vertical del negocio:
1. **Hospitality:** Menú digital PDF, reservas con validación manual para >8 personas, depósitos mínimos.
2. **Service Appointments:** Agenda médica, Google Calendar API 2-way, confirmaciones de anticipo.
3. **E-Commerce:** Catálogo RAG, recuperación de carritos por DM, eventos `Purchase` CAPI.
4. **B2B Sales (High-Ticket):** Calificación BANT, agendamiento de Discovery Calls y sincronización bidireccional con CRM (HubSpot / Salesforce).
5. **Creator Economy (Redes Sociales Meta):** Conversión de comentarios de Reels/Posts a DM (*Keyword-to-DM*), detección de ofertas de patrocinio de marcas y moderación automática de *haters*/toxicidad.

---

## 3. Consecuencias & Beneficios (Consequences)

### Positivas:
- **Cero Riesgo de Alucinación Pública:** El filtro HITL en 1 clic evita que el bot prometa ofertas erróneas o agende citas en horarios bloqueados.
- **Costos de Infraestructura $0 en Fase Demo:** Uso de Supabase Free, Vercel, Render/Localhost con Cloudflare Tunnels y Groq Cloud.
- **Escalabilidad Horizontal:** Arquitectura lista para producción con Docker Compose.
- **Retención de Clientes:** Métricas de Soberanía Financiera demostrables ante los clientes finales.

### Mitigaciones:
- **Latencia de Webhooks:** Se mitiga con Upstash Redis para responder con HTTP 200 a Meta en <200ms mientras el worker procesa en segundo plano.
