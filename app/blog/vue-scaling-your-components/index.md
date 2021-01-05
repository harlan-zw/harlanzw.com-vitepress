---
title: "Scaling Your Vue Components for Mid-Large Size Apps"
description: "Test"
publishDate: 22nd Dec 2020
readTime: 10 min
---

When first embarking on my Vue.js journey for a full on [production app](https://kintell.com), I spent a lot of time researching 
scalability of Vue apps.

There are plenty of articles on the design of your Vuex store, 
using mixins and slots to reduce repeated code, webpack optimisations, etc. However, there's little on the actual design of your **component architecture**.

With finding nothing definitive I went with the wind and did what felt right. Over 2 years of development, 370 components and many side projects later, I have landed on what I deem to be a pretty decent setup for mid-large 
sized apps. 

Like spaces or tabs, everyone has their own opinion on architecture. This is _my opinionated_ approach to scaling components for mid-large size apps.


## The first rule of Vue club

The [official Vue.js style](https://v3.vuejs.org/style-guide/) guide is _the best_ starting point for all Vue developers and is required reading.
It gives you clear, concise instructions on what you should and shouldn't do.

My tips are built off of the "Strongly Recommended" guidelines.

## Naming components

The bane of developers lives: how to name something. 

Having an easy to follow playbook on how to name a component and where to put it will give you the biggest leverage in scaling.

### Choose a Component Prefix

Applicable when you are using a third-party UI library (like Vuetify or Chakra) or one-off components (like algolia or google maps) then namespacing your components is the easiest way to keep your
components clean, avoid conflicts and easily setup auto-loading.

The style guide recommends a prefix of `Base`, `App` or `V` for base components, however I believe a short namespace for _all_ your
components is going to save you effort in the long run. You should use something which relates to your app, for example I use `h` as the prefix
because my site is harlanzw.com.

```vue
<template>
  <p>Please enter your email to subscribe</p>
  <!-- Vuetify components use a V prefix -->
  <v-text-field label="Your Email"></v-text-field>
  <!-- H is the prefix for my components -->
  <h-button>Submit</h-button>
</template>
```

## Namespaces within your component names

> Component names should start with the highest-level (often most general) words and end with descriptive modifying words.

> Child components that are tightly coupled with their parent should include the parent component name as a prefix.

> Component names should prefer full words over abbreviations.



## Where to put components

## Separate component scopes

Creating distinct scopes for how components behave will guide you in staying DRY - not creating duplicate components with minor differences.
A scope for "base" (a.k.a. presentational, dumb, or pure components) components and "app" (a.k.a single-instance) components is a good starting point.

There are multiple ways to set this up. I like making two folders within the component folder, below I have the
"app" folder and "shared" folder for base components. You can also pull out your base components into their own npm package if you're game.

```
components/
|- app
|- shared
```

This forces you to think about component scopes when creating them and how code can be re-used.

It's common that you'll create a component with application logic coupled in, where it can easily be pulled out with a prop or scoped slot.
Props and slots are cheap in comparison to adding new components. 

<img src="../../resources/component-folder-flow.svg" class="block mx-auto">


### "Shared" Folder - Base Components

Base components are inherently re-usable and include components like: form inputs, buttons, dialogs, modals, etc. They should never contain application logic or state data.

When you are using a UI library, you are using base components, think [VueStrap](https://yuche.github.io/vue-strap/), [Vuetify](https://vuetifyjs.com/), [Tailwind UI](https://tailwindui.com/), etc. 

What you should be aiming to do is building your own "ui kit" from your base components.

```
components/
|- app/
|- shared/
|-- Alert
|--- HAlertInfo.vue
|--- HAlertSuccess.vue
|--- HAlertWarn.vue
|-- Button/
|--- HButton.vue
```

### "App" Folder - App components

App components, or as the vue style guide calls them, "single-instance components" do contain application logic and state data. 
I believe app components should be able to have multiple-instances on a page, there are use cases. 



## Examples

Let's see some examples of what we'd like to build and how you would setup the components.

#### Example 1. Phone Number Field with Custom Validation

#### Example 2. Confirm dialog

#### Example 3. Call to action


## Extra tips

## Use An Automatic Component Importer


## The one job principal

## Create a brand guidelines demo

Using a package like [Storybook](https://storybook.js.org/) is a great idea, but it can come with some extra overhead
and when you're starting out it can be a bit overkill.

As a starting point I'd recommend you just create some pages under a `/brand` prefix and throwing your components in there.
The idea is to have an easy way to discover the components (and classes) that are available.



## Offload work to composables

## 