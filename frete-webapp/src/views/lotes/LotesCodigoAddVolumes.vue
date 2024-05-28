<template>
    <h1>Adicionando volumes ao lote {{ loteCodigo }}</h1>
    <template v-if="pending">
        <p>Carregando...</p>
    </template>
    <template v-else>
        <p>{{ lote.nome }}</p>
    </template>
    <QRCodeReader :autoreload="true" @decoded="pushVolume">
        <p>{{ mensagem }}</p>
    </QRCodeReader>
    <p>Lista de volumes sendo adicionados ao lote</p>
    <ul class="list-group mb-3">
        <li class="list-group-item d-flex justify-content-between" v-for="volume in novosVolumes">
            {{ volume }}
            <span class="badge bg-danger">
                <i role="button" @click="removeVolume(volume)" class="bi-trash bi"></i>
            </span>
        </li>
    </ul>
    <div class="text-end">
        <button @click="handleSave" class="btn btn-primary">Adicionar Volumes ao Lote</button>
    </div>
</template>
<script setup>
import { routerKey, useRoute, useRouter } from 'vue-router';
import { db } from '@/backend'
import { ref } from 'vue';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore'
import { useDocument } from 'vuefire'
import QRCodeReader from '@/components/QRCodeReader.vue';

const route = useRoute();
const router = useRouter()
const loteCodigo = route.params.codigo;
const loteRef = doc(db, 'lotes', loteCodigo);
const { data: lote, pending, promise } = useDocument(loteRef)


const novosVolumes = ref([]);
const mensagem = ref("Lote lido com sucesso!");

function pushVolume(new_url) {
    const prefix = "https://frete-norte-ufsc-blumenau.web.app/volumes/cod/"
    if (new_url.startsWith(prefix)) {
        const codVolume = new_url.replace(prefix, "")
        if (!novosVolumes.value.includes(codVolume)) {
            mensagem.value = "Lote lido com sucesso!"
            novosVolumes.value.push(codVolume)
        } else {
            mensagem.value = "Volume já lido"
        }
    } else {
        mensagem.value = "URL inválida"
    }
}

function removeVolume(volume){
    novosVolumes.value.splice(novosVolumes.value.indexOf(volume), 1)
}


async function addVolumesToLote(){  
    const volumesRefs = novosVolumes.value.map(volume => doc(db, 'volumes', volume))
    const uptadeData = {
        volumes: arrayUnion(...volumesRefs)
    }
    await updateDoc(loteRef, uptadeData)
}

async function handleSave(){
    await addVolumesToLote()
    novosVolumes.value = []
    router.push({name: 'lotes-codigo', params: {codigo: loteCodigo}})
}
</script>