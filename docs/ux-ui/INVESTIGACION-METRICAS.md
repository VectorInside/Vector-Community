# Investigación: contactabilidad y medición de VECTOR COMUNITY

Consulta: 13 octubre 2026. Fuentes primarias oficiales. Las recomendaciones de producto son una propuesta propia; no representan benchmarks ni garantías de las plataformas.

## Decisión de producto

La plataforma debe conectar descubrimiento → intención de contacto → conversación atendida → lead calificado → oportunidad → venta. Alcance, seguidores y reacciones explican distribución, pero no acreditan contacto ni ventas. Dos perfiles: Usuario revisa resultados, aprueba contenido y aporta contexto; Administrador configura marca, campañas, medición, permisos y operación.

## Tablero recomendado

| Indicador | Definición operacional propuesta | Acción que habilita |
|---|---|---|
| Contactos nuevos | Personas únicas registradas por CRM en la cohorte, deduplicadas dentro de la marca | Saber cuánta demanda real llegó |
| Conversaciones pendientes | Conversaciones entrantes que requieren acción humana y no tienen resolución | Atender ahora |
| Primera respuesta humana | Mediana y percentil 90 de tiempo desde primer mensaje entrante hasta respuesta humana; separar tiempo corrido y horario laboral | Identificar demoras sin ocultarlas en un promedio |
| Cumplimiento de atención | Conversaciones elegibles respondidas dentro del SLA / conversaciones elegibles ×100 | Ajustar capacidad y horarios |
| Contactabilidad comercial | Leads con comunicación bidireccional confirmada / leads válidos a contactar ×100 | Revisar datos, mensaje y seguimiento |
| Calificación | Leads calificados / leads evaluados ×100 | Revisar ajuste entre oferta y audiencia |
| Costo por lead calificado | Inversión publicitaria atribuible / leads calificados de esa campaña | Evaluar calidad, no solamente volumen |
| Conversión a oportunidad | Leads que llegaron a oportunidad / leads calificados de la misma cohorte ×100 | Mejorar diagnóstico y propuesta |
| Conversión a venta | Oportunidades ganadas / oportunidades cerradas (ganadas + perdidas) ×100 | Evaluar cierre sin mezclar pendientes |
| ROAS | Ingresos atribuibles a anuncios / gasto en anuncios | Evaluar retorno publicitario; no equivale a beneficio ni ROI |
| CTR de búsqueda | Clics / impresiones ×100 en Search Console | Revisar resultado mostrado e intención |
| Conversión web a lead | Sesiones con lead validado / sesiones elegibles ×100 | Revisar la experiencia de contacto |

Todos los indicadores muestran fuente, periodo, cohorte, definición, estado de conexión y actualización. Denominador cero se presenta como «Sin base suficiente», nunca 0% engañoso. SLA inicial sugerido para discusión: 60 minutos dentro de horario; es una política propia editable, no un estándar de Meta ni de Google. No sumar alcance único entre publicaciones o plataformas: las personas se superponen.

## Meta: contenido y conversaciones

