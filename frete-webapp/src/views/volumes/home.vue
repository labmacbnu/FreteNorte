<script setup>
import { computed, inject, onBeforeMount, onMounted, ref } from 'vue';
import Modal from '@/components/Modal.vue';
import ModalDelete from '@/components/ModalDelete.vue';
import { useUserPermissionsStore } from '@/stores/user';
import { useItemsAmbienteStore, orderedGroupBy } from '@/stores/items'; 
import {  registra_volume, apaga_volume } from '@/stores/volumes';
import { update_item_part, delete_item, get_item_ref } from '@/stores/singleitem'
import Acordeao from '@/components/AcordeaoVolumes.vue';
import QRCode from '@/components/QRCode.vue';
import moment from 'moment';

import { db } from '@/backend/index.js';
import { collection, where, doc, orderBy, query } from 'firebase/firestore';
import { useCollection } from 'vuefire';
import { RouterLink } from 'vue-router';

const { globaluser, updateUser } = inject("globaluser")
const permissoes = useUserPermissionsStore() 

const items = useItemsAmbienteStore()
 

 
const volRef = collection(db, "volumes")
const q = computed(() => query(
  volRef, where("responsavel", "==", 
  doc(collection(db, "usuarios"), globaluser.value.email)), 
  where('deleted', '==', false), orderBy("data_criacao", 'desc'))
  )
const {data: volumes, pending } = useCollection(q, {wait: true})


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



onBeforeMount(() => volumes.email = permissoes.email)  
</script>

<template>
  <template v-if="pending">
  Carrregando
  </template>
  <template v-else>
  <div class="row mb-3">
    <div class="col">
      <h1>Volumes que você criou</h1>
    </div>
    <div class="col text-end">
      <!-- <button class="btn-primary btn d-print-none" data-bs-target="#criarVolume" data-bs-toggle="modal">Criar novo volume</button> -->
      <RouterLink class="btn btn-primary" :to="{name: 'volume-add'}">Criar Volume</RouterLink>
    </div>
  </div>
  <div class="row">
    <div class="col">
      <table class="table table-sm d-print-table align-middle">
        <thead>
          <tr>
            <th class="d-none d-print-table-cell">Volume</th>
            <th class="d-print-none">Código</th>
            <th>Itens</th>
            <th>Origem</th>
            <th>Categoria</th>
            <th>Status</th>
            <th>Localização atual</th>
            <th>Criado em</th>
            <th class="d-print-none"></th>
        </tr>
        </thead>
        <tbody tag="tbody" name="tabela" is="transition-group">
          <template  v-for="volume in volumes" :key="'volume' + volume.codigo">
          <tr>
            <td class="d-none d-print-table-cell text-center">
              <QRCode :path="'/volumes/cod/' + volume.codigo"></QRCode>
              <p>{{ volume.codigo }}</p>
            </td>
            <td class="d-print-none"> 
              <RouterLink class="" :to="{name: 'volume-codigo', params: {codigo: volume.codigo }}">
              {{ volume.codigo.substring(0,8) + '...' }}
            </RouterLink>
            </td>
            <td> 
              <a :href="'#items' + volume.codigo"  class="btn btn-sm btn-primary" data-bs-toggle="collapse" 
                role="button" aria-expanded="false" :aria-controls="'items' + volume.codigo">
              Ver itens</a>
            </td>
            <td>
              {{ volume.origem.ambiente_codigo }}
            </td>
            <td>
              {{ volume.categoria }}
            </td>
            <td>
              {{ volume.status }}
            </td>
            <td>
              {{ volume.localizacao_atual.ambiente_codigo }}
            </td>
            <td>
              {{ moment.unix(volume.data_criacao.seconds).format("DD/MM/YY") }}
            </td>  
            <td class="d-print-none">
              <button class="btn btn-danger" data-bs-target="#apagare" data-bs-toggle="modal" 
              @click="() => soft_volume_modal_ref = volume.codigo"><i class="bi bi-trash" title="Apagar volume"></i></button>
            </td>
          </tr>
          <tr class="collapse" :id="'items' + volume.codigo">
            <td colspan="5">
            <ul class="list-group list-group-flush align-top">
                <li v-for="item in volume.items" :key="'I' + item.key" class="list-group-item justify-content-between d-flex">
                  <small class="" v-if="item.key">{{ item.short_descricao }}</small>
                  <RouterLink :to="{name: 'item-codigo', params: {codigo: item.key}}" 
                  class="badge text-primary rounded-pill span-lista-volumes text-elipse">{{item.key}}</RouterLink>
                </li> 
              </ul>
            </td>
            <td colspan="1"></td>
          </tr>
      </template>
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
}

.tabela-item {
  transition: all 1s;
}
.tabela-item > tr >* {
  transition: all 1s;
  overflow: hidden;
}
.tabela-enter > td {
  line-height: 0 !important;
}
.tabela-enter > tr > * {
  padding-top: 0px !important;
  padding-bottom: 0px !important;
}

</style>
 