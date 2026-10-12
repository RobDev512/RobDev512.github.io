# Roadmap del Hub de Proyectos

## Estado actual

El hub ya cuenta con:

- GitHub Pages;
- catálogo dinámico;
- `data/projects.json` como fuente central;
- renderizado mediante `js/hub.js`;
- taxonomía de categorías, estados y visibilidades;
- navegación visible por categoría;
- contadores por categoría;
- URL compartible;
- soporte interno para filtros combinados;
- inventario inicial de proyectos personales;
- cuatro proyectos registrados en el catálogo.

---

# Fase 1 - Catálogo dinámico

**Estado:** Completada.

## Implementado

- [x] Crear `data/projects.json`.
- [x] Crear `js/hub.js`.
- [x] Renderizar proyectos desde JavaScript.
- [x] Mantener las tarjetas de AWS ORBISHOT y LabNotes.
- [x] Validar la estructura del catálogo.
- [x] Preparar filtros internos.

---

# Fase 2 - Categorías y navegación

**Estado:** Completada.

## Implementado

- [x] Navegación visible por categoría.
- [x] Opción Todos.
- [x] Filtros generados desde la taxonomía.
- [x] Ocultar categorías vacías.
- [x] Contadores.
- [x] `aria-pressed`.
- [x] Resumen dinámico.
- [x] `?category=<id>`.
- [x] Atrás / Adelante.
- [x] Aparición automática de nuevas categorías con proyectos.

---

# Fase 3 - Inventario de proyectos existentes

**Estado:** Completada.

## Objetivo

Revisar los proyectos personales existentes y registrar en el catálogo los que ya tienen identidad suficiente para el portafolio.

## Resultado del inventario inicial

### Registrados

- AWS ORBISHOT.
- LabNotes.
- Convertidor de Archivos.
- TecNet Finder.

### No registrados como proyectos independientes

Se descartaron del catálogo público inicial:

- carpetas técnicas de entorno o editor;
- el propio repositorio del Hub;
- variantes históricas de un mismo proyecto;
- ejercicios introductorios aislados de C++;
- colecciones de prácticas de Go sin identidad de producto independiente.

### Pendientes de promoción futura

Algunos proyectos locales pequeños permanecen fuera del catálogo hasta contar con suficiente descripción, alcance o identidad propia.

Esto evita publicar nombres o información insuficiente únicamente por existir como carpeta local.

---

# Fase 4 - Estados y visibilidad

**Estado:** Completada.

## Implementado

- [x] Mostrar el estado en cada tarjeta.
- [x] Mostrar la visibilidad en cada tarjeta.
- [x] Diferenciar visualmente proyectos públicos, privados y locales.
- [x] Mantener estado y visibilidad como propiedades independientes.
- [x] Mostrar `statusDetail` cuando aporta contexto adicional.
- [x] Separar tecnologías de estado y visibilidad.
- [x] Conservar `data-status` y `data-visibility` para filtros posteriores.

---

# Fase 5 - Navegación avanzada

**Estado:** Completada.

## Implementado

- [x] Buscador.
- [x] Filtro por estado.
- [x] Filtro por tecnología.
- [x] Filtro por visibilidad.
- [x] Ordenamiento recomendado.
- [x] Ordenamiento por actividad reciente.
- [x] Ordenamiento alfabético.
- [x] Destacados primero.
- [x] Filtro sólo destacados.
- [x] Combinación simultánea de filtros.
- [x] Estado completo de navegación en la URL.
- [x] Atrás / Adelante con restauración de filtros.
- [x] Botón para limpiar filtros.

---

# Fase 6 - Páginas individuales

**Estado:** Parcialmente adelantada.

Los proyectos importantes podrán disponer de una página:

`/projects/<id>/`

Cobertura actual:

- AWS ORBISHOT: página propia.
- LabNotes: página propia.
- Convertidor de Archivos: página propia.
- TecNet Finder: página propia.

Los futuros proyectos importantes podrán adoptar la misma estructura.

---

# Fase 7 - Historial del portafolio

**Estado:** Visión futura.

Posibles funciones:

- timeline;
- año de creación;
- fecha de última actualización;
- proyectos activos;
- proyectos terminados;
- estadísticas por categoría;
- estadísticas por tecnología;
- evolución histórica.

---

# Principio principal

La navegación debe responder primero:

**¿Qué tipo de proyecto es?**

y después:

**¿Con qué tecnologías está construido?**

Los lenguajes son metadata secundaria.

---

# Próximo paso

Continuar con la Fase 6:

**consolidar el patrón de páginas individuales para proyectos futuros**.

La cobertura del catálogo actual ya está adelantada: los cuatro proyectos
registrados disponen de una landing o página propia.
