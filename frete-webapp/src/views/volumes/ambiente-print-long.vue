<script setup>
import ConteudoVolume from '@/components/ConteudoVolume.vue';

import { useRoute } from 'vue-router';

import { db } from '@/backend/index.js';
import { collection, where, doc, orderBy, query } from 'firebase/firestore';
import { useCollection } from 'vuefire';
import { computed, reactive } from 'vue';


const route = useRoute()

const thisAmbienteRef = doc(db, "ambientes", route.params.ambiente)
const q = query(collection(db, "volumes"), where('origem', '==', thisAmbienteRef), where('deleted', '==', false), orderBy("data_criacao", "desc"))
const { data: volumes, pending, promise } = useCollection(q)

function print() {
  window.print()
}

const selecionados = reactive({})

promise.value.then(() => {
  for (let volume of volumes.value) {
    if (!selecionados[volume.categoria]) {
      selecionados[volume.categoria] = true
    }
  }
})

const volumes_filtrados = computed(() => {
  return volumes.value.filter(volume => selecionados[volume.categoria])
})

</script>

<template>
  <div class="row mb-3 d-print-none align-items-end">
    <div class="col-12 ">
      <h1>Conteúdos dos volumes do ambiente {{ route.params.ambiente }}</h1>
    </div>
    <div class="col-12 d-print-none">
      <p @click="print" role="button" class="d-print-none form-text">Essa página foi otimizada para impressão. Clique
        aqui para imprimir <i class="bi bi-printer"></i>.</p>
    </div>

    <div class="col"> 
      <p class="mb-1">Selecione as categorias a exibir</p>
      <template v-for="categoria in Object.keys(selecionados)">
        <div class="form-check form-switch form-check-inline">
          <input class="form-check-input" type="checkbox" :id="'check' + categoria" v-model="selecionados[categoria]">
          <label class="form-check-label" :for="'check' + categoria">{{categoria}}</label>
        </div> 
      </template> 
    </div>
  </div>
  <template v-if="!pending" v-for="volume in volumes_filtrados" :key="volume.codigo">
    <ConteudoVolume :volume="volume" />
  </template>


</template>
<style>
.listinhadelete {
  max-height: 20vh;
}

.text-elipse {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.p-lista-nao-volumados {
  width: 5em;
}
</style>