<template>
    <h1>Adicionar lote ao carregamento {{ carregCod }}</h1>
    <p class="text-secondary">Selecione os lotes para adicionar ao carregamento.</p>
    <ul v-if="pending" class="list-group">
        <li class="list-group-item">Carregando...</li>
    </ul>
    <ul v-else class="list-group">
        <li class="list-group-item d-flex justify-content-between align-items-center" v-for="lote in lotesNaoCarregados"
            :class="selecionados.includes(lote.id) ? 'bg-primary text-white' : ''" @click="toggleSelecionado(lote.id)">
            <div class="ms-2 me-auto">
                <!-- <RouterLink :to="{ name: 'lotes-codigo', params: { codigo: lote.id } }"  class="d-block text-secondary"> -->
                <div class="fw-bold">{{ lote.id }}</div>
                <!-- </RouterLink> -->
                {{ lote.nome }}
            </div>
            <span class="badge bg-secondary rounded-pill">{{ lote.n_volumes }} volume</span>
        </li>
    </ul>
    <div class="text-end">
        <button @click="handleSave" class="btn btn-primary mt-3">Adicionar lotes selecionados</button>
    </div>
</template>
<script setup>

import { db } from '@/backend/index'
import { collection, query, where, doc, updateDoc } from 'firebase/firestore'
import { useCollection } from 'vuefire';
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router';

const route = useRoute()
const carregCod = route.params.id
const router = useRouter()

const carregamentoZero = doc(db, 'carregamentos', "C0000")
const { data: lotesNaoCarregados, pending } = useCollection(query(collection(db, 'lotes'), where("carregamento", "==", carregamentoZero)))

const selecionados = ref([])
function toggleSelecionado(codigo) {
    if (selecionados.value.includes(codigo)) {
        selecionados.value = selecionados.value.filter(c => c != codigo)
    } else {
        selecionados.value.push(codigo)
    }
}

async function handleSave(){
    const lotesRefs = selecionados.value.map(codigo => doc(db, 'lotes', codigo))
    const promessas = lotesRefs.map(lote => updateDoc(lote, {carregamento: doc(db, 'carregamentos', carregCod)}))
    Promise.all(promessas).then(() => {
        router.push({name: 'carregamentos-view', params: {id: carregCod}})
    })
}

</script>