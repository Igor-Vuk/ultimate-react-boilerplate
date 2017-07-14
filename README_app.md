# CODE HELP #

## Flow shortcuts ##

`flow server` does a full check of your code from scratch. Once it is done, it watches for changes, and incrementally `checks` your code as it changes.

`flow start` basically runs `flow server` in the background.

`flow check` is basically the same thing as `flow server`, except as soon as it's done with the initial full check, it prints the errors and exits.

`flow status` talks to the running `flow server` and asks for the current errors. If no server is running, it calls `flow start` to start a new server.

`flow` (with no explicit command) is an alias for `flow status`

**.flowconfig** => the location of the file is significant. Flow treats the directory that contains the .flowconfig as the project root. By default Flow includes all the source code under the project root. The paths in the [include] section are relative to the project root

*[libs]* =>

* module.name_mapper (regex -> string) => Specify a regular expression to match against module names, and a replacement pattern

* <https://flow.org/en/docs/libdefs/>
* Most real JavaScript programs depend on third-party code and not just code immediately under the control of the project. That means a project using Flow may need to reference outside code that either doesn’t have type information or doesn’t have accurate and/or precise type information. In order to handle this, Flow supports the concept of a “library definition” (AKA “libdef”). A libdef is a special file that informs Flow about the type signature of some specific third-party module or package of modules that your application uses.
* The [libs] section ells Flow to include the specified library definitions when type checking your code.

*[options]* =>

* <https://flow.org/en/docs/config/options/#toc-module-name-mapper-regex-string>

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
* we must set `['es2015', { 'modules': false }]` but we can't do it inside `.babelrc` because it would have effect on babel-node, babel-register... we only want it to have effect on webpack bundle so we have to place it inside webpack.config. Putting it inside .babelrc under 'env' does not work.

### modules ###

* webpack 1 wasn’t able to parse ES2015 modules, so Babel would convert them into CommonJS. Webpack 2 can parse ES2015 modules, and is able to eliminate dead code based on which modules are used, so it’s recommended that you tell Babel not to convert modules into CommonJS. Node does not support `import`. The package `babel-preset-es2015` contains another package named `babel-plugin-transform-es2015-modules-commonjs` that turns all of our ES6 modules into CommonJS modules. When we say modules: false it doesn't do that anymore so we have to use require instead or webpack 2.

### extract-text-webpack-plugin ###

* Use <https://www.youtube.com/watch?v=-j_90uQw-Iw>
* Used to extract styles to a separate file. We extract styles for global css(bootstrap) and local css (css modules) in their separate files and then link to them inside index.ejs(html)
* since we are extracting styles we don't need `style-loader` anymore. We use it as a `fallback` in case styles couldn't be extracted successfully.
* has `contenthash` that is specific to this bundle.

### public path ###

* <http://kurtle.io/2015/11/29/react-redux-webpack-babel.html>
* when using HMR with webpack-dev-middleware we are referencig publicPath from webpack in configurations
* webpack will compile the bundled file and serve it up at the publicPath for us. So, let’s say we set up your express server to serve our app at port 3000. We will be testing our app at `http://localhost:3000`. If we have publicPath set to be '/', it will place bundle.js into `http://localhost:3000/`. Thus, my index.html will load bundle.js like so:

``` html
<script src="bundle.js"></script>
```

Let’s say we had set publicPath to be '/public'. Then, webpack would serve up bundle.js at `http://localhost:3000/public` and our index.html would have to load bundle.js like so:

``` html
<script src="public/bundle.js"></script>
```

### write-file-webpack-plugin ###

* if we are using `webpack-dev-server` everything is written and run from meory. To write it on disc and see the results we can enable this plugin inside webpack.config.js.

## Chunks, code splitting and browser caching ##

### Common chunks plugin ###

* <http://www.bambielli.com/til/2017-04-30-webpack-pt-4/>
* Creates a separate file (known as a chunk), consisting of common modules shared between multiple entry points. If add array under `name` and put a second name we will get one more file that contains `webpack bootstrap`. For now it is inside vendor.js at the beginning of file.

