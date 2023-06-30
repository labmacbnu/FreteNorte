<script setup>
import { useRoute, RouterLink } from 'vue-router'
import { doc } from 'firebase/firestore'
import { useDocument } from 'vuefire'
import { db, getdoc } from '../backend/index'
import { onBeforeMount, ref } from 'vue'

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
    <h1>Volume {{ volume.codigo }}</h1>
{{ volume.responsavel.nome }}
<ul>
<li v-for="item in volume.items">{{ item.short_descricao }} <span>{{ item.key }}</span></li>
</ul>
</template>