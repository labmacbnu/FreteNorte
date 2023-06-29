<script setup>
import { computed, onBeforeMount, ref } from 'vue';
import { useAmbientesStore } from '../stores/ambientes';  
import { RouterView, useRoute } from 'vue-router'; 
import { useUserPermissionsStore } from '../stores/user';

const route = useRoute()
const ambientes = useAmbientesStore() 
const permissoes = useUserPermissionsStore()

const selected = ref("")

const ambientes_filtrados = computed( () => {
    if(selected.value.length >= 3) {
        const regex = new RegExp(`.*${selected.value}.*`, 'i'); 
        return ambientes.dados.filter(
            obj => regex.test(obj.valor)
            );
    }
})


onBeforeMount(ambientes.load_data)
</script>

<template>
  <RouterView :key="route.path"></RouterView>
</template>
