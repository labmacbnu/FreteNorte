<script setup>
import AjudaItem from '@/components/AjudaItem.vue';
import { db } from '@/backend/index.js';
import { useCollection } from 'vuefire';
import { collection, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, computed, inject } from 'vue';
import Modal from '@/components/Modal.vue';

//const { set_mensagem_popup } = inject('mensagem')

const ajudaRef = collection(db, 'ajuda');
const ajuda = useCollection(ajudaRef)

const search = ref('')

const ajuda_filtrada = computed(() => {
    if(search.value.length >= 3) {
        return ajuda.value.filter((documento) => {
            const match_pergunta = documento.pergunta.toLowerCase().includes(search.value.toLowerCase())
            const match_resposta = documento.resposta.toLowerCase().includes(search.value.toLowerCase()) 
            return match_pergunta || match_resposta
        })
    } else {
        return ajuda.value
    }
})
 
 

async function registrar_resposta({id, resposta}){ 
    await updateDoc(doc(ajudaRef, id), { 
        respondida: true,
        resposta: resposta
    })   
}

async function apaga_pergunta({id}){
    await deleteDoc(doc(ajudaRef, id))
}

</script>
<template>
    <h1>Ajuda</h1>
    <input type="text" class="form-control mb-3" v-model="search" placeholder="Pesquisar nas perguntas" aria-label="Pesquisar" aria-describedby="button-addon2">
    <div class="accordion border-bottom-0">
        <AjudaItem v-for="documento in ajuda_filtrada" v-bind="documento" :docid="documento.id" :key="documento.id"
         @responder="x => registrar_resposta(x)"
         @apagar="x => apaga_pergunta(x)"></AjudaItem>
    </div> 
</template>