<script setup>
import {  inject, ref } from 'vue'; 
import { useUserPermissionsStore } from '@/stores/user'; 
import {  registra_volume, apaga_volume, useVolumesEmailStore } from '@/stores/volumes'; 
import ConteudoVolume from '@/components/ConteudoVolume.vue';


import { useRoute } from 'vue-router';

import { db } from '@/backend/index.js';
import { collection, where, doc, orderBy, query } from 'firebase/firestore';
import { useCollection } from 'vuefire';
import { RouterLink } from 'vue-router';

const { globaluser, updateUser } = inject("globaluser")
const permissoes = useUserPermissionsStore() 

const route = useRoute()

const thisAmbienteRef = doc(db, "ambientes", route.params.ambiente)
const q = query(collection(db, "volumes"), where('origem', '==', thisAmbienteRef), where('deleted', '==', false),   orderBy("data_criacao", "desc"))
const {data: volumes, pending, promise} = useCollection(q)

function click_row(i) {
  document.getElementById("check" + i).click()
}

 


async function salvar_volume() {
  const volume = {
    categoria: "NULL",
    responsavel: globaluser.value.email,
    items: lista_items.value
  }
  console.log(volume)
  const uptime = registra_volume(volume)
  if (uptime) {
    for (let item of lista_items.value) {
      var itemRef = all_items_ordered.value.find(x => x.key == item)
      itemRef.volumado = true
    }
    lista_items.value = []

    return true
  } else {
    return false
  }
}
 

async function soft_apaga_volume(codigo) { 
  console.log(`Apagando volume ${codigo}`)
  const volume_registry = volumes.value.find(x => x.codigo == codigo)
  const items_do_volume = volume_registry.items 
  const uptime = apaga_volume(codigo)
  return true
}

const soft_volume_modal_ref = ref(null)

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
 