<template>
    <div class="row">
        <div class="col text-end mb-3">
            <span class="me-2 fw-bold">
            Filtrar por status
            </span>
            <div class="form-check form-check-inline" v-for="status in possiveis_status" :key="'div' + status">
                <input :id="'check-' + status" type="checkbox" class="form-check-input"
                    v-model="status_selecionados[status]">
                <label :for="'check-' + status" class="form-check-label">{{ status }}</label>
            </div>
        </div>
    </div>
    <table class="table">
        <thead>
            <tr>
                <th>ID</th>
                <th>Data criação</th>
                <th>Data saída</th>
                <th>Saída</th>
                <th>Empresa</th>
                <th>Status</th>
                <th>Volumes</th>
                <th>Editar</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="carregamento in carregamentos_filtrados" :key="carregamento.id">
                <td>
                    <RouterLink :to="{ name: 'carregamentos-view', params: { id: carregamento.id } }">
                        {{ carregamento.id }}
                    </RouterLink>
                </td>
                <td>{{ formata_data(carregamento.data_criacao) }}</td>
                <td>{{ formata_data(carregamento.data_saida) }}</td>
                <td>{{ carregamento.saida }}</td>
                <td>{{ carregamento.empresa.nome }}</td>
                <td>{{ carregamento.status }}</td>
                <td>{{ getlotedata(carregamento.id) }}</td>
                <td>
                    <RouterLink :to="{ name: 'carregamentos-edit', params: { id: carregamento.id } }"><i class="bi bi-pencil"></i>
                    </RouterLink>
                </td>
            </tr>
        </tbody>
    </table>
</template>
<script setup>
import { onMounted, reactive, computed } from 'vue';
import moment from 'moment';
import { getLotesFromCarregamento } from '@/stores/lotes'
import { db } from '@/backend';
import { terminate } from 'firebase/firestore';

function formata_data(data) {
    const momento = moment.unix(data.seconds)
    return momento.format("DD/MM/YY HH[h]mm")
}

const props = defineProps({
    carregamentos: Array
});

const possiveis_status = ['agendado', 'carregando', 'carregado', 'descarregando', 'finalizado']

const status_selecionados = reactive({
    agendado: true,
    carregando: true,
    carregado: true,
    descarregando: true,
    finalizado: false

})

const carregamentos_filtrados = computed(() => {
    return props.carregamentos.filter(carregamento => status_selecionados[carregamento.status])
})


function getlotedata(id) {
    return dados[id]
}

const dados = reactive({})

onMounted(async () => {
    for (const carregamento of props.carregamentos) {
        const lotes = await getLotesFromCarregamento(carregamento.id)
        dados[carregamento.id] = lotes
    }
})
</script>