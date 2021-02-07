---
title: "Speed up your dev Nuxt.js builds: Webpack Optimisations"
description: "Components magically being imported into your app is the latest developer experience trend in Vue. Why does it exist and how does it work?"
---

## Why is your Nuxt.js slow?

Nuxt.js is a high level abstraction layer on top of webpack. You don't need to understand webpack to use Nuxt.

While Nuxt does optimise the webpack build for you, you may notice things start to get sluggish as your app grows.

I can't give you the solution to every performance problem, but I'll go over some performance improvements that
all Nuxt apps could benefit from.

Every app is different and are going to have their own bottlenecks. That's why we'll start with measuring your app
and see what's taking the most time.

### Speed Measure Webpack

The speed-measure-webpack-plugin is a tool to diagnose 

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

export default {
  // ...
  build: {
    extend(config) {
      smp.wrap(config)
    }
  }
}
```


## Nuxt.js build config

There are a number of optimisations already built into Nuxt, but because they have some trade offs, they are marked as
"experimental" and disabled by default.

```js
build: {
  // ...
  // Enable cache of terser-webpack-plugin and cache-loader
  // see: https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-build#cache
  cache: true,
  // Enables the HardSourceWebpackPlugin for improved caching
  // see: https://github.com/mzgoddard/hard-source-webpack-plugin
  hardSource: process.env.NODE_ENV === 'development',
  // Enable thread-loader in webpack building
  // see: https://github.com/webpack-contrib/thread-loader#thread-loader  
  parallel: true,
}
```

### Cache

When you enable cache it will inject `cache-loader` into your webpack config and turn on the cache for terser-webpack-plugin (minifies javascript).

The out-of-the-box Webpack loader `cache-loader` sits in front of other loaders, and caching
whatever the output is. The loader is deprecated in webpack 5, but Nuxt is still on webpack 4.

By default, Nuxt does not use this loader and marks it as experimental. However, from my experience is fairly safe to use 
and will give you a significant 'hot' speed increase.

### Hard Source

### Parallel 

parallel: true


## Transpiling Javascript

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
    presets({ isDev, isServer }) {
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
            targets: isDev && !isServer ? { chrome: 88 } : undefined,
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

## webpack config

These are small flags that webpack recommends. 

The functional change of each of these flags I'd recommend you check the webpack docs and make sure it will work for your application.

```js
// custom webpack optimisations
config.resolve.symlinks = false
config.resolve.cacheWithContext = false
if (process.env.NODE_ENV === 'development') {
  // dev env optimisations. See:https://webpack.js.org/guides/build-performance/
  config.optimization.removeAvailableModules = false
  config.optimization.removeEmptyChunks = false
  config.optimization.splitChunks = false
  config.optimization.runtimeChunk = false
  config.output.pathinfo = false
}
```


## Swap out url-loader

```js
build: {
  // ...
  extend() {
    // remove the current image loader
    config.module.rules = config.module.rules.filter(
      r => r.test && r.test.toString() !== '/\\.(png|jpe?g|gif|svg|webp)$/i'
    )
    // inject our new image loader
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|svg|webp)$/i,
      use: [
        // we swap out the url-loader with a file-loader in the dev environment for speed
        // large images and files really slow it down
        isDev ? {
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]',
          },
        } : {
          loader: 'url-loader',
          options: {
            limit: 1000,
            name: '[path][name].[ext]',
          }
        }
      ]
    })
  }
}
```

## Misc tips

### Don't compress images on build

Use git commit hook to run the process and commit the compressed image.

```js
  "lint-staged": {
    "*.{png,jpeg,jpg,gif,svg}": "imagemin-lint-staged"
  }
```

## Further reading

- https://webpack.js.org/guides/build-performance/
- https://web.dev/serve-modern-code-to-modern-browsers/
- https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-build
- https://slack.engineering/keep-webpack-fast-a-field-guide-for-better-build-performance/