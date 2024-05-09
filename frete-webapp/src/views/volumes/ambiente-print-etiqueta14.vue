<script setup>
import EtiquetaVolume from '@/components/EtiquetaVolume14.vue';

import { useRoute } from 'vue-router';

import { db } from '@/backend/index.js';
import { collection, where, doc, orderBy, query } from 'firebase/firestore';
import { useCollection } from 'vuefire';
import { RouterLink } from 'vue-router';

const route = useRoute()

const thisAmbienteRef = doc(db, "ambientes", route.params.ambiente)
const q = query(collection(db, "volumes"), where('origem', '==', thisAmbienteRef), where('deleted', '==', false), orderBy("data_criacao", "desc"))
const { data: volumes, pending, promise } = useCollection(q)




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
      <p @click="print" role="button" class="d-print-none form-text">Essa página foi otimizada para impressão. Clique
        aqui para imprimir <i class="bi bi-printer"></i>.</p>
    </div>
  </div>
  <div id="etiquetacontainer">
    <EtiquetaVolume v-for="volume in volumes" :key="volume.codigo" :volume="volume"></EtiquetaVolume>
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
}
 
 #etiquetacontainer{ 
  width: 213.1mm;
  /* display: flex; */


} 
/* Tamanho da folha
largura 215mm
altura 280mm 
Letter paper size: 8.5 x 11 inches
*/
</style>