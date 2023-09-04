<template>
<span class="badge bg-primary me-1" v-for="status in exibit">{{ status }}</span> 
</template>
<script setup>
import { computed } from 'vue';

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
const prioridade_list = {
    "Criado": 0,
    "Loteado": 1,
    "Desmontado": 1
}

const prioridades = props.status.map( x => prioridade_list[x])

const corte_prioridade = Math.max(...prioridades)

const exibit = computed( () => props.status.filter( status => prioridade_list[status] >= corte_prioridade  ))

</script>