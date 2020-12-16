---
title: "A Deep Dive Into Compile-Time Component Imports"
description: "Having component folders 'auto-magically' imported into your app is the latest craze. How does it work and is it good?"
publishDate: 16th Dec 2020
head:
- - meta
  - name: description
    content: "Having component folders 'auto-magically' imported into your app is the latest craze. How does it work and is it good?"
- - meta
  - property: "og:type"
    content: "website"
- - meta
  - property: "og:url"
    content: "https://harlanzw.com/blog/how-the-heck-does-vite-work/"    
- - meta
  - property: "og:title"
    content: "How The Heck Does Vite Work - A comparison to Webpack"
- - meta
  - property: "og:description"
    content: "Having component folders 'auto-magically' imported into your app is the latest craze. How does it work and is it good?"    
- - meta
  - property: "og:image"
    content: "https://harlanzw.com/social/how-vite-works.png"
- - meta
  - property: "twitter:card"
    content: "summary_large_image"
- - meta
  - property: "twitter:url"
    content: "https://harlanzw.com/blog/how-the-heck-does-vite-work/"
- - meta
  - property: "twitter:title"
    content: "How The Heck Does Vite Work - A comparison to Webpack"
- - meta
  - property: "twitter:description"
    content: "Having component folders 'auto-magically' imported into your app is the latest craze. How does it work and is it good?"
- - meta
  - property: "twitter:image"
    content: "https://harlanzw.com/social/how-vite-works.png"    
---

# {{ $page.title }}

<div class="text-xs text-gray-600"><time>{{ $page.frontmatter.publishDate }}</time></div>

When first learning Vue, you are taught that to use a component you need to import it and add it to the `components` object in your script block.

However, there's been a recent trend to skip over these teachings and instead have components magically and automatically import themselves.

In the wild you can find the feature in most popular frameworks:

