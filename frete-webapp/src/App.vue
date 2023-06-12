<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router' 
import TheNavigation from './components/TheNavigation.vue';

const route = useRoute()
</script>

<template> 
<div class="container">

  <TheNavigation></TheNavigation>  
  <RouterView :key="route.path"/>
</div>
</template>

<style scoped> 
</style>
