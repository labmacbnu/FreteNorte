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
    const ambientesagregados = useDocument(doc(db, "agregados", "ambientes"))
    const todos = computed(() =>  ambientesagregados.value.codigos)
    const liderados = computed(() =>  ambientesagregados.value.liderados)
    const nao_liderados = computed(() => {
    if(todos.value) {
        return todos.value.filter(ambiente => !liderados.value.includes(ambiente))
    } else {
        return []
    }})
    return {todos, liderados, nao_liderados} 
})