- [Nuxt Components](https://github.com/nuxt/components) - Core
- [Vuetify](https://github.com/vuetifyjs/vuetify-loader) - Core
- [Chakra](https://github.com/segunadebayo/chakra-ui) - Core
- [Vue CLI - Import Components](https://github.com/loonpwn/vue-cli-plugin-import-components) - Plugin (Created by me)
- [Vite - Components](https://github.com/antfu/vite-plugin-components) - Plugin

When I was first introduced to the featured in `vuetify-loader` I was impressed, and the question has stayed in my head since.

> How the heck does any of this work?

This question bothered me for months, until I decided to [build my own version]((https://github.com/loonpwn/vue-cli-plugin-import-components)) for Vue CLI.

There are a lot of things to learn to understand how this magic can exist. I'll explain each piece of the puzzle heuristically
and at the end we'll put it together.

I'll end the article by looking at the performance cost of such a feature and some possible solutions.

I'll now refer to **C**ompile-**T**ime **C**omponent **I**mports as **CT-CI** for brevity.

## Why Compile-Time Component Imports?

The advantage that should come first to mind, is the developer experience is epic. No confusion on import paths,
refactoring becomes easier and there's less code in your SFCs.

The lesser known advantages lie in the origin story of the first CT-CI. 

The UI framework [Vuetify](https://vuetifyjs.com/) is huge library of over 80 components and as far as I know, was the first to introduce it. 

### Problem: UI Framework Bloat

One of the complaints you'll hear about using a UI framework over something as simple as TailwindCSS
is the bloat it will add to your application. 

This is a valid concern. It's unlikely your application is going to need half the components that a major UI framework has to offer. Forcing 
your users to download code that will never run, dead code, is a pretty big bloat problem.

The [vuetify.min.js](https://cdnjs.cloudflare.com/ajax/libs/vuetify/2.3.17/vuetify.js) download itself is 99.4kb, pretty huge and doesn't 
include styles.

There is also cognitive load bloat in having to remember to import the components you need and from what paths.

So how does Vuetify and other UI frameworks overcome their inherit bloat?  

### Solution: Automated Optimisations

Queue webpack [Tree Shaking](https://webpack.js.org/guides/tree-shaking/) and [Code Splitting](https://webpack.js.org/guides/code-splitting/).

You can think of tree shaking as a filter for your code that will remove anything that isn't explicitely called. 
Banishing the forbidden 'dead' code.

For Tree Shaking to work you need to: 

- Use ES2015 module syntax (i.e. import and export).
- Ensure no compilers transform your ES2015 module syntax into CommonJS modules
- Use `production` mode

Vuetify's solution to the requirement of efficient code shaking is to manage the imports of components for you, automatically.

All webpack based automatic import loaders work similarly. Let's see how `vuetify-loader` and others work.


## How Does Loading Vue Files Work?

When you request a resource in Webpack, it pushes the request through a pipeline of loaders to resolve the output. The 
loaders are pieces of code which will transform a resource from one thing into another. 

For example the [raw-loader](https://v4.webpack.js.org/loaders/raw-loader/) can read any file and give you the string contents.

The `vue-loader` is the primary loader for `.vue` files. The behaviour for Vue 2 and 3 is a bit different, but at it's core
it's turning your component into code that the browser understand.

### Vue Loader in Action

Let's take a look at an example of input and output from the vue-loader. In this instance we'll look at Vue 2 code because
the compiled code is a little easier to interpret.

#### App.vue 

```vue
<template>
<div id="app">
  <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Welcome to Your Vue.js App"/>
</div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
```

Internally, vue-loader parses this code using the compiler and gets a descriptor object that looks like:

```json
{
  "template": {
    "type": "template",
    "content": "\n<div id=\"app\">\n  <img alt=\"Vue logo\" src=\"./assets/logo.png\">\n  <HelloWorld msg=\"Welcome to Your Vue.js App\"/>\n</div>\n",
    "start": 10,
    "attrs": {},
    "end": 137
  },
  "script": {
    "type": "script",
    "content": "//\n//\n//\n//\n//\n//\n//\n\nimport HelloWorld from './components/HelloWorld.vue'\n\nexport default {\n  name: 'App',\n  components: {\n    HelloWorld\n  }\n}\n",
    "start": 158,
    "attrs": {},
    "end": 282
  },
  "styles": [
    {
      "type": "style",
      "content": "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n#app {\n  font-family: Avenir, Helvetica, Arial, sans-serif;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n  text-align: center;\n  color: #2c3e50;\n  margin-top: 60px;\n}\n",
      "start": 300,
      "attrs": {},
      "end": 500
    }
  ],
  "customBlocks": [],
  "errors": [
    "tag <img> has no matching end tag."
  ]
}
```

It uses this descriptor to generate output of the `vue-loader`, which will then be handed over to another loader such as `babel`.

Note: I've removed the hot module reloading code for simplicity.

#### App.vue Parsed

```js
import { render } from "./App.vue?vue&type=template&id=7ba5bd90"
import script from "./App.vue?vue&type=script&lang=js"
export * from "./App.vue?vue&type=script&lang=js"

import "./App.vue?vue&type=style&index=0&id=7ba5bd90&lang=css"
script.render = render
script.__file = "src/App.vue"

export default script
```

Each part of your SFC is their own `import` with a `type` specified, which allows the native webpack loaders for that file type to handle it.


### Compiling a template



## Extending the vue-loader

Most implementations of automatic imports use a Webpack plugin which modifies the configuration, inserting a new loader directly after the vue-loader.

Imagine you have a `webpack.config.js` file with the following code:

```js
{
  test: /\.vue$/,
  loader: 'vue-loader'
}
```

Adding the plugin would modify your configuration so that it became:

```js
{
  test: /\.vue$/,
  use: [
    {
      loader: 'vue-loader',
    },
    {
      loader: require('./my-automatic-imports-loader')
    }
  ]
}
```

Say if we had a custom webpack loader called `my-automatic-imports-loader.js` and it looked like this:

```js
modules.export = function loader(source) {
  console.log(source)
  return source;
}
```

The `console.log` would spit out the [App.vue Parsed](#app-vue-parsed). 

We can now modify anything about how individual Vue SFC's are parsed by changing the content of `source`.

::: tip TIP
If you just want to modify how the template block is compiled, you can customise the
[compilerOptions](https://vue-loader.vuejs.org/options.html#compileroptions) of the `vue-loader` without a new loader.
:::

## Parsing And Compiling Vue Files

So we have the output of the vue-loader and now we need to do the logic. We need to read the `.vue` file, figure out what
components we're using and inject the imports into the code.

To read the code we need to do two things, `parse` the full SFC file which will give us a `SFCDescriptor`,
splitting out the `template`, `style` and `script` tags.

Once we have the descriptor, we need to compile the template code, for this we use the `compile` function from the vue compiler.

The compiler uses AST nodes which we can hook into to figure out what tags were used. 

### Scanning the components

We also need to scan the components.

### Putting it all together

Now within our loader we know what tags we're using, we know what component files we have available, it's just a matter of
matching them up and inserting the `import` code into the code the `vue-loader` spat out.

## The Cost Of Automatic Imports

## What To Expect In The Future


<Newsletter />