```javascript
new webpack.optimize.CommonsChunkPlugin({
  name: 'vendor',
  minChunks: Infinity
})
```

* `minChunks: Infinity` => prevents webpack from moving any additional modules besides the modules referenced in the vendor entry point into the vendor bundle.

```javascript
entry: {
  ...
  vendor: [
    'react',
    'react-dom',
    'react-router'
  ]
}
```

### webpack-md5-hash ###

* Plugin to replace a standard webpack chunkhash with md5, to ensure hashes are generated based on the file contents.
* We use it for long term browser caching. When we update for example bundle.js only chunkhash/hash grom bundle.js should be updated so when user visits our site, that is the only file that he must download again. All other files, css, vendor... are used from cache. Without this plugin when we change bundle.js, chunkhas/hash from all other files will change also and user will have to download again after visiting our site.
* `hash` is calculated for a build, `chunkhash` is calculated for chunk (entry file), `contenthash` is special hash generated in ExtractTextPlugin and is calculated by extracted content, not by whole chunk content

### webpack-assets-manifest ###

* This Webpack plugin will generate a JSON file that matches the original filename with the hashed version. It will extract bundle, vendor, css file and images to separate folder with the hash / chunkhash provided in webpack config. This way we can reference that file in our `.ejs / html` file for up to date name of assets and files.
* In our example we have two files that end with .css that are extracted from `bundle` entry. localStyles and gloablStyles are generated under same key bundle.css/.map so they overwrite each other. If we want manifest plugin to extract both we must change the name of one of them.

``` javascript
 new WebpackAssetsManifest({
  customize: (key, value) => {
    if (value.toLowerCase().endsWith('.local.css')) {
      return {
        key: 'localcss.css',
        value: value
      }
    }
  }
})
```

### Cache-Control ###

* <https://jakearchibald.com/2016/caching-best-practices/> , <https://devcenter.heroku.com/articles/increasing-application-performance-with-http-cache-headers>
* By using hash/chunkhash/contenthash in our file names we can better utilize browser caching. Browser is caching `hash filename` for example bundle.2720b1af860316h676ac and it will use that same file from cache on any other visit until the name(hash) changes.
* When we change something in our bundle, generate new build folder with webpack and deploy, only the hash from bundle.js will change, all others (vendor, css...) will remain the same. This way browser knows it needs to pull the new copy from server.
* This way we can use long term caching and not be afraid of browser showing old content after new deployment.

```javascript
app.use(Express.static(path.join(__dirname, '../', 'dist'), {maxAge: '1y'}))    // 1 year is maximum
```

* Important thing is not to use long term caching for server because browser needs to contact server to see if hash has changed. We use all files inside `index.ejs`

```javascript
app.use((req: Object, res: Object, next: () => void): void => {
  res.set('Cache-Control', 'no-cache')
  return next()
})
```

* no-cache doesn't mean "don't cache", it means it must check (or "revalidate" as it calls it) with the server before using the cached resource.
* In our case that is the only http request that browser sends if nothing is changed.

### DefinePlugin ###

* The DefinePlugin allows you to create global constants which can be configured at compile time. This can be useful for allowing different behavior between development builds and release builds.

### Uglify ###

* using webpack -p we are using uglify in the back.

### browsersync ###

<https://www.youtube.com/watch?v=hB2YBV7w43s>

* `browser-sync-webpack-plugin` package makes a connection between browsersync and webpack
* BrowserSync will start only when you run Webpack in watch mode
* we also need `browser-sync`
* inside `files` property we tell browsersync what files to watch for
* `proxy` property makes sure that `index.js` is procesed by node server and then we hand it of to `browsersync` plugin to watch for changes. It is equal to url that we would visit our site on after it is processed by node server.
* If we are using `codeSync: false` we are telling not to send any file-change events to browser. We use this to stop refreshing the browser and letting hot reload do its thing and inject/swap changes.

### copy-webpack-plugin ###

* we use this plugin to copy the files to bundle folder. We copy favicon icons and and index.ejs(html) file. This files are are just copied to bundle folder, that is way we don't need loader for example .ejs file(production).

