<script setup>
import { computed, inject, onBeforeMount, onMounted, ref } from 'vue';
import ModalDelete from '@/components/ModalDelete.vue';
import { useUserPermissionsStore } from '@/stores/user';
import { registra_volume, apaga_volume, useVolumesEmailStore } from '@/stores/volumes';
import VolumesTable from '@/components/VolumesTable.vue';

import { useRoute } from 'vue-router';

import { db } from '@/backend/index.js';
import { collection, where, doc, orderBy, query } from 'firebase/firestore';
import { useCollection } from 'vuefire';
import { RouterLink } from 'vue-router';

const { globaluser, updateUser } = inject("globaluser")
const permissoes = useUserPermissionsStore()

const route = useRoute()

const thisAmbienteRef = doc(db, "ambientes", route.params.ambiente)
const q = query(collection(db, "volumes"), where('origem', '==', thisAmbienteRef), where('deleted', '==', false), orderBy("data_criacao", "desc"))
const { data: volumes, pending, promise } = useCollection(q)

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
    <div class="col-6">
      <h1>Volumes do ambiente {{ route.params.ambiente }}</h1>
    </div>

  </div>
  <div class="row">
    <div class="col">
      <div class="vstack">
      <RouterLink class="mb-2 icon-link"
        :to="{ name: 'volumes-ambiente-print-14', params: { ambiente: route.params.ambiente } }">
        <i class="bi bi-printer me-1"></i>Imprimir etiquetas adesivas 14
      </RouterLink>
      <RouterLink class="mb-2 icon-link"
        :to="{ name: 'volumes-ambiente-print-short', params: { ambiente: route.params.ambiente } }">
        <i class="bi bi-printer me-1"></i>Imprimir etiquetas verticais
      </RouterLink>
      <RouterLink class="mb-2 icon-link"
        :to="{ name: 'volumes-ambiente-print-long', params: { ambiente: route.params.ambiente } }">
        <i class="bi bi-printer me-1"></i>Imprimir conteúdos dos volumes
      </RouterLink>
    </div>
    </div>
  </div>
  <div class="row">
    <div class="col">
      <VolumesTable :volumes="volumes" @delete_callback="(codigo) => soft_volume_modal_ref = codigo"></VolumesTable>
    </div>
  </div>


  <ModalDelete modalid="apagare" :delete_callback="() => soft_apaga_volume(soft_volume_modal_ref)">
    <template #titulo>
      Apagar volume
    </template>
    <template #corpo>
      Certeza que quer apagar o volume {{ soft_volume_modal_ref }}?
    </template>

  </ModalDelete>
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