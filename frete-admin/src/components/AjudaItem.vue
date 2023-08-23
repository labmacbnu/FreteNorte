<template>
    <details class="accordion-item border-bottom-0">
        <summary class="accordion-button">
            <div class="accordion-header user-select-none" :class="{'text-danger': !props.respondida}"> 
                    {{ props.pergunta }} 
            </div> 
        </summary>
        <div class="accordion-body border-bottom text-end">
            <textarea class="form-control" v-model="resposta" rows="3"
                placeholder="Digite sua resposta aqui"></textarea>

            <button class="btn btn-danger mt-2 float-start" @click="emits('apagar', {id: props.docid})">
                    Apagar pergunta
            </button>
                <button :class="[resposta == props.resposta ? 'btn-secondary' : 'btn-primary']" class="btn btn-primary mt-2" @click="responde_duvida">
                    {{label_botao}}
                </button>
                
        </div>
    </details>
</template>
<script setup>
import { computed, ref } from 'vue';


const props = defineProps({
    pergunta: String,
    resposta: String,
    respondida: Boolean,
    docid: String
})



const emits = defineEmits(['responder', 'apagar'])

const resposta = ref(props.resposta)

const classe_botao = computed(() => {
    return ( props.resposta == '' || resposta.value == props.resposta )? 'btn-secondary' : 'btn-primary'
})

const label_botao = computed( () => {
    return ( props.resposta == '' || resposta.value == props.resposta )? 'Responder' : 'Atualizar resposta'
})

function responde_duvida(){
    emits('responder', {
        id: props.docid,
        resposta: resposta.value
    })
}

</script>

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