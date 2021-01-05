---
title: "Scaling Your Vue Components for Mid-Large Size Apps"
description: "Test"
publishDate: 22nd Dec 2020
readTime: 10 min
---

When first embarking on my Vue.js journey for a full on [ production app](https://kintell.com), I spent a lot of time researching 
scalability of Vue apps.

There are plenty of articles on the design of your Vuex store, 
using mixins and slots to reduce repeated code, webpack optimisations, etc. However, there's little on the actual design of your **component architecture**.

With finding nothing definitive I went with the wind and did what felt right. Over 2 years of development, 370 components and many side projects later, I have landed on what I deem to be a pretty decent setup for mid-large 
sized apps. 

Like spaces or tabs, everyone has their own opinion on architecture. This is _my opinionated_ approach to scaling components for mid-large size apps.


## The first rule of Vue club

The [official Vue.js style](https://v3.vuejs.org/style-guide/) guide is _the best_ starting point for all Vue developers.
It gives you clear concise descriptions or what you should and shouldn't do.

I won't be going over the style guide directly because it can explain itself better, just know
that my recommendations are built off of the style guide. You should read it first before proceeding.


## Create a UI Kit

The first step in taming your components is to define a separation of scope for "shared" (or "common") components
and "app" (or "business") components.


If you've used a framework like Vuetify or Bootstrap you should intuitively know when you have a component which has
shared functionality.

There are multiple ways to set this up, the easiest and quickest is just to make two folders within your component folder.
If you know that your app may be split up into separate projects at some point, it may be worth creating an npm package just
for your shared components.

```
-| components
---| app
---| shared
```

### Choosing which folder

To the best of your ability, you should be trying to pull out "abstract" components which don't contain any app specific
logic or data into this separate directory. 

You can follow the below decision graph for that:

<img src="../../resources/component-folder-flow.svg" class="block mx-auto">

Let's run through some examples.

#### Example 1. Phone Number Field with Custom Validation

#### Example 2. Confirm dialog

#### Example 3. Call to action

### Make a demo page



## Component File Directory and Names

## The one job principal


## use a component 'magic' loader


## Offload work to composables

## 