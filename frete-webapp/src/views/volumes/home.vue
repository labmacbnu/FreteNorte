<script setup>
import { computed, inject, onBeforeMount, onMounted, ref } from 'vue';
import Modal from '@/components/Modal.vue';
import ModalDelete from '@/components/ModalDelete.vue';
import { useUserPermissionsStore } from '@/stores/user';
import { useItemsAmbienteStore, orderedGroupBy } from '@/stores/items';
import { useAmbientesStore } from '@/stores/ambientes';
import {  registra_volume, apaga_volume } from '@/stores/volumes';
import { update_item_part, delete_part, get_parte_ref } from '@/stores/singleitem'
import Acordeao from '@/components/AcordeaoVolumes.vue';
import QRCode from '@/components/QRCode.vue';

import { db } from '@/backend/index.js';
import { collection, where, doc, setDoc, query, updateDoc } from 'firebase/firestore';
import { useCollection } from 'vuefire';
import { RouterLink } from 'vue-router';

const { globaluser, updateUser } = inject("globaluser")
const permissoes = useUserPermissionsStore()
const ambientes = useAmbientesStore()

const items = useItemsAmbienteStore()
 


const userRef = computed(() => doc(db, "usuarios", globaluser.value.email))
const volRef = collection(db, "volumes")
const q = computed(() =>  query(volRef, where("responsavel", "==", userRef.value), where('deleted', '==', false)))
const volumes = useCollection(q.value, {wait: true})


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

async function deleta_volume_parte(parte_key) {
  const parteRef = await get_parte_ref(parte_key)
  const [itemKey, _] = parte_key.split("-")
  // apaga do item
  await update_item_part(itemKey, 'remove', parteRef)
  // hard apaga a parte
  await delete_part(parte_key)
}

async function soft_apaga_volume(codigo) { 
  console.log(`Apagando volume ${codigo}`)
  const volume_registry = volumes.value.find(x => x.codigo == codigo)
  const items_do_volume = volume_registry.items
  // vamos desavolumar aqui localmente
  items_do_volume.forEach(element => { 
    if (element.key.includes("-")) {
      // SE TEM TRAÇO NA KEY
      console.log(`Apagando parte ${element.key}`)
      deleta_volume_parte(element.key) 
    }
  }); 
  const uptime = apaga_volume(codigo)
  return true
}

const soft_volume_modal_ref = ref(null)



onBeforeMount(() => volumes.email = permissoes.email)  
</script>

<template>
  <div class="row mb-3 justify-content-end">
    <div class="col text-end">
      <!-- <button class="btn-primary btn d-print-none" data-bs-target="#criarVolume" data-bs-toggle="modal">Criar novo volume</button> -->
      <RouterLink class="btn btn-primary" :to="{name: 'volume-add'}">Criar Volume</RouterLink>
    </div>
  </div>
  <div class="row">
    <div class="col">
      <table class="table d-print-table align-middle">
        <thead>
          <tr>
            <th class="d-none d-print-table-cell">Volume</th>
            <th class="d-print-none">Código</th>
            <th>Lista de items</th>
            <th class="d-print-none"></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="volume in volumes" :key="'volume' + volume.codigo">
          <td class="d-none d-print-table-cell text-center">
            <QRCode :path="'/volumes/cod/' + volume.codigo"></QRCode>
            <p>{{ volume.codigo }}</p>
          </td>
          <td class="d-print-none"> 
            <RouterLink class="" :to="{name: 'volume-codigo', params: {codigo: volume.codigo }}">
            {{ volume.codigo }}
          </RouterLink>
          </td>
          <td> 
            <ul class="list-group list-group-flush align-top">
              <li v-for="item in volume.items" :key="'I' + item.key" class="list-group-item justify-content-between d-flex">
                <small class="" v-if="item.key">{{ item.key.includes("-") ? item.descricao :  item.short_descricao }}</small>
                <span class="badge text-primary rounded-pill span-lista-volumes text-elipse">{{item.key}}</span>
              </li> 
              </ul>
          </td>
          <td class="d-print-none">
            <button class="btn btn-danger" data-bs-target="#apagare" data-bs-toggle="modal" 
            @click="() => soft_volume_modal_ref = volume.codigo"><i class="bi bi-trash" title="Apagar volume"></i></button>
          </td>
        </tr>
      </tbody>
      </table>
    </div>
  </div>


<ModalDelete modalid="apagare" :delete_callback="() => soft_apaga_volume(soft_volume_modal_ref)">
<template #titulo>
  Apagar volume
</template>
<template #corpo>
  Certeza que quer apagar o volume {{soft_volume_modal_ref}}?
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

.span-lista-volumes {
  width: 6em;
}
</style>
 