<script setup>
import {onBeforeMount,  reactive, watch, computed } from 'vue';
import { orderedGroupBy } from '@/stores/items'
import Acordeao from '@/components/AcordeaoItems.vue';
import { RouterLink, useRoute } from 'vue-router';
import { useCollection } from 'vuefire';
import { collection, doc, where, query } from 'firebase/firestore';
import { db } from "@/backend/index.js"

 
const route = useRoute()

const q = computed(() => query(collection(db, "items"), where('ambiente', '==',  doc(db, "ambientes", route.params.ambiente))) )
const {data: colecao, pending, promise}  = useCollection( q, {wait: true}); 

const items = computed(() => {
  var dados_sem_partes = colecao.value.filter( x => x.tipo != 'Parte')
  return orderedGroupBy(dados_sem_partes,  x => x.short_descricao)
})

const url_args = reactive({
  ambiente: route.params.ambiente,
  items: null
})

const ambiente = computed(() => pending.value ? null: colecao.value[0].ambiente )


watch(url_args, (novo, antigo) => {
  console.log(novo)
})

</script>

<template>
  <div class="row justify-contents-start">
    <div class="col-12">
      <p class="m-1"> 
        <RouterLink :to="{ name: 'home' }"><i class="bi bi-arrow-left-short"></i>Voltar</RouterLink>
      </p>
      <p class="text-end">
        <RouterLink class="btn btn-primary" :to="{ name: 'item-add', query: { ambiente: route.params.ambiente } }"><i
            class="bi bi-plus-circle me-2"></i>Adicionar novo item</RouterLink>
      </p>
      <h4>Lista de items de {{ route.params.ambiente }}</h4>
      <p class="mb-1">{{ ambiente.nome }}</p>
      <p class="mb-3"><strong>Líder:</strong> {{ ambiente.lider.nome }}</p>
    </div>
  </div>
  <div class="row">
    <div class="col-8">

      <p>Items agrupados por descrição. Marque as caixas de seleção e pressione o botão ao lado para criar um novo volume.
      </p>
    </div>
    <div class="col-4">
      <RouterLink class="btn btn-success d-flex justify-content-between align-items-center"
        :to="{ name: 'volume-add', query: url_args }"><i class="d-none d-md-block bi bi-plus-circle me-2"></i>
        <p class="m-0">Criar novo volume</p><i class="bi-box-seam bi"></i>
      </RouterLink>
    </div>
  </div>
  <div class="row">
    <div class="col-12">
      <Acordeao id="acordeao" :lista_agrupada="items" @items_selecionados="(e) => url_args.items = e" />
    </div>
  </div>
</template>
