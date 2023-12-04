<script setup>
import { db } from '@/backend/index'
import { query, where, collection, setDoc, doc, updateDoc, getCountFromServer } from 'firebase/firestore'
import { useDocument } from 'vuefire'
import { computed, onMounted, reactive, ref } from 'vue';
import ProgressBar from '@/components/ProgressBar.vue'
import { RouterLink } from 'vue-router'

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

    return {
        inteiros: snap_inteiros.data().count,
        volumados: snap_volumados.data().count,
        infra: snap_infra.data().count,
        perdidos: snap_perdidos.data().count
    }
}

const dados_items = reactive({
    inteiros: 0,
    volumados: 0,
    percentual: 0,
    infra: 0,
    perdidos: 0,
    processados: 0
})

onMounted(async () => {
    const contagem = await get_total_volumados()
    dados_items.inteiros = contagem.inteiros
    dados_items.volumados = contagem.volumados
    dados_items.infra = contagem.infra
    dados_items.perdidos = contagem.perdidos
    dados_items.processados = contagem.infra + contagem.volumados + contagem.perdidos
    dados_items.percentual = Math.floor(100 * dados_items.processados / contagem.inteiros)
})



async function get_count_volumes(categoria) {
    const volumesRef = collection(db, "volumes")
    const q = query(volumesRef, where("categoria", "==", categoria), where("deleted", "==", false))
    const snap = await getCountFromServer(q)
    return snap.data().count
}
const { data: categorias, promise: cat_promisse } = useDocument(doc(db, "agregados", "categorias_volumes"))

const quantidade_volumes = reactive({
})

onMounted(async () => {
    cat_promisse.value.then(async () => {
        const cats = categorias.value.valores
        for (let categoria of cats) {
            quantidade_volumes[categoria] = await get_count_volumes(categoria)
        }
    })
})

const quantidade_volumes_ordenada = computed(() => {
    const cats = categorias.value.valores
    const qtds = []
    for (let categoria of cats) {
        qtds.push({ categoria: categoria, quantidade: quantidade_volumes[categoria] })
    }
    qtds.sort((a, b) => b.quantidade - a.quantidade)
    return qtds
})
</script>

<template>
    <div class="row my-3">

        <div class="col">
            <h1>SisLog Admin</h1>
            <ul>
                <li>Items processados: {{ dados_items.processados }}</li>
                <ul>
                    <li>Items volumados: {{ dados_items.volumados }}</li>
                    <li>Items infra: {{ dados_items.infra }}</li>
                    <li>Items perdidos: {{ dados_items.perdidos }}</li>
                </ul>
                <li>Items catalogados: {{ dados_items.inteiros }}</li>
                <li>Progresso: {{ (100 * dados_items.processados / dados_items.inteiros).toFixed(2) }}%</li>
            </ul>

            <ProgressBar :atual="dados_items.processados" :maximo="dados_items.inteiros"
                :percentual="dados_items.percentual" label="processados"></ProgressBar>
        </div>
        <div class="col">
            <p>Sistema de controle da logística da mudança do campus Blumenau.</p>
            <p>Para acessar o sistema, você precisará usar o login pelo Google usando uma conta idUFSC.</p>
        </div>
        <div class="col">
            <h3>Quantidade de volumes</h3>
            <p class="text-end"> <RouterLink :to="{name: 'volumes-edita-categorias'}">Editar categorias</RouterLink></p>
            <ul class="list-group">
                <li v-for="x in quantidade_volumes_ordenada" :key="'categoria' + x.categoria" class="list-group-item d-flex justify-content-between align-items-center">
                    {{x.categoria}}
                    <span class="badge bg-primary rounded-pill">{{x.quantidade}}</span>
                </li> 
            </ul>
 
        </div>
    </div>
</template>
