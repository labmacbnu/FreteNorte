import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue' 
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
        requiresAuth: false,
        title: "Home"
      }
    },
    {
      path: '/negado', 
      name: 'negado', 
      component: () => import('@/views/Forbiden.vue'),
      meta: {
        requiresAuth: false,
        title: "Acesso negado"
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
      path: '/usuarios',
      name: 'users',
      component: () => import('../views/UsersView.vue'),
      meta: {
        requiresAuth: true,
        title: "Usuários"
      }
    },
    {
      path: '/ambientes',
      name: 'ambientes',
      component: () => import('../views/AmbientesView.vue'),
      meta: {
        requiresAuth: true,
        title: "Ambientes"
      }
    },
    { 
        path: '/volumes',
        component: () => import('@/views/volumes/view.vue'),
        children: [
          { 
            name: 'volumes',
            path: '',
            component: () => import('@/views/volumes/home.vue'),
            meta: {
              requiresAuth: true,
              title: "Volumes"
            }
          },
          {
            path: 'cod/:codigo',
            name: 'volume-codigo',
            component: () => import('@/views/volumes/codigo.vue'),
            meta: { title: "Volume por código"}
          },
          { 
            name: 'volumes-edita-categorias',
            path: 'categoriasedit',
            component: () => import('@/views/volumes/categorias.vue'),
            meta: {
              requiresAuth: true,
              title: "Editar categorias"
            }
          }
        ]
    },
    {
      path: '/lotes',
      component: () =>  import('@/views/volumes/view.vue'),
      children: [
        {
          path: '',
          name: 'lotes',
          component: () => import('@/views/lotes/home.vue'),
          meta:{
            requiresAuth: true,
            title: "Lotes"
          }
        },  
        {
          path: 'add',
          name: 'lotes-add',
          component: () => import('@/views/lotes/add.vue'),
          meta: {
            requiresAuth: true,
            title: "Adicionar lote"
          }
        },  
        {
          path: 'edit/:id',
          name: 'lotes-edit',
          component: () => import('@/views/lotes/edit.vue'),
          meta: {
            requiresAuth: true,
            title: "Adicionar lote"
          }
        }
      ]
    },
    {
      path: '/ajuda',
      name: 'ajuda',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/AjudaView.vue'),
      meta: {
        requiresAuth: true,
        title: "Ajuda"
      }
    }, 
    {
      path: '/items',
      component: () => import('@/views/items/index.vue'),
      children: [ {
        path: '',
         name: 'descricoes-search',
         component: () => import('@/views/items/pesquisa.vue'),
         meta: {
           requiresAuth: true,
           title: "Pesquisa por itens"
         }
      }, 
      {
        path: 'descricao',
        name: 'descricoes-result',
        component: () => import('@/views/items/descricao.vue'),
        meta: {
          requiresAuth: true,
          title: "Itens por descrição"
        }
      }
    ]
    },
    {
      path: '/embalagens',
      name: 'embalagens',
      component: () => import('@/views/EmbalagensView.vue'),
      meta: {
        requiresAuth: true,
        title: "Embalagens"
      }
    }
    
  ]
})


export default router
