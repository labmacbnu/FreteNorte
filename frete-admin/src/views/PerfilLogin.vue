<script setup>
import { loginWithGoogle, globalLogout, useUserPermissionsStore } from '@/stores/user'
import { useRoute, useRouter } from "vue-router";
import { computed, inject, onBeforeMount, onBeforeUpdate, onMounted } from "vue";
import { getUserPermissions } from '@/stores/user';

const router = useRouter();
const { globaluser, updateUser } = inject('globaluser')
const permission = useUserPermissionsStore();

function redirectproperly() {
    const { globaluser, updateUser } = inject('globaluser')
    const route = useRoute();
    const proximo = route.query.redirect
    if (globaluser.value) {
        if (proximo != null) {
            //console.log(proximo)
            router.push({ path: proximo })
        } else {
            
        }
    } else { 
        
    }
}
 

onBeforeMount(redirectproperly) 
onBeforeUpdate(redirectproperly)

</script>

<template>
    <template v-if="globaluser">
        <div class="row">
            <div class="col">
                <h2>{{ globaluser.displayName }}</h2>
                <p class="fst-italic"> {{ globaluser.email }}
                    <span class="badge text-bg-warning">{{ permission.role }}</span>
                </p>
            </div>
            <div class="col">
                <button class="btn btn-primary" @click="globalLogout">Logout</button>
            </div> 
        </div>

    </template>
    <template v-else>
        O recurso que você está querendo acessar requer que você faça login.
        <a class="text-decoration-none" @click="loginWithGoogle">
            <div class="botao-login border border-primary px-2 mx-auto rounded">
                <img class="imagem-login me-2"
                    src="/g-logo.png">Fazer login com Google
            </div>
        </a>
    </template>
</template>

<style>
.imagem-login {
    height: 40px;
}

.botao-login { 
    padding: 6px;
    width: fit-content;
    height: fit-content;
    cursor: pointer;
}
</style>

