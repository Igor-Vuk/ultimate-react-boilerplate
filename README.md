# Ultimate React Boilerplate #

## Easy way to start a project ##

### I made a custom React boilerplate for everyone to use. I will keep it updated by adding and combining different technologies per your requests. It is meant to be used for a quick setup when starting a new project and easier development workflow ###

For more informations about how some features work you can look into my notes, maybe there is something that can help [README_app.md](README_app.md)

## Inital Setup Features that you get by default ##

* **React-hot-reload on client side and live-reload on server side in combination with Browsersync for synchronous testing on different devices. No more server restarts.**
* **Seperate webpack bundle for client and server side with different optimization for production and development environment.**
* **Isomorphic server-side rendering (local styles, gloabl styles and assets are extracted from webpack bundle for faster page load on first visit).**
* ES6/ES7
* Babel
* Bootstrap 4 (easy import of Bootstrap variables and mixins to every scss file)
* CSS Modules
* PostCSS, CSS Variables and autoprefixer
* Flow.js (use for static typing)
* SCSS(SASS)
* Test ready (tape, enzyme, sinon)
* Test coverage (istanbul)
* Tree Shaking
* Express
* EJS Template
* ESLint
* standard.js
* yarn.lock
* .editorconfig
* and many more...

## Requirements ##

* Node
* Yarn or NPM
* GitBash

## Run the app ##

* run `yarn` or `yarn install / npm install` to install all npm paskages.

* If you run the app in **production** mode, settings from **app.json** and **webpack.config.prod.js** / **webpack.config.server.prod.js** will be used
* If you run the app in **development** mode, settings from **app.local.json** and **webpack.config.js** / **webpack.config.server.js** will be used
* Open **localhost:3003**

### Development environment ###

* Using Browsersync proxy option we run the app on port **localhost:3003**(ui: 3002) for Browser development. By doing this we can use Browsersync options on port **3002** and it also enables us to use live reload on server side. To not use and bypass Browsersync visit **localhost:3001**.

* For synchronous testing on different devices use Browsersync on port **locahost:3005**(ui:3004). Use address that Browsersync gives you in terminal. To use this feature uncomment Browsersync option inside webpack.config.js. Since this is meant for development and testing on external devices only live reload will work on every change.

* **Note:**during hot-reload in development environment we will be getting warning message in console *[react-router] You cannot change Router routes; it will be ignored*. This is expected behaviour caused by React-router-3 but everything works as it should and you can ignore it. The warning will go away after updating to React-router-4.

### CLEANING BUILD FOLDERS ###

* `yarn run clean` will delete client bundle `dist` and server bundle `build` folder.

### IN PRODUCTION ###

* `yarn run build-server`  will bundle server for production using `webpack` and make a `build` folder
* `yarn run build-client` will bundle client for production using `webpack` and make a `dist` folder
* `yarn run start` starts the app in production environment on port **3001**

* `yarn run start-run` runs above three scripts and starts the app in production environment on port **3001**

### IN DEVELOPMENT ###

* `yarn run webpack-server` will start the server in development environment.
* `yarn run webpack` will start the client in development environment. (For use with Browsersync visit port **3003**)*)

### HELPER SCRIPTS ###

* `yarn run flow` will run flow check
* `yarn run standard` will run standard.js check
* `yarn run test` will run all the tests in `test` environment
* `yarn run coverage` will run test coverage

### Import Bootrasp _variables, _mixins or any other file to every scss file ###

* Inside webpack.config.js under `sass-resources-loader` uncomment to use. You can add and remove any file you want. To use it in production add it to webpack.config.prod.js

### Scripts examples for other systems (replace them if needed) ###

* `"clean": "rmdir /s \"src/dist\" && rmdir /s \"src/build\""`
* `"test": "cross-env NODE_ENV=test babel-tape-runner -r 'test/setup.js' 'test/**/*.test.js' | node_modules/.bin/tap-spec"`
* `"coverage": "cross-env NODE_ENV=test babel-node node_modules/babel-istanbul/lib/cli.js cover node_modules/babel-tape-runner/bin/babel-tape-runner -- 'test/setup.js' -- 'test/**/*.test.js'"`
