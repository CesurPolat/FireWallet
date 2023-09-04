import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue';
import LoadingView from '../views/LoadingView.vue';


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
      component:HomeView,
    },
    {
      path:'/unlock',
      name:'Unlock',
      component:() => import('../views/UnlockView.vue')
    },
    {
      path:'/notification',
      name:'Notification',
      component:() => import('../views/NetworksView.vue')
    },
    {
      path:'/create',
      name:'Create Wallet',
      component:() => import('../views/CreateView.vue')
    },
    {
      path:'/requestAccounts',
      name:'Request Accounts',
      component:() => import('../views/requestAccountsView.vue')
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
