<script setup>
import AmbienteFlag from '@/components/AmbienteFlag.vue'; 

defineProps({
    volumes: {
        type: Array,
        required: true
    }
})

function createLink(codigo){
    const href = window.location.origin
    const url = href.replace("admin-frete-norte", "frete-norte")
    return url + "/volumes/cod/" + codigo
}



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
                        <a class="link" :href="createLink(volume.id)">
                            {{ volume.codigo }}
                        </a>
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
                                    <small  class="badge text-primary rounded-pill span-lista-volumes text-elipse">{{
                item.key }}
                                    </small>
                                </li>
                            </template>
                        </ul>
                    </td>

                </tr>
            </template>
        </tbody>
    </table>
</template>