# apka-rajdowa-rest-backend

Aplickacja stworzona do wspierania organizacji studenckich przy organizowaniu różnego rodzaju wydarzeń.

## Instrukcja deploymentu
###Wymagania :
* `node.js` od wersji 11.0
* `npm` lub `yarn`
* `połącznie internetowe`

###Instalacja :
* projekt należy pobrać z repozytorium github
* następie w głównym folderze projektu, trzeba zainstalować potrzebne depenedencje `npm install` lub `yarn`
* kolejnym krokiem jest zbudowanie projektu do produkcyjnej wersji `npm run compile` lub `yarn compile`
* na koniec wystarczy uruchomić komędą : `npm run start` / `yarn start`

###Configuracja:
Konfiguracji projektu dokonuje się przez zmianę parametrów w pliku `.env`

###Testy
Aby odpalić wszystkie testy wystarczy użyć komendy : `npm run test`
* testy jednostkowe : `npm run test-unit`
* testy integracyjne : `npm run test-api`
## Get Started

Get started developing...

```shell
# install deps
npm install

# run in development mode
npm run dev

# run tests
npm run test
```

## Install Dependencies

Install all package dependencies (one time operation)

```shell
npm install
```

## Run It
#### Run in *development* mode:
Runs the application is development mode. Should not be used in production

```shell
npm run dev
```

or debug it

```shell
npm run dev:debug
```

#### Run in *production* mode:

Compiles the application and starts it in production production mode.

```shell
npm run compile
npm start
```

## Test It

Run the Mocha unit tests

```shell
npm test
```

or debug them

```shell
npm run test:debug
```

## Try It
* Open you're browser to [http://localhost:3000](http://localhost:3000)
* Invoke the `/examples` endpoint 
  ```shell
  curl http://localhost:3000/api/v1/examples
  ```


## Debug It

#### Debug the server:

```
npm run dev:debug
```

#### Debug Tests

```
npm run test:debug
```

#### Debug with VSCode

Add these [contents](https://github.com/cdimascio/generator-express-no-stress/blob/next/assets/.vscode/launch.json) to your `.vscode/launch.json` file
## Lint It

View airbnb linter output

```
npm run lint
```

Fix all airbnb linter errors

```
npm run lint
```




   
