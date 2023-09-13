<script setup>
import AjudaItem from '@/components/AjudaItem.vue';
import { db } from '@/backend/index.js';
import { useCollection } from 'vuefire';
import { collection, query, where, addDoc } from 'firebase/firestore';
import { ref, computed, inject } from 'vue';
import Modal from '@/components/Modal.vue';

const { set_mensagem_popup } = inject('mensagem')

const ajudaRef = collection(db, 'ajuda');
const ajuda = useCollection(query(ajudaRef, where('respondida', '==', true)) )

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

const nova_duvida = ref("")
 

function enviar_duvida(){
    console.log(nova_duvida.value)
    addDoc(ajudaRef, {
        pergunta: nova_duvida.value,
        respondida: false,
        resposta: "",
        stamp: new Date()
    })
    nova_duvida.value = ""
    set_mensagem_popup("Dúvida enviada com sucesso!", "success")
    return true
}

</script>
<template>
    <h1>Ajuda</h1>
    <h3>Canais de ajuda</h3>
    <dl class="ms-3">
        <dt>Área dos líderes de ambiente</dt>
        <dd>Área dedicada dentro do site da mudança: <a href="https://mudancanorteblumenau.paginas.ufsc.br/logistica/area-dos-lideres-de-ambiente/">Área dos líderes de ambiente</a>.</dd>
        <dt>e-mail</dt>
        <dd>Coordenação logística: <a href="mailto:coord.log.bnu@contato.ufsc.br">coord.log.bnu@contato.ufsc.br</a> </dd>
        <dd>COGEP:  <a href="mailto:cogep.bnu@contato.ufsc.br">cogep.bnu@contato.ufsc.br</a></dd>
        <dt>WhatsApp</dt>
        <dd><a href="https://chat.whatsapp.com/LooZsGz4coA8hB5ToiAnFk​">Link para o grupo dos Líderes</a></dd>
    </dl>

    <h3>Dúvidas frequentes</h3>
    <p>Você pode utilizar o campo abaixo para filtrar as perguntas. Se não encontrar, <a href="#" data-bs-toggle="modal" data-bs-target="#enviarduvida">clique aqui para enviar uma nova dúvida</a>. </p>
    <input type="text" class="form-control mb-3" v-model="search" placeholder="Pesquisar nas perguntas" aria-label="Pesquisar" aria-describedby="button-addon2">
    <div class="accordion border-bottom-0">
        <AjudaItem v-for="documento in ajuda_filtrada" v-bind="documento" :key="documento.id"></AjudaItem>
    </div>

    <Modal id="enviarduvida" salve_label="Enviar" :salve_callback="enviar_duvida">
    <template #titulo>
        Enviar dúvida
    </template>
    <template #corpo>
        <textarea class="form-control" v-model="nova_duvida" rows="3" placeholder="Digite sua dúvida aqui"></textarea>
    </template>
    </Modal>
</template>