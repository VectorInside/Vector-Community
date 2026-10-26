# 🏛️ ADR-010: Arquitectura de Micro-Landing Autogenerada, Telemetría Dual (GA4 & Meta CAPI) y Master Agenda Dinámica Multigiro

- **Estado:** ACEPTADO (v1.0)
- **Fecha:** 2026-10-14
- **Autor:** Lead Software Architect & AI Product Strategist — Vector Inside
- **Módulos Afectados:** `/m/[slug]` (Micro-Landing SSR/CSR), `/agenda` (MasterAgenda), `/config` (RAGWizard), `MicroLandingPreviewModal`, Meta Graph CAPI Engine.

---

## 1. Contexto & Planteamiento del Problema

En la fase de aceleración y onboarding de negocios para Vector Inside surgieron dos necesidades críticas de arquitectura comercial y operativa:

1. **La Fricción de la Página Web Propia:**
   - Muchos prospectos y clientes no cuentan con un sitio web corporativo propio (`.com`).
   - Anteriormente, el sistema bloqueaba u ocultaba los campos de analítica (`GA4 Measurement ID` y `Meta Pixel ID`) cuando el usuario marcaba *"SIN Página Web"*, dejando la pauta de Meta Ads y la atribución algorítmica a ciegas.
   - Todo negocio requiere un punto de contacto digital de alta conversión con carga ultrarrápida para Click-to-WhatsApp.

2. **La Diversidad Operativa de Horarios (Rigidez de Calendario):**
   - No todos los 16 giros del proyecto operan como consultorios médicos con horarios continuos de 9 a 5.
   - Los **Restaurantes** manejan turnos de Comida y Cena con mesas simultáneas (capacidad concurrente) y cierran los lunes.
   - Los **Creadores de Contenido** no reciben público; tienen días exclusivos de grabación de contenido y franjas privadas para pitching de marcas/patrocinios (`$3,500 USD`).
   - Las **Empresas B2B** manejan llamadas de calificación BANT de 30 minutos vía Zoom.
   - Si un horario ya tiene una cita confirmada, **la IA de WhatsApp jamás debe sugerir ese horario**.

---

## 2. Decisiones de Arquitectura (Decisions)

### 2.1. Estrategia Dual de Adquisición Digital & Micro-Landing Autogenerada

Se formaliza la decisión de desacoplar la posesión de un dominio propio del tracking algorítmico:

```mermaid
graph TD
    A["Estrategia de Adquisición Digital"] --> B{"¿Tiene Sitio Web Propio?"}
    B -- "SÍ" --> C["Mide Sitio Web Corporativo (GA4 + Pixel + Diagnóstico Fricción)"]
    B -- "NO" --> D["Micro-Landing Autogenerada: https://app.vectorinside.com/m/[slug]"]
    D --> E["Inyección Dinámica de GA4 (Measurement ID)"]
    D --> F["Inyección Dinámica de Meta Pixel ID (fbq)"]
    D --> G["Meta Conversions API (CAPI) for Messaging"]
```

1. **Autogeneración Inmediata de Micro-Landing:**  
   Al dar de alta un tenant, se aprovisiona una ruta pública SSR optimizada en Next.js 14 App Router: `src/app/m/[slug]/page.jsx`.
2. **Telemetría Dual Siempre Activa:**  
   Incluso en la opción *"SIN Página Web"*, los campos de `GA4 Measurement ID` y `Meta Pixel ID` permanecen **visibles, activos y configurables** en el Onboarding y en el Modal de Personalización.
3. **Disparo de Eventos Estándar:**
   - `PageView` al abrir la micro-landing.
   - `Contact` / `click_whatsapp` al presionar cualquier botón de contacto o llamada.
   - `Lead` al completar el formulario de pre-agendamiento en 1 tap.
4. **Branding Vector Inside:**  
   Al pie de toda micro-landing se incluye el sello oficial *"Potenciado por Vector Inside — La infraestructura de IA y Adquisición Digital (https://vectorinside.com)"*, sirviendo como motor de referidos orgánicos.

---

### 2.2. Esquema Dinámico de Calendario por Giro (`calendarConfig`)

Cada uno de los 16 giros comerciales define su propio modelo de agenda estructurado en PostgreSQL / Tenant Metadata:

```json
{
  "calendarConfig": {
    "type": "shifts_split | hospitality_tables | creator_sponsorships | b2b_discovery",
    "slotDurationMin": 30 | 45 | 60 | 90,
    "concurrencyLimit": 1 | 8 | 12,
    "capacityLabel": "Cita / Paciente | Mesas Disponibles | Sesión PR",
    "operatingDays": ["mon", "tue", "wed", "thu", "fri", "sat"],
    "shifts": [
      {
        "id": "shift_1",
        "name": "Turno Matutino / Comida",
        "icon": "sun",
        "start": "09:00",
        "end": "14:00",
        "hours": ["09:00", "10:00", "11:00", "12:00", "13:00"]
      },
      {
        "id": "shift_2",
        "name": "Turno Vespertino / Cena",
        "icon": "sunset",
        "start": "15:00",
        "end": "19:00",
        "hours": ["15:00", "16:00", "17:00", "18:00"]
      }
    ],
    "breakInterval": {
      "start": "14:00",
      "end": "15:00",
      "label": "Receso / Esterilización Médica / Mise en place"
    }
  }
}
```

