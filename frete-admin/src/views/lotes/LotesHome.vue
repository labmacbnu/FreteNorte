<template>
    <a class="link-offset-2 fs-4" :href="linkAdmin">
    Ir para Sislog<i class="bi-link-45deg bi"></i>
    </a>
</template>
<script setup>
import { computed } from 'vue';
const linkAdmin = computed(() => {
    const hostname = window.location.hostname
    if (hostname == "localhost") {
        return window.location.origin + "/login"
    } else {
        const href = window.location.href
        const adminhref = href.replace("admin-frete", "frete")
        return adminhref
    }
})
</script>