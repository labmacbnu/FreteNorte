<script setup>
import {  RouterView, useRoute, useRouter } from 'vue-router' 
import TheNavigation from './components/TheNavigation.vue';  
import {  onServerPrefetch, provide, ref } from 'vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { firebaseApp } from './firebaseConfig'
import { useUserPermissionsStore } from './stores/user'; 
import { useUsuariosStore } from './stores/users';
import { useAmbientesStore } from './stores/ambientes';
import {useListaAmbientes} from './stores/agregados'
import { usePendingPromises } from 'vuefire'


const usuarios = useUsuariosStore()
const ambiente = useAmbientesStore()
const lista_ambientes = useListaAmbientes() 

const route = useRoute()
const router = useRouter()


const globaluser = ref(null) 
const permission = useUserPermissionsStore();

function updateUser(state) {
    globaluser.value = state
}

const auth = getAuth(firebaseApp);

onAuthStateChanged(auth, (user) => {
  if (user) {
    updateUser(user)
    permission.set_email(user.email)
    permission.get_permissions()
  } else {
    updateUser(null)
    permission.reset()
  }
});

provide('globaluser', {globaluser, updateUser})


router.beforeEach( (to, from, next) => { 
  // routes with `meta: { requiresAuth: true }` will check for the users, others won't
  if (to.meta.requiresAuth) {
    // if the user is not logged in, redirect to the login page
    if (!globaluser.value) {
      next({
        name: 'login',
        query: {
          // we keep the current path in the query so we can redirect to it after login
          // with `router.push(route.query.redirect || '/')`
          redirect: to.fullPath,
          o: "router"
        }
      })
    } else {
      next()
    } 
  } else {
    next()
  } 
})
onServerPrefetch(() => usePendingPromises())

</script>

<template> 
  <TheNavigation></TheNavigation>   
  <div id="maincontainer" class="container-fluid px-3">
  <RouterView :key="route.path"/>
  </div>
</template>

<style scoped> 
#maincontainer{
  margin-top: 100px;
}
</style>
