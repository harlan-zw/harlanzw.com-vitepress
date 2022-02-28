const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')
const globby = require('globby')
const postMetas =
  [
    {
      url: '/blog/building-unlighthouse/',
      title: 'Building Unlighthouse: Open-Source Package For Site-wide Google Lighthouse scans',
      publishDate: '28 Feb 2022',
      date: '2022-02-28',
      excerpt: 'Going into detail of what goes into making a modern open-source package.',
      status: 'published',
      readMins: 6,
      tags: ['vue']
    },
    {
      url: '/blog/scale-your-vue-components/',
      title: 'Scaling Your Vue Components for Mid-Large Size Apps',
      publishDate: '12th Jan 2021',
      date: '2021-01-12',
      image: 'https://harlanzw.com/social/scale-your-vue-components.png',
      excerpt: 'Working on a mid-large size app usually means hundreds of components. How do you make sure these components will scale?',
      status: 'published',
      readMins: 8,
      tags: ['vue']
    },
    {
      url: '/blog/vue-automatic-component-imports/',
      title: 'Building a Vue Auto Component Importer - A Better Dev Experience',
      publishDate: '22nd Dec 2020',
      image: 'https://harlanzw.com/social/vue-automatic-component-imports.png',
      date: '2020-12-22',
      excerpt: 'Having component folders \'auto-magically\' imported into your app is the latest craze. How does it work and is it good?',
      status: 'published',
      readMins: 10,
      tags: ['webpack', 'vue']
    },
    {
      url: 'https://github.com/loonpwn/vue-cli-plugin-import-components',
      link: true,
      publishDate: '12th Dec 2020',
      date: '2020-12-12',
      status: 'published',
      title: 'Vue-CLI Plugin: Import Components',
      excerpt: 'I created a Vue-CLI plugin to automatically import your components in your Vue CLI app with tree shaking, supporting Vue 2 and 3.',
      tags: ['vue', 'github']
    },
    {
      url: '/blog/how-the-heck-does-vite-work/',
      title: 'How Does Vite Work - A Comparison to Webpack',
      publishDate: '1st Dec 2020',
      image: 'https://harlanzw.com/social/how-vite-works.png',
      date: '2020-12-01',
      excerpt: 'I used Vite to build a new blazing fast blog ⚡, find out what I learnt and why Vite is the next big thing.',
      status: 'published',
      readMins: 10,
      tags: ['webpack', 'vue']
    },
  ]

exports.getPosts = function getPosts() {
  const cwd = path.resolve(__dirname, '../app/blog')
  const posts = globby.sync(['**/*.md'], { cwd })
  console.log('globby posts', posts, cwd)
  return posts
    .map(file => {
      const src = fs.readFileSync(path.join(cwd, file), 'utf-8')
      const { content } = matter(src)

      // match file to post definition
      const url = '/blog/' + file.replace('index.md', '')
      const postMeta = postMetas.find(p => p.url.endsWith(url))

      return {
        title: postMeta?.title,
        date: formatDate(postMeta?.date),
        ...postMeta,
        content
      }
    })
    .sort((a, b) => b?.date.time - a?.date.time)
}

function formatDate(date) {
  date = new Date(date)
  date.setUTCHours(12)
  return {
    time: +date,
    string: date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
}
