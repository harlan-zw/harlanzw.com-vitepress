---
title: "The Future Of Vue Component Importing"
description: "Having component folders 'auto-magically' imported into your app is the latest craze. How does it work and is it good?"
publishDate: 5th Dec 2020
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

You are taught in Vue that using a component is fairly straightforward. You `import` the component following
the ES-Module syntax, point to a path relative from the current directory or absolute from our project root.

However, there's been a recent trend to replace this manual component loading in favor of automatic imports, as seen in [@nuxt/components](https://github.com/nuxt/components)
and [vuetify-loader](https://github.com/vuetifyjs/vuetify-loader).

In this article we'll look at how these libraries are utilising automatic imports to improve the developer experience,
 how they work under the hood and how you can roll your own.

## Automatic imports in action

The automatic importing works by hijacking your webpacks `vue-loader` configuration, the plugin responsible for transforming
your Vue Single File Components (SFC)`.vue` into multiple split modules (script, style, template, etc).

What does this actually mean in your code? Imagine you have a `webpack.config.js` file with the following code:

```js
{
  test: /\.vue$/,
  loader: 'vue-loader'
}
```

The automatic import plugins are going to extend this configuration so that the vue files run through multiple loaders.

### vuetify-loader

Don't let the package name fool you, the `vuetify-loader` package is not dependent on the Vuetify UI framework to be useful. 

You can use `vuetify-loader` in any Vue project and configure to work for most project setups. For this reason I usually
recommend people to use vuetify-loader whenever they're having difficulties with components.

Following the Vue Best practices for naming components, you should be prefixing your branded components consistently. 
For example for my personal project, all of my custom components behind with `H`, for example `HCardArticle`.

#### How do you use it?

`vuetify-loader` is a webpack plugin: `VuetifyLoaderPlugin






### @nuxt/components

This package is specifically for nuxt.
