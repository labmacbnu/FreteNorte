<script setup>
import { computed, onBeforeMount, ref } from 'vue'; 
import { RouterView, useRoute } from 'vue-router'; 
import { useUserPermissionsStore } from '@/stores/user';
import { useItemsAmbienteStore } from '@/stores/items'

const route = useRoute() 
const permissoes = useUserPermissionsStore()

</script>

<template>
  <RouterView :key="route.fullPath"></RouterView>
</template>
