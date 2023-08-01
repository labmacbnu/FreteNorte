<script setup>
import { useRoute } from 'vue-router'; 
import { onBeforeMount, onMounted } from 'vue';
import { useItemsDescricaoStore } from '@/stores/items' 
import AcordeaoChild from '@/components/AcordeaoChild.vue';
import Acordeao from '@/components/AcordeaoItems.vue';
 


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
        <Acordeao id="acordeao" :lista_agrupada="items.dados_agrupados" />
    </div>
    </div>
</template>