### webpack-bundle-analyzer ###

* We use it to analyze our bundle

---

## Webpack - Server bundle ##

### Special __dirname and __filename global variable ###

* A number of Node.js features are replaced or transformed by webpack, and `__dirname` is one of them. If you add a toplevel node attribute to the server webpack configuration, you can control what happens with `__dirname`. We can do console.log(__dirname) to check where it is pointing to in any case.

* If we `target: node` instead of browser/web:
* `__dirname: false` disables webpack processing of __dirname. If you run the bundle in node.js it falls back to the __dirname of node.js (which makes sense for `target: node`). It sets __dirname to the regular Node.js functionality. In our case, it would resolve to /src/build/
* `__dirname: true` let webpack replace __dirname with the path relative to you context. Makes sense for target: web if you need the path. It sets _dirname to what it was in the source file. In our case the root.
* Not set or undefined: __dirname is set to /

### Back-end server Hot Module Replacement (HMR) ###

* Using webpack-dev-middleware and webpack-hot-middleware is good if there is no much action on server side because every change on server will trigger rebundling of client bundle.
* That's why we make different bundle for client and server side. To use Hot Module Replacement on server side it will be different than on client side. That is because with the browser we don't have to manage an existing state when the code is replaced. With the Node.js server, the request handler for the HTTP server needs to be removed and a new one instantiated and added with the new code.

``` javascript
const server = http.createServer(app)
let currentApp = app

server.listen(3000)

if (module.hot) {
  module.hot.accept('./index', () => {
    server.removeListener('request', currentApp)
    currentApp = app
    server.on('request', app)
  })
}
```

### Server webpack configuration ###

* We need entry point that injects code that listens for module changes. We can do this by polling at a certain interval(1000ms in this case) to see if there are any changes. An alternative is to use signal method, which sends a signal to a listening socket in the running server.

```javascript
webpack/hot/poll?1000
```

We also need to add `HotModuleReplacementPlugin` and `webpack-node-externals` npm package.

**webpack-node-externals** => When bundling with Webpack for the backend - we usually don't want to bundle its node_modules dependencies. This library creates an externals function that ignores node_modules when bundling in Webpack but for webpack/hot/poll?1000 to work it needs to be part of bundle. That's why we use `whitelist`

**start-server-webpack-plugin** => it will automatically start our server once the webpack build is complete.

**NamedModulesPlugin** => Currently the HMR shows updated modules with numbers in the console. This provides little feedback what was updated.

**html-webpack-plugin** => This is a webpack plugin that simplifies creation of HTML files to serve your webpack bundles. If we are using templates we need template loader like `ejs-loader` or we can make our own templates. Since it is not good for server-side-rendering and dynamic content we use it only in development to hot reload server side code.

**webpack-cleanup-plugin** => While using HMR, on every change Webpack creates update files inside build folder. This can get pretty big so we use this plugin to clean the unnecessary files and leaves the needed one.

**NoEmitOnErrorsPlugin** Use the NoEmitOnErrorsPlugin to skip the emitting phase whenever there are errors while compiling. This ensures that no assets are emitted that include errors. The emitted flag in the stats is false for all assets.

---

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

### url-loader and file-loader ###

* by using `url-loader` we can inline assets. It emits our images as base64 strings within our JavaScript bundle. The process decreases the number of requests needed while growing the bundle size. We can set a limit. Images bigger then limit will go to `file-loader` automatically (we need to install both).
* To not emit images again in server bundle we use `emitFile=false`. We can also specify name of the file and path in bundle.

## Express ##

### View engine ###

`app.set('views', path.join(__dirname, 'views'))`
=> we change the path for where to look for static file
`pp.set("view engine","ejs")`
=> we tell express which view engine is going to be used
`app.use(Express.static(path.join(__dirname, '../', 'dist')))`
By default Express will not serve static files. It needs to be told explicitly where the static files are so that it can render them. What this does is tells Express that a directory called dist contains static content and files should be served directly when requested. The __dirname is the directory where the current file is located.

