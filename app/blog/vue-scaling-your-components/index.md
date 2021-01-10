---
title: "Scaling Your Vue Components for Mid-Large Size Apps"
description: "Working on a mid-large size app usually means hundreds of components. How do you make sure these components will scale?"
---

One of the aspects of scaling that is seldom discussed is component architecture. 

- How are components named?
- What folder hierarchy should you use? 
- How component scope is addressed?

These may sound like beginner questions but once you are approaching a few hundred components the cost of not thinking about it grows exponentially. 

As the tech lead at my last company, a startup, growing pains were always being felt. Pivots, design changes and new features were the norm. All pushing
our total component count up. My below suggestions are what I formulated for solving _our_ scaling issues. Your project will have it's own requirements.

## 100+ component club

Let's assume once you hit 100+ components, then you are a mid-size app and you will be feeling your own growth pains.

Are you in the club? Run the following in your component folder:

```shell
# cd app/components
COMPONENTS=$(ls -lR **/*.vue | wc -l) && echo -e "You have ${COMPONENTS} components."
```

### Perks of the club

These are some pain points you may hit once you have a lot of components:

- Difficult to remember which component to use where
- Code is being repeated
- Monolithic components
- New components are being built instead of leveraging existing ones
- Inconsistent emits and props between components with the same functionality
- Technical debt is being ignored because it is too painful


## Solving component scaling with rules

Good code adheres to a set of rules. You either follow existing rules (syntax and conventions) or create
new ones and make sure others follow them (documentation and code reviews).

### Rule 0. Have good dev processes

There is no substitute for good development process in your team: continuous delivery practices, documentation and clear communication. 
The rest of the rules will not help you if you are not functioning as a well oiled machine.

### Rule 1. Know the style guide