---

### 2.3. Regla de Oro de Disponibilidad en Master Agenda & Bot IA

La disponibilidad de citas se calcula mediante un motor algebraico determinista:

$$\text{Slots Disponibles} = \text{Shifts}(\text{Tenant}) - \text{Citas Confirmadas en Google Calendar} - \text{Bloqueos Manuales}$$

- **El Bot de WhatsApp (IA):**  
  Ejecuta la función `consultar_disponibilidad_google_calendar()`. Si un horario ya está reservado o en receso, el bot automáticamente sugiere los horarios contiguos libres sin provocar colisiones ni dobles reservas.
- **La Master Agenda (`/agenda`):**  
  Renderiza dinámicamente los turnos según el negocio activo en la plataforma. Muestra estados ricos con micro-badges (`● Confirmada`, `○ Pre-Cita Triage`), valor económico estimado en MXN, affordance interactivo en slots libres (`+ Cita`, `Bloquear`) y sincronización bidireccional vía Google Calendar API y notificaciones transaccionales Gmail con archivo `.ics`.

---

### 2.4. Sincronización Móvil Instantánea (QR Dinámico & Protocolo WebCal RFC 5545)

Para eliminar la fricción técnica de los dueños de negocio y especialistas (médicos, capitanes de restaurante, master detailers, ejecutivos B2B), se formaliza la arquitectura de sincronización móvil sin requerir login manual en cada teléfono:

```mermaid
sequenceDiagram
    autonumber
    actor D as Doctor / Gerente / Especialista
    participant UI as Master Agenda UI (/agenda)
    participant QR as Modal Sincronización Móvil
    participant GC as Google Calendar WebCal
    participant AC as Apple / Outlook Calendar

    D->>UI: Clic en [Ver en Celular & Google Calendar]
    UI->>QR: Despliega Código QR dinámico + enlaces directos
    alt Escaneo con Cámara Móvil
        D->>QR: Escanea QR con smartphone
        QR-->>D: Abre la Master Agenda PWA responsive de su negocio
    else Suscripción a Google Calendar
        D->>QR: Clic en [Suscribir a Google Calendar]
        QR->>GC: Abre https://calendar.google.com/calendar/render?cid=webcal...
        GC-->>D: Suscripción bidireccional activada en su app de Google Calendar
    else Dispositivos Apple / Mac / Outlook
        D->>QR: Clic en [Copiar Enlace WebCal]
        QR->>AC: Protocolo universal webcal://api.vectorinside.app/cal/{tenant_id}.ics
        AC-->>D: Sincronización nativa en Calendario de iPhone / macOS
    end
```

1. **Código QR Dinámico:** Renderizado en alta fidelidad en SVG para lectura instantánea desde cualquier cámara de iOS o Android.
2. **Suscripción en 1 Clic a Google Calendar:** Utiliza la directiva oficial de Google Calendar WebCal (`https://calendar.google.com/calendar/render?cid=webcal...`) para suscripción en vivo.
3. **Protocolo Universal WebCal (Apple/Outlook):** Enlace directo `webcal://` para el feed de calendario del tenant, permitiendo que las citas se sincronicen de forma automática en el teléfono del especialista sin duplicar eventos.
4. **Despacho por WhatsApp:** Botón interactivo para enviar el link seguro de agenda al teléfono del especialista del negocio.

---

### 2.5. Vista Semanal de Master Agenda (Parrilla Lunes a Domingo con Proyección Financiera)

Para facilitar la planificación semanal operativa y financiera de la agencia y de cada negocio, la Master Agenda adopta como vista predeterminada la modalidad **Semana Completa (`week_table`)**:

1. **Parrilla de 7 Días (Lunes a Domingo):** Tarjetas interactivas por cada día de la semana, resaltando el día activo y calculando en tiempo real:
   - Número de citas confirmadas (`CONFIRMED`) y citas en triage (`TRIAGE`).
   - Suma total de facturación proyectada en MXN por día y por semana.
2. **Acciones Rápidas en Cada Cita:**
   - `Añadir a Google Calendar` en 1 clic (vía URL pre-llenada).
   - `Descargar archivo .ICS` para importación local.
   - `Despachar Correo Personalizado de Confirmación`.
   - `Ver Detalle Forense`.
