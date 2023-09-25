<script setup>
import { onBeforeMount, reactive, watch, computed } from 'vue';
import { orderedGroupBy } from '@/stores/items'
import Acordeao from '@/components/AcordeaoItems.vue';
import { RouterLink, useRoute } from 'vue-router';
import { useCollection } from 'vuefire';
import { collection, doc, where, query } from 'firebase/firestore';
import { db } from "@/backend/index.js"


const route = useRoute()

const q = computed(() => query(collection(db, "items"), where('ambiente', '==', doc(db, "ambientes", route.params.ambiente))))
const { data: colecao, pending, promise } = useCollection(q, { wait: true });

const items = computed(() => {
  var dados_sem_partes = colecao.value.filter(x => x.tipo != 'Parte')
  return orderedGroupBy(dados_sem_partes, x => x.short_descricao)
})

const url_args = reactive({
  ambiente: route.params.ambiente,
  items: null
})

const ambiente = computed(() => pending.value ? null : colecao.value[0].ambiente)


watch(url_args, (novo, antigo) => {
  console.log(novo)
})

</script>

<template>
  <div class="row justify-contents-start d-flex">
    <div class="col-12">
      <p class="m-1">
        <RouterLink class="d-print-none" :to="{name: 'items-ambiente', params: {ambiente: route.params.ambiente}}"><i class="bi bi-arrow-left-short"></i>Voltar</RouterLink>
      </p>
      <h4>Lista de items de {{ route.params.ambiente }}</h4>
      <p class="mb-1">{{ ambiente.nome }}</p>
      <p class="mb-3"><strong>Líder:</strong> {{ ambiente.lider.nome }}</p>
    </div>
  </div> 
  <div class="row">
    <div class="col-12">
      <table class="table d-print-table">
        <thead>
          <tr>
            <th>Código de Barras</th>
            <th class="w-75">Descrição</th>
            <th>Medidas</th>
            <th>Peso</th>
          </tr>
        </thead>
        <tbody>
        <template v-for="(value, key, index) in items" :key="'itemsp' + key">
          <tr><td colspan="4">{{ key }}</td></tr>
          <tr v-for="(item, index) in value" :key="'itemp' + index">
            <td>{{ item.key }}</td>
            <td class="text-lowercase fonte-pequena"> {{ item.detalhes.descricao }}</td>
            <td colspan="2"> </td>
          </tr>
        </template>
      </tbody>
      </table>
    </div>
  </div>
</template>
<style>
.fonte-pequena{
  font-size: 10pt;
}
</style>
