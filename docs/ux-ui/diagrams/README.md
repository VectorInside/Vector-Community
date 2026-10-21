# Diagramas editables del manual

Los siete diagramas están integrados en el README principal. Estos archivos conservan exactamente la misma fuente Mermaid para poder revisarlos o renderizarlos con herramientas compatibles.

| Archivo | Contenido | Alcance |
|---|---|---|
| [00-estados-contenido.mmd](00-estados-contenido.mmd) | Estados de contenido y versión | Implementado en demo |
| [01-carriles-operativos.mmd](01-carriles-operativos.mmd) | Carriles de operación completa | Demo y relación conceptual de negocio |
| [02-carriles-usuarios-editorial.mmd](02-carriles-usuarios-editorial.mmd) | Administrador, Usuario y revisión | Implementado en demo |
| [03-dependencias.mmd](03-dependencias.mmd) | Dependencias funcionales y base productiva | Actual + propuesta diferenciadas |
| [04-carriles-contacto.mmd](04-carriles-contacto.mmd) | Registro local de conversación y decisión comercial | Implementado en demo |
| [05-arquitectura-actual.mmd](05-arquitectura-actual.mmd) | Personas, navegador, storage y servidor estático | Arquitectura actual |
| [06-arquitectura-propuesta.mmd](06-arquitectura-propuesta.mmd) | Identidad, API, datos, workers, proveedores y operación | Propuesta sin stack/proveedor aprobado |

Desde la raíz, `node scripts/verify-ux-ui.mjs` comprueba que ninguna fuente difiera de su bloque en el manual. Esa comparación no sustituye el parser Mermaid ni las pruebas operativas.
