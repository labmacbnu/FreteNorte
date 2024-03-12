<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router' 
import { useLotesStore } from '@/stores/lotes';
const lotes = useLotesStore()

</script>
<template>

    <p>{{ lotes.volumesCods }}</p>
</template>