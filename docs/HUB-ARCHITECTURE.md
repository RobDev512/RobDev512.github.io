# Arquitectura del Hub de Proyectos

## 1. Objetivo

`robdev512.github.io` funciona como el portal central de proyectos personales de RobDev512.

El hub representa proyectos por lo que son, no por la carpeta local donde se encuentran ni por el lenguaje principal.

## 2. Modelo de clasificación

Cada proyecto se describe mediante:

- categoría;
- subtipo;
- descripción;
- tecnologías;
- estado;
- visibilidad;
- versión, cuando aplica;
- enlaces públicos, cuando existen.

Las tecnologías son metadata secundaria.

## 3. Categorías

### Desarrollo Web

Aplicaciones web, sitios, plataformas, dashboards, portales, PWAs y sistemas full-stack.

Ejemplo: LabNotes.

### Desarrollo de Aplicaciones de Escritorio

Aplicaciones nativas, utilidades y herramientas locales con interfaz de escritorio.

Ejemplo: Convertidor de Archivos.

### Desarrollo de Aplicaciones Móviles

Aplicaciones Android, iOS o multiplataforma orientadas principalmente a teléfonos o tablets.

### Desarrollo de Videojuegos

Videojuegos web, de escritorio, móviles y prototipos jugables.

Ejemplo: AWS ORBISHOT.

### Automatización y Scripts

Scripts y herramientas cuyo objetivo principal es automatizar tareas o procesamiento repetitivo.

### Backend y Servicios

APIs, servicios web, microservicios e integraciones cuyo producto principal es el backend.

### Datos y Bases de Datos

Procesamiento, análisis, ETL, herramientas SQL/NoSQL y proyectos cuyo producto principal gira alrededor de datos.

### Sistemas y Experimentación

Compiladores, DSLs, redes, bajo nivel, concurrencia, rendimiento, herramientas de consola y experimentos técnicos.

Ejemplo: TecNet Finder.

### Otros

Categoría temporal para proyectos todavía no clasificables de forma más específica.

## 4. Estados

- En desarrollo
- Estable
- Experimental
- Pausado
- Terminado
- Archivado

## 5. Visibilidad

- Público
- Código privado / aplicación pública
- Privado
- Local

La visibilidad no determina el estado del proyecto.

## 6. Catálogo central

La fuente de verdad es:

`data/projects.json`

La lógica se encuentra en:

`js/hub.js`

El HTML no contiene manualmente la información individual de cada proyecto.

## 7. Navegación

La navegación visible por categoría se genera desde la taxonomía y el contenido real del catálogo.

Reglas:

- siempre existe Todos;
- sólo aparecen categorías con al menos un proyecto;
- cada categoría muestra su cantidad;
- `?category=<id>` representa la categoría activa;
- Atrás y Adelante restauran la selección;
- nuevas categorías aparecen automáticamente al recibir su primer proyecto.

## 8. Inventario y publicación

La estructura local de carpetas no se replica públicamente.

Durante el inventario se distinguen:

- proyectos de portafolio;
- proyectos pequeños o de práctica;
- variantes históricas;
- carpetas técnicas;
- proyectos pendientes de documentación.

Un proyecto privado o local puede tener presencia en el hub sin publicar su código.

Nunca deben publicarse:

- rutas locales;
- credenciales;
- secretos;
- contraseñas;
- datos privados;
- archivos internos sensibles.

## 9. Proyectos registrados

### AWS ORBISHOT

- Desarrollo de Videojuegos
- Videojuego web
- Estable
- Público

### LabNotes

- Desarrollo Web
- Aplicación web full-stack
- En desarrollo
- Código privado / aplicación pública

### Convertidor de Archivos

- Desarrollo de Aplicaciones de Escritorio
- Utilidad de conversión y procesamiento de archivos
- Estable
- Público

### TecNet Finder

- Sistemas y Experimentación
- DSL / compilador para análisis de redes
- En desarrollo
- Privado

## 10. Principio del hub

La navegación debe responder primero:

**¿Qué tipo de proyecto es?**

y después:

**¿Con qué tecnologías está construido?**

El objetivo es mantener un portafolio e historial técnico coherente aunque los proyectos vivan en repositorios, despliegues o ubicaciones diferentes.

## 11. Páginas individuales actuales

Todos los proyectos del catálogo actual disponen de una presentación propia:

- AWS ORBISHOT: landing independiente del proyecto.
- LabNotes: `/projects/labnotes/`.
- Convertidor de Archivos: `/projects/convertidor-archivos/`.
- TecNet Finder: `/projects/tecnet-finder/`.

Las páginas de proyectos privados pueden describir el producto sin exponer el repositorio ni código interno.

Las páginas nuevas comparten estilos base mediante:

`projects/project-page.css`

## 12. Identidad visual y roadmaps

Cuando un proyecto dispone de logo propio, el Hub utiliza una copia pública
del recurso de marca dentro de `assets/`.

Las páginas de proyecto pueden incluir un resumen visual de su roadmap y un
archivo `ROADMAP.md` independiente.

Esto permite que un proyecto con repositorio privado, como TecNet Finder,
muestre públicamente su identidad y planificación sin exponer su código.

## 13. Presentación de estado y visibilidad

El catálogo mantiene `status` y `visibility` como dimensiones independientes.

Las tarjetas muestran ambos valores mediante indicadores visuales separados:

- Estado: En desarrollo, Estable, Experimental, Pausado, Terminado o Archivado.
- Visibilidad: Público, Código privado / aplicación pública, Privado o Local.

`statusDetail` puede añadir contexto sin sustituir el estado normalizado.

Las tecnologías permanecen en `card.badges` y no deben duplicar el estado o la
visibilidad. Los atributos `data-status` y `data-visibility` se conservan en
cada tarjeta para habilitar filtros visibles en una fase posterior.


## 14. Navegación avanzada

La Fase 5 convierte los filtros internos del catálogo en controles visibles.

El estado de navegación puede combinar:

- categoría;
- estado;
- visibilidad;
- tecnología;
- texto de búsqueda;
- sólo destacados;
- ordenamiento.

La URL conserva el estado mediante parámetros:

- `category`
- `status`
- `visibility`
- `tech`
- `q`
- `featured`
- `sort`

Atrás y Adelante restauran la vista completa.

### Búsqueda

La búsqueda se normaliza sin distinguir mayúsculas ni acentos y consulta:

- nombre;
- subtipo;
- descripción;
- versión;
- codename;
- detalle de estado;
- categoría;
- estado;
- visibilidad;
- tecnologías;
- badges de la tarjeta.

### Ordenamiento

El catálogo admite:

- orden recomendado (`displayOrder`);
- más recientes (`updatedAt`);
- destacados primero (`featured`);
- nombre A–Z;
- nombre Z–A.

`updatedAt` representa la actividad más reciente conocida del repositorio del
proyecto y permite ordenar sin depender del orden manual del catálogo.
