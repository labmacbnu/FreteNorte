<script setup>
import { useRoute } from 'vue-router'; 
import { onBeforeMount, onMounted } from 'vue';
import { useItemsDescricaoStore } from '../stores/items' 
import AcordeaoChild from '../components/AcordeaoChild.vue';
 


const items = useItemsDescricaoStore()


onBeforeMount(async () => { 
const route = useRoute()
const descricao = route.query.descricao
const items = useItemsDescricaoStore()
items.short_descricao = descricao
await items.load_data()
})
</script>

<template>
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
