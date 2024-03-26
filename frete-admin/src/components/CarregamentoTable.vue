<template>
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
            </tr>
        </thead>
        <tbody>
            <tr v-for="carregamento in props.carregamentos" :key="carregamento.id">
                <td>{{ carregamento.id }}</td>
                <td>{{ formata_data(carregamento.data_criacao) }}</td>
                <td>{{ formata_data(carregamento.data_saida) }}</td>
                <td>{{ carregamento.saida }}</td>
                <td>{{ carregamento.empresa.nome }}</td>
                <td>{{ carregamento.status }}</td>
                <td>{{ getlotedata(carregamento.id) }}</td>
            </tr>
        </tbody>
    </table> 
</template>
<script setup>
import { onMounted, reactive } from 'vue';
import moment from 'moment';
import { getLotesFromCarregamento } from '@/stores/lotes'
import { db } from '@/backend';

function formata_data(data) {
    const momento = moment.unix(data.seconds)
    return momento.format("DD/MM/YY HH[h]mm")
}

const props = defineProps({
    carregamentos: Array
});

function getlotedata(id){ 
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