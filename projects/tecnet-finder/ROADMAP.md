# ROADMAP — TecNet Finder

## Estado actual

**Versión vigente:** v1.2.1
**Estado general:** Cerrada funcionalmente / roadmap activo
**Siguiente etapa activa:** v1.2.2 — Stability & Polish

> Cada versión debe cubrir una necesidad académica concreta y, además,
> incorporar una mejora visible del producto.

---

## v1.2.1 — Semantic Update

**Estado:** Aplicada

Cierre formal de la Unidad 1 con análisis semántico integrado al lexer y
parser heredados de Lenguajes y Autómatas I.

### Función estrella

Diagnósticos completos y navegación inteligente entre resumen, VLSM y errores.

### Incluido

- Análisis léxico.
- Análisis sintáctico.
- Análisis semántico.
- Diagnósticos y advertencias.
- Recuperación parcial ante bloques con errores.
- Seis idiomas.
- Ejemplos traducibles.
- Configuración avanzada.
- Editor ampliado.
- Modos de ventana.
- IA local opcional.
- Árboles adaptativos.
- Exportación PNG HD, SVG y PDF.

---

## v1.2.2 — Stability & Polish

**Estado:** En desarrollo

Versión de estabilización posterior a la revisión docente; no introduce una
unidad nueva.

### Función estrella

Centro de estabilidad y mantenimiento.

### Objetivos

- Sistema de logs.
- Ventana Acerca de.
- Información de versión.
- Restaurar valores predeterminados.
- Exportar/importar preferencias.
- Reporte sencillo de errores inesperados.

---

## v1.3.0 — Intermediate Code Update

**Estado:** Siguiente

Unidad 2: generación de código intermedio, tripletas, cuádruplos y Código P
adaptados al DSL de redes.

### Función estrella

Visor de transformación DSL → representación intermedia.

### Objetivos

- Código normalizado.
- Tripletas.
- Cuádruplos.
- Código P.
- Copiar y exportar resultados.
- Resaltado de la instrucción fuente asociada a cada operación intermedia.

---

## v1.3.1 — Language Lab

**Estado:** Pendiente

Complementar contenidos de notación infija, prefija y postfija sin alterar
artificialmente el DSL principal.

### Función estrella

Laboratorio independiente de expresiones.

### Objetivos

- Conversión infija/prefija/postfija.
- Árbol de expresión.
- Ejemplos automáticos.
- Generación de ejercicios.
- Copia rápida de resultados.

---

## v1.4.0 — Optimizer Update

**Estado:** Pendiente

Unidad 3: optimización local, global y de mirilla sobre la representación
intermedia.

### Función estrella

Comparador visual antes/después.

### Objetivos

- Códigos OPT.
- Conteo de instrucciones.
- Temporales eliminados.
- Porcentaje de reducción.
- Explicación de cada optimización aplicada.

---

## v1.4.1 — Performance Update

**Estado:** Pendiente

Consolidar la Unidad 3 y hacer observables sus costos.

### Función estrella

Perfilador del compilador por fases.

### Objetivos

- Tiempo de lexer.
- Tiempo de parser.
- Tiempo de semántico.
- Tiempo de IR.
- Tiempo de optimizador.
- Activar/desactivar optimizaciones individuales.
- Comparar compilación con y sin optimización.

---

## v2.0.0 — Compiler Update

**Estado:** Pendiente

Unidad 4: generación de código objeto o ensamblador a partir de la IR
optimizada.

### Función estrella

Mapa IR → ensamblador.

### Objetivos

- Resaltado cruzado IR / instrucciones.
- Mapa de registros.
- Administración de memoria.
- Exportación `.asm`.
- Compilación o simulación si el entorno definido por la maestra lo permite.

---

## v2.1.0 — Workspace Update

**Estado:** Pendiente

Evolución del producto posterior al compilador completo.

### Función estrella

Sistema de proyectos TecNet Finder.

### Objetivos

- Nuevo/Abrir proyecto.
- Recientes.
- Sesiones guardadas.
- Código, resultados y preferencias por proyecto.
- Historial básico de compilaciones.

---

## v2.2.0 — Learning Update

**Estado:** Pendiente

Modo educativo integral para visualizar todo el proceso de compilación.

### Función estrella

Modo aprendizaje paso a paso.

### Flujo

`Lexer → Parser → Semántico → IR → Optimización → Código objeto`

### Objetivos

- Explicación de entrada, transformación y salida en cada fase.
- Proyecto de demostración reproducible.

---

## v3.0.0 — Language Evolution

**Estado:** Visión

Evolución futura del DSL después de terminar la materia.

### Función estrella

Nueva sintaxis orientada a redes y subredes.

### Objetivos

- Bloques `NETWORK` / `SUBNET`.
- Nuevas construcciones semánticas.
- Gramática ampliada.
- AST renovado.
- Compatibilidad/migración con el DSL anterior.

---

## Regla de avance

**Unidad terminada → revisión de la maestra → release estable → siguiente unidad.**

## Prioridades

- No añadir funciones grandes a v1.2.1.
- Usar v1.2.2 para estabilidad y mantenimiento si la revisión genera correcciones.
- Desde v1.3.0, cada versión debe tener una función estrella visible.
- Mantener separadas las herramientas educativas del DSL principal.
- No definir todavía la arquitectura objetivo de v2.0.0.
- Mantener v3.0.0 como evolución posterior al semestre.
