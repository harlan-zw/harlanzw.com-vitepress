---
title: "Building a Vue Auto Component Importer - A Better Dev Experience"
description: "Components magically being imported into your app is the latest developer experience trend in Vue. Why does it exist and how does it work?"
publishDate: 22nd Dec 2020
readTime: 10 min
head:
- - meta
  - name: description
    content: "Components magically being imported into your app is the latest developer experience trend in Vue. Why does it exist and how does it work?"
- - meta
  - property: "og:type"
    content: "website"
- - meta
  - property: "og:url"
    content: "https://harlanzw.com/blog/vue-automatic-component-imports/"
- - meta
  - property: "og:title"
    content: "Building a Vue Auto Component Importer - A Better Dev Experience"
- - meta
  - property: "og:description"
    content: "Components magically being imported into your app is the latest developer experience trend in Vue. Why does it exist and how does it work?"
- - meta
  - property: "og:image"
    content: "https://harlanzw.com/social/vue-automatic-component-imports.png"
- - meta
  - property: "twitter:card"
    content: "summary_large_image"
- - meta
  - property: "twitter:url"
    content: "https://harlanzw.com/blog/vue-automatic-component-imports/"
- - meta
  - property: "twitter:title"
    content: "Building a Vue Auto Component Importer - A Better Dev Experience"
- - meta
  - property: "twitter:description"
    content: "Components magically being imported into your app is the latest developer experience trend in Vue. Why does it exist and how does it work?"
- - meta
  - property: "twitter:image"
    content: "https://harlanzw.com/social/vue-automatic-component-imports.png"
---

# {{ $page.title }}

<div class="text-sm text-gray-500"><time>{{ $page.frontmatter.publishDate }}</time> - 🕒 {{ $page.frontmatter.readTime }}</div>


When first learning Vue, you are taught you need to import and add components to `components` in the script block.

```vue
<template>
  <HelloWorld />
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

However, there's been a recent trend to "upgrade" the Vue developer experience (DX), having components magically import themselves
at compile-time.

```vue
// justworks™
<template>
  <HelloWorld />
