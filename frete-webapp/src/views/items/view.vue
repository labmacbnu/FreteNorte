<script setup>
import { computed, onBeforeMount, ref } from 'vue';
import { useAmbientesStore } from '@/stores/ambientes';  
import { RouterView, useRoute } from 'vue-router'; 
import { useUserPermissionsStore } from '@/stores/user';
import { useItemsAmbienteStore } from '@/stores/items'

const route = useRoute()
const ambientes = useAmbientesStore() 
const permissoes = useUserPermissionsStore()

const ambientes_do_usuario = [...permissoes.ambientes, ...permissoes.usuario_de];


const items_usuario = useItemsAmbienteStore()
items_usuario.load_data(ambientes_do_usuario)

</script>

<template>
  <RouterView :key="route.fullPath"></RouterView>
</template>
