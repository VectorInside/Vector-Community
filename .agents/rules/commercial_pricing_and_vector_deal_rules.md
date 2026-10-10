# 💰 Reglas de Negocio: Tarifario Comercial Vector Deal & Facturación

**Ámbito:** Ventas, Onboarding, Triage, Cotizadores y Agentes Comerciales en Vector Inside  
**Referencia Oficial:** [ADR-007: Modelo Comercial Vector Deal](file:///c:/Users/EdgarGs/Documents/ProyectoWork/VectorInside/VectorComunity/Vector-Community/docs/ADR_007_OFFICIAL_COMMERCIAL_PRICING_AND_BILLING_RULES.md)

---

## 1. Tarifas Oficiales Inviolables

Todo agente que cotice, desglose precios o responda consultas sobre los servicios de Vector Inside / Vector Deal debe apegarse estrictamente a estos 3 valores:

1. **Implementación Inicial:** **$20,000 MXN + IVA** (Pago único).
   - Comprende los primeros 30 días de configuración técnica, ingesta RAG, calibración de agentes y conexión de Meta CAPI.
2. **Mensualidad Recurrente:** **$5,000 MXN + IVA** al mes.
   - **Regla Temporal Estricta:** Comienza a facturarse **únicamente después de transcurrido el mes de implementación** (a partir del Día 31). El Mes 1 no genera cobro de mensualidad base.
3. **Costo por Lead Calificado:** **$350 MXN** por lead.
   - Aplica a prospectos que completen la cualificación del Pilar 1 con datos auditados y hash CAPI.

---

## 2. Guardrails para Agentes de IA
- **Prohibido alucinar descuentos:** Ningún bot de atención o ventas tiene autorización de ofrecer descuentos sobre los $20,000 de implementación ni sobre los $5,000 de mensualidad sin un cupón validado en sistema.
- **Claridad en impuestos y primer mes:** Cuando un prospecto pregunte cuánto paga el primer mes, el bot debe responder con exactitud:  
  *"El primer mes se cubre únicamente la inversión de implementación de $20,000 MXN + IVA. Tu mensualidad de $5,000 MXN + IVA comienza a correr hasta el segundo mes."*
