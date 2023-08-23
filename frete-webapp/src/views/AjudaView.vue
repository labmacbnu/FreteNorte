<script setup>
import AjudaItem from '@/components/AjudaItem.vue';
import { db } from '@/backend/index.js';
import { useCollection } from 'vuefire';
import { collection } from 'firebase/firestore';
import { ref, computed } from 'vue';

const ajuda = useCollection(collection(db, 'ajuda'))

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

</script>
<template>
    <h1>Ajuda</h1>
    <p>Você pode utilizar o campo abaixo para filtrar as perguntas. Se não encontrar, <a>clique aqui</a>para enviar uma nova dúvida. </p>
    <input type="text" class="form-control mb-3" v-model="search" placeholder="Pesquisar nas perguntas" aria-label="Pesquisar" aria-describedby="button-addon2">
    <div class="accordion border-bottom-0">
        <AjudaItem v-for="documento in ajuda_filtrada" v-bind="documento" :key="documento.id"></AjudaItem>
    </div>
</template>
<style>
details.accordion-item:not([open]) .accordion-button {
  background-color: var(--bs-accordion-bg);
}

details.accordion-item:not([open]):last-of-type .accordion-button {
  border-bottom-right-radius: var(--bs-accordion-border-radius);
  border-bottom-left-radius: var(--bs-accordion-border-radius);
}

details.accordion-item:not([open]) .accordion-button::after {
  background-image: var(--bs-accordion-btn-active-icon);
  transform: unset;
}

details.accordion-item[open] .accordion-button::after {
  background-image: var(--bs-accordion-btn-icon);
  transform: var(--bs-accordion-btn-icon-transform);
}
</style>