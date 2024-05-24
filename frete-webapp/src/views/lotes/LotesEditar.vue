<template>
    <div class="row">
        <div class="col-12">
            <div class="hstack justify-content-between">
                <h1>Editando lote {{ loteCodigo }}</h1>
                <button @click="handleSave" class="btn btn-primary">Salvar edições</button>
            </div>
            <p class="text-secondary">Edite as informações do lote.</p>
            <h5 for="nome">Nome do lote</h5>
            <input name="nome" type="text" v-model="loteEditado.nome" class="form-control mb-3"
                placeholder="Nome do lote">
            <h5 class="mb-2">Carregamento</h5>
            <ul v-if="!pendingCarregamentos" class="list-group list-group-horizontal">
                <li :class="{ 'active': loteEditado.carregamento == 'C0000' }"
                    class="list-group-item d-flex justify-content-between align-items-center"
                    @click="loteEditado.carregamento = 'C0000'">
                    <div>
                        <div class="fw-bold">C0000</div>
                        <div style="width: 6em;">Carregamento padrão para lotes criados.</div>
                    </div>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center"
                    v-for="carregamento in carregamentos"
                    :class="{ 'active': loteEditado.carregamento == carregamento.id }"
                    @click="loteEditado.carregamento = carregamento.id">
                    <div>
                        <div class="fw-bold">{{ carregamento.id }}</div>
                        <div>{{ formatDate(carregamento.data_saida) }}</div>
                        <div>{{ carregamento.status }}</div>
                        <div>{{ carregamento.saida }}</div>
                    </div>

                </li>
            </ul>
            <h5 class="mt-2">Volumes</h5>
            <p class="text-secondary mb-1">Clicando no ícone você marca um volumes para remoção. Clicando novamente, você desmarca.</p>
            <ul class="list-group">
                <li class="list-group-item d-flex justify-content-between align-items-center"
                    v-for="volume in loteEditado.volumes"
                    :class="{ 'text-decoration-line-through text-secondary': removeList.includes(volume) }">
                    <div>{{ volume }}</div>
                    <div>
                        <button @click="toggleRemove(volume)" class="btn btn-sm"
                            :class="[removeList.includes(volume) ? 'btn-outline-secondary' : 'btn-danger']">
                            <template v-if="removeList.includes(volume)">
                                <i class="bi bi-check"></i>
                                Manter volume
                            </template>
                            <template v-else>
                                <i class="bi bi-trash"></i>
                                Remover volume
                            </template>
                        </button>
                    </div>
                </li>
            </ul>
        </div> 
    </div>

</template>
<script setup>
import { computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { db } from '@/backend/index'
import { collection, doc, query, where, arrayRemove, updateDoc, increment } from 'firebase/firestore'
import { useCollection, useDocument } from 'vuefire'

import moment from 'moment'
function formatDate(date) {
    return moment.unix(date.seconds).format('DD/MM/YYYY HH:mm')
}

const router = useRouter()
const route = useRoute()
const loteCodigo = route.params.codigo

const { data: lote, pending, promise } = useDocument(doc(db, 'lotes', loteCodigo))
const { data: carregamentos, pendingCarregamentos } = useCollection(query(collection(db, 'carregamentos'), where("status", 'in', ["agendado", "carregando"])))

const loteEditado = reactive({
    nome: null,
    volumes: [],
    carregamento: null
})

const removeList = reactive([])

function toggleRemove(volume) {
    if (removeList.includes(volume)) {
        removeList.splice(removeList.indexOf(volume), 1)
    } else {
        removeList.push(volume)
    }
}

promise.value.then(() => {
    loteEditado.nome = lote.value.nome
    loteEditado.volumes = lote.value.volumes.map(x => x.id)
    loteEditado.carregamento = lote.value.carregamento.id
})

async function handleSave() { 
    const carregamentoRef = doc(db, 'carregamentos', loteEditado.carregamento)
    const loteRef = doc(db, 'lotes', loteCodigo)
    const updates = {
        nome: loteEditado.nome,
        carregamento: carregamentoRef
    }
    if(removeList.length > 0) {
        updates.volumes = arrayRemove(...removeList.map(x => doc(db, 'volumes', x)))
        updates.n_volumes = increment(-removeList.length)
    }

    await updateDoc(loteRef, { ...updates })
    router.push({name: 'lotes-codigo', params: {codigo: loteCodigo}})    
}
</script>