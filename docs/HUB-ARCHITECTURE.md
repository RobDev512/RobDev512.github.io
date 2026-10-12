# Arquitectura del Hub de Proyectos

## 1. Objetivo

robdev512.github.io funciona como el portal central de proyectos personales de RobDev512.

Su función no es reflejar directamente la estructura de carpetas del equipo ni limitarse a repositorios públicos.

El hub puede representar proyectos independientemente de:

- dónde estén almacenados;
- qué lenguaje utilicen;
- si su código es público o privado;
- si están desplegados;
- si siguen en desarrollo;
- si están terminados;
- si son experimentales.

---

## 2. Principio de clasificación

Los proyectos se clasifican principalmente por:

**tipo de producto o área de desarrollo**

No se clasifican principalmente por lenguaje de programación.

La separación conceptual es:

### Qué es

Categoría y subtipo.

### Cómo está construido

Tecnologías.

### En qué estado se encuentra

Estado de desarrollo.

### Cómo puede accederse

Visibilidad y enlaces.

---

## 3. Ejemplo conceptual

LabNotes no es solamente un proyecto Node.js.

Es una:

**Aplicación web full-stack**

Node.js, Express, SQL Server y Azure son tecnologías utilizadas para construirla.

AWS ORBISHOT no es solamente un proyecto JavaScript.

Es un:

**Videojuego web**

HTML5 Canvas, JavaScript y CSS son tecnologías utilizadas para desarrollarlo.

---

# 4. Categorías principales

## Desarrollo Web

Incluye:

- aplicaciones web;
- sitios web;
- plataformas;
- dashboards;
- portales;
- PWAs;
- sistemas full-stack.

Ejemplo actual:

- LabNotes

---

## Desarrollo de Aplicaciones de Escritorio

Incluye:

- aplicaciones nativas;
- utilidades;
- herramientas administrativas;
- software de productividad;
- programas locales;
- interfaces gráficas de escritorio.

Una aplicación de escritorio puede estar construida con Python, C++, C#, Java, Electron u otras tecnologías.

El lenguaje no define la categoría.

---

## Desarrollo de Aplicaciones Móviles

Incluye:

- aplicaciones Android;
- aplicaciones iOS;
- aplicaciones multiplataforma;
- herramientas diseñadas principalmente para teléfonos o tablets.

Tecnologías posibles:

- Kotlin;
- Java;
- Flutter;
- React Native;
- .NET MAUI;
- otras.

---

## Desarrollo de Videojuegos

Incluye:

- videojuegos web;
- videojuegos de escritorio;
- videojuegos móviles;
- prototipos jugables;
- experimentos de gameplay.

Ejemplo actual:

- AWS ORBISHOT

---

## Automatización y Scripts

Incluye:

- scripts de utilidad;
- automatizaciones;
- procesamiento de archivos;
- mantenimiento;
- procesamiento de datos;
- tareas repetitivas.

Tecnologías posibles:

- Python;
- PowerShell;
- Bash;
- JavaScript;
- otras.

---

## Backend y Servicios

Incluye proyectos cuyo producto principal sea:

- una API;
- un servicio web;
- un microservicio;
- una integración;
- un servicio interno.

Si un backend forma parte de una aplicación web completa, normalmente el proyecto debe clasificarse como Desarrollo Web.

---

## Datos y Bases de Datos

Incluye proyectos cuyo objetivo principal sea:

- procesamiento de datos;
- bases de datos;
- análisis;
- visualización;
- ETL;
- herramientas SQL;
- herramientas NoSQL.

Utilizar una base de datos dentro de otra aplicación no convierte automáticamente ese proyecto en un proyecto de datos.

---

## Sistemas y Experimentación

Incluye:

- proyectos de bajo nivel;
- redes;
- concurrencia;
- rendimiento;
- herramientas de consola;
- experimentos técnicos;
- proyectos de sistemas;
- pruebas con C++, Go, ensamblador u otras tecnologías.

---

## Otros

Categoría temporal para proyectos que no tengan todavía una clasificación suficientemente clara.

Debe evitarse si existe una categoría más específica.

---

# 5. Subtipos

Cada proyecto puede tener un subtipo.

Ejemplos:

- Aplicación web full-stack
- Sitio web
- PWA
- Videojuego web
- Videojuego de escritorio
- Aplicación de escritorio
- Herramienta de productividad
- Aplicación Android
- API REST
- Script de automatización
- Herramienta de datos
- Experimento técnico

---

# 6. Tecnologías

Las tecnologías son metadata secundaria.

Ejemplos:

