---
title: "Scaling Your Vue Components for Mid-Large Size Apps"
description: "Working on a mid-large size app usually means hundreds of components. How do you make sure these components will scale?"
head:
- - meta
  - name: description
    content: "Working on a mid-large size app usually means hundreds of components. How do you make sure these components will scale?"
- - meta
  - property: "og:type"
    content: "website"
- - meta
  - property: "og:url"
    content: "https://harlanzw.com/blog/scale-your-vue-components/"
- - meta
  - property: "og:title"
    content: "Scaling Your Vue Components for Mid-Large Size Apps"
- - meta
  - property: "og:description"
    content: "Working on a mid-large size app usually means hundreds of components. How do you make sure these components will scale?"
- - meta
  - property: "og:image"
    content: "https://harlanzw.com/social/scale-your-vue-components.png"
- - meta
  - property: "twitter:card"
    content: "summary_large_image"
- - meta
  - property: "twitter:url"
    content: "https://harlanzw.com/blog/scale-your-vue-components/"
- - meta
  - property: "twitter:title"
    content: "Scaling Your Vue Components for Mid-Large Size Apps"
- - meta
  - property: "twitter:description"
    content: "Working on a mid-large size app usually means hundreds of components. How do you make sure these components will scale?"
- - meta
  - property: "twitter:image"
    content: "https://harlanzw.com/social/scale-your-vue-components.png"
---

One of the key pieces in scaling your Vue app is having good component architecture.

- How are components named?
- What folder hierarchy should you use?
- How is component code scoped?

The cost of not having clear answers to these simple questions increases as your app grows.

My previous role was the tech lead at a startup. Growing pains were frequent with pivots, design changes and new features. All pushing our total component count up.

My below suggestions are what I came up with to solve _our_ scaling issues. Your project will have its own requirements.

## 100+ component club

Let's assume once you hit 100+ components, then you are a mid-size app and you will be feeling your own growing pains.

Are you in the club? Run the following in your component folder:

```shell
# cd app/components
COMPONENTS=$(ls -lR **/*.vue | wc -l) && echo -e "You have ${COMPONENTS} components."
```

### Perks of the club

These are some issues you may come across once you have so many components:

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
There is no substitute for a good development process. You need to be following best continuous delivery, documentation and communication practices.
The rest of the rules will not help you if you are not functioning like a well-oiled machine.

