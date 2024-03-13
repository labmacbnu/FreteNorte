<script setup>
import { computed, ref, toValue } from 'vue';
import { useLotesStore } from '@/stores/lotes';
import SelectPlus from '@/components/SelectPlus.vue';
import { useCollection } from 'vuefire'
import { db } from '@/backend/index'
import { collection } from 'firebase/firestore'

const lotes = useLotesStore()

const {data: caminhoes_info, pending: caminhoes_pending} = useCollection(collection(db, 'caminhoes'))

const caminhoes = computed(() => {
    if(caminhoes_pending.value) return []
    return caminhoes_info.value.map(x => x.placa)
})

const caminhao_selecionado = ref("")

const info_selected = computed(() => {
    if(caminhoes_pending.value) return null
    return caminhoes_info.value.find(x => x.placa === caminhao_selecionado.value)
})

function registerLote(){
    const dados  = {
        volumes: [...lotes.volumesCods],
        caminhao: caminhao_selecionado.value
    }
    console.log("Lote registrado") 
    console.log(dados)
}
 

</script>
<template>
<div class="row">
    <div class="col-12">
        <h1>Designar caminhão</h1>
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
        <h4>Caminhão</h4>
        <SelectPlus :options="caminhoes" placeholder="Selecione o caminhão"  @selected=" x => caminhao_selecionado = x "/>

        <h4 class="mt-3">Informações do caminhão</h4>
        <p class="mb-1"><b>Motorista:</b> {{ info_selected?.motorista }}</p>
        <p class="mb-1"><b>Empresa:</b> {{ info_selected?.empresa }}</p>
        <p class="mb-1"><b>Placa:</b> {{ caminhao_selecionado }}</p>
    </div>

    <div class="col-12 text-center pt-3">
        <RouterLink :to="{name: 'lotes-scan'}" class="btn btn-primary"><i class="bi bi-caret-left"></i> Voltar</RouterLink>
        <button @click="registerLote" class="btn btn-success ms-3">Registrar lote</button>
    </div>
</div>
<div v-for="caminhao in caminhoes_info">
    {{caminhao.id}} : {{ caminhao }} 
    </div>
</template>