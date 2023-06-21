<script setup>
import {  RouterView, useRoute, useRouter } from 'vue-router' 
import TheNavigation from './components/TheNavigation.vue'; 
import { useAmbientesStore } from './stores/ambientes';
import {  provide, ref } from 'vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { firebaseApp } from './firebaseConfig'
 
 
const ambientes = useAmbientesStore() 
const route = useRoute()
const router = useRouter()


const globaluser = ref(null)

function updateUser(state) {
    globaluser.value = state
}

const auth = getAuth(firebaseApp);

onAuthStateChanged(auth, (user) => {
  if (user) {
    updateUser(user)
  } else {
    updateUser(null)
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

</script>

<template> 
<div class="container">

  <TheNavigation></TheNavigation>  
  <RouterView :key="route.path"/>
</div>
</template>

<style scoped> 
.container{
  padding-top: 100px;
}
</style>