### res.render and res.sendFile ###

The render method works when we have a templating engine in use such as handlebars.js, jade or ejs.

A templating engine is a node module assosiated with express (which some people refer to as an express plugin) which parses the template file and genereated the HTML output.

The sendfile method simply sends the file to the client.

If we were to use HTML file, there is nothing particularly to be parsed by the templating engine. So, the output of render is same as that of sendfile (i.e., the HTML written in the file). Hence, both produce the same result.

## scripts inside package.json ##

* We use `cross-env` to set and use environment variables across platforms (for example on Windows we set NODE_ENV with 'set' while on Mac it's different). By using cross-env we don't have to worry about that.
* We also use `yarn-or-npm` so we can execute scripts with *yarn* or *npm*

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

### Sass-resources-loader ###

* We use `sass-resources-loader` for setting sass variables when used with CSS Modules.
* Using the `sass-resources-loader` inside `webpack.config` we point to the files that we wanna import to every .local.scss file.
* We should not include anything that will be actually rendered in CSS, because it will be added to every imported SASS file (for example `body {color: green}` ).
* We should not use `@import` inside resources files but add them to array inside webpack.config (order is important).

### JSX syntax ###

* Instead of: class -> className, tabindex -> tabIndex, for -> htmlFor
* In JSX, lower-case tag names are considered to be HTML tags. However, lower-case tag names with a dot (property accessor) aren't.

```jsx
<component /> compiles to React.createElement('component') (html tag)
<Component /> compiles to React.createElement(Component)
<obj.component /> compiles to React.createElement(obj.component)
```

### PureComponent ###

* Let’s say we have a parent component that rerenders every minute. This parent component also has two child components. To the first child component the parent passes its state as a prop. To the second child it passes some static text as a prop. By rerendering parent component all child components rerender also. This is great for the first child but the second child is getting the same text every time. That means it rerenders unnecessary every minute. We can solve this by using PureComponent. By using PureComponent second child will shallow check this.props and next.props to determine if it should update. If the props are the same it won’t rerender. This works good for shallow comparison (numbers, strings…) but changes inside objects and arrays won't be picked up automatically.

## Tests ##

### tape ###

* testing framework
* if we run with script we can use -r or --require to preload modules

### babel-test-runner ###

* A test runner for tape that utilizes babel in order to run test suites that include ESNext/Harmony features.

### faucet or tap-summary or tap-spec ###

* make test output pretty

### react-addon-test-utils ###

* it is deprecated as of version 15.5.0 of react-dom/react-router
* to use it we just do `import ReactTestUtils from 'react-dom/test-utils'`

* instead of test-utils we can use `enzyme`

### enzyme ###

* If we are using React >=15.5, in addition to enzyme, we will have to ensure that we also have the following npm modules installed if they were not already: `yarn add --dev react-test-renderer react-dom`

* SHALLOW and MOUNT => <https://github.com/airbnb/enzyme/issues/465#issuecomment-227697726>

* `SHALLOW`
* for Shallow rendering is useful to constrain yourself to testing a component as a unit, and to ensure that your tests aren't indirectly asserting on behaviour of child components.

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

### sinon-test ###

* When we use spies, stubs or mocks, wrap your test function in sinon.test. This allows us to use Sinon's automatic clean-up functionality. Sinon will take care of removing all the spies and stubs from the wrapped functions for you. It does this by using sinon.sandbox internally.
* we use a function and not a arrow function (ES2015) when wrapping the test with sinon.test as it needs to be able to access the `this` pointer used inside of the function.
* sinon-test instances need to be configured with a sinon instance

`sinon.test = sinonTest.configureTest(sinon)`

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
* In tests we cannot resolve imports of alias defined in webpack. To fix this inside our `.babelrc` file we setup `babel-plugin-webpack-alias` when env = development. If nothing is defined env will default to development.

## Test Coverage ##

### babel-istanbul ###

* babel-istanbul runs exactly like istanbul
* this package handles coverage for babel generated code by reconciling babel's output and its source map

## Hot Reload with middlewares ##

### webpack-dev-middleware ###

* An expressjs middleware, where requests are passed on.
* Will automatically start to watch the source code (webpack -w) for changes and recompile the bundle.
* It's a simple wrapper middleware for webpack. It serves the files emitted from webpack over a connect server.
* Webpack provides an express middleware that we can plug into our app to serve up our fronted assets via webpack-dev-server rather than express.static. Webpack-dev-middleware serves our bundle.js from memory.

### webpack-hot-middleware ###

* An expressjs middleware, where requests are passed on.
* It automatically subscribes to the bundle recompilation events (start, done), and notify the frontend(browser) that something has changed and that it needs to update itself.

* Now we have `webpack-dev-middleware` that will watch the source code for changes and recompile the bundle and `webpack-hot-middleware` that will be notified when a new bundle is compiled so he can notify the browser that it needs to update.

*But how will the browser handle the update?*

We need to add some code client side to handle the update.

``` javascript
entry: [
  'webpack-hot-middleware/client',
  path.join(__dirname, 'src', 'App.js'),
]
```

* Configuration options can be passed to the client by adding querystring parameters to the path in the webpack config
* **reload** => we use it instead of `webpack/hot/dev-server` and `webpack/hot/only-dev-server`.  If we set reload=true it will auto reload the page when webpack gets stucked.
* **noInfo** => Set to true to disable informational console logging.

* It contains the code that will be used in the browser to handle the SSE communications from the server (the update notifications).

* We also need to add a specific webpack internal plugin `HotModuleReplacementPlugin` to expose the generic webpack HMR API in the browser, that will be used by this code.
* Technically, the code from `webpack-hot-middleware/client` will call `module.hot.apply(...)` provided by the `HotModuleReplacementPlugin`.

**ultiple entry points in webpack** => If you want to use multiple entry points in your webpack config you need to include the hot middleware client in each entry point. This ensures that each entry point file knows how to handle hot updates

```javascript
// webpack.config.js
entry: {
    vendor: ['jquery', 'webpack-hot-middleware/client'],
    index: ['./src/index', 'webpack-hot-middleware/client']
}
```

* With `HotModuleReplacementPlugin` we can use `NoEmitOnErrorsPlugin`

### react-hot-loader 3 ###

* Automatically disabled in production
* If we are using Babel and ES6, we should remove the react-hot-loader from any loaders in our Webpack config, and add react-hot-loader/babel to the plugins section of our .babelrc

```javascript
// .babelrc
{
  "presets": ["es2015-loose", "stage-0", "react"],
  "plugins": ["react-hot-loader/babel"]
}
```

* `'react-hot-loader/patch'` should be placed at the top of the entry section in our Webpack config. However, if we are using polyfills we should put them before patch:
* `<AppContainer/>` is a component that handles module reloading, as well as error handling. When in production, AppContainer is automatically disabled, and simply returns its children. It should be added wherever we use ReactDOM.render

**Differences between Webpack HMR & React-Hot-Loader** => <https://github.com/facebookincubator/create-react-app/issues/1063>

## ESlint ##

* **devDependencies**:
* `eslint`
* `babel-eslint` => if we use flow and new experimental features
* `eslint-config-standard` => ESLint Shareable Config for JavaScript Standard Style:
* eslint-plugin-standard, eslint-plugin-promise, eslint-plugin-import, eslint-plugin-node
* `eslint-config-standard-react` => ESLint Shareable Config for React/JSX support in JavaScript Standard Style
* eslint-plugin-react + every plugin above.
* `eslint-plugin-flowtype` => if we use `plugin:flowtype/recommended` we can extend recomended rules. After that we can change and add our own rules. To work also put 'flowtype' in plugins.

## Gzip ##

* To make gzip files as a part uf webpack bundle process we use `compression-webpack-plugin` and optionally `brotli-webpack-plugin` to gzip beforehand static content.
* To use .gz files we must have both .js and .js.gz version of the file (ex. bundle.js and bundle.js.gz)
* To serve this files inside our server we use `express-static-gzip` plugin instead of serving files with express.static
* request for "/" or "somepath/" will now serve index.html as compressed version. If we dont want this add `indexFromEmptyFile:false`
* In order to use brotli compression in our express-static-gzip plugin we must use `enableBrotli` and compress files with brotli during webpack bundling using `brotli-webpack-plugin`
* We are using compression only for static files and not for server files.

## Caching ##

* We use `maxAge: '1y'` in out server  file to tell browser to cache files for 1 year. If we change something and make a new bundle the chunkhash of the changed file will change and browser will request to download file again.
* For this to work we use `'Cache-Control', 'no-cache'` for our server file (bundle) that contains .ejs template. This way browser will ask the server if anything has changed. If it did it will download the changed file again.
* If we use Nginx we set caching inside of it's config.

## NGINX ##

* **Nginx settings example**: <https://github.com/denji/nginx-tuning>, <http://www.lifelinux.com/how-to-optimize-nginx-for-maximum-performance/>, <https://books.google.hr/books?id=qScxCgAAQBAJ&pg=PA46&lpg=PA46&dq=accept_mutex&source=bl&ots=RM00AbRjy3&sig=Ya4p8ghJ9bo9gzeNKbhqbsUmaOo&hl=hr&sa=X&ved=0ahUKEwjc_57-nNrUAhXLthQKHfFWB3cQ6AEIUTAF#v=onepage&q=accept_mutex&f=false>, <https://blog.martinfjordvald.com/2011/04/optimizing-nginx-for-high-traffic-loads/>

### Nginx - Brotli ###

* To use Brotli we should use 3rd party module `ngx_brotli` and make it a part of buildpack to deploy it to Heroku. <https://www.voorhoede.nl/en/blog/static-site-implosion-with-brotli-and-gzip/>

### WebSockets ###

* To use websockets instead of HTTP
* <http://nginx.org/en/docs/http/websocket.html>
* <http://enterprisewebbook.com/ch8_websockets.html#FIG9-4>
* <https://www.pubnub.com/blog/2015-01-05-websockets-vs-rest-api-understanding-the-difference/>

```nginx
http {
  map $http_upgrade $connection_upgrade {
    default upgrade;
      '' close;
  }

server {
    ...

    location /chat/ {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
    }
}
```

### TCP and Keepalive ###

<https://www.nginx.com/blog/http-keepalives-and-web-performance/>

### proxy_set_header Host $http_host ###

<https://www.simplicidade.org/notes/2011/02/15/tip-keep-the-host-header-via-nginx-proxy_pass/>

### limit_req_zone / limit_req && limit_conn_zone / limit_conn ###

<https://medium.freecodecamp.org/nginx-rate-limiting-in-a-nutshell-128fe9e0126c>

## HEROKU ##

### heroku - nginx ###

* **Deploying to Heroku**:
* In our prodServerHeroku.js file we use `process.env.NGINX_PORT` to distinguish deployment to Heroku with or without Nginx. If in our Heroku app we add env variable `NGINX_PORT=true` to Heroku `heroku config:set NGINX_PORT=true` we will use Nginx and with that we will serve static files with Nginx. If we don't set it we will deploy to Heroku without Nginx and serve static files with Node and `express-static-gzip` plugin.
* To deploy with Nginx we also need `Procfile`. Drag the `Procfile` file from `herokuProcfile` folder to the root directory.
* Follow this instructions for deployment <https://www.nodebeats.com/documentation/configuring-nginx-on-heroku>
* Instead of using suggested nginx buildpack in the instruction file use this one <https://github.com/kuwabarahiroshi/heroku-buildpack-nginx>
* `yarn run start-heroku` to build for Heroku
* **nginx-heroku settings example**: <https://gist.github.com/beanieboi/ad526faf063181f336a2>, <https://gist.github.com/ShrawanLakhe/a00f176496b63c798f6799350e59de89>

### webpack.DefinePLugin() ###

* Use it carefully when deploying to Heroku. If we for example use process.env.NODE_ENV it will overwrite process.env.PORT
