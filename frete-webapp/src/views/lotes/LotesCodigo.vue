<template>
    <div class="row"  v-if="!pending" >
        <div class="col-12">
            <div class="hstack justify-content-between">
                <h1>Lote {{ loteCodigo }}</h1>
                <RouterLink class="btn btn-primary" :to="{ name: 'lotes-editar', params: { codigo: loteCodigo } }"><i class="bi-pencil bi"></i> Editar
                </RouterLink>
            </div>

            <p class="fs-3"> {{ lote.nome }}</p>
            <p>Registrado por {{ lote.responsavel.nome }}</p>

        </div>
        <div class="col-12">
            <div class="hstack justify-content-between">
            <h3>Volumes desse lote</h3> 
            <RouterLink class="btn btn-primary" :to="{name: 'lotes-codigo-add-volume', params: {codigo: lote.id}}"><i class="bi bi-plus"></i> Adicionar volumes</RouterLink>
            </div>
            <VolumesTable masterkey="VS" :volumes="volumes"></VolumesTable> 
        </div>
    </div>

</template>
<script setup> 
import { useRoute, useRouter } from 'vue-router'
import { db } from '@/backend/index'
import { doc } from 'firebase/firestore'
import { useDocument } from 'vuefire'
import VolumesTable from '@/components/SimpleVolumesTable.vue'
import { reactive } from 'vue'
 
const route = useRoute()
const loteCodigo = route.params.codigo

const { data: lote, pending, promise } = useDocument(doc(db, 'lotes', loteCodigo))

const volumes = reactive([])

promise.value.then(() => {
    console.log(lote.value.volumes)
    volumes.push(...lote.value.volumes)
})
</script>