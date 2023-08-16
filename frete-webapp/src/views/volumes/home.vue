<script setup>
import { computed, inject, onBeforeMount, onMounted, ref } from 'vue';
import Modal from '@/components/Modal.vue';
import ModalDelete from '@/components/ModalDelete.vue';
import { useUserPermissionsStore } from '@/stores/user';
import { useItemsAmbienteStore, orderedGroupBy } from '@/stores/items'; 
import {  registra_volume, apaga_volume, useVolumesEmailStore } from '@/stores/volumes';
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
 
const volumes = useVolumesEmailStore()

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
  const volume_registry = volumes.dados.find(x => x.codigo == codigo)
  const items_do_volume = volume_registry.items 
  const uptime = apaga_volume(codigo)
  return true
}

const soft_volume_modal_ref = ref(null)

</script>

<template> 
  <div class="row mb-3">
    <div class="col">
      <h1>Volumes que você criou</h1>
    </div>
    <div class="col text-end">
      <!-- <button class="btn-primary btn d-print-none" data-bs-target="#criarVolume" data-bs-toggle="modal">Criar novo volume</button> -->
      <RouterLink class="btn btn-success btn-lg" :to="{name: 'volume-add'}">Criar Volume</RouterLink>
    </div>
  </div>
  <div class="row">
    <div class="col">
      <table class="table table-sm d-print-table align-middle">
        <thead>
          <tr>
            <th class="d-none d-print-table-cell">Volume</th>
            <th class="d-print-none">Código</th>
            <th class="d-print-none">Editar</th>
            <th>Itens</th>
            <th>Origem</th>
            <th>Destino</th>
            <th>Categoria</th>
            <th>Status</th>
            <th>Localização atual</th>
            <th>Criado em</th>
            <th class="d-print-none">Apagar</th>
        </tr>
        </thead>
        <tbody>
          <template  v-for="volume in volumes.dados" :key="'volume' + volume.codigo">
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
              <RouterLink class="" :to="{name: 'volume-edit', params: {codigo: volume.codigo }}">
              Editar
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
              {{ volume.destino ? volume.destino.codigo : "" }}
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
            <td colspan="2"></td>
            <td colspan="5"> 
            <ul class="list-group list-group-flush align-top">
              <template  v-for="item in volume.items"> 
                <li v-if="item" class="list-group-item justify-content-between d-flex">
                    <small class="">{{ item.short_descricao }}</small>
                    <RouterLink :to="{name: 'item-codigo', params: {codigo: item.key}}" 
                    class="badge text-primary rounded-pill span-lista-volumes text-elipse">{{item.key}}</RouterLink>
                  </li> 
              </template>
              </ul>
            </td>
            <td colspan="3"></td>
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
 