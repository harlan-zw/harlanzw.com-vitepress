import './styles/main.scss';
import './styles/vars.css';
import './styles/layout.css';
import './styles/code.css';
import './styles/custom-blocks.css';
import Layout from './Layout.vue';
import NotFound from './NotFound.vue';
import CardPost from './components/CardPost.vue';
import Zooming from 'zooming'

const theme = {
    Layout,
    NotFound,
    enhanceApp({ app, }) {
        if (typeof document !== 'undefined') {

            const zooming = new Zooming()
            zooming.config({
                scaleBase: 0.75,
                bgOpacity: 0.75,
            })
            app.provide('zoom', zooming)
        }

        app.component('CardPost', CardPost)
    }
};
export default theme;