</template>
```

In the wild, you can find auto component imports in most popular Vue frameworks, as part of the core or a plugin.

- [Nuxt Components](https://github.com/nuxt/components)
- [Vuetify](https://github.com/vuetifyjs/vuetify-loader)
- [Chakra](https://github.com/segunadebayo/chakra-ui)
- [Vue CLI](https://github.com/loonpwn/vue-cli-plugin-import-components) (built by me)
- [Vite](https://github.com/antfu/vite-plugin-components)

In this article, we'll look at: why automatic component imports exist, how you can easily build our own auto component importer using 
a Webpack loader and what the performance cost of using them has on your app. 

Finally, we'll look at some other compile-time DX upgrades that are possible.


## Why Automatic Component Imports?

The _why_ that comes first to my mind, is the developer experience is great. No more confusion or typos on import paths,
refactoring becomes easier and there's less code overall.

The unintuitive but equally great advantage is found in the problem that this feature first solved.

The UI framework [Vuetify](https://vuetifyjs.com/) is a huge library of over 80 components, coming in at [99.4KB](https://cdnjs.cloudflare.com/ajax/libs/vuetify/2.3.17/vuetify.js)
for their scripts and as far as I know, was the first to introduce automatic component imports.

### Problem: UI Framework Bloat

One of the complaints you'll hear about using a UI framework over something simple like [TailwindCSS](https://tailwindcss.com/),
is the bloat it will add to your app.

This is a valid concern. It's unlikely your application is going to need half the components that a UI framework has to offer. Forcing
browsers to download code that will never run, dead code, is not ideal.

Additionally, this component bloat can make import paths harder to work with and further scope for issues to pop up.

So, how do Vuetify and other UI frameworks overcome their inherent bloat?

### Solution: Webpack Optimisations

As is the way, Webpack is here to magically solve our problems with [tree shaking](https://webpack.js.org/guides/tree-shaking/) and [code splitting](https://webpack.js.org/guides/code-splitting/) optimisations.

If tree shaking is new to you, you can think of it as an optimisation to remove code that isn't explicitly used. Banishing
'dead' code to the shadow realm.

The tree shaking optimisation requires ES2015 module syntax, (i.e `import` and `export`) and a production build. The code can't be compiled
to CommonJS modules (i.e `require`) for it to work.

So how does all this relate to automatic component imports?

With Vuetify handling the imports of your components (_[a la carte](https://vuetifyjs.com/en/features/treeshaking/)_ as they call it), they
are able to ensure webpack optimisations are running out of the box for your app with their component library.

> The A la carte system enables you to pick and choose which components to import, drastically lowering your build size.

> This will also make code-splitting more effective, as webpack will only load the components required for that chunk to be displayed.


## Fundamental: How Does Webpack Load Vue Files?

Before we jump into building our own automatic component importer, we'll need to have a basic understand how Webpack loads Vue files.

When you request a resource (such as a file) in Webpack, it pushes the request through a pipeline of Webpack loaders to resolve the output. A Webpack
loader is a piece of code which will transform a resource from one thing into another, it has an `input` and `output`.

For example, the [raw-loader](https://v4.webpack.js.org/loaders/raw-loader/) will read a file and give you the string contents.
The `input` is a path to a file in your filesystem, the `output` is the string contents of the file.

```js
import txt from 'raw-loader!./hello.txt';
// txt=HelloWorld
```

The `vue-loader` is the loader for `.vue` files. The loader compiles and bundles your component Single File Component (SFC) into code
that the browser can understand and run.


### Vue Loader in Action

Let's take a look at an example of input and output from the vue-loader.

#### Input: App.vue

This is the default entry file for Vue CLI with Vue 3.

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

#### Output: App.vue

Internally, the loader parses this code using the compiler, getting an SFC descriptor object that is used to create the
final string output of the loader.


```js
import { render } from "./App.vue?vue&type=template&id=7ba5bd90"
import script from "./App.vue?vue&type=script&lang=js"
export * from "./App.vue?vue&type=script&lang=js"

import "./App.vue?vue&type=style&index=0&id=7ba5bd90&lang=css"
script.render = render
script.__file = "src/App.vue"

export default script
```

Note: I've removed the Hot Module Reloading (HMR) code for simplicity here.

The output of the loader isn't that important to understand, just know that the vue-loader has an in and out function. The output
of the vue-loader is usually parsed to another loader such as [babel-loader](https://github.com/babel/babel-loader).

## Building an Automatic Component Importer

If you'd like to join me along while we build this, I'd recommend using [Vue CLI](https://cli.vuejs.org/) with the Vue 3 preset.

```shell
vue create auto-component-importer -p __default_vue_3__
```

To begin, let's remove the manual import from the entry SFC, like so:

#### New App.vue

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

We need to make sure the loader we'll be making is going to run after the vue-loader.

```js
// ./vue.config.js
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

If you'd like to see the raw webpack config example, open the below.

