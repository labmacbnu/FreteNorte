<script setup>
import { db } from '@/backend/index'
import { useDocument } from 'vuefire';
import { collection, doc, getCountFromServer, query, where } from 'firebase/firestore';
import { computed, ref, reactive } from 'vue';
import { RouterLink } from 'vue-router';

const { data: short_descricoes, pending, promise } = useDocument(doc(db, 'agregados', 'items'));

async function countByShortDescricao(shortDescricao){
    const itemRef = collection(db, "items")
    const pesquisa = query(itemRef, where("short_descricao", '==', shortDescricao))
    const countSnap = await getCountFromServer(pesquisa)
    const count = countSnap.data().count
    return count
}


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
 

const search = ref("")

const items_filtrados = computed(() => {
    if(letra_selected.value == ""){
        if(search.value.length >= 2) {
            const patt = RegExp(search.value, 'ig')
            return agrupados.value.filter(item => item[2].match(patt) )
        }
    } else {
        return agrupados.value.filter(item => item[0] === letra_selected.value)
    }
})

const contador = reactive({})

promise.value.then(async () => {
    agrupados.value.forEach( async lista => {
        const short_descr = lista[2]
        const quant = await countByShortDescricao(short_descr)
        contador[short_descr] = quant
    })

})
</script>
<template>
    <h1>Items por descrição</h1>
    <p>Abaixo temos as descrições curtas dos itens patrimoniados. Navegue pelas abas para encontrar o que procura.</p>
    <template v-if="pending">
        <p>Carregando...</p>
    </template>
    <template v-else>
             <ul class="pagination">
                <li class="page-item">
                    <a class="page-link" 
                    :class="{'active': letra_selected == ''}"
                    @click="letra_selected = ''"
                     href="#" >Pesquisar <i class="bi-search bi ms-2"></i></a>
                </li>
                <li v-for="(elem,index) in letras" :key="'pag-' + index" class="page-item">
                    <a class="page-link" :class="{'active': letra_selected == elem[0]}" href="#" @click="letra_selected = elem[0]">{{elem[0]}}</a>
                </li> 
            </ul> 
            <input v-if="letra_selected == ''" class="form-control w-50 mb-3"
            placeholder="Pesquise a descrição do item" v-model="search">

            <div class="list-group">
                <RouterLink :to="{name: 'descricoes-result', query: {'short_descricao': elem[2] }}" 
                class="list-group-item list-group-item-action fw-normal" 
                v-for="(elem,index) in items_filtrados" :key="'item-' + index">
                <span class="spanfill">
                   <span class="badge bg-primary">{{ contador[elem[2]] }}</span>
                </span> {{elem[1]}}
                </RouterLink>
            </div>
    </template>
</template>

<style>
.spanfill{
    display: inline-block;
    width: 3em;
}
</style>