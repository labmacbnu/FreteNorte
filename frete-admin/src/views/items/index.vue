<script setup>
import { useRoute, RouterView } from 'vue-router';
const route = useRoute()
</script>
<template>
    <RouterView :key="route.fullPath" />
</template>