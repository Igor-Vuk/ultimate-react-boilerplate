# Ultimate React Boilerplate #

## Easy way to start a project ##

### I made a custom React boilerplate for everyone to use. I will keep it updated by adding and combining different technologies per your requests. It is meant to be used for a quick setup when starting a new project and easier development workflow ###

For more informations about how some features work, refer to [README_app.md](README_app.md)

## Inital Setup Features that you get by default ##

* ES6/ES7 ready
* React-hot-reload and Browsersync combination
* Babel
* Bootstrap 4 & Mixins
* CSS Modules
* Flow.js
* SASS
* PostCSS, CSS Variables and autoprefixer
* Test ready (tape, enzyme, sinon)
* Test coverage (istanbul)
* Tree Shaking
* webpack.config (development & production mode)
* Express
* EJS
* ESLint
* standard.js
* yarn.lock
* .editorconfig

## Requirements ##

* Node
* Yarn or NPM
* GitBash

## Run the app ##

* run `yarn` or `yarn install` to install all npm paskages

* Make **app.local.json** inside the **conf** folder
* Copy the settings from **app.json** and change them to your preference
* If you run the app in **production** mode, settings from **app.json** and **webpack.config.prod.babel.js** will be used
* If you run the app in **development** mode, settings from **app.local.json** and **webpack.config.babel.js** will be used

* Using proxy option on Browsersync we run the app on port **3002**(ui: 3001) for Browser development using react-hot-loader and **3004**(ui: 3003) for mobile(external devices) development using live reload.

### BEFORE PRODUCTION ###

* `yarn run clean` will delete client bundle `dist` and server babel bundle `build`

### IN PRODUCTION ###

* `yarn run build-server`  will bundle server for production using `babel` and make a `build` folder
* `yarn run build-client` will bundle client for production using `webpack` and make a `dist` folder
* `yarn run start` starts the server index.js from inside build folder.

* `yarn run start-run` will start the app in production environment on port **3001**

### IN DEVELOPMENT ###

* `yarn run start-dev` will start the app in development environment on port **3002** (server using `nodemon` on port **3000** but using proxy option of Browsersync on port **3002**)

### HELPER SCRIPTS ###

* `yarn run flow` will run flow check
* `yarn run standard` will run standard.js check
* `yarn run test` will run all the tests
* `yarn run coverage` will run test coverage

### Scripts examples for other systems (replace them if needed) ###

* `"clean": "rmdir /s \"src/dist\" && rmdir /s \"src/build\""`
* `"test": "cross-env NODE_ENV=test babel-tape-runner -r 'test/setup.js' 'test/**/*.test.js' | node_modules/.bin/tap-spec"`
* `"coverage": "cross-env NODE_ENV=test babel-node node_modules/babel-istanbul/lib/cli.js cover node_modules/babel-tape-runner/bin/babel-tape-runner -- 'test/setup.js' -- 'test/**/*.test.js'"`
