<script setup>
import { computed, onBeforeMount, onBeforeUpdate, onMounted, onUpdated, ref } from 'vue';
import { useAmbientesStore } from '../stores/ambientes';
import { useItemsAmbienteStore } from '../stores/items' 
import Acordeao from '../components/AcordeaoItems.vue';
import { RouterLink, useRoute } from 'vue-router';

const ambientes = useAmbientesStore()
const items = useItemsAmbienteStore()
const route = useRoute()

const ambiente_completo = computed( () => {
    const amb = route.params.ambiente;
    const ambiente = ambientes.dados.filter( (elem) => elem.ambiente_codigo == amb )[0]
    // hack para atualizar o items store ao calcular o ambiente
    items.ambiente = ambiente.valor
    items.load_data()
    return ambiente
})

</script>

<template> 
  <div class="row justify-contents-start">
    <div class="col-12"> 
     <p class="m-1"><RouterLink :to="{name: 'items'}"><i class="bi bi-arrow-left-short"></i>Voltar</RouterLink></p>
      
    <h4>Lista de items de {{ ambiente_completo.ambiente_nome }}</h4> 
    <Acordeao id="acordeao" :lista_agrupada="items.dados_agrupados" />
    </div>
  </div>
</template>
