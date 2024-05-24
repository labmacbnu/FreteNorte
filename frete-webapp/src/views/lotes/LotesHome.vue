<template>
    <div class="row">
        <div class="col-12">
            <div class="hstack justify-content-between">
                <h1>Lotes</h1>
                <RouterLink class="btn btn-lg btn-primary" :to="{ name: 'lotes-scan' }"><i class="bi-plus bi"></i> Criar
                    lote</RouterLink>
            </div>
        </div>
        <div class="col-12 mb-3">
            <a class="link-offset-2 fs-4" :href="linkAdmin">Ir para o Admin <i class="bi-link-45deg bi"></i></a>
        </div>

        <div class="col-12">
            <h4>Lotes sem carregamento</h4>

            <ul v-if="pending" class="list-group">
                <li class="list-group-item">Carregando...</li>
            </ul>
            <ul v-else class="list-group">
                <li class="list-group-item d-flex justify-content-between align-items-center"
                    v-for="lote in lotesNaoCarregados">
                    <div class="ms-2 me-auto">
                        <RouterLink :to="{ name: 'lotes-codigo', params: { codigo: lote.id } }"
                            class="d-block text-secondary">{{ lote.id }}</RouterLink>
                        {{ lote.nome }}
                    </div>
                    <span class="badge bg-primary rounded-pill">{{ lote.n_volumes }} volume</span>
                </li>
            </ul>
        </div>
    </div>
</template>
<script setup>

import { db } from '@/backend/index'
import { collection, query, where, doc } from 'firebase/firestore'
import { useCollection } from 'vuefire';
import { computed, ref } from 'vue'

const carregamentoZero = doc(db, 'carregamentos', "C0000")
const { data: lotesNaoCarregados, pending } = useCollection(query(collection(db, 'lotes'), where("carregamento", "==", carregamentoZero)))

const linkAdmin = computed(() => {
    const hostname = window.location.hostname
    if (hostname == "localhost") {
        return window.location.origin + "/login"
    } else {
        const href = window.location.href
        const adminhref = href.replace(hostname, "admin-" + hostname)
        return adminhref
    } 
})

</script>