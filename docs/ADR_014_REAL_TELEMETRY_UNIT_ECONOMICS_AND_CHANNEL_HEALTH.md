# 🏛️ ADR-014: Telemetría Real Sin Simuladores, Salud de Canales Determinista, Soberanía Financiera (Unit Economics) y Homologación UI

- **Estado:** ACEPTADO (v1.0)
- **Fecha:** 2026-11-17
- **Autor:** Lead Software Architect & AI Systems Auditor — Vector Inside
- **Módulos Afectados:** `/contactability` (`PerformanceDashboard.jsx`), `/results` (`SoberaniaFinanciera.jsx`, `ExecutiveMonthlyReportModal.jsx`), `/m/[slug]` (`page.jsx`, `MicroLandingPreviewModal.jsx`), `/team` (`page.jsx`, `AgencyStaffView.jsx`, `CuentasAccesosView.jsx`, `SecurityGovernanceView.jsx`), `OnboardingTour.jsx` (`toursCatalog.js`), Backend `AnalyticsService.java`.

---

## 1. Contexto & Planteamiento del Problema

Durante la auditoría integral de extremo a extremo del sistema previo al despliegue en producción, se identificaron cinco brechas críticas de arquitectura y UX:

1. **Contaminación por Simuladores y Buffers en Telemetría:**
   - El panel de Contactabilidad (`/contactability`) mantenía un simulador `emitTestCapiSignal` con buffer en `localStorage` (`vector_capi_logs_${tenantId}`), multiplicadores sintéticos (`0.85x`) para Meta ROAS, una tasa CAPI fija en `99.4%` y un Hook Rate de `32.5%` inventado.
   - El backend (`AnalyticsService.java`) inicializaba `avgLoadTimeSec` en `0.50` por defecto incluso con `0` visitas.
2. **Bucles Infinitos de Verificación en Meta Ads / Instagram y Bloqueo de Píxel en Previews:**
   - Cuando un negocio registraba únicamente enlaces de redes sociales (`socialLinks`) o un Pixel ID sin configurar webhooks activos, la tarjeta de Meta mostraba `"Handshake Pendiente / Verificación en Curso"` de forma indefinida.
   - Los iframes de previsualización administrativa cargaban `fbevents.js`, disparando errores `net::ERR_BLOCKED_BY_CLIENT` y contaminando métricas reales del cliente.
3. **Brecha de Atribución en Micro-Landing (`/m/[slug]`):**
   - Los códigos QR generados no incluían parámetros UTM (`?utm_source=qr`) y los botones de WhatsApp no disparaban `CTA_CLICK` al backend PostgreSQL.
4. **Redundancia y Datos Estáticos en Resultados (`/results`):**
   - `SoberaniaFinanciera.jsx` duplicaba la barra de Micro-Landing de `/contactability`, mostraba tarjetas en `$0` desconectadas del rendimiento real, usaba un texto estático quemado para los guiones virales (`CREATIVE_FATIGUE_BY_TENANT`) y no enviaba `reportData` a `ExecutiveMonthlyReportModal.jsx`.
5. **Desalineación Visual y de Onboarding (`/team` y `Driver.js`):**
   - `/team` restringía su ancho a `max-w-7xl mx-auto` con un contenedor pill de doble borde, rompiendo la homologación `w-full` del resto de la suite.
   - Varios selectores del tour guiado (`OnboardingTour.jsx` / `toursCatalog.js`) apuntaban a IDs inexistentes o copy desactualizado (`5 min` en lugar de `15 min`, `3 Sub-Agentes` en lugar de `4`).

---

## 2. Decisiones de Arquitectura (Decisions)

### 2.1. Política de Telemetría Cero-Simulación (PostgreSQL Source of Truth)
- Se prohíbe cualquier buffer local simulado, multiplicador sintético o métrica inventada en `PerformanceDashboard.jsx` y `performanceService.js`.
- **Valores Iniciales Reales:**
  - `AnalyticsService.java` inicializa `avgLoadTimeSec` en `BigDecimal.ZERO` (`0.00s` mientras `microVisits === 0`).
  - `capiSyncRate` solo reporta `100%` cuando existen citas confirmadas o leads calificados reales (`BILLABLE_LEAD`); en otro caso es `0%`.
  - Los logs de conversiones CAPI provienen exclusivamente de citas reales en PostgreSQL/Agenda y leads que pasaron los 4 filtros BANT.

