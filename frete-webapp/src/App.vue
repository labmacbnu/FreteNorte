<script setup>
import {  RouterView, useRoute } from 'vue-router' 
import TheNavigation from './components/TheNavigation.vue'; 
import { useAmbientesStore } from './stores/ambientes';
import { onBeforeMount } from 'vue';
import { useUserStore } from './stores/user';

const user = useUserStore();
const ambientes = useAmbientesStore() 
const route = useRoute()


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
