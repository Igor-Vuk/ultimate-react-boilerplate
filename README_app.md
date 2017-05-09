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

* `yarn add --dev bootstrapv4.0.0-alpha.6 css-loader style-loader sass-loader node-sass tether script-loader jquery`.

### tether ###

* Tether is a small JS library that helps us position our elements side-by-side when needed. It is needed for Bootstrap 4 to work.

## Bootstrap 4 + CSS Modules ##

* To use CSS Modules together with Bootstrap inside webpack.config we make two loaders.
* `/\.local\.(css|scss)$/` all the local .scss/css files that contain `.local` in name will run css modules
* `/^((?!\.local).)+\.(css|scss)$/` all the global .css/scss files that don't contain `.local` in name will(example: Bootstrap) will not run css modules.
* Inside `app.js` we import `bootstrap` before routes(that contain .local.scss).
* We set gloabl styles(Bootstrap classes) with `className` and local styles with `styleName`
* Inside local styles we can use Bootstrap Mixins
* To override some of bootstrap elements with high specificity we nested everything inside class `container` to increase specificity of our classes. If needed we can increase it even more using further nesting or by chaining selector by itself ex. .btn.btn {...}

**Example 1:**

* index.jsx

```jsx
import './inedx.local.scss'
<button type='button' className='btn btn-default' styleName='custom-btn'>Default</button>
```

* index.local.scss

```scss
.custom-btn {
  @include button-variant(white, purple, black);
}
```

**Example 2:**

* index.jsx

```jsx
<form>
  <div className='form-group' styleName='formula'>
    <label htmlFor='exampleInputEmail1'>Email address</label>
    <input type='email' className='form-control' styleName='formControl' id='exampleInputEmail1' aria-describedby='emailHelp' placeholder='Enter email' />
    ...
```

* index.local.scss

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
* Here we can also set styles that will be imported to every local css/scss stylesheet

### JSX syntax ###

* Instead of: class -> className, tabindex -> tabIndex, for -> htmlFor

### PureComponent ###

* Let’s say we have a parent component that rerenders every minute. This parent component also has two child components. To the first child component the parent passes its state as a prop. To the second child it passes some static text as a prop. By rerendering parent component all child components rerender also. This is great for the first child but the second child is getting the same text every time. That means it rerenders unnecessary every minute. We can solve this by using PureComponent. By using PureComponent second child will shallow check this.props and next.props to determine if it should update. If the props are the same it won’t rerender. This works good for shallow comparison (numbers, strings…) but changes inside objects and arrays won't be picked up automatically.

### extract-text-webpack-plugin ###

* Use <https://www.youtube.com/watch?v=-j_90uQw-Iw>
* Used to extract styles to a separate file. We extract styles for global css(bootstrap) and local css (css modules) in their separate files and then link to them inside index.ejs(html)
* since we are extracting styles we don't need `style-loader` anymore. We use it as a `fallback` in case styles couldn't be extracted successfully.

## Tests ##

### tape ###

* testing framework

### babel-test-runner ###

* A test runner for tape that utilizes babel in order to run test suites that include ESNext/Harmony features.

### faucet or tap-summary ###

* make test output pretty

### react-addon-test-utils ###

* it is deprecated as of version 15.5.0 of react-dom/react-router
* to use it we just do `import ReactTestUtils from 'react-dom/test-utils'`

* instead of test-utils we can use `enzyme`

### enzyme ###

* If we are using React >=15.5, in addition to enzyme, we will have to ensure that we also have the following npm modules installed if they were not already: `yarn add --dev react-test-renderer react-dom`

* SHALLOW and MOUNT => <https://github.com/airbnb/enzyme/issues/465#issuecomment-227697726>

* `SHALLOW`
* for Shallow rendering is useful to constrain yourself to testing a component as a unit, and to ensure that your tests aren't indirectly asserting on behavior of child components.

* `MOUNT`
* for Full DOM rendering is ideal for use cases where you have components that may interact with DOM apis, or may require the full lifecycle in order to fully test the component (ie, componentDidMount etc.)
* `shallow rendering` does not maintain an internal instance and therefore it can't hold a `ref`

### jsdom and jsdom-gloabl ###

* the goal of jsdom is to emulate enough of a subset of a web browser to be useful for testing and scraping real-world web applications.
* Because jsdom is implemented in JavaScript, we can have a DOM-like API to work with without needing a browser. That means that we don’t have to capture a browser in order test, a la Karma. That means that we can run our tests in environments without browsers, like in Node or in continuous integration environments.

By not using real browsers, we’re also essentially saying that we believe the problems in our client JavaScript will not be browser-dependent (again, because we’re not capturing real browsers).

* `jsdom-global` will inject document, window and other DOM API into your Node.js environment. Useful for running, in Node.js, tests that are made for browsers. We place it on top of other import calls `import 'jsdom-global/register'`
* to use `enzyme mount rendering` we need to use jsdom

### react-test-renderer ###

* This renderer was previously located in `react-addons-test-utils`.
* This package provides two React renderers that can be used for testing purposes: Test renderer, Shallow renderer

### sinon ###

* Test spies, stubs and mocks for JavaScript.
* assertion api <http://legacy.sinonjs.org/docs/>

### ignore-styles ###

* The problem is that JavaScript can’t handle CSS syntax. So when we are running unit tests, the test will try to import the CSS file without Webpack which will result error. To test we ignore all styles.
* To find DOM Node we can use className instead of styleName
* If you'd like to substitute your own custom handler to do fancy things, pass it as a second argument:

``` javascript
import register from 'ignore-styles'
register(undefined, () => ({styleName: 'fake_class_name'}))
```

* The first argument to register is the list of extensions to handle. Leaving it undefined, as above, uses the default list. The handler function receives two arguments, `module` and `filename`, directly from Node. Why is this useful? One example is when using something like `react-css-modules`. You need the style imports to actually return something so that you can test the components, or the wrapper component will throw an error. Use this to provide test class names.

### babel-plugin-webpack-alias ###

* This plugin is simply going to take the aliases defined in our webpack config and replace require paths. It is especially useful when you rely on webpack aliases to keep require paths nicer but you can't use webpack in a context, for example for unit testing.
* In tests we can not resolve imports of alias defined in webpack. To fix this inside our `.babelrc` file we setup `babel-plugin-webpack-alias` when env = development. If nothing is defined env will default to development.

## Test Coverage ##

### babel-istanbul ###

* babel-istanbul runs exactly like istanbul
* this package handles coverage for babel generated code by reconciling babel's output and its source map
