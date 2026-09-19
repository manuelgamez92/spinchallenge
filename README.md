# Spin Code Challenge

Aplicación de wallet/banca simulada construida con Next.js, React y TypeScript como code challenge para Spin.

## Resumen

La app simula un entorno bancario con:

- Login mockeado con sesión persistida localmente
- Dashboard con saldo y movimientos
- Transferencias simuladas con estados de éxito y error
- Historial y detalle de transacciones
- Pruebas unitarias, smoke tests y E2E

## Requisitos

- Node.js 20 o superior recomendado
- npm
- Un navegador Chromium para Playwright si vas a ejecutar E2E o smoke tests

## Cómo Ejecutar El Proyecto

1. Instala dependencias:

```bash
npm install
```

2. Inicia el entorno de desarrollo:

```bash
npm run dev
```

3. Abre la app en el navegador. En el entorno local normalmente corre en:

```bash
http://localhost:3000
```

## Credenciales De Acceso

Para entrar a la aplicación, usa cualquiera de estas credenciales mock:

- `test.user@spin.com` ó
- 526622985745

## Scripts Disponibles

- `npm run dev`: inicia Next.js en modo desarrollo
- `npm run build`: genera la compilación de producción
- `npm run start`: ejecuta la versión compilada
- `npm run lint`: valida el código con ESLint
- `npm test`: ejecuta las pruebas unitarias con Vitest
- `npm run test:e2e`: ejecuta toda la suite Playwright
- `npm run test:smoke`: ejecuta los smoke tests críticos del flujo de login y transferencias

## Librerías Usadas

### Core

- `next`: framework principal
- `react` y `react-dom`: UI y rendering
- `typescript`: tipado estático

### Estado, datos y formularios

- `@reduxjs/toolkit` y `react-redux`: estado global local para sesión y flujo de transferencias
- `@tanstack/react-query`: cache, lecturas y sincronización de estado del servidor simulado
- `react-hook-form`: formularios
- `@hookform/resolvers`: integración de formularios con Zod
- `zod`: validación de esquemas

### UI y estilos

- `tailwindcss`: estilos utilitarios

### Pruebas

- `vitest`: pruebas unitarias
- `@testing-library/react`: pruebas de componentes
- `@testing-library/user-event`: interacción de usuario
- `@testing-library/jest-dom`: matchers para DOM
- `playwright`: smoke tests y E2E

## Puertas De Calidad

Este proyecto incluye una validación de estilo producción:

- Pruebas unitarias para reglas de dominio y servicios mockeados de wallet
- Cobertura end-to-end con Playwright para el recorrido principal de la wallet
- Smoke tests dedicados para los caminos de usuario más críticos

## Limitaciones Conocidas

Este proyecto está diseñado como simulación, así que tiene limitaciones intencionales:

- No usa un backend real ni una base de datos persistente externa
- Las transferencias, sesiones y movimientos se simulan en el cliente con almacenamiento local
- El login no autentica contra un proveedor real
- No hay conciliación real de dinero ni integración con sistemas bancarios externos
- La persistencia depende de `localStorage`, así que el estado puede reiniciarse al limpiar el navegador
- Los escenarios de transferencia pueden ser aleatorios si la bandera de simulación está activa
- El flujo está pensado para demostrar arquitectura y UX, no para producción bancaria real

## Feature Flags

Simulación de escenarios de transferencia:

- `NEXT_PUBLIC_ENABLE_TRANSFER_SCENARIOS` por defecto es `true`, así que las confirmaciones de transferencia se comportan de forma aleatoria desde el inicio
- Si necesitas una demo determinista, establece `NEXT_PUBLIC_ENABLE_TRANSFER_SCENARIOS=false`
- Para demos de QA, también puedes sobrescribir la bandera en `localStorage` con `spin.wallet.feature-flags`


