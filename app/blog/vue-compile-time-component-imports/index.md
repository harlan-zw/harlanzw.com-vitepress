---
title: "Building a Vue Automatic Compile-Time Importer: Trending DX"
description: "Having component folders 'auto-magically' imported into your app is the latest craze. How does it work and is it good?"
publishDate: 20th Dec 2020
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

**This Article is Still In Progress**

<div class="text-xs text-gray-600"><time>{{ $page.frontmatter.publishDate }}</time></div>

When first learning Vue, you are taught that to use a component you need to import it and add it to the `components` object in your `<script>` block.

```vue
<template>
  <HelloWorld/>
</template>
<script>
import HelloWorld from '@/components/HelloWorld.vue'
export default {
  components: {
    HelloWorld
  }
}
</script>
```

However, there's been a recent and popular trend to upgrade this traditional Vue workflow, having components magically and automatically import themselves
at compile-time. This 'upgrade' sits in the realm of developer experience (DX for short).

```vue
<template>
  <HelloWorld/>
</template>
<script>
// empty
</script>
```

In the wild, you can find these automatic imports in most popular frameworks as part of the core or a plugin.

- [Nuxt Components](https://github.com/nuxt/components)
- [Vuetify](https://github.com/vuetifyjs/vuetify-loader)
- [Chakra](https://github.com/segunadebayo/chakra-ui)
- [Vue CLI](https://github.com/loonpwn/vue-cli-plugin-import-components) (built by me)
- [Vite](https://github.com/antfu/vite-plugin-components)

In this article we'll first look at why this feature exists and how we can build an automatic compile-time importer ourselves.

Finally, we'll look at the cons of compile-time imports and where the future of compile-time imports could lead.


## Why Compile-Time Imports?

The advantage that should come first to mind, is the developer experience is epic. No confusion on import paths,
refactoring becomes easier and there's less code in your SFCs.

The lesser known advantages lie in their origin story

The UI framework [Vuetify](https://vuetifyjs.com/) is huge library of over 80 components, coming in at [99.4KB](https://cdnjs.cloudflare.com/ajax/libs/vuetify/2.3.17/vuetify.js) 
for their scripts and as far as I know, was the first to introduce compile-time imports. 

### Problem: UI Framework Bloat

One of the complaints you'll hear about using a UI framework over something as simple as TailwindCSS
is the bloat it will add to your application. 

This is a valid concern. It's unlikely your application is going to need half the components that a major UI framework has to offer. Forcing 
your users to download code that will never run, dead code, is not ideal.

Additionally, having a user manually import adds scope for issues to pop up with wrong paths or incorrectly defined `components`
and slows down developers when they need to use a lot of low level components.

So how does Vuetify and other UI frameworks overcome their inherit bloat?  

### Solution: Webpack Optimisations

As is the way, Webpack is here to magically solve our problems with the [Tree Shaking](https://webpack.js.org/guides/tree-shaking/) and [Code Splitting](https://webpack.js.org/guides/code-splitting/) optimisations.

If tree shaking is new to you, you can think of it as an optimisation to remove code that isn't explicitly used. Banishing
'dead' code to the shadow realm.

The tree shaking optimisations has some requirements to work: 

- Use ES2015 module syntax (i.e. import and export).
- Ensure no compilers transform your ES2015 module syntax into CommonJS modules
- Use `production` mode

So how does all this relate to compile-time imports?

By Vuetify handling the imports of components for you, it can make give you the webpack optimisations out of the box.

> The A la carte system enables you to pick and choose which components to import, drastically lowering your build size.

> This will also make code-splitting more effective, as webpack will only load the components required for that chunk to be displayed.


## Fundamental: How Does Webpack Load Vue Files?

Now we understand why compile-time imports exist, it's time to learn the fundamentals about how Vue file loading works in Webpack.

When you request a resource in Webpack, it pushes the request through a pipeline of loaders to resolve the output. The 
loaders are pieces of code which will transform a resource from one thing into another. 

For example the [raw-loader](https://v4.webpack.js.org/loaders/raw-loader/) can read any file and give you the string contents.

The `vue-loader` is the primary loader for `.vue` files. The behaviour for Vue 2 and 3 is a bit different, but at it's core
it's turning your component into code that the browser understand.

### Vue Loader in Action

Let's take a look at an example of input and output from the vue-loader.

#### Input: App.vue 

```vue
<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Welcome to Your Vue.js App"/>
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

Internally, `vue-loader` parses this code using the compiler, getting a SFC descriptor object that is used to create the 
final string output of the loader.

#### Output: App.vue

```js
import { render } from "./App.vue?vue&type=template&id=7ba5bd90"
import script from "./App.vue?vue&type=script&lang=js"
export * from "./App.vue?vue&type=script&lang=js"

import "./App.vue?vue&type=style&index=0&id=7ba5bd90&lang=css"
script.render = render
script.__file = "src/App.vue"

export default script
```

There is subsequent resource requests within webpack for the extra types: `template`, `script`, `style`. You don't
need to understand how these work for the scope of this article.

## Building a Compile-Time Component Importer

If you'd like to join me along while we build this, I'd recommend using Vue CLI with the Vue 3 preset.

To begin, let's say we have this `App.vue` and we removed the manual import, like so:

```vue
<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Welcome to Your Vue.js App"/>
</template>

<script>
export default {
  name: 'App',
}
</script>
```

When we load our `App.vue`, the `HelloWorld` doesn't work, as expected. Our goal is to get it to work without touching the Vue code.

### Step 1. Modify the Webpack Configuration

The first thing we need to do is to insert our custom loader after the vue-loader. 

Image we have the following:

```js
// webpack.config.js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  }
}
```

Knowing that webpack loaders are loaded from bottom to top, we would modify the configuration as so:

```js
// webpack.config.js
module.exports = {
  // ...
  // @todo update this
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: require.resolve('./imports-loader.js')
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  }
}
```

If you'd like to follow along using Vue CLI, you can use this preset configuration:

```js
// vue.config.js
module.exports = {
  chainWebpack: config => {
    config.module
      .rules
      .get('vue')
      .use('components')
      .loader(require.resolve('./imports-loader'))
      .before('vue-loader')
      .end()
  }
}
```

::: tip Hint
Normally a Webpack or Vue CLI plugin would handle this configuration changing for you.
:::

Now we create a loader called `imports-loader.js`. We're going to make sure we only run it on the App.vue file.

```js
// imports-loader.js
module.exports = function loader(source) {
  // only run for the non-query requests
  if (this.resourceQuery) {
    return source
  }
  console.log(source)
  return source;
}
```

The `console.log` would spit out the [Output: App.vue](#output-app-vue). We can now change how our component works
by modifying the `source`.

### Step 2. Dumb Compile-Time Import

As a proof of concept, say we wanted to import the `HelloWorld.vue` component. At this stage we could
simply insert the import code into the `source`.

```js
// imports-loader.js
module.exports = function loader (source) {
  // only run for the non-query requests
  if (this.resourceQuery) {
    return source
  }
  return source + `
import HelloWorld from "@/components/HelloWorld.vue"
script.components = Object.assign({ HelloWorld }, script.components)
`;
}
```

For a proof of concept, this works. Try it yourself. 

### Step 3. Making it smart

#### a. Scan components 

The first step in making it smarter is we need to create a map of the components we want to automatically import.

This is straight forward, we recursively iterate over the components folder and do some mapping

```js
// a. Scan components
const base = './src/components/'
const fileComponents = (await globby('*.vue', { cwd: base })).map(c => {
  const name = path.parse(c).name
  const shortPath = path.resolve(base).replace(path.resolve('./src'), '@')
  return {
    name: name,
    import: `import ${name} from "${shortPath}/${c}"`
  }
})
//[ { name: 'HelloWorld', import: 'import HelloWorld from "@/components/HelloWorld.vue"' } ]
```

#### b. Find the template tags

To understand what components are within the `<template>` block we need to compile it. This is where the code gets a little
more complicated, but all we're doing is running the `App.vue` file through the vue compiler.

Note: The implementation between Vue 2 and 3 is different. For simplicity, we'll be using Vue 3's compiler.

```js
// b. Find the template tags
const compiler = require('@vue/compiler-sfc')
const parsed = compiler.parse(fs.readFileSync(this.context + '/' + path.basename(this.resourcePath), 'utf8')).descriptor
const template = compiler.compileTemplate({
  id: 'tmp',
  source: parsed.template.content,
  filename: this.resourcePath,
})
const componentTags = template.ast.components
// [ 'HelloWorld' ]
```

#### c. Match making

With our freshly compiled template, we need to match the `componentTags` with our mapped component files
from step a.

```js
// c. Match making
const matches = []
componentTags.forEach(tag => matches.push(first(filter(fileComponents, c => c.name === tag))))
//[ { name: 'HelloWorld', import: 'import HelloWorld from "@/components/HelloWorld.vue"' } ]
```

#### d. Insert the new dynamic imports

```js
// d. Insert the new dynamic imports
if (!matches.length) {
  return source
}
const newContent = `
${matches.map(c => c.import).join('\\n')}
script.components = Object.assign({ ${matches.map(c => c.name).join(', ')} }, script.components);
`;
return source + newContent
```

### Putting it all together

In case any of the imports tripped you up, here is the full loader for reference. This loader should _just work_. Create
a new component and then use it straight away, make sure you use PascalCase.

```js
// imports-loader.js
const globby = require('globby')
const fs = require('fs')
const path = require('path')
const first = require('lodash/first')
const filter = require('lodash/filter')

module.exports = async function loader (source) {
  // only run for the non-query requests
  if (this.resourceQuery) {
    return source
  }

  // a. Scan components
  const base = './src/components/'
  const fileComponents = (await globby('*.vue', { cwd: base })).map(c => {
    const name = path.parse(c).name
    const shortPath = path.resolve(base).replace(path.resolve('./src'), '@')
    return {
      name: name,
      import: `import ${name} from "${shortPath}/${c}"`
    }
  })

  // b. Find the template tags
  const compiler = require('@vue/compiler-sfc')
  const parsed = compiler.parse(fs.readFileSync(this.context + '/' + path.basename(this.resourcePath), 'utf8')).descriptor
  const template = compiler.compileTemplate({
    id: 'na',
    source: parsed.template.content,
    filename: this.resourcePath,
  })
  const componentTags = template.ast.components

  // c. Match making
  const matches = []
  componentTags.forEach(tag => matches.push(first(filter(fileComponents, c => c.name === tag))))

  // d. Insert the new dynamic imports
  if (!matches.length) {
    return source
  }
  const newContent = `
${matches.map(c => c.import).join('\\n')}
script.components = Object.assign({ ${matches.map(c => c.name).join(', ')} }, script.components);
`;
  return source + newContent
}
```

:::tip Tip
There are a number of edge case I haven't added to the proof of concept. If you're after a more complete solution you should clone the repo's I listed at start of the project.
:::

## Issues With Compile-Time Imports

Hopefully you now have a better understanding of how this feature works now. While working through that rough proof of 
concept, you may have foreseen the following issues.

### Static code only

If you have a dynamic import then it's not going to work. I don't think this is a massive issue as you can easily
work around it with manualy imports or using the `v-if` directive on inline components. Consider the below
code:

```vue
<template>
  <component :is="myComponent">
</template>
<script>
export default {
  computed: {
    myComponent () {
      return Math.random() * 100 > 50 ? ComponentA : ComponentB
    }
  }
}
</script>
```

While this one day might be possible to still automatically import the components, for now it's not possible.

### Performance Cost

For compile-time automatic imports to provide their magic, they need to parse the SFC and compile the template. If you recall
we are running our loader after the vue-loader, that means this compilation has already been completed and is happening again.

This means that by adding this feature, we are could be **doubling our build time**. Which affects the hot module
replacement speed, the web-dev-server boot-time and the production build time.

Saying that, there are certain optimisations that can and are made. Loader output can be cached with one line, so unless we change a file 
we don't need to recompile it.

```js
// imports-loaders.js
// ... 
module.exports = async function loader (source) {
  this.cache()
  // ...
}
```

For Vue 3 there may be a new way to optimise how this feature works with the `compilerOptions`. I've based the proof of concept on how the existing
plugins works.

If the `compilerOptions` wouldn't work, then we would need the `vue-loader` to provide some sort of hook mechanism where we could
access the entire context and modify the final output. As far as I know there isn't any plans for this.

## The Future of Compile-Time Imports

### Directive Support

### Progressive Images

### Below-the-fold async imports

<Newsletter />