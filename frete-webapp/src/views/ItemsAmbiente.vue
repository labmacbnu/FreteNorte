<script setup>
import { computed, onBeforeMount, onBeforeUpdate, onUpdated, ref } from 'vue';
import { useAmbientesStore } from '../stores/ambientes';
import { useItemsStore } from '../stores/items'
import AcordeaoChild from '../components/AcordeaoChild.vue';
import { useRoute } from 'vue-router';

const ambientes = useAmbientesStore()
const items = useItemsStore()
const route = useRoute()

const ambiente_completo = computed( () => {
    const amb = route.params.ambiente;
    return ambientes.dados.filter( (elem) => elem.ambiente_codigo == amb )[0]
})
 

//onBeforeMount(async () => ambientes.load_data())
onBeforeUpdate(async () => {  
    items.load_data()
})

</script>

<template> 
  
    <h2>Lista de items de {{ ambiente_completo.ambiente_nome }}</h2> 
    <div class="accordion" id="acordeao">
        <AcordeaoChild v-for="(valor, chave, n) in items.dados_agrupados" pai="acordeao" :aid="'acord' + n">
            <template #titulo>
                <span class="badge rounded-pill text-bg-secondary mx-1">{{valor.length}}</span> {{chave}} 
            </template>
            
            <template #corpo>
            <ul class="list-group">
                <li class="list-group-item" v-for="subitem in valor">
                    {{ subitem.descricao }}
                </li>
            </ul>
        </template>
        </AcordeaoChild>
    </div>
</template>
