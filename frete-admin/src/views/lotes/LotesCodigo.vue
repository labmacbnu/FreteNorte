<template>
    <div class="row"  v-if="!pending" >
        <div class="col-12">
            <div class="hstack justify-content-between">
                <h1>Lote {{ loteCodigo }}</h1>
                <a class="btn btn-primary" :href="createLink(loteCodigo)"><i class="bi-pencil bi"></i> Editar no Sislog
                </a> 
            </div>

            <p class="fs-3"> {{ lote.nome }}</p>

        </div>
        <div class="col-12">
            <h3>Volumes desse lote</h3> 
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

function createLink(codigo){
    const href = window.location.origin
    const url = href.replace("admin-frete-norte", "frete-norte")
    return url + `/lotes/cod/${codigo}/edit`
}
</script>