### Rule 1. Know the style guide
You should be familiar with the official [Vue.js Style Guide](https://v3.vuejs.org/style-guide/).
It gives you clear, concise instructions on what you should and shouldn't do.
You should set up [eslint-plugin-vue](https://eslint.vuejs.org/) with the recommended rules.

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

You can address that by having an easy-to-follow convention on how to name a component. The convention will also tell you where to put the component in your folder hierarchy.

<div class="language- px-4 py-2 text-white">
<span class="text-yellow-400">{prefix}</span>-<span class="text-blue-400">{namespace}</span><span class="text-pink-400">{?-class}</span>
</div>

#### Prefix

> Base components (a.k.a. presentational, dumb, or pure components) that apply app-specific styling and conventions should all begin with a specific prefix, such as Base, App, or V.

A short prefix for _all_ your components is preferable to the above.

Using a prefix avoids conflicts with HTML tags and third-party components. It also gives you scoped IDE autocompletion and more reusable components.

It's important when working with a component library ([Vuetify](https://vuetifyjs.com/), [VueStrap](https://yuche.github.io/vue-strap/), etc) or third-party components
([algolia](https://github.com/algolia/vue-instantsearch), [google maps](https://github.com/xkjyeah/vue-google-maps), etc).

You should use something which relates to your app, for example, I use `h` as the prefix because my site is harlanzw.com.

```vue
<template>
<p>Please enter your email to subscribe</p>
<!-- Vuetify components use a V prefix -->
<v-text-field label="Your Email"></v-text-field>
<!-- H is the prefix for my apps components -->
<h-button>Submit</h-button>
</template>
```

You can use many prefixes for your components to help you with scoping code. Make sure you separate the scopes into different folders.

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

> Child components that are tightly coupled with their parent should include the parent component name as a prefix.

The style guide recommends starting with the parent component, it's more flexible to use a _namespace_ after our prefix.

Namespaces avoid conflicts, improve IDE autocompletion and define the scope of the component.

You should map namespaces to a folder, this way you can group components, making them easier to find and use. I would recommend not nesting namespaces, to begin with.

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

You can then create conventions that components in a namespace should follow. For example these components should all have a `:value` prop and `$emit('input', value)`.

#### Class (optional)

> Component names should start with the highest-level (often most general) words and end with descriptive modifying words.

The final part of the convention is, in fact, the name of the component. Thinking of it as a class name makes the distinction between the namespace easier. You still want to follow the above style guide rule, our class names should be
general to descriptive.

The class should be optional. Namespaces can provide a default component to reduce naming bloat.

Imagine you have a project with a few buttons. Most of the time you want to use the default button, you shouldn't
need to name it `HButtonDefault.vue`.

```shell
components/
|- Button/ # namespace
|--- HButton.vue # The namespaces default component 
|--- HButtonCallToAction.vue # A call to action button
|--- HButtonSubmitForm.vue # A button to submit forms
```

Recommendations on naming the class:
- Describe the application-specific function of the component, rather than what it looks like.
  - ❌ `HButtonRainbowFlashing.vue`
  - ✅ `HButtonCallToAction.vue`
- Choose to be verbose if it adds clarity to the scope.
  - ❌ `HProfileUser.vue`
  - ✅ `HProfileAuthenticatedUsersCard.vue`
- Prefer full words over abbreviations. From the [style guide](https://v3.vuejs.org/style-guide/#full-word-component-names-strongly-recommended).

### Rule 3. Separate component scopes

Defining scopes for how components behave will guide you in staying DRY.
A scope for "base" (a.k.a. presentational, dumb, or pure components) components and "app" (a.k.a single-instance) components is a good starting point.

There are many ways to set this up. I like making two folders within the component folder. You could also pull out your "shared" components into their own npm package.

```shell
components/
|- app
|- shared
```

This forces you to think about component scopes when creating them and how code can be re-used.

When creating a component it's common application logic is coupled in. You can pull this logic out usually with a prop or scoped slot.
Props and slots are cheap in comparison to adding new components.

<img src="../../resources/component-folder-flow.svg" class="block mx-auto">


#### "Shared" Folder - Base Components

Base components are re-usable and include components like form inputs, buttons, dialogues, modals, etc. They should never contain application logic or state data.

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

App components do contain application logic and state data. Commonly, these will be single instance per page
but giving yourself this restriction is not worth the effort.

If you were to copy+paste an app component into a new project, it should not work.

## Example: Component Structure for a Forum

To put the above into practice, let's imagine you want to build a forum thread page where a user can see comments, interact with comments and post their own comment.

<img src="../../resources/forum-example.png" class="block mx-auto" alt="Laravel.io Forum Example">

Using `F` as our component prefix, let's look at what is needed.

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

The IDE support can be a little shaky as this is the new syntax in Vue 3, but it's going to be an improvement regardless.

### Components have "one job"

> Every component should have one job, any code in the component that isn't achieving that job shouldn't be there.

You should be thinking when you create a component what the scope of it will be. What is its purpose? Is its sole purpose
to pass the butter?

Imagine you have a form and how that could be broken down:
- `HFieldText`: Store a text value from the user
- `HFormSubmitter`: Handle XHR form submission
- `HFormFields`: Get all validated values from the user
- `HButtonSubmitForm`: Submit a form button

This mindset can be limiting so don't force this mindset on your components, but consider it.

### Create component demo pages

Using a package like [Storybook](https://storybook.js.org/) is a great idea, but it comes with overhead
and when you're starting out it can be a bit overkill.

As a starting point, you can create pages under a `/demo` prefix and throw your components in.
The idea is to have an easy way to discover the components (and classes) that are available for your team.

It doesn't need to be complicated, here is a rough demo page as an example: [Massive Monster UI Demo](https://massivemonster.co/demo).

<img src="../../resources/brand-demo.png" class="block mx-auto" alt="Massive Monster Demo Page">

### Mixins and composables

This one should be pretty obvious and there are enough articles elsewhere on using these.

You want to pull out common logic from components and put them in either mixins or composables.

Check out the [vueuse](https://github.com/antfu/vueuse) for some ideas on what could look like.


## Thanks for reading

This was a challenging topic for me when I started Vue over 3 years ago, I hope I have given at least one person some
guidance in scaling their components.

If you like the technical side of Vue and Laravel, I'll be posting regular articles on this site. The best
way to keep up to date is by following me [@harlan_zw](https://twitter.com/harlan_zw) or signing up for the newsletter below.