![Branches](./badges/coverage-branches.svg)
![Functions](./badges/coverage-functions.svg)
![Lines](./badges/coverage-lines.svg)
![Statements](./badges/coverage-statements.svg)
![Jest coverage](./badges/coverage-jest%20coverage.svg)
[![CLA assistant](https://cla-assistant.io/readme/badge/Renovus-Tech/solarec-react)](https://cla-assistant.io/Renovus-Tech/solarec-react)

# Solarec

React Web Application for Solarec.

## Table of Contents

* [Versions](#versions)
* [Requirements](#requirements)
* [Template](#template)
* [Package dependencies](#package-dependencies)
* [Quick Start](#quick-start)
* [Installation](#installation)
* [Basic usage](#basic-usage)
* [Project structure](#project-structure)
* [Data filters](#data-filters)
* [Environment variables](#environment-variables)

## Versions


## Requirements

node.js 21.1.0
npm 10.2.4


## Template

CoreUI Free React Admin Template

CoreUI is meant to be the UX game changer. Pure & transparent code is devoid of redundant components, so the app is light enough to offer ultimate user experience. This means mobile devices also, where the navigation is just as easy and intuitive as on a desktop or laptop. The CoreUI Layout API lets you customize your project for almost any device – be it Mobile, Web or WebApp – CoreUI covers them all!

For transparency into our release cycle and in striving to maintain backward compatibility, CoreUI Free Admin Template is maintained under [the Semantic Versioning guidelines](http://semver.org/).

See [the Releases section of our project](https://github.com/coreui/coreui-free-react-admin-template/releases) for changelogs for each release version.


## Package dependencies

### Production

@coreui/chartjs: ^3.1.2 -> https://github.com/coreui/coreui-chartjs/releases/tag/v3.1.2  
@coreui/coreui: ^4.2.6 -> https://github.com/coreui/coreui/releases/tag/v4.2.6  
@coreui/icons: ^3.0.1 -> https://github.com/coreui/coreui-icons/releases/tag/v3.0.1  
@coreui/icons-react: ^2.1.0 -> https://github.com/coreui/coreui-icons-react  
@coreui/react: ^4.9.0-rc.0 -> https://github.com/coreui/coreui-react/releases/tag/v4.9.0-rc.0  
@coreui/react-chartjs: ^2.1.3 -> https://github.com/coreui/coreui-react-chartjs/releases/tag/v2.1.3  
@coreui/utils: ^2.0.2 -> https://github.com/coreui/coreui-utils/releases/tag/v2.0.2  
@kurkle/color: ^0.3.2 -> https://github.com/kurkle/color/releases/tag/v0.3.2  
chart.js: ^4.4.0 -> https://github.com/chartjs/Chart.js/releases/tag/v4.4.0  
classnames: ^2.3.2 -> https://github.com/JedWatson/classnames/releases/tag/v2.3.2  
core-js: ^3.31.0 -> https://github.com/zloirock/core-js/releases/tag/v3.31.0  
google-map-react: ^2.2.1 -> https://github.com/google-map-react/google-map-react/releases/tag/2.2  
i18next: ^23.11.5 -> https://github.com/i18next/i18next/releases/tag/v23.11.5  
js-cookie: ^3.0.5 -> https://github.com/js-cookie/js-cookie/releases/tag/v3.0.5  
moment: ^2.30.1 -> https://github.com/moment/moment/releases/tag/2.30.1  
prop-types: ^15.8.1 -> https://github.com/facebook/prop-types/releases/tag/v15.8.1  
react: ^18.2.0 -> https://github.com/facebook/react/releases/tag/v18.2.0  
react-app-polyfill: ^3.0.0 -> https://github.com/facebook/create-react-app/releases/tag/v3.0.0  
react-chartjs-2: ^5.2.0 -> https://github.com/reactchartjs/react-chartjs-2/releases/tag/v5.2.0  
react-datepicker: ^4.24.0 -> https://github.com/Hacker0x01/react-datepicker/releases/tag/v4.24.0  
react-dom: ^18.2.0 -> https://github.com/facebook/react/releases/tag/v18.2.0  
react-flags-select: ^2.2.3 -> https://github.com/ekwonye-richard/react-flags-select/releases/tag/v2.2.3  
react-i18next: ^13.5.0 -> https://github.com/i18next/react-i18next/releases/tag/v13.5.0  
react-redux: ^8.1.1 -> https://github.com/reduxjs/react-redux/releases/tag/v8.1.1  
react-router-dom: ^6.14.0 -> https://github.com/remix-run/react-router/releases/tag/react-router%406.14.0  
react-scripts: 5.0.1 -> https://github.com/facebook/create-react-app/releases/tag/v5.0.1
redux: 4.2.1 -> https://github.com/reduxjs/redux/releases/tag/v4.2.1  
sass: ^1.63.6 -> https://github.com/sass/dart-sass/releases/tag/1.63.6  
simplebar-react: ^2.4.3 -> https://github.com/Grsmto/simplebar/releases/tag/v2.4.3  
web-vitals: ^3.3.2 -> https://github.com/GoogleChrome/web-vitals/releases/tag/v3.3.2

### Development

@babel/preset-env: ^7.23.5 -> https://github.com/babel/babel/releases/tag/v7.23.5  
@babel/preset-react: ^7.23.3 -> https://github.com/babel/babel/releases/tag/v7.23.3  
@testing-library/jest-dom: ^5.16.5 -> https://github.com/testing-library/jest-dom/releases/tag/v5.16.5  
@testing-library/react: ^14.0.0 -> https://github.com/testing-library/react-testing-library/releases/tag/v14.0.0  
ajv: ^8.12.0 -> https://github.com/ajv-validator/ajv/releases/tag/v8.12.0  
ajv-keywords: ^5.1.0 -> https://github.com/ajv-validator/ajv-keywords/releases/tag/v5.1.0  
eslint-config-prettier: ^8.8.0 -> https://github.com/prettier/eslint-config-prettier/releases/tag/v8.8.0  
eslint-plugin-prettier: ^4.2.1 -> https://github.com/prettier/eslint-plugin-prettier/releases/tag/v4.2.1  
jest-canvas-mock: ^2.5.2 -> https://github.com/hustcc/jest-canvas-mock  
jest-cli: ^29.7.0 -> https://github.com/jestjs/jest/releases/tag/v29.7.0  
jest-fetch-mock: ^3.0.3 -> https://github.com/jefflau/jest-fetch-mock/releases/tag/3.0.0  
license-compatibility-checker: ^0.3.5 -> https://github.com/HansHammel/license-compatibility-checker  
prettier: 2.8.8 -> https://github.com/prettier/prettier/releases/tag/2.8.8

### Overrides

postcss: 8.4.38 -> https://github.com/postcss/postcss/releases/tag/8.4.38  
nth-check: 2.1.1 -> https://github.com/fb55/nth-check/releases/tag/v2.1.1  
got: 14.4.1 -> https://github.com/sindresorhus/got/releases/tag/v14.4.1  
react-error-overlay: 6.0.9 -> https://github.com/facebook/create-react-app


## Quick Start

- [Download the latest release](https://github.com/Renovus-Tech/solarec-react/archive/refs/heads/main.zip)
- Clone the repo: `git clone https://github.com/Renovus-Tech/solarec-react.git`

### Installation

``` bash
$ npm install
```

or

``` bash
$ yarn install
```

### Basic usage

``` bash
# dev server with hot reload at http://localhost:3000
$ npm start 
```

or 

``` bash
# dev server with hot reload at http://localhost:3000
$ yarn start
```

Navigate to [http://localhost:3000](http://localhost:3000). The app will automatically reload if you change any of the source files.

#### Build

Run `build` to build the project. The build artifacts will be stored in the `build/` directory.

```bash
# build for production with minification
$ npm run build
```

or

```bash
# build for production with minification
$ yarn build
```


## Project Structure
```
solarec-react
├── public/              # static files
│   ├── favicon.ico
│   ├── index.html       # html template
│   └── manifest.json
│
├── src/                 # project root
│   ├── assets/          # images, icons, etc.
│   ├── components/      # common components - header, footer, sidebar, etc.
│   ├── layouts/         # layout containers
│   ├── helpers/     
│   ├── scss/            # scss styles
│   ├── locales/         # translations files
│   ├── views/           # application views
│   │   └── pages/        # application pages
│   │      ├── user/      # user pages
│   │      ├── client/    # client pages
│   │      ├── login/     # login and password reset pages
│   │      ├── enery/     # energy pages
│   │      ├── revenue/   # revenue pages
│   │      ├── page404/   
│   │      └── page500/   
│   ├── _nav.js          # sidebar navigation config
│   ├── App.js
│   ├── index.js
│   ├── routes.js        # routes config
│   └── store.js         # template state example 
│
├── .env                 # environment variables
├── licenses.json        # packages licenses information
├── package.json         # npm dependencies and run scripts
└── README.md            # Documentation
```


## Data filters
Attributes used across the app to filter de information needed.

### Period: 
- cy -> Current year
- cm -> Current month
- cw -> Current week
- y -> Yesterday
- 30d -> 30 days
- 12w -> 12 weeks
- 12m -> 12 month
- cy-{{x}} -> Current year minus {{x}}
- x -> Custom range
	- from
	- to

### Group by:
- hour
- day
- week
- month
- year


## Environment variables

| Variable             | Description                                                                                                                                                                                                                          | Default    |
|----------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------|
| PORT                 | Port in which you want the app to start                                                                                                                                                                                              | 3000       |
| CHOKIDAR_USEPOLLING  | When set to true, the watcher runs in polling mode, as necessary inside a VM. Use this option if npm start isn't detecting changes.                                                                                                  | true       |
| SKIP_PREFLIGHT_CHECK | Manually installing incompatible versions is known to cause hard-to-debug issues. If prefer to ignore this check, set SKIP_PREFLIGHT_CHECK to true. That will permanently disable this message but you might encounter other issues. | true       |
| REACT_APP_NAME       | Name of the app                                                                                                                                                                                                                      | SOLAREC    |
| REACT_APP_API_URL    | Endpoint for backend calls                                                                                                                                                                                                           | /api3/rest |
| GOOGLE_MAPS_API_KEY  | Your Google maps API Key. This is needed to make the map work.                                                                                                                                                                       | ''         |