3. **Selector de Vistas Flexible:** Alternancia fluida entre:
   - `📅 Semana Completa (Lunes a Domingo)` — Vista macro semanal.
   - `⏱️ Vista Horas & Turnos` — Vista micro de slots y concurrencia.
   - `📋 Lista Resumen` — Vista secuencial de citas.

---

### 2.6. Email Studio Transaccional Membretado Multi-Tenant con Adjunto `.ICS`

Se formaliza el módulo transaccional para el despacho de correos de confirmación oficiales:

```mermaid
graph LR
    A[Cita Confirmada / Aprobada] --> B[Email Studio Generator]
    B --> C[Reemplazo Variables Dinámicas]
    B --> D[Generador RFC 5545 .ics Client-Side Blob]
    B --> E[URL Template Google Calendar]
    C --> F[HTML Membretado Oficial del Negocio]
    D --> G[confirmacion-cita.ics Adjunto]
    E --> H[Botón CTA Directo a Google Calendar]
    F & G & H --> I[Previsualizador Dual WYSIWYG Desktop/Móvil]
    I --> J[Despacho con Simulación de Latencia & Confeti]
```

1. **Generador RFC 5545 (`.ics`):** Función `generateIcsContent(apt, tenant)` que produce un archivo iCalendar estándar con zona horaria UTC (`Z`), alarmas de recordatorio (`-PT2H`), geolocalización de la sede y estado `CONFIRMED`.
2. **Descarga Instantánea sin Dependencias:** `triggerIcsDownload(apt, tenant)` utiliza un objeto `Blob` (`text/calendar;charset=utf-8`) para descarga inmediata en navegador o smartphone.
3. **Template Google Calendar Universal:** Enlace parametrizado `https://calendar.google.com/calendar/render?action=TEMPLATE&text=...&dates=...&details=...&location=...` que autocompleta el evento en la cuenta personal del cliente.
4. **Motor de Variables Dinámicas:** Interpola en tiempo real: `{{cliente}}`, `{{servicio}}`, `{{fecha}}`, `{{hora}}`, `{{especialista}}`, `{{negocio}}`, `{{ubicacion}}`.

---

### 2.7. Aislamiento Estricto de Plantillas y Políticas por Negocio (`TENANT_EMAIL_TEMPLATES`)

Para garantizar que ningún negocio contamine a otro con sus indicaciones médicas, códigos de vestimenta o políticas arancelarias:

1. **Diccionario Canónico Aislado:** Matriz formal `TENANT_EMAIL_TEMPLATES` con configuraciones por defecto segregadas:
   - `dental`: Clínica Odontológica Integral (Estudios radiográficos previos, sillón odontológico, `#D4FF00`, 🦷).
   - `polanco`: Polanco Steakhouse & Mixology (Tolerancia 15 min, código de vestimenta Smart Casual, menú degustación, `#F97316`, 🥩).
   - `urban`: Urban Motors & Sneaks Premium (Inspección vehicular, 1/4 tanque mínimo, tratamiento cerámico 9H, `#06B6D4`, 👟).
   - `corp`: Vector Corporate Solutions B2B (Google Meet cifrado, sesión ejecutiva, métricas de conversión, `#3B82F6`, 🏢).
2. **Persistencia Segregada en Estado & LocalStorage:** `tenantEmailConfigs[activeKey]` almacena las personalizaciones hechas por el usuario para cada negocio de forma aislada, garantizando que los cambios en un restaurante jamás afecten a una clínica dental.

---

## 3. Consecuencias & Beneficios

### Positivas

1. **Cero Clientes Desatendidos:** Aquellos negocios sin sitio web corporativo cuentan con una landing page profesional de alta conversión lista para pautar anuncios en Meta Ads en minutos.
2. **Atribución Algorítmica al 100%:** Meta Pixel y Google Analytics 4 optimizan los anuncios hacia usuarios que efectivamente inician conversaciones por WhatsApp.
3. **Escalabilidad Multigiro:** El calendario se adapta de forma orgánica a restaurantes, consultorios, agencias B2B o creadores de contenido sin código hardcodeado.
4. **Protección de Tiempos:** Los profesionales que graban contenido o tienen descansos entre turnos tienen sus espacios bloqueados de manera inviolable.
5. **Autonomía Móvil para Especialistas:** Doctores, chefs y gerentes pueden consultar y suscribir su agenda en tiempo real a su teléfono mediante QR y WebCal sin necesidad de compartir credenciales maestras del sistema.
6. **Experiencia Premium de Marca:** Confirmación transaccional con previsualización fidedigna (Desktop/Móvil), archivo `.ics` y botón de Google Calendar, elevando el valor percibido del servicio del cliente final.
7. **Blindaje Multi-Tenant Inviolable:** Aislamiento total de las comunicaciones y políticas de cada negocio, cumpliendo con la gobernanza de Vector Inside.
