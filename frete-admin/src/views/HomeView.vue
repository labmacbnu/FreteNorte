<script setup>
import { db } from '@/backend/index'
import { query, where, collection, setDoc, doc, updateDoc, getCountFromServer } from 'firebase/firestore'
import { onMounted, reactive, ref } from 'vue';
import ProgressBar from '@/components/ProgressBar.vue'

async function get_total_volumados() {
    const collRef = collection(db, "items")
    const items_inteiros = query(collRef, where('meta.inteiro', '==', true))
    const items_inteiros_volumados = query(collRef, where('meta.inteiro', '==', true), where('meta.volumado', '==', true))
    const snap_inteiros = await getCountFromServer(items_inteiros)
    const snap_volumados = await getCountFromServer(items_inteiros_volumados)
    return { inteiros: snap_inteiros.data().count, volumados: snap_volumados.data().count }
}

const dados = reactive({
    inteiros: 0,
    volumados: 0,
    percentual: 0
})

onMounted(async () => {
    const contagem = await get_total_volumados()
    dados.inteiros = contagem.inteiros
    dados.volumados = contagem.volumados
    dados.percentual = Math.floor(100 * contagem.volumados / contagem.inteiros)
})
</script>

<template>
    <div class="row my-3">

        <div class="col">
            <h1>SisLog Admin</h1>
            <ul>
                <li>Items volumados: {{ dados.volumados }}</li> 
                <li>Items catalogados: {{ dados.inteiros }}</li>
                <li>Progresso: {{ (100*dados.volumados/dados.inteiros).toFixed(2) }}%</li>
            </ul> 
            
            <ProgressBar :atual="dados.volumados" :maximo="dados.inteiros" :percentual="dados.percentual"></ProgressBar>
        </div>
        <div class="col">
            <p>Sistema de controle da logística da mudança do campus Blumenau.</p>
            <p>Para acessar o sistema, você precisará usar o login pelo Google usando uma conta idUFSC.</p>
        </div>
    </div>
</template>
