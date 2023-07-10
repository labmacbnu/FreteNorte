<script setup>
import { useRoute, RouterLink } from 'vue-router'
import { doc } from 'firebase/firestore'
import { useDocument } from 'vuefire'
import { db, getdoc } from '../backend/index'
import { onBeforeMount, ref } from 'vue'
import QRCode from '../components/QRCode.vue'

const route = useRoute()
const codigo = route.params.codigo
const {
  // rename the Ref to something more meaningful
  data: volume,
  // is the subscription still pending?
  pending,
  // did the subscription fail?
  error,
  // A promise that resolves or rejects when the initial state is loaded
  promise
} = useDocument(doc(db, "volumes", codigo))

const responsavel = ref(null)

</script>
<template>
  <div class="row">
    <div class="col">
      <QRCode :path="route.fullPath"></QRCode>
    </div>
    <div class="col-9">
      <h1>Volume {{ volume.codigo }}</h1>
      <p><b>Responsável:</b> {{ volume.responsavel.nome }}</p>
      <ul class="list-group">
        <li class="list-group-item justify-content-between d-flex" v-for="item in volume.items">
          {{ item.key.includes("-") ? item.descricao : item.short_descricao }} 
          <span class="bagde text-secondary">Cód. {{ item.key }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>