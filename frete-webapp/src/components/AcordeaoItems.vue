<script setup>
import { ref, watch } from 'vue';
defineProps(['id', 'lista_agrupada'])
import AcordeaoChild from './AcordeaoChild.vue';

const emits = defineEmits(['items_selecionados'])

const selecionados = ref([])

watch(selecionados, (novo, antigo) => { 
    emits('items_selecionados', novo)
})
</script>

<template> 
<div class="accordion" :id="id">
        <AcordeaoChild v-for="(valor, chave, n) in lista_agrupada" :pai="id" :aid="'acord' + n">
            <template #titulo>
                <span class="badge rounded-pill text-bg-secondary mx-1">{{valor.length}}</span> {{chave}} 
            </template>
            
            <template #corpo>
            <ul class="list-group">
                <template v-for="(subitem, idx) in valor">
                    <template v-if="subitem.meta.inteiro">
                    <li class="list-group-item d-flex justify-content-between align-items-center" >
                        <div class="form-check">
                            <input :disabled="subitem.meta.volumado" :id="'item'+subitem.key" v-model="selecionados" type="checkbox" class="form-check-input border border-primary" :value="subitem.key">
                            <label :for="'item'+subitem.key" class="form-check-label text-capitalize">{{ subitem.detalhes.descricao.substring(0,140) }}</label>
                        </div> 
                        <span class="badge badge-primary badge-pill">
                        <RouterLink :to="{name: 'item-codigo', params: {codigo: subitem.key }}">Ver item</RouterLink></span>
                    </li>
                </template>
                <template v-else>
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        {{ subitem.detalhes.descricao.substring(0,180) }}
                    </li>
                    <template v-for="(parte, idx) in subitem.meta.partes">
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                        <div class="form-check">
                            <input :disabled="parte.meta.volumado" :id="'item'+parte.key" v-model="selecionados" type="checkbox" class="form-check-input border border-primary" :value="parte.key">
                            <label :for="'item'+parte.key" class="form-check-label text-capitalize">{{ parte.detalhes.descricao.substring(0,140) }}</label>
                        </div> 
                        <span class="badge badge-primary badge-pill">
                        <RouterLink :to="{name: 'item-codigo', params: {codigo: parte.key }}">Ver item</RouterLink></span>
                        </li>
                    </template>
                </template>
                </template>
            </ul>
        </template>
        </AcordeaoChild>
    </div>
</template>