- HTML
- CSS
- JavaScript
- TypeScript
- Node.js
- Express
- Python
- C++
- Go
- Java
- Kotlin
- SQL Server
- MongoDB
- Azure
- GitHub Actions
- HTML5 Canvas

Un proyecto puede contener múltiples tecnologías.

Las tecnologías no sustituyen la categoría principal.

---

# 7. Estados

## En desarrollo

Proyecto actualmente activo.

## Estable

Proyecto funcional con una versión considerada estable.

Puede seguir teniendo roadmap activo.

## Experimental

Prueba, prototipo o exploración técnica.

## Pausado

Proyecto cuyo desarrollo está detenido temporalmente.

## Terminado

Proyecto cuyo objetivo fue completado.

## Archivado

Proyecto conservado por historial o referencia y que ya no forma parte del desarrollo activo.

---

# 8. Visibilidad

La visibilidad es independiente del estado del proyecto.

## Público

Código y proyecto accesibles públicamente.

## Código privado / aplicación pública

El código es privado pero existe una aplicación o demostración pública.

Ejemplo:

- LabNotes

## Privado

Repositorio o proyecto sin acceso público.

## Local

Proyecto almacenado únicamente de forma local.

Un proyecto local puede aparecer en el hub sin necesidad de tener todavía un repositorio GitHub.

---

# 9. Proyectos actuales

## AWS ORBISHOT

Categoría:

Desarrollo de Videojuegos

Subtipo:

Videojuego web

Tecnologías:

- HTML5 Canvas
- JavaScript
- CSS

Estado:

Estable con roadmap activo

Visibilidad:

Público

Página:

https://robdev512.github.io/AWS-ORBISHOT/

---

## LabNotes

Categoría:

Desarrollo Web

Subtipo:

Aplicación web full-stack

Tecnologías:

- HTML
- CSS
- JavaScript
- Node.js
- Express
- SQL Server
- Azure

Estado:

En desarrollo

Release actual:

v1.1.0-alpha.1 - Night Shift

Visibilidad:

Código privado / aplicación pública

Página:

https://robdev512.github.io/projects/labnotes/

---

# 10. Catálogo central

El hub utiliza actualmente:

data/projects.json

como fuente central de verdad del catálogo.

La lógica de carga, validación, filtrado y renderizado se encuentra en:

js/hub.js

index.html conserva únicamente la estructura general de la página y el contenedor donde se renderiza el catálogo.

Cada proyecto podrá definir:

- identificador;
- nombre;
- categoría;
- subtipo;
- descripción;
- tecnologías;
- estado;
- visibilidad;
- versión;
- codename;
- logo;
- repositorio;
- página de presentación;
- aplicación;
- proyecto destacado;
- fecha de creación;
- fecha de última actualización.

Ejemplo conceptual de un registro de LabNotes:

    {
      "id": "labnotes",
      "name": "LabNotes",
      "category": "web",
      "categoryLabel": "Desarrollo Web",
      "subtype": "Aplicación web full-stack",
      "technologies": [
        "Node.js",
        "Express",
        "SQL Server",
        "Azure"
      ],
      "status": "development",
      "visibility": "private-code-public-app",
      "version": "v1.1.0-alpha.1",
      "codename": "Night Shift",
      "featured": true
    }

---

# 11. Regla de publicación

Un proyecto no necesita estar en GitHub para aparecer en el hub.

Los proyectos locales pueden mostrar:

- nombre;
- descripción;
- categoría;
- subtipo;
- tecnologías;
- estado;
- capturas;
- logo;
- información general.

Nunca se deben publicar:

- rutas locales;
- contraseñas;
- secretos;
- credenciales;
- información privada;
- archivos internos sensibles.

---

# 12. Relación con las carpetas locales

La estructura local y la estructura pública son independientes.

Pueden existir carpetas locales como:

- Proyectos HTML
- Proyectos Python
- Proyectos C++
- Proyectos GOlang

pero esas carpetas representan organización de archivos.

El hub utiliza categorías orientadas al producto.

Por ejemplo:

Un proyecto almacenado dentro de Proyectos Python puede aparecer públicamente como:

**Desarrollo de Aplicaciones de Escritorio**

si ese es su propósito.

---

# 13. Filosofía del hub

El hub no debe mostrar solamente código.

Debe responder:

- ¿Qué es el proyecto?
- ¿Qué problema resuelve?
- ¿Qué se construyó?
- ¿En qué estado está?
- ¿Qué tecnologías utiliza?
- ¿Cómo ha evolucionado?
- ¿Dónde puede probarse?
- ¿Existe repositorio?
- ¿Es público, privado o local?

El objetivo final es que robdev512.github.io funcione como portafolio e historial técnico de proyectos personales.
