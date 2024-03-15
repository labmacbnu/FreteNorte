<template>
    <div class="row">
        <div class="col-8">
            <h1>Carregamentos</h1>

        </div>
        <div class="col-4 text-end">
            <RouterLink :to="{name: 'lotes-add'}" class="btn btn-primary"><i class="bi bi-plus"></i>Adicionar carregamento</RouterLink>
        </div>
    </div>
    <div class="row">
        <div class="col"> 
            <CarregamentoShow v-for="carregamento in carregamentos" :key="carregamento.id" :carregamento="carregamento" />
        </div>
    </div>
</template>
<script setup>
import { RouterLink } from 'vue-router';
import { useCollection } from 'vuefire';
import { db } from '@/backend';
import { collection } from 'firebase/firestore';
import CarregamentoShow  from '@/components/CarregamentoShow.vue';

const carregamentos = useCollection(collection(db, 'carregamentos'));
</script>