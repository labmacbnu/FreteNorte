<script setup>
import { inject } from "vue";
import { useUserStore } from "../stores/user";
import { RouterLink } from "vue-router";

const globaluser = inject("globaluser")
const user = useUserStore()

</script>

<template>
    <!-- <img class="float-end" :src="user.photoURL"> -->
    <div v-if="globaluser" class="row my-3">
        <div class="col">
         <h2>{{globaluser.displayName}}</h2>
            <p class="fst-italic"> {{ globaluser.email }} 
            <span class="badge text-bg-warning">{{ user.role }}</span></p>
 <!-- {{ user }} -->
        </div>
        </div>

        {{ globaluser }}
        {{ user }}
        
        <RouterLink :to="{name: 'login'}">login</RouterLink>
 <a class="btn btn-primary float-end" @click="() => user.logout()" href="#">Sair</a>
</template>

