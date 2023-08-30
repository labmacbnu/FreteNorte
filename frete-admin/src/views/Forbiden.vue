<script setup>
import { useUserPermissionsStore } from '@/stores/user'; 
const permission = useUserPermissionsStore();
</script>
<template>
    <h1 class="text-danger">Acesso negado</h1>
    <p>Você  está cadastrado como <span class="fw-bolder">{{permission.role}} </span> e não tem permissão para usar esse sistema.</p>
</template>