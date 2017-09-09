![picture alt](https://i.imgur.com/tk1CZaK.png "List")

# Easy way to start your new project #

## I made a custom React boilerplate for everyone to use. I will keep it updated by adding and combining different technologies per your requests. It is meant to be used for a quick setup when starting a new project and for easier development and production workflow ##

## Inital Setup Features ##

* **React-hot-reload on client side and live-reload on server side in combination with Browsersync for synchronous testing on different external devices. No more server restarts.**
* **Seperate webpack bundle for client and server side with different optimization for production and development environment.**
* **Isomorphic server-side rendering (local styles, gloabl styles and assets are extracted from webpack bundle for faster page load on first visit).**
* **Code splitting and long-term caching of assets without contacting the server until hash/chunkhas(every client file contains it: bundle, vendor, images, css) changes. If there is a change, browser requests only the changed file. This greatly improves the speed of site and flexibility of deployment.**
* **Support for gzip and brotli. Running webpack we get 3 files (ex. bundle.js, bundle.js.gz and bundle.js.br). We are using static compression here so there is no more dynamic compression on the fly while user waits for response. If browser supports brotli it will be used, if not, then gzip. If neither is supported original file will be used.**
* **Ready for Heroku deployment with option to use or not to use Nginx as a web server**
* **Tree Shaking**
* Responsive and mobile ready
* Bootstrap 4 (easy import of Bootstrap variables and mixins to every scss file)
* CSS Modules
* PostCSS, CSS Variables and autoprefixer
* SCSS(SASS)
* ES6/ES7
* Babel
* Flow.js (use for static typing)
* Favicon preparation setup
* Test environment and test ready (tape, enzyme, sinon)
* Test coverage (istanbul)
* Express
* EJS Template
* ESLint, standard.js
* yarn.lock
* .editorconfig
* and many more...

For more informations about how some features work you can look into my notes, maybe there is something that can help [README_app.md](README_app.md)

## Requirements ##

* Node
* Yarn or NPM
* GitBash

## Run the app ##

* run `yarn` or `yarn install / npm install` to install all npm paskages.

* If you run the app in **production** mode, settings from **app.json** and **webpack.config.prod.js** / **webpack.config.server.prod.js** will be used
* If you run the app in **development** mode, settings from **app.local.json** and **webpack.config.js** / **webpack.config.server.js** will be used
* Open **localhost:3001(production)**, **localhost:3003(development)**

### Development environment ###

* Using Browsersync proxy option we run the app on port **localhost:3003**(ui: 3002) for Browser development. By doing this we can use Browsersync options on port **3002** and it also enables us to use live reload on server side. To not use and bypass Browsersync visit **localhost:3001**.

* For synchronous testing on different devices use Browsersync on port **locahost:3005**(ui:3004). Use address that Browsersync gives you in terminal. To use this feature uncomment Browsersync option inside webpack.config.js. Since this is meant for development and testing on external devices only live reload will work on every change.

* **Note:** during hot-reload in development environment we will be getting warning message in console *[react-router] You cannot change Router routes; it will be ignored*. This is expected behaviour caused by React-router-3 but everything works as it should and you can ignore it. The warning will go away after updating to React-router-4.

### CLEANING BUILD FOLDERS ###

* `yarn run clean` will delete client bundle `dist` and server bundle `build` folder.

### IN PRODUCTION ###

* `yarn run build-client` will bundle client for production using `webpack` and make a `dist` folder => (run it before build-server)
* `yarn run build-server`  will bundle server for production using `webpack` and make a `build` folder
* `yarn run start` starts the app in production environment on port **3001**

* `yarn run start-run` runs above three scripts and starts the app in production environment on port **3001**

### IN DEVELOPMENT ###

* `yarn run webpack-server` will start the server in development environment.
* `yarn run webpack` will start the client in development environment. (For use with Browsersync visit port **3003**)

### FOR HEROKU ###

* `yarn run build-server-heroku` will bundle server for Heroku using **webpack.config.heroku.server.prod.js**
* `yarn run start-heroku` will run `build-client` and `build-server-heroku` script for Heroku deployment

### HELPER SCRIPTS ###

* `yarn run flow` will run flow check
* `yarn run test` will run all the tests in `test` environment
* `yarn run coverage` will run test coverage

### Heroku Deployment ###

#### With Nginx ####

* To deploy app to Heroku together with Nginx be sure to add env variable `NGINX_PORT=true` to Heroku `heroku config:set NGINX_PORT=true`
* for now `heroku-16` stack is not supported so we must use `cedar-14`. To change it we do `heroku stack:set cedar-14 -a <app_name>`
* Drag the `Procfile` file from `herokuProcfile` folder to the root directory.
* Follow this instructions for deployment <https://www.nodebeats.com/documentation/configuring-nginx-on-heroku>
* Instead of using suggested nginx buildpack in the instruction file use this one <https://github.com/kuwabarahiroshi/heroku-buildpack-nginx>
* `yarn run start-heroku` to build for Heroku

#### Without Nginx ####

* To deploy to Heroku without Nginx just run `yarn run start-heroku` and `git push heroku master` after creating the app.

### Testing Gzip ###

* We can test to see if gzip is working as it should with cURL
* Open CMD() with Admin privileges and go to cURL bin folder (C:/Program Files/cURL/bin). Use `curl -I -H "Accept-Encoding: gzip,deflate,sdch,br" <siteName>`

### Import Bootrasp _variables, _mixins or any other file to every scss file ###

* Inside webpack.config.js under `sass-resources-loader` uncomment to use. You can add and remove any file you want. To use it in production add it to webpack.config.prod.js

### Live reload on the server ###

* We use `browsersync` to reload the page after updating it on the server side. If by any chance page reloads before changes were saved increase the time of `stabilityTreshold` inside `webpack.config.server.js`

### Favicon icons ###

* The best way to implement favicons is to visit **<https://realfavicongenerator.net/>**.
* Choose the favicons that you want, choose the root destination, download the file, unzip it and put **all the content** to the root of **src/client/styles/favicon directory**
* Copy the generated html code to the head of **src/server/views/index.ejs** file
* Done.

#### Note ####

* If the favicon doesn't show clear the browser cache and history.
* If you want to change icon at the latter date pay attention at Version/Refresh option in realfavicongenerator.
* Use compression option for smaller size.

### Images ###

* Add all your images to **src/client/styles/img** directory.
* Before adding them you can use a tool like `<https://tinypng.com/>` and `Photoshop Save for Web` to optimize and compress your images.

### Scripts examples for other systems (replace them if needed) ###

* `"clean": "rmdir /s \"src/dist\" && rmdir /s \"src/build\""`
* `"test": "cross-env NODE_ENV=test babel-tape-runner -r 'test/setup.js' 'test/**/*.test.js' | node_modules/.bin/tap-spec"`
* `"coverage": "cross-env NODE_ENV=test babel-node node_modules/babel-istanbul/lib/cli.js cover node_modules/babel-tape-runner/bin/babel-tape-runner -- 'test/setup.js' -- 'test/**/*.test.js'"`
