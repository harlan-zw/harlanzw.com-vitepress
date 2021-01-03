---
title: "Scaling Your Vue Components for Mid-Large Size Apps"
description: "Test"
publishDate: 22nd Dec 2020
readTime: 10 min
---

# {{ $page.title }}

When first embarking on my Vue.js journey for a [full on production app](https://kintell.com), I spent a lot of time researching the best way to 
build my app so that it would scale.

My research went okay, there was plenty of articles on design of your Vuex store, 
using mixins and slots to reduce repeated code, webpack optimisations, etc. However, with my research, I got stuck on something I thought should have been simple: designing the **component architechture**.

I knew my from the start that my app was going to exceed a couple of hundred components, but I had some questions I couldn't answer.
For example, what was the best way to set up the directory structure, to handle naming and 
to separate logic?

With finding nothing definitive I went with the wind and did what felt right. Over 2 years of development and 370 components later, I have landed on what I deem to be a pretty decent setup for mid-large 
sized apps. 

Like fashion, everyone has their own style when they architecture an app. This is _my opinionated_ approach to scaling components for mid-large size apps.


## The first rule of Vue club

The official Vue.js style guide is _the best_ starting point for application architecture.
The style guide should be required reading for anyone jumping into Vue or Vue developers who somehow have missed it.

I won't go directly into what the style guide recommends because it can explain itself better, just know
that my recommendations are built off of the style guide. 


## app / shared folder

## verbose file names and directories

## use a component 'magic' loader

## Do one thing principal

## Offload work to composables

## 