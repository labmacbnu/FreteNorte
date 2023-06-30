<script setup>
defineProps(['id', 'lista_agrupada'])
import AcordeaoChild from './AcordeaoChild.vue';
</script>

<template>
<div class="accordion" :id="id">
        <AcordeaoChild v-for="(valor, chave, n) in lista_agrupada" :pai="id" :aid="'acord' + n">
            <template #titulo>
                <span class="badge rounded-pill text-bg-secondary mx-1">{{valor.length}}</span> {{chave}} 
            </template>
            
            <template #corpo>
            <ul class="list-group">
                <li class="list-group-item d-flex justify-content-between align-items-center" v-for="subitem in valor">
                    {{ subitem.descricao }}
                    <span class="badge badge-primary badge-pill">
                    <RouterLink :to="{name: 'item-codigo', params: {codigo: subitem.key }}">Ver item</RouterLink></span>
                </li>
            </ul>
        </template>
        </AcordeaoChild>
    </div>
</template>