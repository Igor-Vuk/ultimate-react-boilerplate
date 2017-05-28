# Changelog #

## v1.0.3 ##

* configured **react-hot-reload** and **browsersync** in development
* by running `start-dev` script we are we are running the app in development environment which triggers `webpack-dev-middleware` and `webpack-hot-middleware`. Using proxy option in `Browsersync` we are hosting our own node server on localport:3002 where we have react-hot-reload and Bowsersync working together.
* using proxy option on Browsersync we are also hosting our own node server on localport:3004 that we can use for mobile and external device development. Here we have auto reload instead of hot reload.
* added `cross-env` and `yarn-or-npm` to scripts in package.json for better compatibility in running and setting environments across different systems with yarn or npm.
* **Note** during hot reload we will be getting warning message in console *[react-router] You cannot change Router routes; it will be ignored*. This is expected behaviour caused by React-router-3 but everything works as it should. The warning will go away after updating to React-router-4.

## v1.0.2 ##

* update `test` script
* fix the bug with `build-server` script after adding `babel-plugin-webpack-alias`

## v1.0.1 ##

* added alias for all components inside webpack
* added and configured `babel-plugin-webpack-alias` package that allows us to use imports of webpack alias for our unit testing
* update jsdom and jsdom-global

## v1.0.0 ##

First release
