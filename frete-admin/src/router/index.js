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
      path: '/carregamentos',
      component: () =>  import('@/views/volumes/view.vue'),
      children: [
        {
          path: '',
          name: 'carregamentos',
          component: () => import('@/views/carregamentos/home.vue'),
          meta:{
            requiresAuth: true,
            title: "Carregamentos"
          }
        },  
        {
          path: 'add',
          name: 'carregamentos-add',
          component: () => import('@/views/carregamentos/add.vue'),
          meta: {
            requiresAuth: true,
            title: "Adicionar carregamento"
          }
        },  
        {
          path: 'edit/:id',
          name: 'carregamentos-edit',
          component: () => import('@/views/carregamentos/edit.vue'),
          meta: {
            requiresAuth: true,
            title: "Editar carregamento"
          }
        },
        {
          path: 'cod/:id',
          name: 'carregamentos-view',
          component: () => import('@/views/carregamentos/view.vue'),
          meta: {
            requiresAuth: true,
            title: "Visualizar carregamento"
          }
        },
        {
          path: 'cod/:id/addlote',
          name: 'carregamentos-add-lote',
          component: () => import('@/views/carregamentos/add-lote.vue'),
          meta: {
            requiresAuth: true,
            title: "Adicionar lote ao carregamento"
          }
        }
      ]
    },
    {

      path: '/lotes',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/volumes/view.vue'),
      meta: {
        requiresAuth: true
      },
      children: [
        {
        path: '',
        name: 'lotes-home', 
        component: () => import('@/views/lotes/LotesHome.vue'),
        meta: { title: "Lotes" }
        }, 
        {
          path: 'cod/:codigo',
          name: 'lotes-codigo',
          component: () => import('@/views/lotes/LotesCodigo.vue'),
          meta: { title: "Lote por código" }
        },
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
