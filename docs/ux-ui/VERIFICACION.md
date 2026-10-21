# Verificación de entrega · UX/UI

Fecha: 21 de octubre de 2026. Alcance: manual operativo y snapshot del prototipo local v2, fixture 13 de octubre de 2026.

| Comprobación ejecutada | Resultado |
|---|---|
| `node --check prototypes/vector-comunity/dist/app.js` | Correcto |
| `node scripts/verify-ux-ui.mjs` | Correcto |
| Fixture: cohorte, contacto, calificación, pipeline, ventas, crédito, gasto, SLA, mediana y p90 | Coinciden con el manual |
| Filtro de 7 días y canal directo | Coinciden con el contrato del fixture |
| Parser CSV: comas, comillas, error de comilla sin cerrar | Correcto |
| Protección de celdas que comienzan con fórmulas | Correcto en los casos verificados |
| Huellas SHA-256 de los siete archivos del prototipo | Coinciden con `INVENTARIO.json` |
| Bloques Mermaid en README y sus fuentes `.mmd` | Siete pares idénticos |
| Parser Mermaid, con DOM temporal para validación | Siete diagramas aceptados |
| Enlaces locales y anclas del README | Destinos presentes |
| `git diff --check` | Sin errores |
| README previo | Conservado con idéntico objeto Git |

La dependencia utilizada para validar Mermaid se instaló en una carpeta temporal fuera del repositorio, con scripts de instalación deshabilitados. No es una dependencia de ejecución del prototipo.

Las capturas y las pruebas de navegación, perfiles, editorial, respuesta local y móvil de 390×844 corresponden a la revisión del prototipo del 13 de octubre; se incluyen como evidencia de ese snapshot. Esta entrega no ejecuta una migración al frontend Next.js original, no prueba un backend inexistente y no certifica WCAG, seguridad productiva o conectores reales.

Para mantener el contrato: actualizar manual, diagramas, fixture esperado e inventario cuando cambie el prototipo. Los archivos estratégicos privados de otras conversaciones y el estado local del navegador no forman parte de la publicación.
