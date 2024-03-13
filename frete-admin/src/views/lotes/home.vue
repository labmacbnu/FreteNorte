<template>
    <div class="row">
        <div class="col">
            <h1>Lotes Home</h1>

        </div>
        <div class="col">
            <RouterLink :to="{name: 'lotes-add'}" class="btn btn-primary">Adicionar lote</RouterLink>
        </div>
    </div>
</template>
<script setup>
import { RouterLink } from 'vue-router';
</script>