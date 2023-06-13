<script setup>
import { useUserStore } from '../stores/user';

const user  = useUserStore()

</script>

<template>
    <!-- <img class="float-end" :src="user.photoURL"> -->
    <div class="row my-3">
        <div class="col">
 <h2>{{user.displayName}}</h2>
 <p class="fst-italic"> {{ user.email }} 
 <span class="badge text-bg-warning">{{ user.role }}</span></p>
 <!-- {{ user }} -->
 </div></div>
 <a class="btn btn-primary float-end" @click="user.logout" href="#">Sair</a>
</template>

