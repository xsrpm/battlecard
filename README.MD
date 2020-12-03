
# Jest

Issue con reporte html de coverage y warnings en consola al correr 'npm run test:coverage' con version de "jest": "^22.4.3", y su solucion es añadir como dev dependency: "handlebars": "~4.5.3"
https://github.com/facebook/jest/issues/9396
https://github.com/facebook/jest/issues/9388

# Nodemon

Inicia y autodespliega servidor luego de cambios en el codigo fuente.

    npm run nodemon --exec "npm start"


para instalaciones globales:

    nodemon --exec "npm start"