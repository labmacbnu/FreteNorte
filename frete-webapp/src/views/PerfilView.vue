<script setup>
import { useRoute } from 'vue-router';

const route = useRoute()
</script>

<template>
 Perfil
 <RouterView :key="route.path"/>
</template>

