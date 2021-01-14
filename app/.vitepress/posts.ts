import { Post } from 'types'

export default [
    {
        url: '/blog/scale-your-vue-components/',
        title: 'Scaling Your Vue Components for Mid-Large Size Apps',
        publishDate: '12th Jan 2021',
        excerpt: 'Working on a mid-large size app usually means hundreds of components. How do you make sure these components will scale?',
        status: 'published',
        readMins: 8,
        tags: ['vue']
    },
    {
        url: '/blog/vue-automatic-component-imports/',
        title: 'Building a Vue Auto Component Importer - A Better Dev Experience',
        publishDate: '22nd Dec 2020',
        excerpt: 'Having component folders \'auto-magically\' imported into your app is the latest craze. How does it work and is it good?',
        status: 'published',
        readMins: 10,
        tags: ['webpack', 'vue']
    },
    {
        url: 'https://github.com/loonpwn/vue-cli-plugin-import-components',
        link: true,
        publishDate: '12th Dec 2020',
        status: 'published',
        title: 'Vue-CLI Plugin: Import Components',
        excerpt: 'I created a Vue-CLI plugin to automatically import your components in your Vue CLI app with tree shaking, supporting Vue 2 and 3.',
        tags: ['vue', 'github']
    },
    {
        url: '/blog/how-the-heck-does-vite-work/',
        title: 'How Does Vite Work - A Comparison to Webpack',
        publishDate: '1st Dec 2020',
        excerpt: 'I used Vite to build a new blazing fast blog ⚡, find out what I learnt and why Vite is the next big thing.',
        status: 'published',
        readMins: 10,
        tags: ['webpack', 'vue']
    },
] as Array<Post>
