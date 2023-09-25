<script setup>
import {  RouterView, useRoute, useRouter } from 'vue-router' 
import TheNavigation from './components/TheNavigation.vue'; 
import { useAmbientesUserStore } from './stores/ambientes';
import {  onBeforeMount, onMounted, provide, ref } from 'vue';
import { getAuth, onAuthStateChanged,  } from 'firebase/auth'
import { firebaseApp } from './firebaseConfig'
import { useUserPermissionsStore } from './stores/user';
import { useDescricoesStore } from './stores/items';
 
 
const route = useRoute()
const router = useRouter()
const descricoes = useDescricoesStore()


const globaluser = ref(null) 
const permission = useUserPermissionsStore(); 

function updateUser(state) {
    globaluser.value = state
}

const auth = getAuth(firebaseApp);

onAuthStateChanged(auth, async (user) => {
  if (user) {
    updateUser(user)
    permission.set_email(user.email)
    await permission.get_permissions()
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

router.afterEach( (to, from) => {
  document.title = `Frete Norte - ${to.meta.title}`
}) 

onBeforeMount(descricoes.load_data) 

const mensagem_popup = ref(null)
const mensagem_level = ref(null)
function level_classes(level) {
  switch (level) {
    case "info":
      return "bg-light text-dark"
    case "warning":
      return "bg-warning-subtle text-dark"
    case "danger":
      return "bg-danger-subtle text-dark"
    case "success":
      return "bg-success-subtle text-dark"
    default:
      return "bg-body-secondary text-dark"
  }
} 
 
/**
 * Mostra uma mensagem de alerta no meio da tela
 * @param {string} mensagem A mensagem a ser exibida no popup
 * @param {"info" | "warning" | "danger" | "success"} level A cor que o popup deve ter
 */
function set_mensagem_popup(mensagem, level = "info"){
  mensagem_level.value = level_classes(level)
  mensagem_popup.value = mensagem
  const myToastEl = document.getElementById('liveToast') 
  const myToast = bootstrap.Toast.getOrCreateInstance(myToastEl)
  myToast.show()
} 
 
provide('mensagem', {set_mensagem_popup}) 
// Em qualquer parte do app, é só usar o inject para ter acesso à função
// const { set_mensagem_popup } = inject("mensagem")

onMounted(() => {
  const myAlert = document.getElementById('liveToast')
  new bootstrap.Toast(myAlert, {delay: 3000})
})
onMounted(async () => {
  const auth = getAuth()
  const user = auth.currentUser
  if(user) {
    updateUser(user)
    permission.set_email(user.email)
    await permission.get_permissions()
  }
})
</script>

<template> 
<div class="container"> 
    <div id="liveToast" :class="mensagem_level" class="toast align-items-center"
    role="alert" aria-live="assertive" aria-atomic="true">
    <div class="d-flex">
      <div class="toast-body">
        {{ mensagem_popup }}
      </div>
      <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  </div> 
    
  <TheNavigation></TheNavigation>  
  <RouterView :key="route.path"/>
</div>
</template>

<style scoped> 
@media screen {
.container{
  padding-top: 100px;
}
}


#liveToast { 
  z-index: 1050;  
  position: absolute;
  top: 120px;
  left: 50%;
  width: 40vw;
  margin-left: -20vw; 
}
</style>