The [official Vue.js style](https://v3.vuejs.org/style-guide/) guide is _the best_ starting point and is required reading.
It gives you clear, concise instructions on what you should and shouldn't do.

If you're not already, make sure you lint against the style guide using [eslint-plugin-vue](https://eslint.vuejs.org/) with the recommended rules.

```js
// .eslintrc.js
module.exports = {
  extends: [
    // ...
    'plugin:vue/vue3-recommended',
    // 'plugin:vue/recommended' // Use this if you are using Vue.js 2.x.
  ],
}
```


### Rule 2. Use a component naming convention

The bane of developers lives: how to name something.

We're going to address that by having an easy-to-follow convention on how to name a component, which will also tell us where to put it.

<div class="language- px-4 py-2 text-white">
<span class="text-yellow-400">{prefix}</span>-<span class="text-blue-400">{namespace}</span><span class="text-pink-400">{?-class}</span>
</div>

#### Prefix

> Base components (a.k.a. presentational, dumb, or pure components) that apply app-specific styling and conventions should all begin with a specific prefix, such as Base, App, or V.

The style guide recommends the above, however I believe a short prefix for _all_ your components is preferable.

Giving your components a prefix allows you to use single-word names while avoiding HTML and third-party component conflicts. 
It also gives you scoped IDE autocompletion and makes your components re-usable in other apps.

This is especially useful when working with a component library ([Vuetify](https://vuetifyjs.com/), [VueStrap](https://yuche.github.io/vue-strap/), etc) or one-off components
([algolia](https://github.com/algolia/vue-instantsearch), [google maps](https://github.com/xkjyeah/vue-google-maps), etc).

You should use something which relates to your app, for example I use `h` as the prefix because my site is harlanzw.com.

```vue
<template>
<p>Please enter your email to subscribe</p>
<!-- Vuetify components use a V prefix -->
<v-text-field label="Your Email"></v-text-field>
<!-- H is the prefix for my apps components -->
<h-button>Submit</h-button>
</template>
```

Feel free to implement multiple prefixes for your components if you'd like to use it for scoping.

```vue
<template>
<!-- 'the' as a prefix for layout components -->
<the-header>
  <!-- 'v' prefix for vuetify components -->
  <v-img src="logo.png" />
  <!-- 'h' prefix for our branded components -->
  <h-button>Sign In</h-button>
</the-header>
<main>
  <the-sidebar />
  <the-content v-html="content" />
</main>
<the-footer />
</template>
```

#### Namespace

This is an interpretation of two recommendations from the style guide:

> Component names should start with the highest-level (often most general) words and end with descriptive modifying words.

> Child components that are tightly coupled with their parent should include the parent component name as a prefix.

While the style guide recommends starting with the parent component, it's more flexible to start with a _namespace_.

We want namespaces to avoid conflicts within our own components, improve IDE autocompletion and define the scope
of the component from the get go.

Namespaces should be mapped to a folder the component sits in, this way we can easily group our components and find
what we have available. I would recommend not nesting namespaces to begin with.

An example of a namespace is `Field`, for all our field components (text field, textarea, search, etc.).

```shell
components/
|- Field/ # namespace
|--- HFieldText.vue
|--- HFieldTextarea.vue
|--- HFieldSearch.vue
|--- HFieldAutocomplete.vue
|--- HFieldCheckbox.vue
```

Having defined a namespace for all of these field components, you can then create conventions that components in that
namespace should follow. For example these components should have a `value` prop and emit an `input`.

#### Class (optional)

The final part of the convention, is in fact the name of the component. Thinking of it as a class name makes the 
distinction between the namespace easier.

Classes should be optional, namespaces can provide a default component to reduce inherit naming bloat.

Let's imagine we have a project with a few buttons. Most of the time we want to use the default button, we shouldn't 
need to use bloated component names.

```shell
components/
|- Button/ # namespace
|--- HButton.vue # The namespaces default component 
|--- HButtonCallToAction.vue # A call to action button
|--- HButtonSubmitForm.vue # A button to submit forms
```

Recommendations on naming the class:
- Describe the application specific function of the component, rather than what it looks like.
  - ❌ HButtonRainbowFlashing.vue
  - ✅ HButtonCallToAction.vue
- Choose to be verbose if it adds clarity to the scope.
  - ❌ HProfileUsers.vue
  - ✅ HProfileAuthenticatedUsers.vue
- Prefer full words over abbreviations - from the [style guide](https://v3.vuejs.org/style-guide/#full-word-component-names-strongly-recommended).

### Rule 3. Separate component scopes

Creating distinct scopes for how components behave will guide you in staying DRY - not creating duplicate components with minor differences.
A scope for "base" (a.k.a. presentational, dumb, or pure components) components and "app" (a.k.a single-instance) components is a good starting point.

There are multiple ways to set this up. I like making two folders within the component folder. You could also pull out your "shared" components into their own npm package.

```shell
components/
|- app
|- shared
```

This forces you to think about component scopes when creating them and how code can be re-used.

It's common that you'll create a component with application logic coupled in, where it can easily be pulled out with a prop or scoped slot.
Props and slots are cheap in comparison to adding new components. 

<img src="../../resources/component-folder-flow.svg" class="block mx-auto">


#### "Shared" Folder - Base Components

Base components are inherently re-usable and include components like: form inputs, buttons, dialogs, modals, etc. They should never contain application logic or state data.

When you are using a UI library, you are using base components, think [VueStrap](https://yuche.github.io/vue-strap/), [Vuetify](https://vuetifyjs.com/), [Tailwind UI](https://tailwindui.com/), etc. 

What you should be aiming to do is building your own "ui kit" from your base components.

```shell
components/
|- shared/
|-- Alert/
|--- HAlertInfo.vue
|--- HAlertSuccess.vue
|--- HAlertWarn.vue
|-- Button/
|--- HButton.vue
```

If you were to copy+paste your shared folder into a new project, it should work out of the box - assuming npm / util dependencies are
addressed.

#### "App" Folder - App components

App components do contain application logic and state data. It's common that these will be single instance per page
but giving yourself this restriction is not worth the effort.

If you were to copy+paste an app component into a new project, it should not work.

## Example: Component Structure for a Forum

To put the above into practice, let's imagine we want to build a forum thread page where a user can see comments, interact with comments and post their own comment.

<img src="../../resources/forum-example.png" class="block mx-auto" alt="Laravel.io Forum Example">

Using `F` as our component prefix, let's imagine what we'll need.

**App Components**

```shell
components/app/
|- Thread/
|-- FThread # Wraps the entire thread
|-- FThreadPost # A single post / reply
|-- FThreadTag # A single thread tag
|- Field/
|-- FFieldComment.vue # Comment box for posts
|- Button/
|-- FButtonLike.vue # The thumbs up button
```


**Shared Components**

```shell
components/shared/
|- Img/
|-- FImgAvatar.vue # Users photos
|- Field/
|-- FFieldWYSIWYG.vue # Comment box for posts
|- Card/
|-- FCard.vue # Gives posts a 'card' look
|-- FCardSpacing.vue # Gives posts consistent spacing
|- Button/
|-- FButtonSubmit.vue # Reply button for the post box
|- Chip/
|-- FChip.vue # For the thread tags
```

## Extra and optional rules

### Use An Automatic Component Importer

Once you have a few hundred components, being tied to the import paths of components will slow
you down when you are building and refactoring.

You will strip a huge amount of code and free yourself to tinker with the directory structure of your components however
you see fit by using an [automatic component imports](/blog/vue-automatic-component-imports/). 

### Typescript Components

Typescript can be a bit of a commitment and add some overhead. However, the power of typing can't be understated
when you're working with objects.

```vue
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Post } from './types'

export default defineComponent({
  props: {
    post: {
      type: Object as PropType<Post>,
      required: true
    }
  },
})
</script>
```

The IDE support can be a little shaky as this is new syntax in Vue 3, but it's going to be an improvement regardless.

### Components have "one job"

> Every component should have one job, any code in the component that isn't achieving that job shouldn't be there.

You should be thinking when you create a component what the scope of it will be. What is its purpose? Is its sole purpose
to pass butter?

Let's imagine we have a form and how we could break that down
- `HFieldText`: Store a text value from the user
- `HFormSubmitter`: Handle XHR form submission
- `HFormFields`: Get all validated values from the user
- `HButtonSubmitForm`: Submit a form button

This can be quite limiting so don't force this mindset on your components, but consider it.

### Create component demo pages

Using a package like [Storybook](https://storybook.js.org/) is a great idea, but it comes with overhead
and when you're starting out it can be a bit overkill.

As a starting point you can create pages under a `/demo` prefix and throw your components in.
The idea is to have an easy way to discover the components (and classes) that are available for your team.

It doesn't need to be complicated, here is a rough demo page as an example: [Massive Monster UI Demo](https://massivemonster.co/demo).

<img src="../../resources/brand-demo.png" class="block mx-auto" alt="Massive Monster Demo Page">

### Mixins and composables

This one should be pretty obvious and there is enough articles elsewhere on using these.

You want to pull out common logic from components and put them in either mixins or composables.

Check out the [vueuse](https://github.com/antfu/vueuse) for some ideas on what could look like.


## Thanks for reading

This was a challenging topic for me when I started Vue over 3 years ago, I hope I have given at least one person some 
guidance in scaling their components.

If you like the technical side of Vue and Laravel, I'll be posting regular articles on this site. The best
way to keep up to date is by following me [@harlan_zw](https://twitter.com/harlan_zw) or signing up for the newsletter below.
