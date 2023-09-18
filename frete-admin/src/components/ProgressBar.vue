<template>
    <div class="progress" role="progressbar" aria-label="Default striped example"
        :aria-valuenow="atual" aria-valuemin="0"
        :aria-valuemax="maximo">
        <div :class="cor" class="progress-bar progress-bar-striped overflow-visible text-dark" :style="{ width: percentual + '%' }">
            {{ texto }}</div>
    </div>
</template>
<script setup>
import { computed } from 'vue';
const props = defineProps(['atual', 'maximo', 'percentual'])

const percentual = computed( () => (props.atual == props.maximo)? 100: props.percentual )
const texto = computed( () => props.maximo == 0 ? `Ambiente vazio`: `${props.atual} de ${props.maximo} volumados`)

const cor = computed( () => {
    if(props.maximo == 0) {
        return `bg-secondary`
    }
    if (props.percentual >= 99){
        return `bg-success`
    }
    if (props.percentual >= 60){
        return `bg-primary`
    }
    if (props.percentual >= 40){
        return `bg-warning`
    }
    return `bg-danger`

})
</script>