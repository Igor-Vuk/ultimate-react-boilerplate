# CODE HELP #

## Flow shortcuts ##

`flow server` does a full check of your code from scratch. Once it is done, it watches for changes, and incrementally `checks` your code as it changes.

`flow start` basically runs `flow server` in the background.

`flow check` is basically the same thing as `flow server`, except as soon as it's done with the initial full check, it prints the errors and exits.

`flow status` talks to the running `flow server` and asks for the current errors. If no server is running, it calls `flow start` to start a new server.

`flow` (with no explicit command) is an alias for `flow status`

**.flowconfig** =>
the location of the file is significant. Flow treats the directory that contains the .flowconfig as the project root. By default Flow includes all the source code under the project root. The paths in the [include] section are relative to the project root

---

## Babel ##

**.babelrc** =>
specifying the *presets* in the webpack.config will only affect webpack, everything else that uses babel (e.g. `babel-node`, `babel-register`, etc.) will not care about your webpack.config and therefore doesn't see them.

The other way around does work. So you can remove the webpack.config presets options if you have a .babelrc, because `babel-loader` uses babel under the hood, which obviously respects the .babelrc.

**babel-register** =>
it's used to compile server code since it is not included in webpack. It uses .babelrc for presets. Since it compiles code in runtime it's not effective for production. It can't be in the same file we want to compile so in the first file we use plain JS syntax to require babel-register and then all subsequent files required by node with the extensions .es6, .es, .jsx and .js will be transformed by Babel.

We must include the *polyfill* separately when using features that require it, like generators.

**babel-runtime** =>
in order to implement details of ECMAScript specs, Babel will use "helper" methods in order to keep the generated code clean.
Since these helpers can get pretty long, and they get added to the top of every file you can move them into a single "runtime" which gets required.

Start by installing `babel-plugin-transform-runtime`(devDependecie) and `babel-runtime`(dependencie)

**babel-node** =>
it is a convenience binary and is not intended for production use. Similar to the node binary, it can either be used to run a script if supplied on the command line, or be used as a REPL if no arguments are supplied. It automatically requires *babel-polyfill to polyfill ES2015 features and methods and sets up *babel-register to compile (i.e., transform) other modules as they’re required. We get it by installing babel-cli.

---

## Webpack ##

### webpack.config.babel.js ###

* we attach babel to use ES6 inside config. We must have babel-register installed.

### tree-shaking ###

* <http://jakewiesler.com/tree-shaking-es6-modules-in-webpack-2/>
* tree-shaking is the ability to only include code in your bundle that is being used. Any code that goes unused doesn't make it into bundle.
* we must set `['es2015', { 'modules': false }]` but we can't do it inside `.babelrc` because it would have effect on babel-node, babel-register... we only want it to have effect on webpack bundle so we have to place it inside webpack.config

### modules ###

* webpack 1 wasn’t able to parse ES2015 modules, so Babel would convert them into CommonJS. Webpack 2 can parse ES2015 modules, and is able to eliminate dead code based on which modules are used, so it’s recommended that you tell Babel not to convert modules into CommonJS.

### browsersync ###

<https://www.youtube.com/watch?v=hB2YBV7w43s>

* `browser-sync-webpack-plugin` package makes a connection between browsersync and webpack
* we also need `browser-sync`
* inside `files` property we tell browsersync what files to watch for
* `proxy` property makes sure that `index.js` is processed by node server and then we hand it of to `browsersync` plugin to watch for changes. It is equal to url that we would visit our site on after it is processed by node server. This is why we first run `yarn run start-dev` which starts node server and then `yarn run webpack` which starts `browsersync`

---

## View engine ##

`app.set('views', path.join(__dirname, 'views'))` we change the path for where to look for static file
`app.use(Express.static(path.join(__dirname, '../', 'dist')))` where to serve it from

## Loaders ##

### css-loader, style-loader, sass-loader, node-sass, script-loader ###

* The `css-loader` interprets imports and url() like requires. It doesn't actually do anything with the returned CSS.

* The `style-loader` takes CSS and actually inserts it into the page so that the styles are active on the page.

They perform different operations, but it's often useful to chain them together, like Unix pipes. For example, if you were using the Sass CSS preprocessor, you could use `sass-loader`

require("style-loader!css-loader!sass-loader!./file.scss")

* The `sass-loader` requires `node-sass` which allows us to natively compile .scss files to .css

When we put scripts in webpack.config entry there is a problem. This are regular scripts, they were not designed to work with webpack. `script-loader` will execute those scripts once in global context.

## postcss, postcss-loader ##

* `postcss postcss-loader postcss-cssnext`
* to use postcss we must make `postcss.config.js` file or configure it inside the webpack.config like this

``` javascript
new webpack.LoaderOptionsPlugin({
  options: {
    postcss () {
      return [
        require('postcss-cssnext')
      ]
    }
  }
})

```

`postcss-cssnext` supports all new css standards like variables. It also uses `autoprefixer` so we don't need to install it separately.

## Bootstrap 4 ##

* yarn add --dev bootstrap(v4) css-loader style-loader sass-loader node-sass tether script-loader jquery.

### tether ###

* Tether is a small JS library that helps us position our elements side-by-side when needed. It is needed for Bootstrap 4 to work.

## Bootstrap 4 + CSS Modules ##

* To use CSS Modules together with Bootstrap inside webpack.config we make two loaders.
* `/\.local\.(css|scss)$/` all the local .scss/css files that contain `.local` in name will run css modules
* `/^((?!\.local).)+\.(css|scss)$/` all the global .css/scss files that don't contain `.local` in name will(example: Bootstrap) will not run css modules.
* Inside `app.js` we import `bootstrap` before routes(that contain .local.scss).
* We set gloabl styles(Bootstrap classes) with `className` and local styles with `styleName`
* Inside local styles we can use Bootstrap Mixins

**Example 1:**

* feature/index.jsx

```jsx
import './inedx.local.scss'
<button type='button' className='btn btn-default' styleName='custom-btn'>Default</button>
```

* feature/index.local.scss

```scss
.custom-btn {
  @include button-variant(white, purple, black);
}
```

**Example 2:**

* feature/index.jsx

```jsx
<form>
  <div className='form-group' styleName='formula'>
    <label htmlFor='exampleInputEmail1'>Email address</label>
    <input type='email' className='form-control' styleName='formControl' id='exampleInputEmail1' aria-describedby='emailHelp' placeholder='Enter email' />
    ...
```

* feature/index.local.scss

```scss
.formula {
  @include input-size('.formControl', 70px, 12px, 12px, 32px, 5em, 0);
}

//To reference .formControl we have to make empty string
.formControl {
}
```

### CSS Modules ###

* To use CSS Modules we are using `babel-plugin-react-css-modules` npm package.
1. We are not forced to use the camelCase naming convention.
1. We do not need to refer to the styles object every time we use a CSS Module.
1. There is clear distinction between global CSS and CSS modules.

### Mixins ###

* We use `sass-resources-loader` to load bootstrap _variables and _mixins. It is designed for setting sass variables when used with CSS Modules. We can use them inside local .local.(css|scss) files

### JSX syntax ###

* Instead of: class -> className, tabindex -> tabIndex, for -> htmlFor

### extract-text-webpack-plugin ###

* Use <https://www.youtube.com/watch?v=-j_90uQw-Iw>
* Used to extract styles to a separate file. We extract styles for global css(bootstrap) and local css (css modules) in their separate files and then link to them inside index.ejs(html)
* since we are extracting styles we don't need `style-loader` anymore. We use it as a `fallback` in case styles couldn't be extracted successfully.
