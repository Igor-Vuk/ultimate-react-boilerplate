# Ultimate React Boilerplate #

## Easy way to start a project ##

### I made a custom React boilerplate for everyone to use. I will keep it updated by adding and combining different technologies per your requests. It is meant to be used for a quick setup when starting a new project and easier development workflow ###

For more informations about how some features work, refer to [README_app.md](README_app.md)

## Inital Setup Features that you get by default ##

* ES6/ES7 ready
* Babel
* Bootstrap 4 & Mixins
* CSS Modules
* Flow.js
* PostCSS, CSS Variables and autoprefixer
* Test ready (tape, enzyme, sinon)
* Test coverage (istanbul)
* Tree Shaking
* webpack.config (development & production mode)
* Browsersync
* Express
* EJS
* SASS
* ESLint
* standard.js
* yarn.lock
* .editorconfig

## Help needed with ##

* Combining browsersynic with react-hot-loader and webpack-dev-middleware/webpack-hot-middleware

## Run the app ##

* run `yarn` or `yarn install` to install all npm paskages

* Make **app.local.json** inside the **conf** folder
* Copy the settings from **app.json** and change them to your preference
* If you run the app in **production** mode, settings from **app.json** will be used
* If you run the app in **development** mode, settings from **app.local.json** will be used

### BEFORE PRODUCTION ###

* `yarn run clean-client` will delete client bundle `build`
* `yarn run clean-server` will delete server bundle `dist`

### IN PRODUCTION ###

* `yarn run build-server`  will bundle server for production using `babel` and make a `build` folder
* `yarn run build-client` will bundle client for production using `webpack` and make a `dist` folder
* `yarn run start` set NODE_ENV = production and start the app on port **3001** (build server and client first)

### IN DEVELOPMENT ###

* `yarn run start-dev` will set NODE_ENV = development and start the server using `nodemon` on port **3000**
* `yarn run webpack` will start the webpack in `watch mode`, make a bundle directory `dist`, start the `browsersync` and automatic reloading and run the app on port **3002**

### HELPER SCRIPTS ###

* `yarn run flow` will run flow check
* `yarn run standard` will run standard.js check
* `yarn run test` will run all the tests
* `yarn run coverage` will run test coverage
