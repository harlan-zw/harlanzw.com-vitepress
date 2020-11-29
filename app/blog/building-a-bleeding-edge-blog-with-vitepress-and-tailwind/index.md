---
title: "Building a bleeding edge blog with VitePress & Tailwind"
description: "I had a play around with Vite, VitePress and TailwindCSS to build a new blazing ⚡ fast blog. Discover why Vite is the next best thing."
publishDate: 24th Nov 2020
---

# Building a bleeding edge blog with VitePress & Tailwind

::: warning WARNING
This article is a WIP
:::

## VuePress's baby brother: VitePress

::: warning WARNING
VitePress is an early WIP! It's not recommended to use for anything serious yet.
:::

Little did I know when I chose to use VitePress, but it exists for the primary function of documentation sites. 
That's not to say you can't build other type of sites with it, just a lot of the feature and design decisions have been
made around that use case. 

Given that fact, I still had a lot of fun playing with VitePress and getting it to work for my blog.

### The good 

What I really enjoy comes down to the speed and the simplicity of everything.

- 🙅‍♂️ Zero configuration out of the box. Your project could be an index.md and a package.json
- 🔥 Hot module reloading for markdown content makes writing a breeze
- 🔨 Basic support to change the default theme through a simple config.js file


If you're looking to use it for a serious project or a blog, I'm not sure I'd recommend it, unless your intent on maintaining it.

### The 'needs' some work

- Documentation is not complete (Vuepress docs mostly work)
- HMR does not work on theme files?
- Asset paths can trip you up
- Requiring MD files for pages feels a bit limiting
- No way to query all pages
- @vuepress/plugin-blog does not seem to work

### Summary

## Building your own VitePress Blog 
