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

</script>

<template> 
  <div class="row justify-contents-start">
    <div class="col-12"> 
  <RouterLink :to="{name: 'items'}"><i class="bi bi-arrow-left-short"></i>Voltar</RouterLink>
    <h4>Lista de items de {{ ambiente_completo.ambiente_nome }}</h4>  
    <div class="accordion" id="acordeao">
        <AcordeaoChild v-for="(valor, chave, n) in items.dados_agrupados" pai="acordeao" :aid="'acord' + n">
            <template #titulo>
                <span class="badge rounded-pill text-bg-secondary mx-1">{{valor.length}}</span> {{chave}} 
            </template>
            
            <template #corpo>
            <ul class="list-group">
                <li class="list-group-item d-flex justify-content-between align-items-center" v-for="subitem in valor">
                    {{ subitem.descricao }}
                    <span class="badge badge-primary badge-pill">
                    <RouterLink :to="{name: 'item-codigo', params: {codigo: subitem.key }}">Ver item</RouterLink></span>
                </li>
            </ul>
        </template>
        </AcordeaoChild>
    </div>
    </div>
  </div>
</template>
