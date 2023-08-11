<script setup>
import { useRoute, useRouter } from 'vue-router'
import { doc } from 'firebase/firestore'
import { useDocument } from 'vuefire'
import { db, getdoc } from '@/backend/index'
import { onBeforeMount, onMounted, ref } from 'vue'
import QRCode from '@/components/QRCode.vue'

const route = useRoute()
const router = useRouter()
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

  {{ error }}
  <div v-if="pending" class="d-flex justify-content-center">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
  <div class="row" v-else>
    <template v-if="!volume">
      <div class="col alert alert-danger">
        <p class="text-center fs-3">O volume pesquisado não existe!</p>
        <p class="text-center"><RouterLink :to="{name: 'volumes'}"><i class="bi bi-arrow-left"></i> Voltar</RouterLink></p>
      </div>
    </template>
    <template v-else>
      <div class="col-lg-2">
        <QRCode :path="route.fullPath"></QRCode>
      </div>
      <div class="col-lg-6 col-sm-12 m-3">
        <h1>Volume {{ volume.codigo }}</h1>
        <p><b>Responsável:</b> {{ volume.responsavel.nome }}</p>
        <ul class="list-group">
          <li class="list-group-item justify-content-between d-flex" v-for="item in volume.items">
            <span v-if="item.key && typeof item.key != 'number'">
              {{ item.descricao }}
            </span>
            <span v-else>
              {{ item.short_descricao }}
            </span>
            <span class="bagde text-secondary text-elipse codigo-span">{{ item.key }}</span>
          </li>
        </ul>
      </div>
    </template>
  </div>
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