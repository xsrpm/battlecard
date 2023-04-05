# Frontend

## Requerimientos para ejecución del proyecto
- Node.js v16.13.1 o más
- Paquetes de npm declarados en sección dependencies en package.json

## Requerimientos para el desarrollo/actualización del proyecto
- Visual Studio Code (editor recomendado)
- Extensiones recomendadas para visual studio code en .vscode/extensions.json
- Node.js v16.13.1 o más
- Paquetes de npm declarados en sección devDependencies en package.json

## Caracteristicas
- Este proyecto hace uso de [WebSockets](https://developer.mozilla.org/es/docs/Web/API/WebSockets_API) para comunicarse en tiempo real con su backend.
- El frontend está dockerizado.


## Referencia

* Tests de e2e
    - https://playwright.dev/docs/intro
    - https://playwright.dev/docs/running-tests
    - https://playwright.dev/docs/getting-started-vscode
* Testing de componentes y hooks
    - https://react-hooks-testing-library.com/
    - https://github.com/testing-library/react-hooks-testing-library
    - https://www.npmjs.com/package/@testing-library/react
    - https://testing-library.com/docs/react-testing-library/intro


## Apéndice
* Agregar eslint en proyecto con Typescript y  React

        npx eslint --init
    
    - responser las preguntas para un proyecto de typescript
    - agregar en el .eslintrc.cjs la referencia al tsconfig.json
    - agregar algunas reglas al eslintrc.cjs que queramos omitir del linter

* agregar extension de eslint a vscode

    - configurar que los archivos de javascript/typescript se guarden on save para la extension de eslint