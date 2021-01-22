import { createRouter, createWebHistory } from 'vue-router';
import store from '../store';

const Login = () =>
  import(/* webpackChunkName: "Login" */ '../pages/auth/Login.vue');
const Signup = () => import('../pages/auth/Signup.vue');
const Home = () => import('../pages/Home.vue');
const GetMetamask = () => import('../pages/GetMetamask.vue');
const Certificates = () => import('../pages/Certificates.vue');

const routes = [
  { path: '', component: Home },
  { path: '/metamask', component: GetMetamask },
  { path: '/login', component: Login, meta: { auth: false } },
  { path: '/signup', component: Signup, meta: { auth: false } },
  { path: '/certificates', component: Certificates, meta: { auth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if ('auth' in to.meta && to.meta.auth && store.getters['getToken']) {
    next('/login');
  } else if (
    'auth' in to.meta &&
    !to.meta.auth &&
    store.getters['isAuthenticated']
  ) {
    next('/certificates');
  } else {
    next();
  }
});

export default router;
