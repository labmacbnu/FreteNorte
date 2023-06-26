import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { getFirestore, doc,  collection, getDoc } from 'firebase/firestore'
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


export const useListaAmbientes = defineStore('lista-ambientes', ()=>{ 
    const db = getFirestore(firebaseApp)
    const dados = ref([])  
    async function load_data(){
        if(dados.value.length == 0) {
            const querySnapshot = await getDoc(doc(db, "agregados", "ambientes")); 
            var docdt = querySnapshot.data() 
            dados.value = docdt.codigos
        }
    }

    return {dados, load_data} 
})