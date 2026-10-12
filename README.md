# RobDev512.github.io

Portal central de proyectos personales de RobDev512.

Sitio:

https://robdev512.github.io/

## Propósito

Este repositorio funciona como el hub general de proyectos personales.

El portal puede representar proyectos públicos, privados, locales, desplegados, experimentales, terminados o todavía en desarrollo.

Nunca deben publicarse rutas locales, credenciales, secretos ni información privada.

## Clasificación

Los proyectos se clasifican principalmente por su tipo de producto o área de desarrollo, no por el lenguaje utilizado.

Categorías:

- Desarrollo Web
- Desarrollo de Aplicaciones de Escritorio
- Desarrollo de Aplicaciones Móviles
- Desarrollo de Videojuegos
- Automatización y Scripts
- Backend y Servicios
- Datos y Bases de Datos
- Sistemas y Experimentación
- Otros

## Arquitectura actual

La fuente central del catálogo es:

`data/projects.json`

La lógica de carga, validación, navegación, filtros y renderizado se encuentra en:

`js/hub.js`

`index.html` contiene la estructura general y la navegación visible por categorías.

Las categorías visibles se generan automáticamente según los proyectos registrados.

## Proyectos actuales

### AWS ORBISHOT

- Categoría: Desarrollo de Videojuegos
- Subtipo: Videojuego web
- Estado: Estable con roadmap activo
- Versión: v1.4.3.2
- Visibilidad: Público
- Página: https://robdev512.github.io/AWS-ORBISHOT/

### LabNotes

- Categoría: Desarrollo Web
- Subtipo: Aplicación web full-stack
- Estado: En desarrollo
- Release: v1.1.0-alpha.1 - Night Shift
- Visibilidad: Código privado / aplicación pública
- Página: https://robdev512.github.io/projects/labnotes/

### Convertidor de Archivos

- Categoría: Desarrollo de Aplicaciones de Escritorio
- Subtipo: Utilidad de conversión y procesamiento de archivos
- Estado: Estable
- Versión: v1.1.1
- Visibilidad: Público
- Página: https://robdev512.github.io/projects/convertidor-archivos/
- Repositorio: https://github.com/RobDev512/ConvertidorArchivos

### TecNet Finder

- Categoría: Sistemas y Experimentación
- Subtipo: DSL / compilador para análisis de redes
- Estado: En desarrollo
- Visibilidad: Privado
- Página: https://robdev512.github.io/projects/tecnet-finder/
- Código no publicado desde el hub

## Navegación por categorías

El hub incluye:

- opción Todos;
- categorías con proyectos;
- contador por categoría;
- URL compartible con `?category=<id>`;
- navegación Atrás / Adelante;
- soporte interno para combinar categoría, estado, tecnología y visibilidad.

## Inventario inicial

La Fase 3 revisó los proyectos personales existentes y separó:

- proyectos adecuados para el portafolio;
- prácticas pequeñas;
- variantes históricas;
- carpetas técnicas;
- proyectos que necesitan más información antes de publicarse.

El catálogo público no refleja directamente la estructura local de carpetas.

## Documentación

- `docs/HUB-ARCHITECTURE.md`
- `docs/HUB-ROADMAP.md`

## Próximo objetivo

La siguiente fase es mejorar la representación visible de estado y visibilidad para que proyectos públicos, privados y locales puedan convivir claramente en el catálogo.

Todos los proyectos registrados actualmente cuentan ya con una página de presentación o landing propia.

## Roadmaps por proyecto

Los proyectos con planificación propia pueden exponer un `ROADMAP.md` dentro
de su página de presentación.

Actualmente:

- `projects/convertidor-archivos/ROADMAP.md`
- `projects/tecnet-finder/ROADMAP.md`

Las páginas HTML muestran un resumen visual del roadmap y el Markdown conserva
el detalle de versiones.

Los logos del Hub son copias de los recursos de marca oficiales de cada
proyecto y se almacenan en `assets/` para que el catálogo público no dependa
de repositorios privados.
