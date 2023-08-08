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
                <li class="list-group-item d-flex justify-content-between align-items-center" v-for="(subitem, idx) in valor">
                    <div class="form-check">
                        <input :disabled="subitem.meta.volumado" :id="'item'+subitem.key" v-model="selecionados" type="checkbox" class="form-check-input border border-primary" :value="subitem.key">
                        <label :for="'item'+subitem.key" class="form-check-label text-capitalize">{{ subitem.detalhes.descricao.substring(0,140) }}</label>
                    </div>
                    <p></p>
                    <span class="badge badge-primary badge-pill">
                    <RouterLink :to="{name: 'item-codigo', params: {codigo: subitem.key }}">Ver item</RouterLink></span>
                </li>
            </ul>
        </template>
        </AcordeaoChild>
    </div>
</template>