import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useUserStore } from '../stores/user'
import { getAuth } from 'firebase/auth'
import { firebaseApp } from '../firebaseConfig'

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
      path: '/perfil', 
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.  
      component: () => import('../views/PerfilView.vue'),
      children: [
        {
          name: 'perfil',
          path: '',
          component: () => import('../views/PerfilHome.vue'),
          meta: {
            requiresAuth: true
          }
        },
        { name: 'login',
         path: 'login', 
         component: () => import('../views/PerfilLogin.vue')
        }

      ]
    },
    {
      path: '/items',
      name: 'items',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/ItemsView.vue'),
      meta: {
        requiresAuth: true
      },
      children: [
        {name: 'items-ambiente',
        path: '/items/ambiente/:ambiente',
        component: () => import('../views/ItemsAmbiente.vue')
       }
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

router.beforeEach(async (to, from) => {
  // routes with `meta: { requiresAuth: true }` will check for the users, others won't
  if (to.meta.requiresAuth) { 
    const user = auth.currentUser
    // if the user is not logged in, redirect to the login page
    if (!user) {
      return {
        name: 'login', 
        query: {
          // we keep the current path in the query so we can redirect to it after login
          // with `router.push(route.query.redirect || '/')`
          redirect: to.fullPath,
        },
      }
    }
  }
})

export default router
