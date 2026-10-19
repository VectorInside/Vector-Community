# 🏛️ ADR-001: Arquitectura Maestra, Gobernanza Multi-Tenant & Motor de IA

- **Estado:** ACEPTADO (v3.0 - Universal Business Taxonomy & Meta Intelligence Edition)
- **Fecha:** 2026-10-09
- **Autor:** Lead Software Architect & Product Strategist — Vector Inside
- **Contexto:** Vector Community OS ("La Puerta Trasera")
- **Documentos Relacionados:** [ADR-002: Taxonomía Universal & Pilares RAG](file:///c:/Users/EdgarGs/Documents/ProyectoWork/VectorInside/VectorComunity/Vector-Community/docs/ADR_002_UNIVERSAL_BUSINESS_TAXONOMY_AND_RAG_PILLARS.md), [ADR-003: Meta Graph Intelligence & HITL](file:///c:/Users/EdgarGs/Documents/ProyectoWork/VectorInside/VectorComunity/Vector-Community/docs/ADR_003_META_GRAPH_INTELLIGENCE_AND_HITL_TRIAGE.md), [ADR-007: Modelo Comercial Vector Deal](file:///c:/Users/EdgarGs/Documents/ProyectoWork/VectorInside/VectorComunity/Vector-Community/docs/ADR_007_OFFICIAL_COMMERCIAL_PRICING_AND_BILLING_RULES.md)

---

## 1. Contexto & Planteamiento del Problema

El Community Management tradicional presenta deficiencias críticas: alta dependencia de personal manual, riesgo de respuestas erróneas que comprometen la reputación de marcas, falta de atribución financiera real (ROAS real vs métricas vanidosas del Pixel) y nula escalabilidad multi-cliente.

**Vector Community** requiere una arquitectura desacoplada que combine:

1. Automatización extrema con agentes de Inteligencia Artificial (LangGraph / DeepSeek / Groq).
2. Seguridad estricta multi-empresa con aislamiento de datos (PostgreSQL Row-Level Security).
3. Gobernanza de agencia con filtro humano obligatorio únicamente para excepciones críticas (**Human-in-the-Loop - HITL**).
4. Adaptabilidad a la **Taxonomía Universal de Giros Comerciales** (Fitness/Gyms, Escuelas/Educación, Networking/Membresías, E-Commerce, Hospitality/Restaurantes, B2B High-Ticket, Bienes Raíces/Autos y Creadores/Marcas Meta).
5. Ingestión en 1-clic de *Master Briefing* con auto-clasificación en los 4 Pilares RAG y medidor de salud (*RAG Health Score*).

---

## 2. Decisiones de Arquitectura (Decisions)

### 2.1. Gobernanza "Agencia Primero" & HITL Selectivo

- **Decisión:** La IA opera de forma 100% autónoma en el 95%+ de interacciones rutinarias. Únicamente se escala al operador humano (Lobo Vectorial) en:
  1. *Riesgo reputacional / Insultos / Crisis legal.*
  2. *Deals VIP de alto valor que requieren toque humano.*
  3. *Solicitudes que pretendan romper las Reglas Inviolables del negocio.*
  4. *Consultas sin respuesta en la base RAG.*

### 2.2. Aislamiento Multi-Tenant Estricto (Supabase PostgreSQL RLS)

- **Decisión:** Todo registro en base de datos e índice vectorial `pgvector` incluye la clave foránea obligatoria `tenant_id`.
- **Implementación:** Políticas de PostgreSQL **Row Level Security (RLS)** activadas para que sea matemáticamente imposible la fuga o cruce de datos entre marcas competidoras. En el frontend, el interceptor inyecta automáticamente el encabezado HTTP `X-Tenant-ID`.

### 2.3. Desacople de Microservicios: Spring Boot (Core) + Python AI Worker

- **Decisión:**
  - **Backend Core (Spring Boot / Java 21):** Responsable de la seguridad JWT, gestión de Webhooks entrantes, persistencia transaccional, sincronización con Google Calendar API v3 y despacho server-to-server a Meta Conversions API (CAPI).
  - **AI Worker (Python LangGraph / CrewAI):** Microservicio dedicado al procesamiento denso de grafos de agentes, embeddings vectoriales y orquestación LLM (DeepSeek R1/V3 vía Groq Cloud).
  - **Cola Asíncrona (Redis / Upstash):** Desacopla las llamadas masivas concurrentes de WhatsApp Cloud API e Instagram Graph API.

### 2.4. Atribución Backend Real & Sincronización Meta CAPI

- **Decisión:** Los cálculos de **ROAS Real**, **MER** y **CAC** no dependen de las estimaciones del navegador (Pixel), sino del cruce exacto de ventas registradas en base de datos contra el gasto real de Meta Graph API.
- **Transmisión:** Los eventos confirmados se transmiten vía Meta Conversions API con datos de contacto hasheados en **SHA-256**.

### 2.5. Ecosistema Adaptativo por Giros Comerciales & 4 Pilares RAG

- **Decisión:** Solo el **Pilar 2 (Identidad & Brandbook)** es estrictamente obligatorio.
- Los Pilares 1 (Precios), 3 (Crisis/FAQs) y 4 (Histórico) se adaptan dinámicamente según la familia comercial (Gimnasios, Escuelas, Redes de Networking, E-Commerce, Clínicas, B2B, Bienes Raíces, Creadores).
- Se incorpora el motor de **Auto-Ingestión 1-Click** para analizar briefings maestros sin carga manual.

### 2.6. Estrategia Dual de Adquisición: Negocios CON Web vs. SIN Web (`has_website`)

- **Decisión:** La plataforma incorpora un *Feature Toggle* (`has_website: true / false`) para gobernar la telemetría según la madurez digital del cliente:
  - **Negocios CON Web (`has_website = true`):** Integración de Google Analytics 4 (GA4 API - Plan $0 USD), Meta Pixel Web y medición de Bounce Rate contra Tasa de Clic a WhatsApp. Aplica la regla de diagnóstico:
    $$\text{IF } (\text{CPC Anuncio es Bajo}) \land (\text{Tráfico Web es Alto}) \land (\text{Tasa Clic a WhatsApp} < 3\%) \implies \text{Alerta: Fricción en Página Web}$$
  - **Negocios SIN Web (`has_website = false`):** Enrutamiento directo a mensajería (*Direct-to-Messaging* con pauta Click-to-WhatsApp y Click-to-DM). Los eventos de conversión se transmiten vía **Meta CAPI for Messaging** directamente desde los webhooks del chat sin requerir pixel web. Opcionalmente genera una Micro-Landing ultraligera en `app.vectorinside.com/m/{tenant_slug}`.

### 2.7. Contrato de Onboarding Multi-Tenant (`POST /api/v1/tenants/onboard`)

- **Decisión:** El proceso de alta de un nuevo tenant consolida 6 bloques atómicos de configuración:
  ```json
  {
    "tenant_id": "tenant_sonrisas_001",
    "business_name": "Clínica Dental Sonrisas",
    "legal_name_tax_id": "Sonrisas Dentales S.A. de C.V. / SDS120304XYZ",
    "vertical_tipo": "service_appointments",
    "owner_name": "Dr. Alejandro Silva",
    "owner_phone": "+525598765432",
    "meta_credentials": {
      "whatsapp_phone_number_id": "10987654321",
      "waba_id": "98765432109",
      "whatsapp_access_token": "EAAX...",
      "instagram_account_id": "1784140000000",
      "facebook_page_id": "100555444333"
    },
    "web_tracking": {
      "has_website": true,
      "website_url": "https://clinicasonrisas.com",
      "ga4_measurement_id": "G-ABC123XYZ",
      "meta_pixel_id": "123456789012345",
      "meta_capi_token": "EAAX_CAPI..."
    },
    "google_workspace_integration": {
      "google_calendar_id": "c_dental_sonrisas@group.calendar.google.com",
      "google_credentials_json": "{\"type\": \"service_account\", ...}",
      "gmail_sender_address": "citas@clinicasonrisas.com",
      "enable_gmail_transactional_dispatch": true,
      "email_templates": {
        "pre_cita_confirmation": "tpl_precita_dental_01",
        "monthly_roi_report": "tpl_executive_monthly_report_01"
      },
      "business_hours": {
        "monday_friday": "09:00-18:00",
        "saturday": "09:00-14:00"
      },
      "appointment_duration_minutes": 45
    },
    "financial_performance_rules": {
      "target_cac_limit": 20.00,
      "cost_per_qualified_lead": 15.00,
      "monthly_ad_budget": 1500.00
    },
    "ai_rag_configuration": {
      "brand_voice_tone": "Profesional, empático y orientativo",
      "brand_purpose": "Democratizar la salud bucal con tecnología avanzada sin dolor",
      "custom_system_prompt": "Siempre ofrecer la cita de valoración gratuita antes de dar presupuesto definitivo.",
      "vector_collection_id": "vec_sonrisas_knowledge_01"
    }
  }
  ```

### 2.8. Mapa de Disparadores (Triggers) y Frecuencias de Ejecución

Para garantizar un rendimiento óptimo, minimizar latencias y mantener los costos de consumo de tokens en **$0 USD o cerca de cero**, la ejecución de los prompts y workflows se clasifica por **Disparadores (Triggers) y Frecuencias**:

```
                                  MAPA DE DISPARADORES
                                           │
         ┌─────────────────────────────────┼─────────────────────────────────┐
         ▼                                 ▼                                 ▼
[ ⚡ REAL-TIME (EVENT-DRIVEN) ]   [ ⏱️ CRON JOBS (REDIS QUEUE) ]    [ 📊 BATCH PROGRAMADO ]
• Webhook WhatsApp/Instagram     • Re-engagement a las 24h       • Resumen diario al dueño (8 AM)
• Consulta Google Calendar       • Expiración de reservas        • Auditoría Semanal de CAPI/ROAS
• Validación BILLABLE_LEAD
```

| Evento / Workflow | Disparador (*Trigger*) | Frecuencia de Ejecución | Modelo / Sub-Agente | Estrategia de Eficiencia & Caching |
| :--- | :--- | :--- | :--- | :--- |
| **Recepción de Mensaje DM/WA** | Webhook de Meta | En tiempo real (0ms / Event-driven) | Supervisor + Moderador/Closer | **Prompt Caching:** El System Prompt base y RAG se congelan en caché; solo se procesa el delta del mensaje. |
| **Consulta de Calendario** | Tool Call en Chat | Bajo demanda cuando el usuario pide horario | Tool Nativa / Google Calendar API | Sin llamada a LLM. Conexión REST directa a `freebusy.query` para ahorrar tokens. |
| **Seguimiento 24 Horas** | Tarea en Upstash Redis | A las 24h exactas tras estado `FOLLOWUP_PENDING_24H` | Sub-Agente Re-Engagement (DeepSeek) | **Batching nocturno / Llama 3 en Groq:** Procesamiento ultra-rápido de baja latencia a costo $0 USD. |
| **Reporte Diario al Dueño** | Scheduler Cron Job | Todos los días a las 08:00 AM local | Sub-Agente Supervisor | Lectura directa de agregados SQL en Supabase + plantilla WhatsApp (sin costo de razonamiento). |
| **Auditoría Creativa & CAPI** | Scheduler Cron Job | Todos los Domingos a las 11:00 PM | Sub-Agente Analista (DeepSeek V3) | Evaluación por lotes (*Batch Processing*) de métricas semanales de Meta Ads y GA4 API. |

### 2.9. Las 5 Reglas de Negocio y Gobernanza Estrictas del Sistema

1. **Aislamiento Estricto por Tenant (`tenant_id`):**
   * Toda consulta SQL, vector de embeddings o clave de API debe incluir la cláusula de seguridad RLS: `WHERE tenant_id = current_setting('app.current_tenant_id')`.
2. **Soberanía "Agencia Primero" (Human-in-the-Loop):**
   * Ninguna cita agendada o propuesta comercial crítica toca directamente al cliente final sin la aprobación previa en 1 clic de la agencia desde el **Drawer "Dictamen Pre-Cita"** o mensaje interactivo de WhatsApp.
3. **Protocolo de Interrupción por Crisis (`PAUSED_HUMAN_TAKEOVER`):**
   * Si el score de sentimiento cae o el usuario menciona palabras clave de cancelación/reclamo, la automatización se detiene al instante y el estado pasa a `PAUSED_HUMAN_TAKEOVER` (borde rojo neón en Triage).
4. **Criterio de Facturación (`BILLABLE_LEAD`):**
   * El evento de cobro ($350 MXN) y la transmisión a Meta CAPI solo se activan cuando los 4 requisitos booleanos retornan `true` en la base de datos (`identityValidated ∧ catalogIdentified ∧ financialClarified ∧ consentOrBooked`).
5. **Comportamiento Dinámico `has_website`:**
   * Si `has_website = false`, los módulos de GA4 y Pixel Web se desactivan visual y lógicamente, redirigiendo el 100% del rastreo a **Meta CAPI for Messaging** y aprovisionando la Micro-Landing autogenerada.

---

## 3. Consecuencias & Beneficios (Consequences)

### Positivas

- **Cero Riesgo de Alucinación Pública:** El blindaje RAG y las Reglas Inviolables impiden comprometer precios o políticas inexistentes.
- **Escalabilidad Horizontal Multi-Cliente:** Una sola agencia puede gestionar decenas de cuentas con supervisión centralizada.
- **Soberanía Financiera Demostrable:** Transparencia total de métricas reales ante los dueños de negocio.
- **Eficiencia de Costos de Tokens ($0 USD):** El uso de Prompt Caching, herramientas nativas para Google Calendar y procesamiento batch programado mantiene el gasto en cómputo casi nulo.

### Mitigaciones

- **Latencia de Webhooks:** Se mitiga con Upstash Redis para responder con HTTP 200 a Meta en <200ms mientras el worker procesa en segundo plano.


