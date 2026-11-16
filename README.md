# Ejecución paralela de pruebas

Ejemplo con el test runner integrado de Node.js. Tres archivos de prueba ejecutan
operaciones asíncronas de 1,2 segundos.

## Requisitos

- Node.js 20.10 o posterior.

## Ejecutar en paralelo

~~~bash
npm run test:parallel
~~~

El valor '--test-concurrency=3' permite ejecutar hasta tres archivos de prueba al
mismo tiempo.

## Comparar con la ejecución secuencial

~~~bash
npm run test:sequential
npm run evidence
~~~

El último comando ejecuta ambos modos, mide sus duraciones y genera el archivo de
evidencia en '../docs/evidencia-ejecucion.md'.

## Interfaz gráfica

Ejecuta `npm start` y abre `http://127.0.0.1:4175`. El botón
**Comparar ejecuciones** corre las mismas pruebas en ambos modos y muestra la
duración, los intervalos de cada prueba y la salida original de Node.js.
