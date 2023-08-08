import { computed, reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { getFirestore, getDocs, doc,  collection, where, getCountFromServer, query } from 'firebase/firestore'
import { firebaseApp } from '../firebaseConfig'
import { useCollection, useDocument } from 'vuefire'



export const useAmbientesStore = defineStore('ambientes', ()=>{ 
    const db = getFirestore(firebaseApp) 
    const predados = useCollection(collection(db, "ambientes"))
    const dados = computed( () => {
        if(predados.value){
            var retorno = []
            predados.value.forEach(ambiente => { 
                retorno.push({full_name: ambiente.ambiente_codigo + ' - ' + ambiente.ambiente_nome,...ambiente })
            })
            return retorno
        }
    })

    return {dados} 
})

export async function ambiente_status(ambiente_codigo) {
    const db = getFirestore(firebaseApp)
    const ambienteRef = doc(db, "ambientes", ambiente_codigo)
    const volumados_query = query(collection(db, "items"), where('ambiente', '==', ambienteRef),
    where('meta.volumado', '==', true))
    const volumados_snap = await getCountFromServer(volumados_query)
    const volumados_n = volumados_snap.data().count

    const all_query = query(collection(db, "items"), where('ambiente', '==', ambienteRef)) // where('inteiro', '==', true)
    const all_snap = await getCountFromServer(all_query)
    const all_n = all_snap.data().count

    return {volumados: volumados_n, todos: all_n}

}