<template>
<div class="row">
    <div class="col-12">
        <div class="hstack justify-content-between">
            <h1>Lote {{ loteCodigo }}</h1>
            <RouterLink class="btn btn-primary" :to="{ name: 'lotes-editar', params: {codigo: loteCodigo} }">Editar</RouterLink>
        </div>
        
        <p class="fs-3"  v-if="!pending"> {{ lote.nome }}</p>

    </div>
    <div class="col-12">
<h3>Volumes desse lote</h3>
<VolumesTable v-if="!pending" :volumes="lote.volumes"></VolumesTable>
    </div>

</div>

</template>
<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { db } from '@/backend/index'
import { doc, getDoc } from 'firebase/firestore'
import { useDocument } from 'vuefire'
import VolumesTable  from '@/components/SimpleVolumesTable.vue'

const router = useRouter()
const route = useRoute()
const loteCodigo = route.params.codigo

const {data: lote, pending, promise} = useDocument(doc(db, 'lotes', loteCodigo))

</script>