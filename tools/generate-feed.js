const fs = require('fs')
const path = require('path')
const { Feed } = require('feed')
const { getPosts } = require('./get-posts')

const dist = path.resolve(__dirname, `../app/.vitepress/dist`)
const url = `https://harlanzw.com`

const feed = new Feed({
  title: 'Laravel & Vue Sydney Developer | Harlan Wilton',
  description: 'Hey I&#39;m building Laravel &amp; Vue projects and would like to share my journey with you.',
  id: url,
  link: url,
  language: 'en',
  image: 'https://harlanzw.com/social/home.png',
  favicon: `${url}/favicon.ico`,
  copyright:
    'Copyright (c) 2021-present, Harlan Wilton'
})

getPosts().forEach((post) => {
  const file = path.join(dist, path.join(post.url, '/index.html'))
  const rendered = fs.readFileSync(file, 'utf-8')

  const content = rendered.match(
    /<div.*?class="content.*?">([\s\S]*)<\/div>/m
  )
  feed.addItem({
    title: post.title,
    id: `${url}${post.url}`,
    link: `${url}${post.url}`,
    description: post.excerpt,
    content: content[1],
    image: post.image,
    author: [
      {
        name: 'Harlan Wilton',
        link: `https://twitter.com/harlan_zw`
      }
    ],
    date: post.published
  })
})

fs.writeFileSync(path.join(dist, 'feed.rss'), feed.rss2())
