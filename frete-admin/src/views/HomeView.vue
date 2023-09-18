<script setup>
import { db } from '@/backend/index'
import { query, where, collection, setDoc, doc, updateDoc, getCountFromServer } from 'firebase/firestore'
import { onMounted, reactive, ref } from 'vue';
import ProgressBar from '@/components/ProgressBar.vue'

async function get_total_volumados() {
    const itemsRef = collection(db, "items")
    const ambRef = collection(db, "ambientes")
    const infraRef = doc(ambRef, "INFRA")
    const lostRef = doc(ambRef, "PERDIDO")
    
    const items_inteiros = query(itemsRef, where('meta.inteiro', '==', true))
    const items_inteiros_volumados = query(itemsRef, where('meta.inteiro', '==', true), where('meta.volumado', '==', true))
    const items_infra = query(itemsRef, where("ambiente", '==', infraRef))
    const items_perdidos = query(itemsRef, where("ambiente", '==', lostRef))

    
    const snap_inteiros = await getCountFromServer(items_inteiros)
    const snap_volumados = await getCountFromServer(items_inteiros_volumados)
    const snap_infra = await getCountFromServer(items_infra)
    const snap_perdidos = await getCountFromServer(items_perdidos)

    return { inteiros: snap_inteiros.data().count, 
        volumados: snap_volumados.data().count, 
        infra: snap_infra.data().count,
        perdidos: snap_perdidos.data().count
    }
}

const dados = reactive({
    inteiros: 0,
    volumados: 0,
    percentual: 0,
    infra: 0,
    perdidos: 0,
    processados: 0
})

onMounted(async () => {
    const contagem = await get_total_volumados()
    dados.inteiros = contagem.inteiros
    dados.volumados = contagem.volumados
    dados.infra = contagem.infra
    dados.perdidos = contagem.perdidos
    dados.processados = contagem.infra + contagem.volumados + contagem.perdidos
    dados.percentual = Math.floor(100 *dados.processados/ contagem.inteiros)
})
</script>

<template>
    <div class="row my-3">

        <div class="col">
            <h1>SisLog Admin</h1>
            <ul>
                <li>Items processados: {{dados.processados}}</li>
                <ul>
                <li>Items volumados: {{ dados.volumados }}</li> 
                <li>Items infra: {{ dados.infra }}</li>
                <li>Items perdidos: {{ dados.perdidos }}</li>
                </ul>
                <li>Items catalogados: {{ dados.inteiros }}</li>
                <li>Progresso: {{ (100*dados.processados/dados.inteiros).toFixed(2) }}%</li>
            </ul> 
            
            <ProgressBar :atual="dados.processados" :maximo="dados.inteiros" :percentual="dados.percentual" label="processados"></ProgressBar>
        </div>
        <div class="col">
            <p>Sistema de controle da logística da mudança do campus Blumenau.</p>
            <p>Para acessar o sistema, você precisará usar o login pelo Google usando uma conta idUFSC.</p>
        </div>
    </div>
</template>
