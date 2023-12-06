<template>
    <span class="text-nowrap" :class="[okay ? 'text-dark' : 'text-danger']">{{ p.a }}&times;{{ p.l }}&times;{{ p.c }} cm</span>
</template>
<script setup>
import { computed } from 'vue';

const p = defineProps(['a','l','c'])

const okay = computed(() => {
    const soma = p.a + p.l + p.c
    return (p.a >= 10 && p.l >= 10 && p.c >= 10)  || (soma >= 50)
})
</script>