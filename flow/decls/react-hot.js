/* without this flowtype throws an error on module.hot.accept */

// eslint-disable-next-line
declare var module: {
  hot: {
    accept(path: string, callback: () => void): void
  }
}
