import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useUserStore } from '../stores/user'
import { getAuth } from 'firebase/auth'
import { firebaseApp } from '../firebaseConfig'
import { inject } from 'vue'

const auth = getAuth(firebaseApp)  

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        requiresAuth: false
      }
    },
    { 
        name: 'login',
        path: '/login',
        component: () => import('../views/PerfilLogin.vue'),
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/items', 
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/ItemsView.vue'),
      meta: {
        requiresAuth: true
      },
      children: [
        {
          name: 'items',
          path: '',
          component: () => import('../views/ItemsHome.vue')
        },
        {
          name: 'items-ambiente',
          path: 'ambiente/:ambiente',
          component: () => import('../views/ItemsAmbiente.vue')
        },
        {
          name: 'item-codigo',
          path: 'cod/:codigo',
          component: () => import('../views/ItemsCod.vue')
        },
      ]
    },
    {
      path: '/pacotes',
      name: 'pacotes',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/PacotesView.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/lotes',
      name: 'lotes',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/LotesView.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/qrscan',
      name: 'qrcode',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/ScanearView.vue'),
      meta: {
        requiresAuth: true
      }
    }
  ]
})


export default router
