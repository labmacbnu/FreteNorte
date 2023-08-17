<script setup>
import { ref, watch, computed } from 'vue';
import AcordeaoChild from './AcordeaoChild.vue';

const props = defineProps(['id', 'lista_agrupada'])

const emits = defineEmits(['items_selecionados'])

const selecionados = ref([])
 
const volumado_ok = computed(() => Object.values(props.lista_agrupada).map(
        // para cada lista de items, se o item for inteiro, verifica se ele foi volumado
        // se não for inteiro, verifica se as partes são volumadas e retorna um flat array
        x => x.map( y =>  y.meta.inteiro ?  y.meta.volumado : y.meta.partes.map( z => z.meta.volumado) ).flat()
        )
)
// aplica um operador && para cada item da lista, se todos forem true, retorna true
const header_classes = computed(() => volumado_ok.value.map( x=> x.reduce( (a,b) => a && b, true)) 
)

// conta quantos itens tem em cada lista
const n_considerando_partes = computed(() => volumado_ok.value.map( x=> x.length ))
 

watch(selecionados, (novo, antigo) => { 
    emits('items_selecionados', novo)
})
</script>

<template>  
<div class="accordion" :id="props.id">
        <AcordeaoChild v-for="(valor, chave, n) in props.lista_agrupada" :pai="id" :aid="'acord' + n" :done="header_classes[n]">
            <template #titulo>
                <span class="badge rounded-pill mx-1" :class="[header_classes[n] ? 'text-bg-secondary': 'text-bg-primary']">{{n_considerando_partes[n]}}</span> 
                {{chave}} 
            </template>
            
            <template #corpo>
            <ul class="list-group">
                <template v-for="(subitem, idx) in valor">
                    <!-- Se o item estiver inteiro -->
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
                    <!-- Se o item estiver em partes -->
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
                        <RouterLink :to="{name: 'item-codigo', params: {codigo: parte.key }}">Ver parte</RouterLink></span>
                        </li>
                    </template>
                </template>
                </template>
            </ul>
        </template>
        </AcordeaoChild>
    </div>
</template>