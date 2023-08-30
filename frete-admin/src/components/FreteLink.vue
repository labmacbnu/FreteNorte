<script setup>
defineProps({
    path: String,
    decoration: {
        type: Boolean,
        default: false
    }
})
</script>
<template>
<a target="_blank" 
:class="decoration ? 'text-decoration-underline' : 'text-decoration-none'" 
:href="'https://frete-norte-ufsc-blumenau.web.app/' + path">
<slot></slot>
</a>
</template>