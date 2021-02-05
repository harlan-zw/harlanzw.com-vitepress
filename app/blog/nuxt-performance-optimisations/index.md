---
title: "Speed up your Nuxt.js builds: Webpack Optimisations"
description: "Components magically being imported into your app is the latest developer experience trend in Vue. Why does it exist and how does it work?"
---

## Why is your Nuxt.js slow?

## Measure

speed-measure-webpack-plugin

```shell
yarn add -D speed-measure-webpack-plugin
```

**nuxt.config.js**

```js
import SpeedMeasurePlugin from 'speed-measure-webpack-plugin'

const smp = new SpeedMeasurePlugin({
  outputFormat: "humanVerbose",
  loaderTopFiles: 5,
  granularLoaderData: true
});

build: {
  extend(config) {
    smp.wrap(config)
  }
}
```


## Nuxt.js config

### Cache

cache: true

### Parallel 

parallel: true

### Hard Source

### Disable optimisations


## Modern builds

Nuxt provides `modern: boolean` option, when enabled it creates a separate bundle for 'modern' browsers.
This modern package is good, it's quicker to build and has a smaller output.

While this option is useful for a production build, in development it is only going to slow you down, having to build
two separate artifacts. Ideally we would have the option to only generate a modern build, this is expected to be possible in Nuxt.js 3.

Instead, we want to modify the default babel configuration to make the `client` bundle more optimised for development.

The main change is setting the babel `targets` to only the latest chrome version. 

```js
build: {
  // ...
  babel: {
    presets({ isDev }) {
      return [
        [
          '@nuxt/babel-preset-app',
          {
            // nuxt.js defaults
            modules: false,
            useBuiltIns: 'usage',
            corejs: 3,
            // use only latest chrome for development
            ignoreBrowserslistConfig: isDev,
            targets: isDev ? { chrome: 88 } : undefined,
            // decreases overall package size. See: https://babeljs.io/docs/en/babel-preset-env#bugfixes
            bugfixes: true,
          },
        ],
      ],
    },
  },
}
```

Result: **~40% babel-loader speed increase** (on cold starts)

## Fast Saas Loader

## Swap out url-loader


## Related articles

- https://webpack.js.org/guides/build-performance/
- https://web.dev/serve-modern-code-to-modern-browsers/