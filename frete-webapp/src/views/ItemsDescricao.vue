<script setup>
import { useRoute } from 'vue-router'; 
import { onBeforeMount, onMounted } from 'vue';
import { useItemsDescricaoStore } from '../stores/items' 
import AcordeaoChild from '../components/AcordeaoChild.vue';
 


const items = useItemsDescricaoStore()
const route = useRoute()
const descricao = route.query.descricao


onBeforeMount(async () => { 
const route = useRoute()
const descricao = route.query.descricao
const items = useItemsDescricaoStore()
items.short_descricao = descricao
await items.load_data()
})
</script>

<template>
    <div class="row justify-contents-start">
      <div class="col-12"> 
<p class="m-1"><RouterLink :to="{name: 'items'}"><i class="bi bi-arrow-left-short"></i>Voltar</RouterLink></p>
        <h4>{{ descricao }}</h4>
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