### 2.2. Máquina de Estados Determinista para Salud de Canales & Guardián de Iframe
Se establecen 3 estados explícitos en `PerformanceDashboard.jsx` para Meta Ads & CAPI:
1. **`connected`**: Webhook activo y validado con Meta Graph API v21.0.
2. **`pending`**: Solo cuando el backend reporta explícitamente `channelHealth.meta.status === 'PENDING'`.
3. **`configured`**: Cuando existen perfiles sociales o Pixel ID registrados sin webhook conectado (`"Perfil vinculado (Sin webhook)"` + acceso directo a `/config?tab=channels`).

En `src/app/m/[slug]/page.jsx`, si `window.self !== window.top` o `?preview=true`, **se bloquea la inyección de scripts externos** (Meta Pixel `fbevents.js` y GA4 `gtag`) y se capturan silenciosamente errores de red/adblockers.

### 2.3. Pipeline de Atribución Real en Micro-Landing (`/m/[slug]`)
- **QR Tracking:** `MicroLandingPreviewModal.jsx` genera los códigos QR hacia `https://app.vectorinside.com/m/${slug}?utm_source=qr`. Al abrirse, `page.jsx` envía `QR_SCAN` (o `VISIT` si no trae `utm_source=qr`) a `POST /api/v1/analytics/track`.
- **CTA WhatsApp Tracking:** Todos los puntos de contacto (Hero CTA, tarjetas de servicios y barra flotante inferior) invocan `handleWhatsAppClick`, disparando tanto la conversión del píxel cliente como `CTA_CLICK` hacia PostgreSQL.

### 2.4. Soberanía Financiera Real (`/results`) & Motor Creativo DeepSeek R1
- **Eliminación de Redundancia:** Se reemplaza la barra duplicada de Micro-Landing por una barra ejecutiva de **Salud Comercial & Eficiencia de Capital** (Ratio `LTV:CAC`, Valor Total de Pipeline en cartera y enlace directo a `/contactability`).
- **Unit Economics en Vivo:** `SoberaniaFinanciera.jsx` consolida en paralelo `leadService`, `calendarService`, `campaignService` y `performanceService` para calcular dinámicamente `MER`, `CAC`, `Ticket Promedio`, `LTV (12m)`, `Pipeline Activo` y `Conversiones / Citas`.
- **DeepSeek R1 Generador de Guiones (30s):** Conectado a `aiService.generateContent` (`POST /api/v1/ai/generate-content`) con respaldo adaptativo por giro real del negocio (`industry || verticalLabel || giro || vertical`).
- **Reporte Ejecutivo Mensual (`ExecutiveMonthlyReportModal.jsx`):** Recibe `reportData` compilado en tiempo real, con folio dinámico del mes en curso y certificación `Meta Graph API v21.0`.

### 2.5. Homologación Visual `/team` y Sincronización de Driver.js
- Se elimina `max-w-7xl mx-auto` en `/team` (`page.jsx`, `AgencyStaffView.jsx`, `CuentasAccesosView.jsx`, `SecurityGovernanceView.jsx`) adoptando `w-full px-4 sm:px-6 lg:px-8` y pestañas unificadas sin doble borde.
- Se sincronizan los selectores `#tour-contactability-*`, `#tour-results-*` y `#tour-crm-*` entre los componentes DOM, `toursCatalog.js` y `OnboardingTour.jsx` (corrigiendo `SLA 15 min` y `4 Sub-Agentes`).

---

## 3. Consecuencias
- **Positivas:** Cero discrepancias entre los números mostrados en pantalla y la base de datos PostgreSQL; eliminación definitiva de bucles falsos de verificación Meta y errores de consola en previsualizaciones; documentación y tours guiados alineados al 100% con el código productivo.
- **Mantenimiento:** Toda nueva pantalla o tab agregado al sistema debe registrar su `id="tour-*"` correspondiente en `toursCatalog.js` y respetar el principio de Cero-Simulación.
