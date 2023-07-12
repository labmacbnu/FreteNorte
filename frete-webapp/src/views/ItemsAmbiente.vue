<script setup>
import { computed, onBeforeMount, onBeforeUpdate, onMounted, onUpdated, ref } from 'vue';
import { useAmbientesStore } from '../stores/ambientes';
import { useItemsAmbienteStore } from '../stores/items' 
import Acordeao from '../components/AcordeaoItems.vue';
import { RouterLink, useRoute } from 'vue-router';

const ambientes = useAmbientesStore()
const items = useItemsAmbienteStore()
const route = useRoute()

onMounted( () => { 
     // hack para atualizar o items store ao calcular o ambiente
    const ambiente = route.params.ambiente
    console.log(ambiente)
    items.ambiente = ambiente
    items.load_data() 
})

</script>

<template> 
  <div class="row justify-contents-start">
    <div class="col-12"> 
     <p class="m-1"><RouterLink :to="{name: 'items'}"><i class="bi bi-arrow-left-short"></i>Voltar</RouterLink></p>
     <p class="m-3 text-end">
      <RouterLink class="btn btn-primary" :to="{name: 'item-add', query: {ambiente: route.params.ambiente}}"><i class="bi bi-plus-circle me-2"></i>Adicionar item</RouterLink>
     </p>
    <h4>Lista de items de {{ route.params.ambiente }}</h4> 
    <Acordeao id="acordeao" :lista_agrupada="items.dados_agrupados" />
    </div>
  </div>
</template>
