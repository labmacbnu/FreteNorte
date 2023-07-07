import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { getFirestore, getDocs,  collection, where, getCountFromServer, query } from 'firebase/firestore'
import { firebaseApp } from '../firebaseConfig'
import { useDocument } from 'vuefire'



export const useAmbientesStore = defineStore('ambientes', ()=>{ 
    const db = getFirestore(firebaseApp)
    const dados = ref([])  
    async function load_data(){
        if(dados.value.length == 0) {
            const querySnapshot = await getDocs(collection(db, "ambientes"));
            querySnapshot.forEach( function (doc) { 
                var docdt = doc.data()
                docdt.valor = docdt.ambiente_codigo + ' - ' + docdt.ambiente_nome 
                dados.value.push(docdt) 
            }) 
        }
    }

    return {dados, load_data} 
})

export async function ambiente_status(ambiente_full) {
    const db = getFirestore(firebaseApp)
    const volumados_query = query(collection(db, "items"), where('ambiente', '==', ambiente_full),
    where('volumado', '==', true))
    const volumados_snap = await getCountFromServer(volumados_query)
    const volumados_n = volumados_snap.data().count

    const all_query = query(collection(db, "items"), where('ambiente', '==', ambiente_full))
    const all_snap = await getCountFromServer(all_query)
    const all_n = all_snap.data().count

    return {volumados: volumados_n, todos: all_n}

}