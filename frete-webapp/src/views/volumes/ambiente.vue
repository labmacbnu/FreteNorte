<script setup>
import { computed, inject, onBeforeMount, onMounted, ref } from 'vue'; 
import ModalDelete from '@/components/ModalDelete.vue';
import { useUserPermissionsStore } from '@/stores/user'; 
import {  registra_volume, apaga_volume, useVolumesEmailStore } from '@/stores/volumes';
import AmbienteFlag from '@/components/AmbienteFlag.vue';
import StatusList from '@/components/StatusList.vue';
import QRCode from '@/components/QRCode.vue';
import moment from 'moment';
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
  const volume_registry = volumes.dados.find(x => x.codigo == codigo)
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
    <div class="col">
      <RouterLink :to="{name: 'volumes-print'}" class="text-secondary icon-link"><i class="bi-printer" bi></i> Versão para impressão</RouterLink>
    </div>
    <div class="col text-end">
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
            <th>Local<br>atual</th>
            <th>Destino</th>
            <th>Categoria</th>
            <th>Status</th>
            <th>Criado em</th>
            <th>Criado por</th>
            <th class="d-print-none">Apagar</th>
        </tr>
        </thead>
        <tbody>
          <template  v-for="volume in volumes" :key="'volume' + volume.codigo">
          <tr>
            <td class="d-none d-print-table-cell text-center">
              <QRCode :path="'/volumes/cod/' + volume.codigo"></QRCode>
              <p>{{ volume.codigo }}</p>
            </td>
            <td class="d-print-none"> 
              <RouterLink class="" :to="{name: 'volume-codigo', params: {codigo: volume.codigo }}">
              {{ volume.codigo.substring(0,10) + '...' }}
            </RouterLink>
            </td>
            <td> 
              <RouterLink class="text-secondary text-decoration-none" :to="{name: 'volume-edit', params: {codigo: volume.codigo }}">
                Editar <i class="bi bi-pencil-square"></i>
            </RouterLink>
            </td>
            <td> 
              <a :href="'#items' + volume.codigo"  class="btn btn-sm btn-primary" data-bs-toggle="collapse" 
                role="button" aria-expanded="false" :aria-controls="'items' + volume.codigo">
                Detalhes</a>
            </td>
            <td class="text-center"><AmbienteFlag v-bind="volume.origem"></AmbienteFlag></td>
            <td><AmbienteFlag v-bind="volume.localizacao_atual"></AmbienteFlag></td>
            <td><AmbienteFlag v-bind="volume.destino"></AmbienteFlag></td>
            <td>{{ volume.categoria }}</td>
            <td><StatusList :status="volume.status"></StatusList></td>
            <td :title="moment.unix(volume.data_criacao.seconds).format('DD/MM/YY HH:MM')">{{ moment.unix(volume.data_criacao.seconds).format("DD/MM/YY") }}</td>  
            <td>{{ volume.responsavel.nome }}</td>
            <td class="d-print-none">
              <button class="btn btn-danger" data-bs-target="#apagare" data-bs-toggle="modal" 
              @click="() => soft_volume_modal_ref = volume.codigo"><i class="bi bi-trash" title="Apagar volume"></i></button>
            </td>
          </tr>
          <tr class="collapse" :id="'items' + volume.codigo">
            <td colspan="1"></td>
            <td colspan="5"> 
            <ul class="list-group list-group-flush align-top border-top">
              <template  v-for="item in volume.items"> 
                <li v-if="item" class="list-group-item justify-content-between d-flex">
                    <small class="">{{ item.short_descricao }}</small>
                    <RouterLink :to="{name: 'item-codigo', params: {codigo: item.key}}" 
                    class="badge text-primary rounded-pill span-lista-volumes text-elipse">{{item.key}}</RouterLink>
                  </li> 
              </template>
              </ul>
            </td>
            <td colspan="4">
             <p class="mb-1" v-if="volume.observacao"><b>Observação:</b> {{ volume.observacao }}</p> 
             <p><b>Propriedades:</b>
             <ul>
              <li v-for="prop in volume.propriedades">{{ prop }}</li>
             </ul>
            </p>
            </td>
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
 