<script setup>
import EtiquetaVolume from '@/components/EtiquetaVolume14.vue';

import { useRoute } from 'vue-router';

import { db } from '@/backend/index.js';
import { collection, where, doc, orderBy, query } from 'firebase/firestore';
import { useCollection } from 'vuefire';
import { computed, reactive } from 'vue';

const route = useRoute()

const thisAmbienteRef = doc(db, "ambientes", route.params.ambiente)
const q = query(collection(db, "volumes"), where('origem', '==', thisAmbienteRef), where('deleted', '==', false), orderBy("data_criacao", "desc"))
const { data: volumes, pending, promise } = useCollection(q)

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

function print() {
  window.print()
}

</script>

<template>
  <div class="row mb-3 align-items-end d-print-none">
    <div class="col-12 ">
      <h1>Etiquetas dos volumes do ambiente {{ route.params.ambiente }}</h1>
    </div>
    <div class="col-12 d-print-none">
      <p @click="print" role="button" class="d-print-none text-primary">Essa página foi otimizada para impressão de
        etiquetas 14. Clique
        aqui para imprimir <i class="bi bi-printer"></i>.</p>
      <p class="">Imprima em Letter Paper com margens superior e inferior 21mm, margens esquerda e direita 4mm.</p>
    </div>
    <div class="col">
      <p class="mb-1">Selecione as categorias a exibir</p>
      <template v-for="categoria in Object.keys(selecionados)">
        <div class="form-check form-switch form-check-inline">
          <input class="form-check-input" type="checkbox" :id="'check' + categoria" v-model="selecionados[categoria]">
          <label class="form-check-label" :for="'check' + categoria">{{ categoria }}</label>
        </div>
      </template>
    </div>
  </div>
  <div id="etiquetacontainer">
    <template v-for="volume in volumes_filtrados"  >
      <template v-for="k in volume.items.length" :key="k + '/' + volume.id"> 
        <EtiquetaVolume :volume="volume" :k="k-1"></EtiquetaVolume> 
      </template>
    </template>
  </div>
</template>
<style>
body {
  font-size: 12pt;
  margin: 0;
  padding: 0;
}

.etiqueta:nth-child(odd) {
  margin-right: 9.9mm;
}

.etiqueta {
  border: 0.5px solid black;
  margin-bottom: 1pt;
}

#etiquetacontainer {
  width: 213.1mm;
  /* display: flex; */


}

/* Tamanho da folha
largura 215mm
altura 280mm 
Letter paper size: 8.5 x 11 inches
*/
</style>