import { computed, reactive, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { getFirestore, getDoc, doc, collection, where, getCountFromServer, query } from 'firebase/firestore'
import { firebaseApp } from '../firebaseConfig'
import { useCollection, useDocument } from 'vuefire'
import { useUserPermissionsStore } from './user'


export const useAmbientesStore = defineStore('ambientes', () => {
    const db = getFirestore(firebaseApp)
    const predados = useCollection(collection(db, "ambientes"))
    const dados = computed(() => {
        if (predados.value) {
            var retorno = []
            predados.value.forEach(ambiente => {
                retorno.push({ full_name: ambiente.codigo + ' - ' + ambiente.nome, ...ambiente })
            })
            return retorno
        }
    })

    return { dados }
})


export const useListaAmbientesStore = defineStore('listaAmbientes', () => {
    const db = getFirestore(firebaseApp)
    const pesquisa = doc(db, "agregados/ambientes")
    const { data: pre_dados, pending, promise } = useDocument(pesquisa)
    const dados = computed(() => pending.value ? [] : pre_dados.value.codigos)
    return { dados }
})


export const useListaAmbientesNorteStore = defineStore('listaAmbientesNorte', () => {
    const db = getFirestore(firebaseApp)
    const pesquisa = doc(db, "agregados/ambientes_norte")
    const { data: pre_dados, pending, promise } = useDocument(pesquisa)
    const dados = computed(() => pending.value ? [] : pre_dados.value.codigos)
    return { dados }
})


export const useAmbientesUserStore = defineStore('ambientes-user', () => {
    async function ambiente_status(ambiente_codigo) {
        const db = getFirestore(firebaseApp)
        const ambienteRef = doc(db, "ambientes", ambiente_codigo)
        const volumados_query = query(collection(db, "items"), where('ambiente', '==', ambienteRef),
            where('meta.volumado', '==', true))
        const volumados_snap = await getCountFromServer(volumados_query)
        const volumados_n = volumados_snap.data().count

        const all_query = query(collection(db, "items"), where('ambiente', '==', ambienteRef),
            where('meta.inteiro', '==', true)) // where('inteiro', '==', true)
        const all_snap = await getCountFromServer(all_query)
        const all_n = all_snap.data().count

        const percent = all_n == 0 ? 100 :  parseInt(100 * volumados_n / all_n)

        return { volumados: volumados_n, todos: all_n, percent: percent }

    }

    const permissoes = useUserPermissionsStore()
    const db = getFirestore(firebaseApp)
    const ambientes = computed(() => [...permissoes.ambientes, ...permissoes.usuario_de])

    //const amb_query = computed(() =>  query(collection(db, "ambientes"), where('codigo', 'in', ambientes.value))) 

    const status = reactive({})

    const dados = ref([])

    async function update_stats() {
        for (const ambiente of ambientes.value) {
            status[ambiente] = await ambiente_status(ambiente)
            console.log(status[ambiente])
        }
    }
    watch(ambientes, async () => {
        if (ambientes.value.length != 0) {
            ambientes.value.forEach(async ambiente => {
                const {id: amb_id, data: amb_data } = await get_document(doc(db, "ambientes", ambiente))
                dados.value.push(amb_data)
            })
            update_stats()
        }
    }, { immediate: true })


    return { ambientes, dados, status, update_stats }
})

async function get_document(docRef) { 
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return {id: docSnap.id, data: docSnap.data()}
    } else {
        return null
    }
}