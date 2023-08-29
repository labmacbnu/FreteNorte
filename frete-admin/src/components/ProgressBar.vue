<template>
    <div class="progress" role="progressbar" aria-label="Default striped example"
        :aria-valuenow="atual" aria-valuemin="0"
        :aria-valuemax="maximo">
        <div class="progress-bar progress-bar-striped" :style="{ width: percentual + '%' }">
            {{ atual }} de {{ maximo }} volumados</div>
    </div>
</template>
<script setup>
defineProps(['atual', 'maximo', 'percentual'])
</script>