<details>
  <summary>webpack.config.js example</summary>

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
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [
          {
            loader: require.resolve('./imports-loader'),
          },
          {
            loader: 'vue-loader',
          }
        ]
      },
    ]
  }
}
```
::: tip Hint
Normally a Webpack would handle this configuration changing for you.
:::
</details>



Now we create the loader called `imports-loader.js` in your apps root directory. We're going to make sure we only run it for the virtual SFC module.

```js
// imports-loader.js
module.exports = function loader(source) {
  // only run for the virtual SFC
  if (this.resourceQuery) {
    return source
  }
  console.log(source)
  return source;
}
```

The `console.log` would spit out the [Output: App.vue](#output-app-vue). We can now change anything about how our component works
by modifying the `source`.

### Step 2. Dumb Compile-Time Import

As a proof of concept, let's try to import the `HelloWorld.vue` component so our [New App.vue](#new-app-vue) works. At this stage, we could
append the import code on to the `source`.

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

Your `App.vue` now knows what the HelloWorld component is and works. Try it yourself.

Note: This really is a _dumb_ solution, as it will be modifying `HelloWorld.vue` to also import itself.

### Step 3. Making it smart

#### a. Scan components

The first step in making it smarter is we need to create a map of the components files we want to automatically import.

This is fairly straight forward, we recursively iterate over the components folder and do some mapping.

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

#### c. Matchmaking

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

Below is the full `imports-loader.js` for reference. This loader should _just work_. Create
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

:::warning Note
There are several issues and edge cases with the above code, this is merely a proof of concept and shouldn't be used in
production.

If you're after a more complete solution you should clone the repos listed before.
:::

## Problems With Automatic Component Imports

Hopefully, you now have a better understanding of how auto component importing works. While working through that rough proof of
concept, you may have foreseen some issues.

### Static code only

If you have a dynamic import then it's not going to work. I don't think this is a massive issue as you can
work around it with manual imports or using the `v-if` on inline components. Consider the below
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

For now the automatic import of `ComponentA` and `ComponentB` is not possible.

### Performance Cost

For automatic component imports to provide their magic, they need to parse the SFC and compile the template at compile time. If you recall,
we are running our loader after the `vue-loader`, that means this compilation has already been completed and is happening again.

This means that by adding this feature, we are could be **doubling our build time**. Which affects the hot module
replacement speed, the web-dev-server boot-time and the production build time.

Saying that certain optimisations can and are made. Loader output can be cached with one line, so unless we change a file
we don't need to recompile it.

```js
// imports-loaders.js
// ... 
module.exports = async function loader (source) {
  this.cache()
  // ...
}
```

For Vue 3 there may be a new ways to optimise this feature. I've based the proof of concept on how the existing Vue 2 plugins work.

### Stricter component naming

Due to the nature of mapping a file name to a component name, it sets a few requirements around how you name your components.
If you're following the Vue [style-guide](https://vuejs.org/v2/style-guide/#Multi-word-component-names-essential) for component naming, you shouldn't have an issue.

If you're going to adopt automatic component imports I'd recommend the following rules:
- Namespace all components (i.e `HButtonOutline`, `H` is the namespace)
- Avoid non-unique component file names
- Use nested folders to separate scopes

## Future Of Automatic Compile-Time "Upgrades"

### Import Directive Support

Vuetify already has some support for this. The idea is that when compiling the template, we can also see when specific directives are used.
If the directive is not globally registered, then we can do a compile-time import of it.

```vue
<template>
<div>
  <input v-my-directive="bar">
</div>
</template>
<script>
export default {
  data () {
    return {
      bar: 'foo'
    }
  }
}
</script>
```

We could imagine that we could write some code which would inject the directive such as `import MyDirective from "@/directives/MyDirective"`.

### Progressive Images

Once again, another vuetify-loader feature and one we could see become more popular is automatic progressive images.

The idea is that we hook into the compiling again and replace the source of our images with compile-time low-resolution
versions.

**Input** 
```vue
<template>
<v-img src="@/images/my-image">
</template>
```

**Output**
```vue
<template>
<v-img placeholder="@/images/my-image-placeholder" src="@/images/my-image">
</template>
```

### Below-the-fold async imports

The `@nuxt/components` does offer this functionality as opt-in, but it would be interesting to see an 'automatic' version of it.

The idea is that for any component which would be rendered below the fold, to load it asynchronously. When we load components
async that are not in the main webpack chunk of that page. That means if you have a large page with lots of components,
you could minimise the initial load significantly.

## Conclusion

Vue is already one of the most developer-friendly frontend frameworks around, with continued improvemenets in the dev experience
Vue will continue to flourish.

While these compile-time upgrades are not needed, they do make life easier. The possibilities
with injecting code at compile time opens up many opportunities for reducing the 'chores' that seem to follow us around
project to project.

## Thanks for reading

Webpack and Vue internals are a challenging topic and if you made it all the way through, pat yourself on the back. 

If you like the technical side of Vue and Laravel, I'll be posting regular articles on this site. The best
way to keep up to date is by following me [@harlan_zw](https://twitter.com/harlan_zw) or signing up for the newsletter below.

<Newsletter />


## Other Vue Articles

<Posts/>
