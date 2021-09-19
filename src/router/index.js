import { createRouter, createWebHistory } from 'vue-router';
import store from '../store';

const Login = () =>
  import(/* webpackChunkName: "Login" */ '../views/auth/Login.vue');
const Signup = () => import('../views/auth/Signup.vue');
const Home = () => import('../views/Home.vue');
const GetMetamask = () => import('../views/GetMetamask.vue');
const Documents = () => import('../views/Documents.vue');
const Document = () => import('../views/Document.vue');
const Certificate = () => import('../views/Certificate.vue');

const routes = [
  { path: '', component: Home },
  { path: '/metamask', component: GetMetamask },
  { path: '/login', component: Login, meta: { auth: false } },
  { path: '/signup', component: Signup, meta: { auth: false } },
  { path: '/certificates', component: Certificate, meta: { auth: true } },
  { path: '/documents', component: Documents },
  { path: '/documents/:id', component: Document },
  {
    path: '/docs',
    beforeEnter() {
      location.href = 'https://miker83z.github.io/intelligible-docs/';
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if ('auth' in to.meta && to.meta.auth && !store.getters['isAuthenticated']) {
    next('/login');
  } else if (
    'auth' in to.meta &&
    !to.meta.auth &&
    store.getters['isAuthenticated']
  ) {
    next('/home');
  } else {
    next();
  }
});

export default router;
