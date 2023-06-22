<script setup>
import { computed, onBeforeMount, onBeforeUpdate, onMounted, onUpdated, ref } from 'vue';
import { useAmbientesStore } from '../stores/ambientes';
import { useItemsAmbienteStore } from '../stores/items'
import AcordeaoChild from '../components/AcordeaoChild.vue';
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
 

//onBeforeMount(async () => ambientes.load_data()) 


</script>

<template> 
  
  <RouterLink :to="{name: 'items'}">Voltar</RouterLink>
    <h4>Lista de items de {{ ambiente_completo.ambiente_nome }}</h4>  
    <div class="accordion" id="acordeao">
        <AcordeaoChild v-for="(valor, chave, n) in items.dados_agrupados" pai="acordeao" :aid="'acord' + n">
            <template #titulo>
                <span class="badge rounded-pill text-bg-secondary mx-1">{{valor.length}}</span> {{chave}} 
            </template>
            
            <template #corpo>
            <ul class="list-group">
                <li class="list-group-item" v-for="subitem in valor">
                    {{ subitem.descricao }}
                    <RouterLink :to="{name: 'item-codigo', params: {codigo: subitem.key }}">Ver item</RouterLink>
                </li>
            </ul>
        </template>
        </AcordeaoChild>
    </div>
</template>
