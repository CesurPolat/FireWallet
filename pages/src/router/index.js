import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue';
import LoadingView from '../views/LoadingView.vue';
import UnlockView from '../views/UnlockView.vue';
import CreateView from '../views/CreateView.vue';
import NotificationView from '../views/NotificationView.vue';
import requestAccounts from '../views/requestAccountsView.vue';

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
      path:'/unlock',
      name:'Unlock',
      component:UnlockView
    },
    {
      path:'/notification',
      name:'Notification',
      component:NotificationView
    },
    {
      path:'/create',
      name:'Create Wallet',
      component:CreateView
    },
    {
      path:'/requestAccounts',
      name:'Request Accounts',
      component:requestAccounts
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
