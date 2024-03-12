<script setup>
import { computed, ref, toValue } from 'vue';
import { useRouter } from 'vue-router' 
import { useLotesStore } from '@/stores/lotes';
const lotes = useLotesStore()
import SelectPlus from '@/components/SelectPlus.vue';

const caminhoes_info = [
    {placa: "ABC-1234", motorista: "João", empresa: "Transportadora A"},
    {placa: "DEF-5678", motorista: "Maria", empresa: "Transportadora B"},
    {placa: "GHI-9101", motorista: "José", empresa: "Transportadora C"}
] 

const caminhoes = ["ABC-1234", "DEF-5678", "GHI-9101"]

const caminhao_selecionado = ref("")

const info_selected = computed(() => {
    return caminhoes_info.find(x => x.placa === caminhao_selecionado.value)
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
</template>