<script setup>
import AmbienteFlag from '@/components/AmbienteFlag.vue';
import StatusList from '@/components/StatusList.vue';
import QRCode from '@/components/QRCode.vue';
import moment from 'moment';
import VMedidasDisplay from '@/components/VMedidasDisplay.vue';
import { inject } from 'vue';

defineProps({
    volumes: {
        type: Array,
        required: true
    }
})

const {globaluser, updateUser} = inject("globaluser")

const emits = defineEmits(["delete_callback"])


function precisa_revisar(volume){
    if(volume.observacao.includes("PRECISA AJUSTAR AS MEDIDAS")){
        return true
    } else {
        return false
    }
}
</script>

<template>
    <table class="table table-sm d-print-table align-middle">
        <thead>
            <tr>
                <th class="d-none d-print-table-cell">Volume</th>
                <th class="d-print-none">Código</th>
                <th class="d-print-none">Editar</th>
                <th>Origem</th>
                <th>Local<br>atual</th>
                <th>Destino</th>
                <th>Categoria</th>
                <th>Itens</th>
                <th>Medidas</th>
                <th>Status</th>
                <th>Criado em</th>
                <th class="d-print-none">Apagar</th>
            </tr>
        </thead>
        <tbody>
            <template v-for="volume in volumes" :key="'volume' + volume.codigo">
                <tr :class="[precisa_revisar(volume)? 'revisar': '']" >
                    <td class="d-none d-print-table-cell text-center">
                        <QRCode :path="'/volumes/cod/' + volume.codigo"></QRCode>
                        <p>{{ volume.codigo }}</p>
                    </td>
                    <td class="d-print-none">
                        <RouterLink class="" :to="{ name: 'volume-codigo', params: { codigo: volume.codigo } }">
                            {{ volume.codigo }}
                        </RouterLink>
                    </td>
                    <td>
                        <RouterLink class="text-secondary text-decoration-none"
                            :to="{ name: 'volume-edit', params: { codigo: volume.codigo } }">
                            Editar <i class="bi bi-pencil-square"></i>
                        </RouterLink>
                    </td> 
                    <td class="text-center">
                        <AmbienteFlag v-bind="volume.origem"></AmbienteFlag>
                    </td>
                    <td>
                        <AmbienteFlag v-bind="volume.localizacao_atual"></AmbienteFlag>
                    </td>
                    <td>
                        <AmbienteFlag v-bind="volume.destino"></AmbienteFlag>
                    </td>
                    <td>{{ volume.categoria }}</td>
                    <td>
                        <ul class="list-group list-group-flush align-top">
                            <template v-for="item in volume.items">
                                <li v-if="item" class="list-group-item justify-content-between d-flex">
                                    <small class="text-lowercase">{{ item.short_descricao }}</small>
                                    <RouterLink :to="{ name: 'item-codigo', params: { codigo: item.key } }"
                                        class="badge text-primary rounded-pill span-lista-volumes text-elipse">{{ item.key }}
                                    </RouterLink>
                                </li>
                            </template>
                        </ul>
                    </td>
                    <td>
                        <VMedidasDisplay v-bind="volume.medidas"></VMedidasDisplay>
                    </td>
                    <td>
                        <StatusList :status="volume.status"></StatusList>
                    </td>
                    <td :title="moment.unix(volume.data_criacao.seconds).format('DD/MM/YY HH:MM')">{{
                        moment.unix(volume.data_criacao.seconds).format("DD/MM/YY") }}</td>
                    <td class="d-print-none">
                        <template v-if="globaluser.displayName == volume.responsavel.nome">
                            <button title="Apagar volume" class="btn btn-danger" data-bs-target="#apagare" data-bs-toggle="modal"
                                @click="emits('delete_callback', volume.codigo)"><i class="bi bi-trash"
                                    ></i></button>
                        </template>
                        <template v-else>
                            <button title="Apenas o criador do volume pode apagá-lo" class="btn btn-secondary disabled" disabled><i class="bi bi-trash"
                                    ></i></button>
                        </template>
                    </td>
                </tr> 
        </template>
    </tbody>
</table>
</template>
<style scoped>
tr.revisar td {
    background-color: var(--bs-warning);
}
</style>