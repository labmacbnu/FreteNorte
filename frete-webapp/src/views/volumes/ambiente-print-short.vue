<script setup>
import {  inject, ref } from 'vue'; 
import { useUserPermissionsStore } from '@/stores/user'; 
import {  registra_volume, apaga_volume, useVolumesEmailStore } from '@/stores/volumes'; 
import EtiquetaVolume from '@/components/EtiquetaVolume.vue';

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

</script>

<template> 
  <div class="row mb-3 align-items-end">
    <div class="col-12 d-print-none">
      <h1>Etiquetas dos volumes do ambiente {{ route.params.ambiente }}</h1>
    </div> 
  </div>
  <div class="row g-0" v-if="!pending">
    <div class="col p-0" v-for="volume in volumes" :key="volume.codigo">
      <EtiquetaVolume :volume="volume" />
    </div>
  </div>

 
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
 