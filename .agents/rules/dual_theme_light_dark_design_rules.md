# 🎨 Reglas de Diseño UI/UX: Sistema Dual-Theme (Modo Claro Ejecutivo & Modo Oscuro)

**Ámbito:** Frontend Global, Componentes UI, Tablero de Triage, Dashboards, Modales y Layout  
**Referencia Oficial:** [ADR-009: Sistema de Diseño Dual-Theme & Accesibilidad WCAG](file:///c:/Users/EdgarGs/Documents/ProyectoWork/VectorInside/VectorComunity/Vector-Community/docs/ADR_009_DUAL_THEME_DESIGN_SYSTEM_RULES.md)

---

## 1. Principio Fundamental
En **Vector Community**, el Modo Oscuro encarna una **Terminal Cibernética de Alta Autoridad**, mientras que el Modo Claro representa una **Sala de Juntas Ejecutiva de Claridad Editorial (Porcelana & Grafito)**. Ningún componente puede sacrificar contraste, legibilidad ni armonía de marca al alternar entre ambos modos.

---

## 2. Guardrails Inviolables para Agentes de Código

1. **PROHIBIDO usar `text-white` rígido:**
   - Todo texto blanco debe ir acompañado de su contraparte en modo claro: `text-zinc-900 dark:text-white` o usar el token `text-[var(--text-main)]`.
   - Textos secundarios deben usar `text-zinc-600 dark:text-zinc-400` o `text-[var(--text-muted)]`.

2. **PROHIBIDO texto neón `#E7F900` desnudo sobre fondos claros:**
   - El Amarillo Vectorial no puede usarse como color de texto plano sobre blanco o gris claro porque viola los estándares WCAG AA (contraste ~1.2:1).
   - Para texto de acento, usar la clase `.text-neon` (que resuelve automáticamente a `--neon-text`: `#4D5600` en modo claro y `#E7F900` en modo oscuro).
   - Para etiquetas brillantes con texto neón (ej. tickets de leads), alojarlas en un contenedor oscuro con contraste supremo:
     ```jsx
     <span className="bg-zinc-900 dark:bg-zinc-950 border border-neon/40 text-neon font-black">
     ```

3. **PROHIBIDAS cajas negras fijas sobre lienzos claros:**
   - Paneles y tarjetas deben alternar sus fondos:
     `bg-white dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800/80`
   - Pozos de mensajes o auditorías deben alternar:
     `bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-zinc-800/80`

4. **Botones de Acción Primaria:**
   - Los botones de impacto principal deben usar `bg-neon text-black font-bold shadow-neon-sm` en ambos modos.
