<template>
    <div class="row">
        <div class="col-8">
            <h1>Carregamentos</h1>

        </div>
        <div class="col-4 text-end">
            <RouterLink :to="{ name: 'carregamentos-add' }" class="btn btn-primary"><i class="bi bi-plus"></i>Adicionar
                carregamento</RouterLink>
        </div>
    </div>
    <div class="row"> 
        <div class="col-auto">
            <CarregamentoTable :carregamentos="carregamentos" />
        </div>
    </div> 
</template>
<script setup> 
import { RouterLink } from 'vue-router';
import { useCollection } from 'vuefire';
import { db } from '@/backend';
import { collection } from 'firebase/firestore';   


import CarregamentoTable from '@/components/CarregamentoTable.vue';
import moment from 'moment';

function formata_data(data) {
    const momento = moment.unix(data.seconds)
    return momento.format("DD/MM/YY")
}


const {data: carregamentos, pending} = useCollection(collection(db, 'carregamentos'));

</script>