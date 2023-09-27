<script setup>
import { db } from '@/backend/index';
import { collection, where, doc, setDoc, query, orderBy, limit } from 'firebase/firestore';
import { useCollection, useDocument } from 'vuefire';
import { reactive, computed, ref } from 'vue';


const volRef = collection(db, "volumes")
const embalados = useCollection(query(volRef, where('embalagem.caixa', '==', 'caixa_padrao'), where('deleted', '==', false)), { wait: true, maxRefDepth: 1 })


</script>
<template> 
<table class="table table-hover">
    <thead>
        <tr>
            <th>Volume</th>
            <th>Origem</th>
            <th>Categoria</th>
            <th>Responsável</th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="(volume, i) in embalados" :key="'emb-' + i">
            <td>{{ volume.id }}</td>
            <td>{{ volume.origem.codigo }}</td>
            <td>{{ volume.categoria }}</td>
            <td>{{ volume.responsavel.nome }}</td>
        </tr>
    </tbody>
</table> 
</template>