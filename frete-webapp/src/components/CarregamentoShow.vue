<script setup>
import { computed } from 'vue';
import moment from 'moment';

function formata_data(data) {
    const momento = moment.unix(data.seconds)
    return momento.format("DD/MM/YY HH:mm")
}
const props = defineProps({
    carregamento: {
        type: Object,
        required: true
    },
    selecionado: {
        type: Boolean,
        default: false
    }
})

const classes = computed(() => {
    if (props.selecionado) {
        return 'bg-primary-subtle border-primary'
    }
})
const emits = defineEmits(['select:carregamento'])
</script>
<template>
    <div @click="emits('select:carregamento', props.carregamento.id)" class="card m-2" :class="classes">
        <div class="card-body">
            <h5 class="card-title d-flex justify-content-between">
               <span>{{ props.carregamento.id }}</span><span class="badge text-bg-light">{{
        formata_data(props.carregamento.data_saida) }}</span>
            </h5>
            <p class="card-text">
            <table class="table table-sm">
                <thead>
                    <tr>
                        <td>Caminhão</td>
                        <td>Status</td>
                        <td>Saída</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{ props.carregamento.caminhao.placa }}</td>
                        <td>{{ props.carregamento.status }}</td>
                        <td>{{ props.carregamento.saida }}</td>
                    </tr>
                </tbody>
            </table>
            </p>
        </div>
    </div>
</template>