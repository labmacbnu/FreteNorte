<script setup>
import { computed, ref, toValue } from 'vue';
import { useLotesStore } from '@/stores/lotes';
import CarregamentoShow from '@/components/CarregamentoShow.vue';
import { useCollection } from 'vuefire'
import { db } from '@/backend/index'
import { collection, query, where } from 'firebase/firestore'

const lotes = useLotesStore()
 
const carregamentos = useCollection(query(collection(db, 'carregamentos'), where("status", 'in', ["agendado", "carregando"])))

const carregamento_selecionado = ref(null)

function registerLote(){
    const dados  = {
        volumes: [...lotes.volumesCods],
        caminhao: carregamento_selecionado.value
    }
    console.log("Lote registrado") 
    console.log(dados)
}
 

</script>
<template>
<div class="row">
    <div class="col-12">
        <h1>Designar carregamento</h1>
    </div>
    <div class="col-sm-12 col-md-6 mt-2">
        <h4>Volumes</h4>
        <ul class="list-group">
        <li class="list-group-item d-flex justify-content-between align-items-center" v-for="l in lotes.volumesCods">
          {{ l }} 
        </li>
      </ul>
    </div>
    <div class="col-sm-12 col-md-6 mt-2">
        <h4>Carregamento</h4>  
        <p class="my-0 text-secondary">Selecione o carregamento.</p>
            <div v-for="carregamento in carregamentos" :key="carregamento.id">
                <CarregamentoShow 
                @select:carregamento=" x => carregamento_selecionado = x" 
                :carregamento="carregamento"
                :selecionado="carregamento_selecionado === carregamento.id"
                     />
            </div> 
    </div>

    <div class="col-12 text-center pt-3">
        <RouterLink :to="{name: 'lotes-scan'}" class="btn btn-primary"><i class="bi bi-caret-left"></i> Voltar</RouterLink>
        <button @click="registerLote" class="btn btn-success ms-3">Registrar lote</button>
    </div>
</div> 
</template>