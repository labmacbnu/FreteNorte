import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue' 
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
        requiresAuth: false,
        title: 'Home'
      }
    },
    { 
        name: 'login',
        path: '/login',
        component: () => import('../views/PerfilLogin.vue'),
      meta: {
        requiresAuth: false,
        title: "Login"
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
          component: () => import('../views/ItemsHome.vue'),
          meta: { title: "Items"}
        },
        {
          name: 'items-ambiente',
          path: 'ambiente/:ambiente',
          component: () => import('../views/ItemsAmbiente.vue'),
          meta: { title: "Items por Ambiente"}
        },
        {
          name: 'item-codigo',
          path: 'cod/:codigo',
          component: () => import('../views/ItemsCod.vue'),
          meta: { title: "Item por código"}
        },
        {
          name: 'item-descricao',
          path: 'descricao',
          component: () => import('../views/ItemsDescricao.vue'),
          meta: { title: "Items por descrição"}
        }
      ]
    },
    {
      path: '/volumes',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/PacotesView.vue'),
      meta: {
        requiresAuth: true
      },
      children:[
        {
          path: '',
          name: 'volumes',
          component: () => import('../views/PacotesHome.vue'),
        },
        {
          path: 'cod/:codigo',
          name: 'volumes-codigo',
          component: () => import('../views/PacotesCodigo.vue')
        }
      ]
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
