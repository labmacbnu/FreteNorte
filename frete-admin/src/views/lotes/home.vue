<template>
    <div class="row">
        <div class="col-8">
            <h1>Carregamentos</h1>

        </div>
        <div class="col-4 text-end">
            <RouterLink :to="{ name: 'lotes-add' }" class="btn btn-primary"><i class="bi bi-plus"></i>Adicionar
                carregamento</RouterLink>
        </div>
    </div>
    <div class="row">
        <!-- <div v-for="carregamento in carregamentos" :key="carregamento.id" class="col-sm-6 col-md-4"> 
            <CarregamentoShow  :carregamento="carregamento" />
        </div> -->
        <div class="col">
            <CarregamentoTable :carregamentos="carregamentos" />
        </div>
    </div> 
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { useCollection } from 'vuefire';
import { db } from '@/backend';
import { query, collection, where, doc, getAggregateFromServer, sum } from 'firebase/firestore';  
import CarregamentoShow from '@/components/CarregamentoShow.vue';
import { getLotesFromCarregamento } from '@/stores/lotes'


import CarregamentoTable from '@/components/CarregamentoTable.vue';
import moment from 'moment';

function formata_data(data) {
    const momento = moment.unix(data.seconds)
    return momento.format("DD/MM/YY")
}


const {data: carregamentos, pending} = useCollection(collection(db, 'carregamentos'));

// Código para criar os índices
// const lotesRef = collection(db, "lotes")
// const carregamentoRef = doc(db, 'carregamentos', 'C0002')
// const pesquisa = query(lotesRef, where('carregamento', '==', carregamentoRef), where('tipo', '==', 'Descarregamento'))
// const mylotes = useCollection(pesquisa, {maxRefDepth: 1})  

// const k = ref(-1)
// onMounted(async () => {
//     const result = await getAggregateFromServer(pesquisa, {k: sum('n_volumes')})
//     k.value = result.data().k 
// })
</script>