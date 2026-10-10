# 🤖 Reglas de Negocio: Enrutamiento Universal de Modelos IA & Multi-Proveedor

**Ámbito:** Arquitectura de Agentes, Sub-Bots, RAG, Meta Webhooks y Gestión Multi-Tenant en Vector Inside  
**Referencias:** [ADR-002: Taxonomía Universal & 4 Pilares](file:///c:/Users/EdgarGs/Documents/ProyectoWork/VectorInside/VectorComunity/Vector-Community/docs/ADR_002_UNIVERSAL_BUSINESS_TAXONOMY_AND_RAG_PILLARS.md), [ADR-004: Model Routing](file:///c:/Users/EdgarGs/Documents/ProyectoWork/VectorInside/VectorComunity/Vector-Community/docs/ADR_004_MODEL_ROUTING_AND_AGENT_SPECIALIZATION.md), [ADR-005: Taxonomía Multi-Proveedor](file:///c:/Users/EdgarGs/Documents/ProyectoWork/VectorInside/VectorComunity/Vector-Community/docs/ADR_005_UNIVERSAL_MULTI_PROVIDER_AI_TAXONOMY.md) y [ADR-006: Matriz Tridimensional de Acoplamiento](file:///c:/Users/EdgarGs/Documents/ProyectoWork/VectorInside/VectorComunity/Vector-Community/docs/ADR_006_TRI_DIMENSIONAL_COUPLING_MATRIX.md)

---

## 1. Principio Fundamental de 2 Niveles (Two-Tier Rule)
Sin importar el proveedor que elija el cliente (DeepSeek, OpenAI, Anthropic, Google o Groq), el sistema **NUNCA** usa un solo modelo para todo. Siempre se divide en:
- **Tier 1 (Operativo Frontal):** Respuestas instantáneas (<800ms), bajo costo y alta velocidad.
- **Tier 2 (Cognitivo & RAG):** Razonamiento profundo (CoT), auditoría de documentos, extracción de Reglas Inviolables y prevención de alucinaciones.

---

## 2. Matriz Universal de Equivalencia por Proveedor

Si el cliente o agencia decide utilizar su propia clave de API (**BYOK: Bring Your Own Key**), el router asigna automáticamente:

| Proveedor Elegido | Tier 1: Operativo Frontal (<800ms) | Tier 2: Cognitivo & RAG (Razonamiento / Cero Alucinación) | Perfil Idóneo |
| :--- | :--- | :--- | :--- |
| **DeepSeek** *(Default)* | **DeepSeek V3** (`deepseek-chat`) | **DeepSeek R1** (`deepseek-reasoner`) | Máximo rendimiento por dólar. Rentabilidad del 95% para la agencia. |
| **OpenAI** | **GPT-4o mini** | **o3-mini** (o `o1`) | Estándar corporativo; clientes con créditos o infraestructura en Azure. |
| **Anthropic** | **Claude 3.5 Haiku** | **Claude 3.5 Sonnet** | Marcas donde el tono de voz humano y la empatía son indispensables. |
| **Google Cloud** | **Gemini 2.0 Flash** | **Gemini 2.0 Flash Thinking** / **1.5 Pro** | Catálogos colosales, PDFs de 300+ páginas o audio/video en el Asistente RAG. |
| **Groq / Open Source** | **Llama 3.3 70B** | **Qwen 2.5 72B** / **DeepSeek R1 (Groq)** | Velocidad récord en LPU (300+ tok/s) y soberanía de datos estricta. |

---

## 3. Matriz de Decisión Rápida por Tarea

| Tarea o Evento | Nivel Requerido | Acción del Router |
| :--- | :--- | :--- |
| **Chat WhatsApp / Instagram DM** | **Tier 1 (Operativo)** | Invoca el modelo Tier 1 del proveedor configurado. |
| **Auto-Reply Comentarios en Reels** | **Tier 1 (Operativo)** | Respuesta pública + DM en <5 segundos. |
| **Planificador de Contenido (`ContentPlanner`)** | **Tier 1 (Operativo)** | Generación creativa de copys, ganchos y hashtags. |
| **Ingestión de Documentos Maestros en RAG** | **Tier 2 (Cognitivo)** | Extrae los 4 Pilares y valida coherencia sin inventar. |
| **Extracción de Reglas Inviolables** | **Tier 2 (Cognitivo)** | Garantía matemática de no alucinación en políticas. |
| **Detección de Riesgo Legal / Alerta Roja** | **Tier 2 (Cognitivo)** | Evalúa severidad antes de notificar a la mesa **HITL**. |
| **Calificación de Lead B2B VIP (> $15k USD)** | **Tier 2 (Cognitivo)** | Desglose multidimensional de valor del trato. |

---

## 4. Reglas Obligatorias de Codificación
1. **Desacople Absoluto (Factory Pattern):** Nunca importar SDKs de proveedores de forma rígida en componentes de UI. Todo debe pasar por `ModelProviderFactory`.
2. **Failover Automático:** Si el proveedor del tenant falla (código 429 o 500) por 2 llamadas consecutivas, conmutar en caliente al proveedor de respaldo sin desconectar al usuario final.
3. **Proteger el ratio 90/10:** El 90% del volumen debe resolverse con modelos Tier 1; el 10% restante en Tier 2.
