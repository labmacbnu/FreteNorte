import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { getFirestore, getDocs,  collection, setDoc, doc } from 'firebase/firestore'
import { firebaseApp } from '../firebaseConfig'



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

export async function create_ambiente(ambiente_data) { 
    const db = getFirestore(firebaseApp)
    const docRef = doc(db, 'ambientes', ambiente_data.ambiente_codigo)
    const uptime = await setDoc(docRef, {...ambiente_data})
    return uptime

}