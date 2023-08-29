<script setup>
import { computed } from 'vue';

const props = defineProps(['campus', 'codigo'])
const letra = computed( () => props.campus.substring(0,1))
</script>
<template>
    <div class="d-flex">
        <span class="badge p-1 text-dark align-self-center">{{letra}}</span>
        <span>{{ props.codigo }}</span>
    </div>
</template>