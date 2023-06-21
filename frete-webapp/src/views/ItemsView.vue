<script setup>
import { computed, onBeforeMount, ref } from 'vue';
import { useAmbientesStore } from '../stores/ambientes';
import { useItemsStore } from '../stores/items'
import AcordeaoChild from '../components/AcordeaoChild.vue';
import { RouterLink, RouterView, useRoute } from 'vue-router'; 

const route = useRoute()
const ambientes = useAmbientesStore() 

const selected = ref("")

const ambientes_filtrados = computed( () => {
    if(selected.value.length >= 3) {
        const regex = new RegExp(`.*${selected.value}.*`, 'i'); 
        return ambientes.dados.filter(
            obj => regex.test(obj.valor)
            );
    }
})


onBeforeMount(async () => ambientes.load_data())
</script>

<template>
  <RouterView :key="route.path"></RouterView>
</template>
