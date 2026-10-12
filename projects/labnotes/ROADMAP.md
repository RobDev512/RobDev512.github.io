# ROADMAP — LabNotes

## Estado actual

**Versión estable:** v1.0.0 — Foundation  
**Versión en desarrollo:** v1.1.0 — Night Shift  
**Pre-release actual:** v1.1.0-alpha.1

> Este documento conserva en Markdown el roadmap de la presentación pública de
> LabNotes y sirve como respaldo documental dentro del repositorio del proyecto.

---

## v1.0.0 — Foundation · Base estable

**Estado:** Aplicada / Publicada

Primera versión funcional y base SemVer de LabNotes.

### Incluido

- Autenticación, recuperación de contraseña y gestión de cuenta.
- Notas, categorías, laboratorios, etiquetas, búsqueda, imágenes y comentarios.
- Perfil, preferencias, administración básica y diseño responsive.
- Node.js, Express, SQL Server / Azure SQL, JWT HttpOnly, SMTP, GitHub Actions y Azure App Service.

---

## v1.1.0 — Night Shift · Experiencia y participación

**Estado:** En desarrollo  
**Pre-release:** v1.1.0-alpha.1

Accesibilidad visual, participación comunitaria y mejor organización de las notas.

### Implementado

- Sistema de temas y apariencia de Night Shift.
- Tema oscuro y persistencia de preferencias visuales.
- Sistema de votos Útil / No útil.
- Backend, frontend, estilos y migración SQL del sistema de votos.
- Versión SemVer y codename configurados como fuente del release.
- Correcciones responsive de Night Shift para móvil.

### En progreso

- Sistema de favoritos por usuario.
- Backend de favoritos iniciado.
- Migración SQL de favoritos iniciada.
- Pendiente completar interfaz e integración de Mis favoritos.

### Pendiente

- Mostrar versión y codename dentro de la interfaz de LabNotes.
- Completar favoritos de extremo a extremo.
- Ordenamiento por más recientes, más útiles y más comentadas.
- Estado Abierto / Resuelto, visualización y filtrado.
- Pruebas de regresión y validación final de Night Shift.
- Avanzar desde alpha hacia beta / rc antes de publicar v1.1.0 estable.

---

## v1.2.0 — Resolve · Soluciones colaborativas

**Estado:** Pendiente / Planeada

Comentarios convertidos en respuestas técnicas con validación y moderación.

### Objetivos

- Solución aceptada por el autor.
- Votos en respuestas.
- Notificaciones internas.
- Reportes y moderación administrativa.

---

## v1.3.0 — Compass · Búsqueda y descubrimiento

**Estado:** Pendiente / Planeada

Encontrar conocimiento útil de forma rápida incluso con gran volumen de notas.

### Objetivos

- Búsqueda avanzada.
- Filtros combinables.
- Problemas similares antes de publicar.
- Paginación, carga progresiva y skeleton loaders.

---

## v1.4.0 — Grid · Equipos, QR e incidencias

**Estado:** Pendiente / Planeada

Vincular LabNotes con computadoras físicas y crear historial técnico por equipo.

### Objetivos

- Entidad Equipo y notas por computadora.
- Página e historial de cada equipo.
- Código QR único.
- Historial de incidencias y dashboard de resolución.

---

## v1.5.0 — Merit · Perfiles y reputación

**Estado:** Pendiente / Planeada

Reconocer contribuciones útiles sin convertir la plataforma en una competencia excesiva.

### Objetivos

- Perfil ampliado.
- Insignias por aportaciones.
- Historial cronológico de actividad.
- Reputación contextual.

---

## v1.6.0 — Sentinel · Infraestructura y seguridad

**Estado:** Pendiente / Planeada

Robustecer despliegues, observabilidad, seguridad y pruebas.

### Objetivos

- Azure Blob Storage.
- Logs estructurados y health checks.
- Rate limiting y validación de uploads.
- Pruebas automáticas y CI/CD con gates.

---

## v1.7.0 — Archive · Historial y exportación

**Estado:** Pendiente / Planeada

Trazabilidad de cambios y reutilización del conocimiento fuera de la plataforma.

### Objetivos

- Historial de versiones de notas.
- Restauración de contenido previo.
- Exportación PDF.
- Formato de impresión.

---

## v1.8.0 — Pulse · PWA, tiempo real y suscripciones

**Estado:** Pendiente / Planeada

Una experiencia instalable, más inmediata y personalizada.

### Objetivos

- PWA en Android, iPhone y Windows.
- Mejor manejo de conexiones lentas.
- Notificaciones avanzadas.
- Tiempo real y suscripciones.

---

## v1.9.0 — Campus · Capacidades institucionales

**Estado:** Pendiente / Planeada

Operación formal de laboratorios, mantenimiento e inventario.

### Objetivos

- Estructura institucional.
- Roles avanzados.
- Mantenimiento con prioridades y técnicos asignados.
- Inventario y trazabilidad técnica.

---

## v1.10.0 — Insight · Funciones inteligentes

**Estado:** Visión

Asistencia basada en datos cuando exista suficiente conocimiento real acumulado.

### Objetivos

- Problemas similares avanzados.
- Recomendación de soluciones existentes.
- Sugerencias de categorías y etiquetas.
- Resumen de soluciones extensas.
- Control humano como principio de diseño.
