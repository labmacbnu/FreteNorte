<script setup>
import { db } from '@/backend/index'
import { useDocument } from 'vuefire';
import { doc } from 'firebase/firestore';
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';

const { data: short_descricoes, pending } = useDocument(doc(db, 'agregados', 'items'));

const agrupados = computed(() => {
    if (short_descricoes) {
        return short_descricoes.value.short_descricoes.map(item => {
            const trimmed = item.trim()
            return [trimmed[0], trimmed, item]
        })
    }
})

function onlyUnique(value, index, array) {
  return array.indexOf(value) === index;
}

const letras = computed(() => {
    if (agrupados) {
        const allLetras = agrupados.value.map(item => item[0])
        return allLetras.filter(onlyUnique)
    }
})

const letra_selected = ref('')

const items = computed(() => {
    if (letra_selected.value) {
        return agrupados.value.filter(item => item[0] === letra_selected.value)
    }
})



</script>
<template>
    <h1>Items por descrição</h1>
    <template v-if="pending">
        <p>Carregando...</p>
    </template>
    <template v-else>
             <ul class="pagination">
                <li v-for="(elem,index) in letras" :key="'pag-' + index" class="page-item">
                    <a class="page-link" :class="{'active': letra_selected == elem[0]}" href="#" @click="letra_selected = elem[0]">{{elem[0]}}</a>
                </li> 
            </ul> 
            <div class="list-group">
                <RouterLink :to="{name: 'descricoes-result', query: {'short_descricao': elem[2] }}" class="list-group-item list-group-item-action fw-normal" v-for="(elem,index) in items" :key="'item-' + index">
                    {{elem[1]}}
                </RouterLink>
            </div>
    </template>
</template>