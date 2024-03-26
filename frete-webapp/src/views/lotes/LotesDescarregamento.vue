<script setup>
import { computed, ref, toValue, inject } from 'vue';
import { useLotesStore } from '@/stores/lotes';
import CarregamentoShow from '@/components/CarregamentoShow.vue';
import SelectPlus from '@/components/SelectPlus.vue';
import { useCollection } from 'vuefire'
import { db } from '@/backend/index'
import { collection, query, where, doc, setDoc } from 'firebase/firestore'
import { useListaAmbientesNorteStore } from '@/stores/ambientes'

const {globaluser, updateUser} = inject('globaluser')

const lotes = useLotesStore()
 
const carregamentos = useCollection(query(collection(db, 'carregamentos'), where("status", 'in', ["carregado"])))

const carregamento_selecionado = ref(null)

const salas = useListaAmbientesNorteStore()
 
const sala_selecionada = ref(null)



function registerLoteDescarregamento(){
    const dados  = {
        volumes: lotes.volumesCods.map(x => doc(db, 'volumes', x)),
        carregamento: doc(db, 'carregamentos', carregamento_selecionado.value),
        data_criado: new Date(),
        responsavel: doc(db, 'usuarios', globaluser.value.email),
        tipo: "Descarregamento",
        sala: doc(db, 'ambientes-norte', sala_selecionada.value), 
        n_volumes: lotes.volumesCods.length
    }
    console.log("Lote registrado") 
    const new_id = (dados.data_criado.getTime()).toString(36).toUpperCase() 
    const new_docref = doc(db, 'lotes', new_id)
    setDoc(new_docref, dados)
    console.log(dados)
}
</script>
<template>
<div class="row">
    <div class="col-12">
        <h1>Descarregando Caixas</h1>
    </div>
    <div class="col-sm-12 col-md-4 mt-2">
        <h4>Volumes</h4>
        <ul class="list-group">
        <li class="list-group-item d-flex justify-content-between align-items-center" v-for="l in lotes.volumesCods">
          {{ l }} 
        </li>
      </ul>
    </div>
    <div class="col-sm-12 col-md-4 mt-2"> 
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
    <div class="col-sm-12 col-md-4 mt-2">
        <h4>Sala</h4>  
        <p class="my-0 text-secondary">Selecione a sala que serão descarregados os volumes.</p>
        <SelectPlus 
            :options="salas.dados"
            value="sala_selecionada"
            @selected="x => sala_selecionada = x"
            placeholder="Digite para pesquisar a sala"
            />
    </div>

    <div class="col-12 text-center pt-3">
        <RouterLink :to="{name: 'lotes-scan'}" class="btn btn-primary"><i class="bi bi-caret-left"></i> Voltar</RouterLink> 
        <button @click="registerLoteDescarregamento" class="btn btn-success ms-3">Descarregar lote</button>
    </div>
</div> 
</template>