Inbox de Meta Business Suite reúne Facebook, Instagram y WhatsApp cuando se conceden los permisos y se configura acceso. VECTOR puede proponer una bandeja con responsable, etapa, motivo, siguiente acción y plazo; el prototipo no debe fingir acceso real. Meta permite automatizaciones: útil para confirmar recepción y explicar horario, manteniendo transferencia clara a una persona. [Inbox oficial](https://www.facebook.com/business/help/27148728838061242).

La guía oficial de generación de leads mediante mensajería recomienda aclarar que se invita a conversar y utilizar preguntas útiles para calificar. La UI debe permitir probar dos rutas: anuncio → conversación y anuncio → landing/formulario, comparando costo por lead calificado y cierre, no escoger una universalmente. [Guía oficial de Meta](https://about.fb.com/ltam/wp-content/uploads/sites/14/2023/11/LeadGenerationGuide.pdf).

Una conversación reportada por anuncios no debe presentarse como cliente único del CRM. Guardar el nombre nativo del resultado, ventana de atribución y configuración de campaña; algunas métricas y canales disponibles varían. El prototipo puede ofrecer ficha de creativo con objetivo, oferta, CTA, formato, público, hipótesis y resultado. [Formación oficial de mensajería](https://www.facebookblueprint.com/student/activity/637794-meta-business-messaging-tools).

Separar permisos internos de permisos otorgados a Facebook/Instagram: tener el rol Administrador en VECTOR no concede acceso a una cuenta Meta. [Acceso oficial de páginas](https://www.facebook.com/help/289207354498410/).

## Google: tres capas distintas

Search Console mide aparición y clics del sitio en búsqueda. Mostrar consultas, páginas, dispositivo, clics, impresiones y CTR; explicar posición promedio como señal contextual. Una alerta útil identifica páginas con muchas impresiones, CTR menor que su propio histórico y consultas relevantes; el Administrador propone mejorar título, contenido y coherencia de oferta. No prometer una posición. [Definiciones oficiales](https://support.google.com/webmasters/answer/7042828?hl=en).

Business Profile mide acciones desde el perfil verificado: clics a web, clics al botón de llamada y solicitudes de dirección. «Llamadas» en ese reporte son clics al botón: no acreditan llamada conectada ni venta. La herramienta debe conservar esa etiqueta precisa. [Rendimiento oficial](https://support.google.com/business/answer/9918094?hl=en).

Para presencia local: información completa y exacta, verificación, horarios, fotos, servicios y gestión de reseñas. Google explica relevancia, distancia y prominencia; no se puede pagar o pedir mejor ranking local. Incluir checklist y registro de mejoras, no un puntaje presentado como algoritmo de Google. [Buenas prácticas oficiales](https://support.google.com/business/answer/7091?hl=en).

GA4 mide uso del sitio. Un clic a WhatsApp o teléfono es intención; un formulario confirmado o un lead verificado es otro evento. Propuesta: `contact_intent` personalizado para clic al canal; `generate_lead` cuando se confirma el lead; `working_lead` al contactar; `qualify_lead` al calificar; `close_convert_lead` al convertirse en cliente. Mantener `disqualify_lead` y `close_unconvert_lead` con motivo. No asignar valor monetario inventado a leads. [Eventos recomendados](https://developers.google.com/analytics/devguides/collection/ga4/reference/events).

GA4 dispone de un reporte de adquisición con nuevos leads, leads calificados y convertidos, alimentado por esos eventos. Su recuento se basa en usuarios de Analytics, por lo que puede diferir de los IDs únicos del CRM. La plataforma debe mostrar ambos universos y conciliación, no fusionarlos silenciosamente. [Reporte oficial](https://support.google.com/analytics/answer/16376749?hl=en).

## Instrumentación y confianza

Construir enlaces con UTM normalizados: source, medium, campaign, id y content. Mantener minúsculas y catálogo para evitar dividir campañas por errores de escritura. Nunca incluir nombres, correo, teléfono ni texto de conversaciones en UTM o eventos enviados a Analytics. [UTM oficial](https://support.google.com/analytics/answer/10917952?hl=en); [PII en Analytics](https://support.google.com/analytics/answer/6366371?hl=en).

La atribución es asignación de crédito según un modelo y una ventana; no prueba causalidad. Los reportes de Meta, GA4 y CRM pueden diferir. Mostrar «Reportado por plataforma», «Vinculado por evidencia CRM» y «Origen declarado» como datos distintos. La tarjeta de resultado debe revelar modelo/ventana y porcentaje sin origen. [Atribución oficial GA4](https://support.google.com/analytics/answer/10596866?hl=en).

Una acción de negocio puede marcarse como evento clave de GA4 y utilizarse para crear una conversión de Google Ads cuando existe cuenta vinculada. Scroll o visita no sustituyen lead generado. [Conversiones oficiales](https://support.google.com/analytics/answer/9356034?hl=en).

## Prácticas convertidas en funciones

1. Brief de campaña: oferta, audiencia, problema, resultado esperado, CTA único, responsable, presupuesto e hipótesis.
2. Calendario: pilares orientados a resolver preguntas reales, prueba/portafolio, oferta y conversación. La frecuencia se decide por capacidad y aprendizaje; no imponer «publicar diario».
3. Aprobación: vista del contenido en contexto, versión, cambios solicitados y fecha límite; Usuario aprueba, Administrador prepara y gestiona.
4. Bandeja: pendientes primero, etiquetas de necesidad, asignación, respuesta sugerida editable, siguiente acción y registro de resolución.
5. Seguimiento: próxima acción y canal autorizado, historial, calificación transparente y motivos de pérdida.
6. Presencia Google: ficha completa, consultas relevantes, páginas por servicio y enlace de contacto fácil de usar en móvil.
7. Laboratorio: probar CTA/oferta/formato de uno en uno; periodo, hipótesis, señal primaria y aprendizaje. No declarar ganador con volumen insuficiente.
8. Resultados: embudo, calidad y costos acompañados por decisiones concretas. Ejemplo: «12 conversaciones esperan respuesta; prioriza las 4 que solicitan cotización».

## Alcance del prototipo

Datos ficticios claramente identificados, conexiones simuladas, acciones reversibles y dos perfiles. Debe enseñar la herramienta completa sin aparentar publicar, enviar mensajes o sincronizar métricas reales. Persistencia local de demostración permite experimentar, restablecer y evaluar recorridos.
