import {defineConfig} from 'vitepress'

export default defineConfig({
  title: 'Harlan Wilton',
  description: 'Hey 👋 I\'m building Laravel & Vue projects and would like to share my journey with you.',
  head: [
    ['link', { rel: 'stylesheet', href: '//fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Dosis:wght@300;400;500;600;700&display=swap' }],
    ['link', { rel: 'alternative', type: 'application/rss+xml', href: '/feed.rss', title: 'RSS Feed for harlanzw.com' }]
  ],
  themeConfig: {
    logo: '/icon.svg',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'About', link: '/about/' },
      { text: 'Contact', link: '/contact/' }
    ],
  },
})
