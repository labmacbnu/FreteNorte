<script setup>
import { db } from '@/backend/index';
import { collection, where, doc, setDoc, query, orderBy, limit } from 'firebase/firestore';
import { useCollection, useDocument } from 'vuefire';
import { reactive, computed, ref } from 'vue';
import { orderedGroupBy } from '@/stores/groupby.js'

const volRef = collection(db, "volumes")
const embalados = useCollection(query(volRef, where('embalagem.caixa', '==', 'caixa_padrao'), where('deleted', '==', false)), { wait: true, maxRefDepth: 1 })

const grupo_embalados = computed(() => {
    return orderedGroupBy(embalados.value, x => x.origem.codigo)
})
</script>
<template> 
Volumes que precisam da caixa padrão: {{ embalados.length }}
<table class="table table-hover">
    <thead>
        <tr>
            <th>Origem</th>
            <th>Volume</th> 
            <th>Categoria</th>
            <th>Responsável</th>
        </tr>
    </thead>
    <tbody>
        <template v-for="(embals, codigo, i) in grupo_embalados"> 
        <tr v-for="(volume, i) in embals" :key="'emb-' + i">
            <td>{{ codigo }}</td>
            <td>{{ volume.id }}</td> 
            <td>{{ volume.categoria }}</td>
            <td>{{ volume.responsavel.nome }}</td>
        </tr>
        </template> 
    </tbody>
</table> 
 
</template>