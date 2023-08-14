import { computed, reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { getFirestore, query, where, collection, setDoc, doc, updateDoc } from 'firebase/firestore'
import { firebaseApp } from '../firebaseConfig'
import { useCollection, useDocument } from 'vuefire'
import { useUsuariosStore } from './users'



export const useAmbientesStore = defineStore('ambientes', ()=>{ 
    const db = getFirestore(firebaseApp)
    const edificio = ref('')
    const pesquisa = computed(() => query(collection(db, "ambientes"), where("edificio", "==", edificio.value)))
    const pre_dados = useCollection(pesquisa)
    const dados = computed(() => {
        const ambientes = []
        pre_dados.value.forEach( function (doc) { 
            var docdt = doc
            docdt.valor = docdt.ambiente_codigo + ' - ' + docdt.ambiente_nome  
            ambientes.push(docdt)
        }) 
        return ambientes
    })
    return {dados, edificio} 
})

export async function create_ambiente(ambiente_data) { 
    const db = getFirestore(firebaseApp)
    const docRef = doc(db, 'ambientes', ambiente_data.ambiente_codigo)
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