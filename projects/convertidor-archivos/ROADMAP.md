# ROADMAP — Convertidor de Archivos

## Estado actual

**Versión vigente:** v1.1.1
**Estado general:** Estable / publicada
**Plataforma principal:** Windows 64-bit

> La ruta futura conserva la planificación original del proyecto. Los estados
> pueden cambiar conforme evolucione el desarrollo.

---

## v1.0.1 — Base estable publicada

**Estado:** Aplicada

Primera versión estable y distribuible.

### Base funcional

- Conversión entre múltiples tipos de archivos.
- Documentos de Microsoft Office.
- PDF.
- Imágenes.
- Archivos comprimidos.
- Libros y formatos de marcado.
- Archivos de Minecraft.
- Previsualización de archivos originales y resultados.
- Manejo seguro de sobrescritura, copias, cancelaciones y temporales.
- Funcionamiento offline.
- Instalador mediante Inno Setup.
- Publicación mediante GitHub Releases.

---

## v1.1.0 — Herramientas PDF

**Estado:** Aplicada

Primera gran expansión del menú de herramientas PDF.

### Incluido

- Unir PDFs.
- Dividir PDF.
- Extraer páginas.
- Reordenar páginas.
- Comprimir PDF.
- Conversión PDF → DOCX mediante motor propio y motores de respaldo compatibles.

---

## v1.1.1 — Herramientas de imágenes

**Estado:** Aplicada

Versión vigente.

### Incluido

- Redimensionar imágenes.
- Comprimir imágenes.
- Imágenes → PDF.
- Mejorar calidad mediante Real-ESRGAN local y mejora clásica.
- Quitar fondo mediante modelos locales.
- Procesamiento por lotes en las herramientas compatibles.
- Funcionamiento local sin necesidad de subir imágenes a Internet.

---

## v1.1.2 — Soporte multimedia

**Estado:** En desarrollo

Incorporación de audio, video y GIF.

### Motor previsto

- FFmpeg.
- ffprobe.

### Convertidor principal

Conversión de archivo completo A → archivo completo B.

### Ejemplos previstos

- MP4 → MP3.
- MP4 → GIF.
- GIF → MP4.
- MP3 → WAV.
- WAV → MP3.
- MP4 → WebM.
- M4A → MP3.

### Herramientas multimedia

- Extraer fotogramas.
- Recortar video, audio o GIF.
- Unir multimedia.
- Comprimir multimedia.
- Cambiar velocidad.

---

## v1.1.3 — Herramientas de archivos comprimidos

**Estado:** Siguiente

Nueva sección para trabajar con archivos comprimidos.

### Objetivos

- Comprimir archivos y carpetas.
- ZIP.
- 7Z.
- RAR cuando WinRAR/RAR esté disponible.
- Elegir nivel de compresión.
- Extraer archivos.
- Explorar el contenido sin extraer todo.
- Validar integridad.
- Estudiar soporte para volúmenes divididos.

---

## v1.1.4 — Herramientas de Minecraft

**Estado:** Pendiente

Inicialmente centradas en Minecraft Bedrock.

### Objetivos

- Crear `.mcpack`.
- Crear `.mcaddon`.
- Crear `.mcworld`.
- Crear `.mctemplate`.
- Extraer paquetes.
- Visualizar estructura.
- Validar estructura ZIP y `manifest.json`.
- Leer UUID, versión, módulos y dependencias.
- Generar UUID nuevos.
- Actualizar versiones.
- Combinar Resource Pack + Behavior Pack.

---

## v1.1.5 — Actualizaciones e integración con Windows

**Estado:** Pendiente

### Actualizador integrado

- Consultar GitHub Releases.
- Detectar versiones nuevas.
- Mostrar novedades.
- Descargar instalador.
- Verificar descarga.
- Cerrar la aplicación y ejecutar el instalador.

### Integración con Windows

- Abrir con Convertidor de Archivos.
- Recibir rutas como argumentos.
- Menú contextual.
- Arrastrar archivos sobre el ejecutable o acceso directo.

---

## v1.2.0 — Conversión por lotes y cola de trabajo

**Estado:** Pendiente

Primera actualización grande después de la familia v1.1.x.

### Objetivos

- Añadir múltiples archivos.
- Elegir carpetas completas.
- Procesar subcarpetas.
- Mantener estructura de carpetas.
- Cola de trabajos.
- Pausar.
- Continuar.
- Cancelar.
- Reintentar.
- Progreso individual y global.
- Resumen de completados, fallidos y omitidos.
- Integración con selección múltiple desde Windows.

---

## v1.3.0 — Perfiles y configuración

**Estado:** Pendiente

### Perfiles

Guardar configuraciones reutilizables para distintos tipos de conversión.

### Configuración general

- Carpeta de salida predeterminada.
- Recordar última carpeta.
- Comportamiento ante archivos existentes.
- Preferencias de motores.
- Calidad predeterminada.
- Actualizador.
- Integración con Windows.

---

## v1.4.0 — Herramientas avanzadas de documentos

**Estado:** Pendiente

### Objetivos

- Extraer imágenes.
- Extraer archivos incrustados cuando sea posible.
- Mostrar metadatos.
- Rotar, eliminar y duplicar páginas PDF.
- Combinar varias operaciones antes de guardar.

### OCR — posible

Se evaluará únicamente si existe un motor offline adecuado por calidad,
tamaño, rendimiento y licencia.

---

## v1.5.0 — Multimedia avanzada

**Estado:** Pendiente

### Video

- Resolución.
- FPS.
- Bitrate.
- Rotación.
- Volteo.
- Relación de aspecto.
- Recorte físico.

### Audio de video

- Quitar audio.
- Reemplazar audio.
- Extraer pistas.
- Trabajar con múltiples pistas cuando sea viable.

### GIF y fotogramas

- Crear GIF desde fragmentos.
- Elegir FPS, resolución y calidad.
- Extraer fotogramas concretos.
- Crear portadas y miniaturas.

---

## v1.6.0 — Productividad y experiencia de usuario

**Estado:** Pendiente

### Objetivos

- Historial de conversiones.
- Repetir conversiones.
- Accesos rápidos.
- Favoritos.
- Mejoras de drag & drop.
- Diagnóstico de motores.
- Información de errores más clara.
- Registro opcional de operaciones.

---

## v2.0.0 — Gran actualización futura

**Estado:** Visión

Reservada para cambios de alcance mayor.

### Líneas posibles

- Arquitectura todavía más modular.
- Incorporación más sencilla de formatos y motores.
- Mejor separación entre interfaz, conversión y herramientas.
- Flujos de procesamiento encadenados.
- Flujos personalizados reutilizables.
- Ejecución sobre múltiples archivos.
- Posible rediseño de interfaz si el crecimiento del producto lo requiere.

---

## Regla de avance

Una versión puede cambiar de alcance, dividirse, adelantarse o retrasarse si el
desarrollo real lo requiere.
