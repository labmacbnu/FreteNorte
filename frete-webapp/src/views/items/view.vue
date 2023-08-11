<script setup>
import { computed, onBeforeMount, ref } from 'vue'; 
import { RouterView, useRoute } from 'vue-router'; 
import { useUserPermissionsStore } from '@/stores/user'; 

const route = useRoute()  

</script>

<template>
  <RouterView :key="route.fullPath"></RouterView>
</template>
