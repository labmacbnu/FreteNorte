<script setup>
import AmbienteFlag from '@/components/AmbienteFlag.vue'; 

defineProps({
    volumes: {
        type: Array,
        required: true
    }
})



</script>

<template>
    <table class="table table-sm d-print-table align-middle">
        <thead>
            <tr>
                <th class="d-print-none">Código</th>
                <th>Origem</th>
                <th>Local<br>atual</th>
                <th>Destino</th>
                <th>Categoria</th>
                <th>Itens</th>
            </tr>
        </thead>
        <tbody>
            <template v-for="volume in volumes" :key="'volume' + volume.id">
                <tr>
                    <td class="d-print-none">
                        <RouterLink class="" :to="{ name: 'volume-codigo', params: { codigo: volume.codigo } }">
                            {{ volume.codigo }}
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
                                        class="badge text-primary rounded-pill span-lista-volumes text-elipse">{{
                item.key }}
                                    </RouterLink>
                                </li>
                            </template>
                        </ul>
                    </td>

                </tr>
            </template>
        </tbody>
    </table>
</template>