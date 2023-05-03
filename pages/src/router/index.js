import { createRouter, createWebHashHistory } from 'vue-router'
import LoadingView from '../views/LoadingView.vue';
import CreateView from '../views/CreateView.vue';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Loading',
      component: LoadingView//() => import('../views/AboutView.vue')
    },
    {
      path:'/home',
      name:'Home',
      component:HomeView
    },
    {
      path:'/create',
      name:'Create Wallet',
      component:CreateView
    },
    {
      path: "/:catchAll(.*)",
      redirect:'/'
    }
  ]
})

router.afterEach((to)=>{
  document.title=to.name;
})

export default router
