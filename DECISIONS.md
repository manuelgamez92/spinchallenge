# DECISIONES DE ARQUITECTURA

## Por Qué Elegí Esta Arquitectura

Tomé la decisión de estructurar este proyecto de una forma muy cercana a cómo se organizan hoy los proyectos modernos con Next.js, porque buscaba algo mas lineal, fácil de seguir y sencillo de escalar sin perder claridad.

La idea principal fue que el proyecto se entendiera rápido desde cualquier punto de entrada. Por eso dejé las rutas dentro de `app/`, enfocando esa carpeta únicamente en el enrutamiento y en las páginas. Así, cada ruta se comporta como una capa de navegación y presentación, sin mezclar ahí reglas de negocio más complejas.

Después de eso, decidí llevar la lógica de negocio a `src/features/` porque quería que cada dominio tuviera su propio espacio y fuera fácil de entender por separado. Esa organización ayuda a que cada feature concentre sus componentes, hooks, store, servicios y validaciones en un mismo lugar, lo que hace más sencillo ubicar el comportamiento de cada parte de la app sin tener que recorrer todo el proyecto.

No opté por una arquitectura hexagonal completa porque este proyecto está pensado como una aplicación frontend simulada, con flujos mockeados y un foco muy claro en la experiencia de usuario, la organización por features y la validación del recorrido principal.

En este contexto, una arquitectura hexagonal estricta habría agregado más abstracción y más capas de las que realmente necesitaba el proyecto para demostrar valor. Preferí una estructura más directa, más fácil de leer y más alineada con cómo se construyen hoy muchos proyectos modernos con Next.js.


## Por Qué No Usé Server Actions En Este Caso

En este proyecto no utilicé Server Actions porque la aplicación no se conecta a servicios reales. Todo el flujo está mockeado para simular login, transferencias y persistencia local, así que el foco principal fue la experiencia de la app, la organización del código y la validación del flujo.

En ese contexto, Server Actions no aportaban un beneficio real inmediato, porque no había una capa de servidor verdadera que aprovechar. Sin embargo, sí considero que en una app bancaria real son una muy buena opción, especialmente para operaciones sensibles como transferencias, autenticación y cambios de datos críticos, porque ayudan a concentrar la lógica importante en el servidor y a reforzar la seguridad y la consistencia del flujo.

## Separación De Responsabilidades

Decidí separar la lógica de negocio dentro de `src/features/` porque eso hace que cada dominio tenga su propio espacio, su propio contexto y sus propias reglas.

La intención fue que cada feature se entienda por sí sola, con sus componentes, hooks, store y servicios cercanos entre sí. Esa cercanía ayuda mucho a mantener el código más legible, porque cuando alguien entra a una feature no tiene que saltar por todo el proyecto para entender cómo funciona.

## Por Qué Usé React Query

En una app como esta, hay datos que se consultan, se cachean, se revalidan y se sincronizan entre pantallas, y React Query me da justo esas capacidades sin tener que construir toda esa infraestructura manualmente.

Además de cachear datos, React Query me permite manejar refetch, invalidaciones, estados de carga y reintentos de forma más limpia. Eso hace que el flujo sea más robusto y que el componente se concentre en presentar la información, mientras la capa de datos resuelve lo que ocurre con el estado del servidor simulado.

## Por Qué Usé Redux Toolkit

También elegí Redux Toolkit para manejar el estado global porque simplifica bastante la forma de escribir Redux y reduce mucho el código repetitivo que normalmente se tenía con Redux tradicional.

Me permitió definir slices, actions y reducers de manera más clara y con una estructura más directa.

## Por Qué Usé Zod

Elegí Zod porque me permite definir validaciones de una manera declarativa, tipada y fácil de mantener. Eso ayuda mucho a que los formularios tengan reglas claras desde el inicio y a que el tipo de datos que recibe cada feature esté más controlado.

## Por Qué Organicé Los Estilos Así

También decidí ordenar los estilos con una base de variables y tokens reutilizables porque quería que la parte visual fuera consistente y fácil de extender.

No opté por `styled-components` porque, en este tipo de proyecto, implicaba sumar una capa extra de complejidad para la hidratación y el renderizado en servidor sin que realmente me aportara un beneficio proporcional. Como la app ya está bien resuelta con variables CSS, utilidades de Tailwind y estilos por feature, me resultó más simple y más consistente mantener esa estrategia.

## Por Qué Usé Tailwind

También decidí usar Tailwind porque es un framework de diseño ya integrado, popular y muy eficiente para este tipo de proyecto. Me permitió moverme rápido sin tener que construir un sistema visual desde cero y me ayudó a concentrarme más en la lógica, las reglas de negocio y la estructura general de la aplicación.

## Por Qué Agregué Smoke Tests

Quise incluir smoke tests porque en una app de este tipo hay flujos que no deberían romperse nunca: login, carga del dashboard y transferencia.



