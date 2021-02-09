import { createApp } from 'vue';
import App from './App.vue';
import router from './router/';
import ipfs from './plugins/ipfs';
import store from './store/';
import './assets/css/style.css';
import './assets/fonts/material-icon/css/material-design-iconic-font.min.css';
import VueSidebarMenu from 'vue-sidebar-menu';
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css';

const app = createApp(App);

app.use(VueSidebarMenu);
app.use(router);
app.use(ipfs);
app.use(store);
app.mount('#app');
