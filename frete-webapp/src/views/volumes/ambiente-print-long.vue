<script setup> 
import ConteudoVolume from '@/components/ConteudoVolume.vue';

import { useRoute } from 'vue-router';

import { db } from '@/backend/index.js';
import { collection, where, doc, orderBy, query } from 'firebase/firestore';
import { useCollection } from 'vuefire';
import { RouterLink } from 'vue-router';
 

const route = useRoute()

const thisAmbienteRef = doc(db, "ambientes", route.params.ambiente)
const q = query(collection(db, "volumes"), where('origem', '==', thisAmbienteRef), where('deleted', '==', false),   orderBy("data_criacao", "desc"))
const {data: volumes, pending, promise} = useCollection(q)

function print() {
  window.print()
}
</script>

<template> 
  <div class="row mb-3 align-items-end">
    <div class="col-12 d-print-none">
      <h1>Conteúdos dos volumes do ambiente {{ route.params.ambiente }}</h1>
    </div> 
    <div class="col-12 d-print-none">
      <p @click="print" role="button" class="d-print-none form-text">Essa página foi otimizada para impressão. Clique aqui para imprimir <i class="bi bi-printer"></i>.</p>
</div>
  </div>
  <template v-if="!pending" v-for="volume in volumes" :key="volume.codigo">   
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
 