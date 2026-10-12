# RobDev512.github.io

Portal central de proyectos personales de RobDev512.

Sitio:

https://robdev512.github.io/

## Propósito

Este repositorio funciona como el hub general de proyectos personales.

El portal puede representar:

- proyectos públicos;
- proyectos con código privado;
- aplicaciones desplegadas;
- proyectos locales;
- proyectos en desarrollo;
- experimentos;
- proyectos terminados;
- proyectos archivados.

Un proyecto no necesita estar publicado en GitHub para poder formar parte del catálogo.

Nunca deben publicarse rutas locales, credenciales, secretos ni información privada.

## Clasificación

Los proyectos se clasifican principalmente por su tipo de producto o área de desarrollo.

Categorías iniciales:

- Desarrollo Web
- Desarrollo de Aplicaciones de Escritorio
- Desarrollo de Aplicaciones Móviles
- Desarrollo de Videojuegos
- Automatización y Scripts
- Backend y Servicios
- Datos y Bases de Datos
- Sistemas y Experimentación
- Otros

Los lenguajes, frameworks, bases de datos y plataformas se utilizan como tecnologías o etiquetas secundarias.

## Estados

- En desarrollo
- Estable
- Experimental
- Pausado
- Terminado
- Archivado

## Visibilidad

- Público
- Código privado / aplicación pública
- Privado
- Local

## Arquitectura actual

El catálogo funciona de manera dinámica.

La fuente central de verdad es:

data/projects.json

La lógica del catálogo y la navegación se encuentran en:

js/hub.js

index.html contiene la estructura general, la navegación visible por categorías y el contenedor donde JavaScript renderiza las tarjetas.

La información individual de los proyectos no se mantiene directamente dentro de index.html.

## Navegación por categorías

El hub genera automáticamente los filtros visibles usando la taxonomía de data/projects.json.

La navegación incluye:

- opción Todos;
- categorías que actualmente contienen al menos un proyecto;
- contador de proyectos por categoría;
- estado activo accesible mediante aria-pressed;
- URL compartible mediante el parámetro category;
- compatibilidad con los botones Atrás y Adelante del navegador.

Las categorías sin proyectos permanecen en la taxonomía, pero no ocupan espacio visual. Cuando se registre el primer proyecto de una categoría, su filtro aparecerá automáticamente.

Los filtros internos por estado, tecnología y visibilidad permanecen preparados para fases posteriores.

## Proyectos actuales

### AWS ORBISHOT

Categoría:

Desarrollo de Videojuegos

Subtipo:

Videojuego web

Estado:

Estable con roadmap activo

Versión:

v1.4.3.2

Página:

https://robdev512.github.io/AWS-ORBISHOT/

### LabNotes

Categoría:

Desarrollo Web

Subtipo:

Aplicación web full-stack

Estado:

En desarrollo

Release actual:

v1.1.0-alpha.1 - Night Shift

Visibilidad:

Código privado / aplicación pública

Página:

https://robdev512.github.io/projects/labnotes/

## Estructura principal

    RobDev512.github.io/
    ├── assets/
    ├── data/
    │   └── projects.json
    ├── docs/
    │   ├── HUB-ARCHITECTURE.md
    │   └── HUB-ROADMAP.md
    ├── js/
    │   └── hub.js
    ├── projects/
    │   └── labnotes/
    ├── index.html
    ├── styles.css
    └── labnotes-card.css

## Documentación

Arquitectura:

docs/HUB-ARCHITECTURE.md

Roadmap:

docs/HUB-ROADMAP.md

## Próximo objetivo

La siguiente fase es realizar el inventario de proyectos personales existentes e incorporarlos progresivamente al catálogo sin publicar rutas locales ni información sensible.
