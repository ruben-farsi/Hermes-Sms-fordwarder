# AGENTS.md — Reglas Globales para Hermes

## Model Routing (SIEMPRE activo)

Cuando una tarea involucre imágenes, screenshots o análisis visual:
1. Usar `delegate_task` con el modelo de visión: `openrouter/google/gemma-4-31b-it:free`
2. ESPERAR el resultado antes de continuar
3. Integrar el análisis visual en el resultado final

El usuario NUNCA debe especificar qué modelo usar. La selección es automática.

## Flujo de Reportes

NUNCA enviar un reporte incompleto o pendiente.
- Si hay análisis visual pendiente → esperar a que termine
- Integrar TODOS los resultados en UN solo reporte
- Enviar solo cuando está 100% completo

## Git Workflow

NUNCA hacer push a main.
- Siempre crear rama de desarrollo
- Hacer push a la rama
- Crear PR
- El usuario hace merge manual

## Polyglot Seniority & Environment Anti-Patterns (Master Rule)

Como desarrollador experto, tienes estrictamente prohibido programar en "piloto automático". Antes de escribir o sugerir código, es tu Paso Cero Obligatorio identificar activamente el runtime exacto (React Native, Node.js, Angular, Flutter, etc.). Tras identificarlo, DEBES enumerar explícitamente en tu bloque de pensamiento interno (thinking block) los 3 peores anti-patrones o limitaciones fatales de ese framework para blindar tu código.
- **React Native:** Reconocerás que NO existen módulos core de Node.js (prohibido usar `crypto`, `fs`, `path`) y usarás alternativas nativas o JS puro. Nunca usarás renders condicionales con strings vacíos (ej. `string && <View>`).
- **Angular:** Prevendrás fugas de memoria severas desuscribiéndote siempre de RxJS Observables (ej. `takeUntil`, `AsyncPipe`) y evitarás mutaciones directas de estado.
- **Flutter/Dart:** Nunca llamarás a `setState` durante la fase de build y verificarás siempre el flag `mounted` tras operaciones asíncronas.
- **React JS:** Vigilarás los staleness closures en `useEffect` y prevendrás renderizados infinitos por referencias inestables en arrays de dependencias.
## Regla Anti-Pereza en Refactorización UI (Master Rule)
- **Prohibido el trabajo a medias:** Cuando se te ordene aplicar un nuevo diseño, paleta de colores o refactorización visual, tienes ESTRICTAMENTE PROHIBIDO asumir que terminaste tras modificar los archivos principales.
- **Rastreo Obligatorio:** Antes de declarar la tarea terminada, DEBES hacer una búsqueda exhaustiva (`grep` o similar) en toda la carpeta `src/presentation/components` y `src/presentation/screens` para garantizar que TODOS los componentes aislados (Tarjetas, Botones, Modales, Inputs) han sido migrados a la nueva estética. Si dejas un componente con el diseño viejo, será considerado un fracaso crítico.
