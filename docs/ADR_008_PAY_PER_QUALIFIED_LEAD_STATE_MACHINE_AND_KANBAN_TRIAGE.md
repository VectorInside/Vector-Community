# 🏛️ ADR-008: Máquina de Estados Pay-Per-Qualified-Lead, Tablero Kanban de Triage & Atribución Meta CAPI

- **Estado:** ACEPTADO (v3.0 - Pay-Per-Qualified-Lead & Sutura Arcángel Master Standard)
- **Fecha:** 2026-10-10
- **Autor:** Principal Enterprise Solutions Architect & Chief Commercial Officer — Vector Inside
- **Módulos Afectados:** `/triage` (TriageProtocol), `/metrics` (SoberaniaFinanciera), `/planner` (ContentPlanner), `/calendar` (MasterAgenda), Backend Core (Spring Boot), Supabase RLS, Redis Queue.
- **Documentos Relacionados:** [ADR-001: Arquitectura Maestra](file:///c:/Users/EdgarGs/Documents/ProyectoWork/VectorInside/VectorComunity/Vector-Community/docs/ADR_001_MASTER_ARCHITECTURE_AND_BUSINESS_RULES.md), [ADR-003: Meta Graph Intelligence & HITL](file:///c:/Users/EdgarGs/Documents/ProyectoWork/VectorInside/VectorComunity/Vector-Community/docs/ADR_003_META_GRAPH_INTELLIGENCE_AND_HITL_TRIAGE.md), [ADR-007: Modelo Comercial Vector Deal](file:///c:/Users/EdgarGs/Documents/ProyectoWork/VectorInside/VectorComunity/Vector-Community/docs/ADR_007_OFFICIAL_COMMERCIAL_PRICING_AND_BILLING_RULES.md)

---

## 1. Contexto & Objetivos Estratégicos

Bajo la doctrina de **Vector Inside**, la infraestructura de **Vector Community OS** opera como un activo de tracción operativa y sustitución/potenciación analítica frente al Community Manager tradicional. El sistema implementa una arquitectura de *"Puerta Trasera"* supervisada por el **Lobo Vectorial** (Supervisor IA), garantizando la **Sutura Arcángel** para que la fuerza comercial intervenga únicamente en momentos críticos con precisión quirúrgica.

Para alinear el cobro con la rentabilidad real del cliente (eliminando cobros por interacciones vacías o leads fríos), la plataforma se rige por el modelo **Pay-Per-Qualified-Lead ($350 MXN)**.

---

## 2. Decisiones de Arquitectura

### 2.1. Matriz de Temperatura y Enumeraciones Unificadas (ENUMs)

Para prevenir condiciones de carrera (race conditions) e inconsistencias en la base de datos multi-tenant, todas las transiciones de estado conversacional se mapean estrictamente a los siguientes constantes ENUM:

| Estado (ENUM) | Comportamiento / Indicador Conversacional | Acción del Bot / CTA | Tratamiento de Facturación |
| :--- | :--- | :--- | :--- |
| `LEAD_COLD_24H` | Preguntó precio o info básica, evasiva ("lo voy a pensar") sin datos adicionales. | Programación de re-contactación automática a 24 horas en Redis Queue. | **No facturable ($0.00)** |
| `LEAD_WARM_24H` | Solicitó info detallada y respondió preguntas breves, sin profundizar en pagos o MSI. | Presentación de CTA explícito de aclaración antes de ingresar a espera de 24h. | **No facturable ($0.00)** |
| `LEAD_HOT_PREQUAL` | Conversación fluida con interés activo en financiamiento, métodos de pago o requisitos. | CTA de conexión con ejecutivo o cita. Pasa a ciclo 24h si no confirma de inmediato. | **No facturable ($0.00)** |
| `BILLABLE_LEAD` | Cumplió al 100% los 4 criterios booleanos AND; aceptó contacto o confirmó cita en agenda. | Notificación push/WhatsApp, Dictamen Pre-Cita, congelamiento conversacional. | **Facturable ($350.00 MXN)** |
| `HITL_INTERVENTION` | Lenguaje agresivo, insultos, solicitud de atención humana o fricción de marca. | Congelamiento de IA (borde rojo neón), alerta push WebSocket STOMP. | **Depende de resolución** |

---

### 2.2. Regla Booleana Acumulativa AND Estricta (4 Criterios Innegociables)

La mutación de cualquier prospecto a `BILLABLE_LEAD` y la consiguiente inserción en `billing_ledger` requiere obligatoriamente:

$$\text{MUTATION\_ALLOWED} \iff (\text{Criterio 1}) \land (\text{Criterio 2}) \land (\text{Criterio 3}) \land (\text{Criterio 4})$$

1. **Criterio 1 (Identidad y Contacto Validados):** Nombre completo AND Email estructurado AND WhatsApp verificado (formato E.164).
2. **Criterio 2 (Interés Específico en Catálogo):** Identificación unívoca del producto o servicio dentro de la matriz del tenant.
3. **Criterio 3 (Aclaración Financiera Completa):** Confirmación de que todas las dudas sobre precios, envíos, métodos de pago o planes a meses sin intereses (MSI) fueron resueltas por la IA.
4. **Criterio 4 (Aceptación Explícita o Cita Confirmada):** Autorización inambigua de contacto por ejecutivo o cita formal reservada en Google Calendar.

---

### 2.3. Motor de Atribución Server-to-Server (Meta CAPI) & `billing_ledger`

Al validarse el Criterio 4, el servidor ejecuta en una única transacción atómica:

1. **Persistencia de Estado:**
   ```sql
   UPDATE leads 
   SET status = 'BILLABLE_LEAD', updated_at = NOW() 
   WHERE id = :lead_id AND tenant_id = :tenant_id;
   ```

2. **Despacho Server-to-Server (Meta Conversions API Graph v20.0):**
   ```json
   {
     "data": [
       {
         "event_name": "Lead",
         "event_time": 1772381000,
         "event_id": "lead_uuid_v4_8f9a2b",
         "action_source": "system_generated",
         "user_data": {
           "em": ["f660ab912ec121d1b1e928a0bb4bc61b15f5ad44d5efdc4e1c92a25e99b8e44a"],
           "ph": ["4c24b2142e0084f23473138380295eb1381387d8d2ef071a938c5208b5e2a220"],
           "fn": ["242f2324f462f43d837699042b5f63901416e033994356e9999f8d5e8f0a2d20"]
         },
         "custom_data": {
           "currency": "MXN",
           "value": 0.00,
           "lead_type": "BILLABLE_LEAD",
           "lead_price": 350.00
         }
       }
     ]
   }
   ```

3. **Registro en Libro de Facturación:**
   ```sql
   INSERT INTO billing_ledger (id, tenant_id, lead_id, amount, status, created_at) 
   VALUES (gen_random_uuid(), :tenant_id, :lead_id, 350.00, 'PENDING_INVOICE', NOW());
   ```

4. **Emisión de Notificación Push HITL:**
   Evento STOMP sobre WebSocket / SSE hacia el frontend con el Dictamen Pre-Cita.

---

### 2.4. Tablero Kanban de Triage (5 Columnas Deterministas)

El frontend en `/triage` provee una vista dual (Kanban y Bandeja Detallada):
- **Columna 1:** Ingreso / Frío (`LEAD_COLD_24H`) con contador regresivo 24h.
- **Columna 2:** En Seguimiento 24h (`LEAD_WARM_24H`) con indicador de CTA.
- **Columna 3:** Cálido (`LEAD_HOT_PREQUAL`) con validación de financiamiento.
- **Columna 4:** Calificado / BILLABLE_LEAD (`BILLABLE_LEAD`) con insignia de $350 MXN e inspector CAPI.
- **Columna 5:** Intervención Humana (HITL) con alerta rojo neón y Sutura Arcángel a un clic.

---

### 2.5. Condición Algorítmica de Fatiga Creativa (DeepSeek Trigger)

El Sub-Bot Analista evalúa periódicamente las métricas consumidas desde Meta Graph API. La regeneración creativa con DeepSeek V3/R1 se activa cuando:

$$\text{IF } (\text{Frequency} > 3.5) \land \left( \Delta\text{CPC} > +20\% \lor \Delta\text{CTR} < -15\% \right) \implies \text{TRIGGER DeepSeek\_Creative\_Diversity\_Prompt}$$

---

### 2.6. Diagnóstico Algorítmico de Fricción Web & Meta CAPI for Messaging

Para los tenants que operan con portal digital (`has_website = true`), el sistema cruza los eventos de adquisición publicitaria contra la conversión hacia WhatsApp:

$$\text{IF } (\text{CPC} \le \text{CPC\_Target}) \land (\text{Sessions} > 500) \land (\text{ClickToWhatsAppRate} < 3\%) \implies \text{TRIGGER Web\_Friction\_Alert}$$

- **Alerta de Consultoría Automática:** *"Fricción en Página Web detectada: Alto tráfico con bajo contacto. Revisar velocidad de carga, propuesta de valor superior o contraste del botón flotante de WhatsApp."*
- **Flujo Direct-to-Messaging (`has_website = false`):** Para marcas sin sitio web, se suprime la dependencia del Pixel web y se activa el protocolo **Meta CAPI for Messaging**, transmitiendo los hitos de calificación (`Lead`, `Schedule`, `Purchase`) directamente desde los webhooks de WhatsApp e Instagram Graph API con hash SHA-256.

---

## 3. Estado de Alineación e Impacto


| Requisito del Plan Maestro | Estado en el SaaS | Ajuste Ejecutado |
| :--- | :--- | :--- |
| Visión "Puerta Trasera", Lobo Vectorial e IFV | ✅ 100% Implementado | Activo en Centro de Mando y Header. |
| ENUMs Deterministas de Temperatura | ✅ 100% Moldado | Definidos en `constants.js` y aplicados en threads. |
| 4 Criterios Booleanos AND para Cobro | ✅ 100% Moldado | Checklist visual interactivo en Triage y tarjetas. |
| Atribución Meta CAPI S2S & `billing_ledger` | ✅ 100% Moldado | Modal inspector criptográfico y telemetría de $350 MXN. |
| Tablero Kanban de Triage (5 Columnas) | ✅ 100% Implementado | Vista Kanban interactiva en `/triage` con Sutura Arcángel. |
| Alerta Matemática de Fatiga Creativa | ✅ 100% Moldado | Desplegado en `/planner` con trigger de diversidad DeepSeek. |
| Infraestructura Costo $0 (Spring Boot + Supabase RLS) | ✅ Especificado & Listo | Arquitectura documentada y preparada para backend. |
