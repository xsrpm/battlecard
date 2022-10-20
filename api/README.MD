
# Apuntes de desarrollo

## Jest
https://jestjs.io/docs/

Issue con reporte html de coverage y warnings en consola al correr 'npm run test:coverage' con version de "jest": "^22.4.3", y su solucion es añadir como dev dependency: "handlebars": "~4.5.3"
https://github.com/facebook/jest/issues/9396
https://github.com/facebook/jest/issues/9388

para test especifico de clase

    npm run test tests/carta.test.js   

https://jestjs.io/docs/getting-started#using-typescript
https://jestjs.io/docs/getting-started#via-ts-jest
https://github.com/kulshekhar/ts-jest
https://jestjs.io/docs/api

## Nodemon

Inicia y autodespliega servidor luego de cambios en el codigo fuente.

    npm run nodemon --exec "npm start"


para instalaciones globales:

    nodemon --exec "npm start"
 
 Validating & Structuring JSON over WebSockets - JavaScript Tutorial
 https://www.youtube.com/watch?v=mmZmtOUIBsg