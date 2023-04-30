import { createRouter, createWebHistory } from 'vue-router'
import LoadingView from '../views/LoadingView.vue';
import CreateView from '../views/CreateView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Loading',
      component: LoadingView
    },
    {
      path:'/create',
      name:'Create Wallet',
      component:CreateView
    },
    /* {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }, */
    {
      path: "/:catchAll(.*)",
      redirect:'/'
    }
  ]
})

export default router
