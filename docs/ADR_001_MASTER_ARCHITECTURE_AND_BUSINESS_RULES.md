# 🏛️ ADR-001: Arquitectura Maestra, Gobernanza Multi-Tenant & Motor de IA

- **Estado:** ACEPTADO (v3.0 - Universal Business Taxonomy & Meta Intelligence Edition)
- **Fecha:** 2026-10-09
- **Autor:** Lead Software Architect & Product Strategist — Vector Inside
- **Contexto:** Vector Community OS ("La Puerta Trasera")
- **Documentos Relacionados:** [ADR-002: Taxonomía Universal & Pilares RAG](file:///c:/Users/EdgarGs/Documents/ProyectoWork/VectorInside/VectorComunity/Vector-Community/docs/ADR_002_UNIVERSAL_BUSINESS_TAXONOMY_AND_RAG_PILLARS.md), [ADR-003: Meta Graph Intelligence & HITL](file:///c:/Users/EdgarGs/Documents/ProyectoWork/VectorInside/VectorComunity/Vector-Community/docs/ADR_003_META_GRAPH_INTELLIGENCE_AND_HITL_TRIAGE.md)

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

---

## 3. Consecuencias & Beneficios (Consequences)

### Positivas:
- **Cero Riesgo de Alucinación Pública:** El blindaje RAG y las Reglas Inviolables impiden comprometer precios o políticas inexistentes.
- **Escalabilidad Horizontal Multi-Cliente:** Una sola agencia puede gestionar decenas de cuentas con supervisión centralizada.
- **Soberanía Financiera Demostrable:** Transparencia total de métricas reales ante los dueños de negocio.

### Mitigaciones:
- **Latencia de Webhooks:** Se mitiga con Upstash Redis para responder con HTTP 200 a Meta en <200ms mientras el worker procesa en segundo plano.
