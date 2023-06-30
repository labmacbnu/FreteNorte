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
                <p class="mx-2">
                    <RouterLink :to="{name: 'volume-codigo', params: {codigo: chave }}">Ver volume</RouterLink>
                    
                </p>
            <ul class="list-group">
                <li class="list-group-item d-flex justify-content-between align-items-center" v-for="subitem in valor">
                    {{ subitem.short_descricao }}
                    <span class="badge text-bg-light">{{ subitem.key }}</span> 
                </li>
                
            </ul>

        </template>
        </AcordeaoChild>
        
    </div>
</template>