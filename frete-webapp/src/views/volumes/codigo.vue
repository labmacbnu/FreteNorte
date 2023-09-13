<script setup>
import { doc } from 'firebase/firestore'
import { useDocument } from 'vuefire'
import { db } from '@/backend/index'
import { inject, ref, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import QRCode from '@/components/QRCode.vue'
import AmbienteFlag from '@/components/AmbienteFlag.vue';
import moment from 'moment'
import { simbolos_nbr } from '@/stores/volumes'

const route = useRoute()
const router = useRouter()
const codigo = ref( (route.params)? route.params.codigo: null)

const { globaluser, updateUser } = inject("globaluser")

watch( () => route.params.codigo, () =>{
  codigo.value = route.params.codigo
}, {immediate: true})

const {
  // rename the Ref to something more meaningful
  data: volume,
  // is the subscription still pending?
  pending,
  // did the subscription fail?
  error,
  // A promise that resolves or rejects when the initial state is loaded
  promise
} = useDocument(doc(db, "volumes", codigo.value))

const responsavel = ref(null)

function print(){
  window.print()
}




</script>
<template>
  <!-- Carregando -->
  <div v-if="pending" class="d-flex justify-content-center">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
  <template v-else>
    <!-- Carregou -->
    <template v-if="!volume || volume.deleted">
      <!-- Não existe -->
      <div class="row justify-content-start g-3">
        <div class="col alert alert-danger">
          <p class="text-center fs-3">O volume pesquisado não existe!</p>
          <p class="text-center">
            <RouterLink :to="{ name: 'volumes' }"><i class="bi bi-arrow-left"></i> Voltar</RouterLink>
          </p>
        </div>
      </div>
    </template>
    <template v-else>
      <!-- Existe -->
      <div class="row">
        <div class="col"> 
          <h4>Volume {{ volume.codigo }}</h4>
        </div>
        <div v-if="globaluser.email == volume.responsavel.id" class="col text-end">
          <RouterLink :to="{name: 'volume-edit', params: {codigo: volume.codigo}}" class="btn btn-secondary">Editar este volume <i class="bi bi-pencil"></i></RouterLink>
        </div>
      </div>
      <div class="row justify-content-start g-1">
        <div class="col-4">
          <p class="mb-1"><b>Responsável:</b> {{ volume.responsavel.nome }}</p>
          <p class="mb-1"><b>Criado em:</b> {{ moment.unix(volume.data_criacao.seconds).format("DD/MM/YY HH:MM") }}</p>
          <h5 class="mt-3">Localização</h5>
          <div class="hstack gap-2">
            <p class="px-3 text-center mb-1"><b>Origem:</b><AmbienteFlag v-bind="volume.origem" ></AmbienteFlag></p>
              <i class="bi bi-arrow-right"></i>
            <p class="px-3 align-self-top text-center mb-1 d-print-none"><b>Atual:</b><AmbienteFlag v-bind="volume.localizacao_atual" ></AmbienteFlag></p>
              <i class="bi bi-arrow-right d-print-none"></i>
            <p class="px-3 text-center mb-1"><b>Destino:</b><AmbienteFlag v-bind="volume.destino" ></AmbienteFlag></p>
          </div>

        </div>
        <div class="col text-end">
          <template v-for="(valor, key) in simbolos_nbr">
           <template v-if="volume.propriedades?.includes(key)">
            <figure class="figure">
              <img  :src="valor" :title="key" :alt="key" class="figure-img img-fluid" 
              style="max-width: 96px; max-height: 96px; object-fit: contain; object-position: center;"/> 
              <figcaption class="figure-caption text-center">{{ key }}</figcaption>
            </figure> 
           </template>
          </template>
        </div>
        <div class="col-3 d-flex justify-content-end"> 
          <QRCode :path="route.fullPath"></QRCode>
        </div>
        <div class="col-12" v-if="volume.observacao">
          <p class="mt-3"><b class="fs-5">Observação:</b> {{ volume.observacao  }}</p>
        </div>

      </div> 
      <div class="row mt-2">
        <div class="col">
          <h5 class="fw-bold">Lista de itens</h5>
          <ul class="list-group">
            <li class="list-group-item justify-content-between d-flex" v-for="item in volume.items">
              <span>
                {{ item.descricao ? item.descricao : item.short_descricao }}
              </span>
              <span class="bagde text-secondary">{{ item.key }}</span>
            </li>
          </ul>

          <p @click="print" role="button" class="d-print-none mt-4 form-text text-end">Essa página foi otimizada para impressão. Clique aqui para imprimir <i class="bi bi-printer"></i>.</p>
        </div>
      </div>

    </template>
  </template>
</template>
<style>
.text-elipse {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.codigo-span {
  min-width: 4.5em;
  max-width: 6em;
}
</style>