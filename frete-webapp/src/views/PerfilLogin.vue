<script setup>
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "../stores/user";
import { computed, onBeforeUpdate } from "vue";
import { onBeforeMount } from "vue";

const router = useRouter();
const user = useUserStore();


function redirectproperly() {
    const route = useRoute()
    var next = route.query.redirect
    if (!next) {
        var next = { name: 'perfil' }
    }
    if (user.isLogged) {
        router.push(next)
    }

}

onBeforeMount(redirectproperly )
onBeforeUpdate(redirectproperly )

</script>

<template>
 <template v-if="user.isLogged">
        {{ user.displayName }}
        <button class="btn btn-primary" @click="user.logout">Logout</button>
    </template>
    <template v-else>
        O recurso que você está querendo acessar requer que você faça login.
        <a class="text-decoration-none" @click="user.login('/perfil')">
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

