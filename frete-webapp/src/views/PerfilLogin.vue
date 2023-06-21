<script setup> 
import { loginWithGoogle, globalLogout, useUserStore } from '../stores/user'
import { useRoute, useRouter } from "vue-router"; 
import {  computed, inject, onBeforeMount, onBeforeUpdate } from "vue"; 

const user = useUserStore();
const {globaluser, updateUser} = inject('globaluser') 
const router = useRouter();

function redirectproperly() {
    const {globaluser, updateUser} = inject('globaluser') 
    const route = useRoute();
    const proximo = route.query.redirect 
    if (globaluser.value) {
        if(proximo != null) {
            //console.log(proximo)
            router.push({path: proximo})
        } else {
            console.log("mas que caralho")
        }
    } else {
        console.log('que inferno')
            //router.push({name: "login"})
    }
}
onBeforeMount(redirectproperly)
onBeforeUpdate(redirectproperly)

</script>

<template>
 <template v-if="globaluser">
    <div class="row">
    <div class="col">
         <h2>{{globaluser.displayName}}</h2>
            <p class="fst-italic"> {{ globaluser.email }} 
            <span class="badge text-bg-warning">{{ user.role }}</span></p> 
        </div>
        <div class="col">
            <button class="btn btn-primary" @click="globalLogout">Logout</button>
        </div>
        </div>
       
    </template>
    <template v-else>
        O recurso que você está querendo acessar requer que você faça login.
        <a class="text-decoration-none" @click="loginWithGoogle">
            <div class="botao-login border border-secondary mx-auto">
                <img class="imagem-login"
                    src="https://developers.google.com/static/identity/images/g-logo.png?hl=pt-br">Fazer login com Google
            </div>
        </a>
    </template>
</template>

<style>
.imagem-login {
    height: 40px;
}

.botao-login {
    font-family: 'Roboto';
    padding: 6px;
    width: fit-content;
    height: fit-content;
    cursor: pointer;
}
</style>

