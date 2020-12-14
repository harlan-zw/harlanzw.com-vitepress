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

const theme = {
    Layout,
    NotFound,
    enhanceApp({ app, }) {
        if (typeof document !== 'undefined' && typeof window !== 'undefined') {

            const zooming = new Zooming()
            zooming.config({
                scaleBase: 0.75,
                bgOpacity: 0.75,
            })
            app.provide('zoom', zooming)

            window.addEventListener('load', () => {
                // analytics
                window.panelbear = window.panelbear || function () {
                    window.panelbearQ = window.panelbearQ || [];
                    panelbearQ.push(arguments);
                };
                window.panelbear('config', { site: '9EWSXgG8txm', spaMode: 'history' });
            })
        }
        app.component('Newsletter', Newsletter)
        app.component('CardPost', CardPost)
        app.component('Posts', Posts)
    }
};
export default theme;
