<template>
<span class="badge bg-primary me-1" v-for="status in exibit">{{ status }}</span> 
</template>
<script setup>
import { computed } from 'vue';
import { volume_status } from '@/stores/status'

const props = defineProps({
    status: {
        type: Array
    }
})

/**
 * Racional: não dá pra ficar exibindo todos os status dos lotes
 * Então vamos estabelecer um ponto de corte `corte_prioridade`
 * e exibir todos os status que sejam maiores do que esse corte. 
 */

const prioridades = props.status.map( x => volume_status[x])

const corte_prioridade = 1// Math.max(...prioridades)

const exibit = computed( () => props.status.filter( status => volume_status[status] >= corte_prioridade  ))
</script>