<script setup>
import { doc } from 'firebase/firestore'
import { useDocument } from 'vuefire'
import { db } from '@/backend/index'
import { inject, ref, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import ConteudoVolume from '@/components/ConteudoVolume.vue'

const route = useRoute()
const router = useRouter()
const codigo = ref((route.params) ? route.params.codigo : null)

const { globaluser, updateUser } = inject("globaluser")

watch(() => route.params.codigo, () => {
  codigo.value = route.params.codigo
}, { immediate: true })

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

function print() {
  window.print()
}

function checkprivileges() {
  if (!globaluser) {
    return false
  }
  if (globaluser.email == volume.value.responsavel.id) {
    return true
  } else if (globaluser.role == "Comissão de Logística" || globaluser.role == "Administrador") {
    return true
  } else {
    return false
  }

}

const especial = useDocument(doc(db, "especiais", codigo.value))


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
        <div class="col d-flex justify-content-between">
          <h4>Volume {{ volume.codigo }}</h4>
          <div class="d-print-none" v-if="especial"> 
              <a target="_blank" class="fs-5 icon-link m-1" :href="especial.link">Tratamento especial<i
                  class="bi bi-file-pdf"></i></a> 
          </div>
          <RouterLink v-if="checkprivileges" class="btn btn-secondary d-print-none"
            :to="{ name: 'volume-edit', params: { codigo: volume.codigo } }"><i class="bi bi-pencil"></i> Editar Volume
          </RouterLink>
        </div>
      </div>

      <ConteudoVolume :volume="volume"></ConteudoVolume>

    </template>

    <p @click="print" role="button" class="d-print-none mt-4 form-text text-end">Essa página foi otimizada para impressão.
      Clique aqui para imprimir <i class="bi bi-printer"></i>.</p>
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