<script setup>
import { useUserStore } from '../stores/user';

const user  = useUserStore()

</script>

<template>
 Home
 <a @click="user.logout" href="#">Sair</a>

 {{ user.email }}
 {{ user.role }}
</template>

