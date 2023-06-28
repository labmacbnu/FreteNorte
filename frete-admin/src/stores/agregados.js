import { computed, reactive, readonly, ref } from 'vue'
import { defineStore } from 'pinia'
import { getFirestore, doc,  collection, getDoc } from 'firebase/firestore'
import { firebaseApp } from '../firebaseConfig'
import { useCollection, useDocument } from 'vuefire'



export const useAmbientesStore = defineStore('ambientes', ()=>{ 
    const db = getFirestore(firebaseApp)
    const pre_dados = useCollection(collection(db, "ambientes"))
    const dados = computed( () => {
        const ambientes = []
        pre_dados.value.forEach( function (doc) { 
            var docdt = doc.data() 
            docdt.valor = docdt.ambiente_codigo + ' - ' + docdt.ambiente_nome  
            ambientes.push(docdt)
        }) 
        return ambientes
    }) 
    return {dados} 
})


export const useListaAmbientes = defineStore('lista-ambientes', ()=>{ 
    const db = getFirestore(firebaseApp)
    const todos = ref([])  
    const liderados = ref([])
    const nao_liderados = computed(() => todos.value.filter(ambiente => !liderados.value.includes(ambiente)))
    async function load_data(){
        if(todos.value.length == 0) {
            const querySnapshot = await getDoc(doc(db, "agregados", "ambientes")); 
            var docdt = querySnapshot.data() 
            todos.value = docdt.codigos
            liderados.value = docdt.liderados
        }
    }

    return {todos, liderados, nao_liderados, load_data} 
})