<script setup>
defineProps(['id', 'lista_agrupada', 'apaga_volume'])
import AcordeaoChild from './AcordeaoChild.vue';
</script>

<template>
<div class="accordion" :id="id">
    
        <AcordeaoChild v-for="(valor, chave, n) in lista_agrupada" :pai="id" :aid="'acord' + n">
            <template #titulo>
                <span class="badge rounded-pill text-bg-secondary mx-1">{{valor.length}}</span> {{chave}} 
            </template>
            
            <template #corpo>
                <p class="mx-2 d-flex justify-content-between">
                    <RouterLink class="btn btn-primary" :to="{name: 'volume-codigo', params: {codigo: chave }}">Ver volume</RouterLink>
                    <button class="btn btn-danger" @click="() => apaga_volume(chave)">Apagar volume</button>
                </p> 
            <ul class="list-group">
                <li class="list-group-item d-flex justify-content-between align-items-center" v-for="subitem in valor">
                    <template v-if="subitem.key">
                    {{ subitem.key.includes("-") ? subitem.descricao : subitem.short_descricao }}
                    </template>
                    <span class="badge text-bg-light">{{ subitem.key }}</span> 
                </li>
                
            </ul>

        </template>
        </AcordeaoChild>
        
    </div>
</template>