import 'windi.css'
import './styles/main.scss';
import './styles/vars.css';
import './styles/layout.css';
import './styles/code.css';
import './styles/custom-blocks.css';
import Layout from './Layout.vue';
import NotFound from './NotFound.vue';
import CardPost from './components/CardPost.vue';
import Posts from './components/Posts.vue'
import Newsletter from './components/Newsletter.vue'
import Zooming from 'zooming'
import * as Panelbear from '@panelbear/panelbear-js'
import DefaultTheme from 'vitepress/theme'
import { installSchemaOrg } from '@vueuse/schema-org-vite/vitepress'

const theme = DefaultTheme

theme.Layout = Layout
theme.NotFound = NotFound
theme.enhanceApp = (ctx) => {
    const { app } = ctx
    app.component('Newsletter', Newsletter)
    app.component('CardPost', CardPost)
    app.component('Posts', Posts)

    installSchemaOrg(ctx, {
        // set to your production domain
        canonicalHost: 'https://harlanzw.com',
        // change to your default language
        defaultLanguage: 'en-AU',
    })

    // if we're in a server context then we exit out here
    if (typeof document === 'undefined' || typeof window === 'undefined') {
        return
    }

    const zooming = new Zooming()
    zooming.config({
        scaleBase: 0.75,
        bgOpacity: 0,
    })
    app.provide('zoom', zooming)

    // analytics
    app.provide('analytics', Panelbear)
    Panelbear.load('9EWSXgG8txm', {
        spaMode: 'history',
        autoTrack: true,
        debug: false, //import.meta.env.DEV
    })
}

export default DefaultTheme
