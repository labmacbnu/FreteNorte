<template> 
<h3>Mostrando lotes {{ tipo }}</h3>  
<p v-if="!pendingCarregados">
    <ul class="list-group">
    <li class="list-group-item d-flex justify-content-between align-items-center"
                    v-for="lote in lotesCarregados">
                    <div class="ms-2 me-auto">
                        <RouterLink :to="{ name: 'lotes-codigo', params: { codigo: lote.id } }"
                            class="d-block text-secondary">{{ lote.id }}</RouterLink>
                        {{ lote.nome }}
                    </div>
                    <span class="badge bg-primary rounded-pill">{{ lote.n_volumes }} volume</span>
                </li>
            </ul>
</p>
</template>
<script setup>
import { useRoute } from 'vue-router';
import { db } from '@/backend/index'
import { collection, query, where, doc, limit, orderBy, startAt } from 'firebase/firestore'
import { useCollection } from 'vuefire';

const route = useRoute()  
const tipo = route.query.tipo
const page = parseInt(route.query.page)
const n = 10

const lotesRef = collection(db, 'lotes')
const carregamentoZero = doc(db, 'carregamentos', "C0000")

const carregamentos = query(lotesRef, 
    where("tipo", "==", tipo),  
    orderBy("tipo", "asc"),
    orderBy("data_criado", "desc"),
    limit(n))

const { data: lotesCarregados, pending: pendingCarregados } = useCollection( carregamentos, { maxRefDepth: 0 } )
</script>