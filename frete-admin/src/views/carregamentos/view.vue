<template>
    <h1>Carregamento {{ carregCod }}</h1>

    <ul class="list-group">
        <li class="list-group-item">
            <strong>Data de criação:</strong> {{ formatDate(carregamento.data_criacao) }}
        </li>
        <li class="list-group-item">
            <strong>Data de saída:</strong> {{ formatDate(carregamento.data_saida) }}
        </li>
        <li class="list-group-item">
            <strong>Saída:</strong> {{ carregamento.saida }}
        </li>
    </ul>
    <h3>Lotes</h3>
    <ul class="list-group">
        <li class="list-group-item" v-for="lote in lotes" :key="lote.id">
            <strong>Lote:</strong> {{ lote.nome }}<br> 
            <strong>Volumes:</strong> {{ lote.n_volumes }}<br>
        </li>
    </ul>
    
</template>
<script setup>
import { useRoute } from 'vue-router'
import {db} from '@/backend'
import { useCollection, useDocument } from 'vuefire'
import { query, collection, where, doc } from 'firebase/firestore'
import moment from 'moment'
function formatDate(data) {
    const momento = moment.unix(data.seconds)
    return momento.format("DD/MM/YY HH[h]mm")
}

const route = useRoute()
const carregCod = route.params.id

const carregRef = doc(db, 'carregamentos', carregCod)
const carregamento = useDocument(carregRef)
const lotes = useCollection(query(collection(db, 'lotes'), where('carregamento', '==', carregRef)), {maxRefDepth: 1})
</script>