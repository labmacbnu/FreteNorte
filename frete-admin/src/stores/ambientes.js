import { computed, reactive, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { getFirestore, query, where, collection, setDoc, doc, updateDoc, getCountFromServer } from 'firebase/firestore'
import { firebaseApp } from '../firebaseConfig'
import { useCollection, useDocument } from 'vuefire'
import { useUsuariosStore } from './users'  



export const useAmbientesStore = defineStore('ambientes', ()=>{ 
    const db = getFirestore(firebaseApp)
    const edificio = ref('')
    const pesquisa = computed(() => query(collection(db, "ambientes"), where("edificio", "==", edificio.value)))
    const dados = useCollection(pesquisa)
    const status = reactive({})
    watch(dados, () =>  {
        if(dados.value){
            dados.value.forEach( ambiente => {
                ambiente_status(ambiente.codigo).then( (value) => { status[ambiente.codigo] = value } )
            })
        }
    }) 
    return {dados, edificio, status} 
})

export async function create_ambiente(ambiente_data) { 
    const db = getFirestore(firebaseApp)
    const docRef = doc(db, 'ambientes', ambiente_data.codigo)
    ambiente_data.lider = doc(db, 'usuarios', ambiente_data.lider)
    const uptime = await setDoc(docRef, {...ambiente_data})
    return uptime

}

export async function add_lider_ambiente(ambiente_codigo, lider_email) {
    const db = getFirestore(firebaseApp)
    const docRef = doc(db, 'ambientes', ambiente_codigo)
    const uptime = await updateDoc(docRef, {lider: lider_email})
    const usuarios = useUsuariosStore()
    usuarios.add_ambiente(lider_email, ambiente_codigo)
    return uptime
}

export const useListaAmbientesStore = defineStore('listaAmbientes', ()=>{ 
    const db = getFirestore(firebaseApp)
    const pesquisa = doc(db, "agregados/ambientes")  
    const {data: pre_dados, pending, promise} =  useDocument(pesquisa) 
    const dados = computed(() =>  pending.value? [] : pre_dados.value.codigos)
    return {dados}
})

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

    const percent = parseInt(100* volumados_n / all_n)

    return {volumados: volumados_n, todos: all_n, percent: percent, ambiente: ambiente_codigo}

}