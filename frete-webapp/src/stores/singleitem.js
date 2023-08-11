import { getFirestore, getDoc, setDoc, updateDoc, doc, arrayUnion, arrayRemove, deleteDoc, runTransaction } from 'firebase/firestore'
import { firebaseApp } from '../firebaseConfig'
import { defineStore } from 'pinia' 
import { useDocument } from  'vuefire';
import { ref, computed } from 'vue'; 
import { db } from '@/backend/index'
import moment from 'moment';

export const useSingleItemStoreOld = defineStore("single-item-old", {  
    state: () => ({
        descricao: null,
        short_descricao: null,
        edificio: null,
        ambiente: null,
        patrimonio: Number,
        valor: Number,
        medidas: null, 
        peso: null,
        fragil: false,
        transporte_especial: false
    }),
    actions: {
        async get_item (codigo){
            const docRef = doc(db, "items", codigo);
            const docSnap = await getDoc(docRef);
            const mydoc = docSnap.data()
            this.$patch({...mydoc}) 
        }

    }
})


export const useSingleItemStore = defineStore("single-item",  () => {
    const db = getFirestore(firebaseApp) 
    const codigo = ref(null)
    const docRef = computed(() => (codigo.value == null)?  null : doc(db, "items", codigo.value)) 
    const documento = computed(() => (docRef.value == null)?  null: useDocument(docRef.value))
    return {documento, codigo}
})


export async function update_item (codigo, item_data){
    const db = getFirestore(firebaseApp) 
    const docRef = doc(db, `items/${codigo}`)
    const promisse = await updateDoc(docRef, {...item_data})
    return promisse
}

export async function update_item_part(item_codigo, operation, partRef){
    const db = getFirestore(firebaseApp) 
    const docRef = doc(db, `items/${item_codigo}`)

    if(operation == "add"){
        const uptime = await updateDoc(docRef, 
            {'meta.partes': arrayUnion(partRef)}
        ) 
        return true
    } else if (operation == "remove"){
        const uptime = await updateDoc(docRef, 
            {'meta.partes': arrayRemove(partRef)}
        ) 
        return true
    } else {
        return false
    }
}

function seconds2Date(seconds){
    return moment.unix(seconds).toDate()
}

export async function create_part(part_data){
    const db = getFirestore(firebaseApp) 
    if( part_data.detalhes.incorporacao != undefined ) {
        part_data.detalhes.incorporacao = seconds2Date(part_data.detalhes.incorporacao.seconds)
    }
    if( part_data.detalhes.transf_local != undefined) {
        part_data.detalhes.transf_local = seconds2Date(part_data.detalhes.transf_local.seconds)
    }
    console.log({...part_data})
    console.log({...part_data.detalhes})
    console.log({...part_data.meta}) 
    const partRef = doc(db, `items/${part_data.key}`)
    // ambientes/codigo pois usamos { maxRefDepth: 0 } no useDocument
    const ambienteRef = doc(db, 'ambientes', part_data.ambiente )
    part_data.ambiente = ambienteRef 
    //return {...part_data, id: 'fake0'}
    const promessa = await setDoc(partRef, part_data)
    //return partRef 
    // increment ambiente.items
    const newN = await runTransaction(db, async (transaction) => {
        const ambiente = await transaction.get(ambienteRef)
        const itemsp1 = ambiente.data().items + 1;
        transaction.update(ambienteRef, {items: itemsp1})
        return itemsp1
    })
    return partRef
}

export function get_item_ref(key){
    const db = getFirestore(firebaseApp) 
    return doc(db, `items/${key}` )
}

export async function notused_delete_item(key){
    const db = getFirestore(firebaseApp) 
    const itemRef = get_item_ref(key)
    const lista_filhos = await runTransaction(db, async (transaction) => {
        const item = await transaction.get(itemRef)
        const volumeRef = item.data().meta.volume 
        console.log(`item apagado está no volume ${volumeRef}`) 
        if(volumeRef){
        // verifica se o item está volumado, e retira do volume 
        transaction.update(volumeRef, {items: arrayRemove(itemRef)})
        } 
        transaction.delete(itemRef)
    })
    console.log(`Apagado ${key}`)
 
 

}

export const itemModel = {
    "responsavel": "",
    "ambiente": "",
    "edificio": "",
    "detalhes": {
      "patrimonio": "",
      "n_controle": "",
      "cod_barras": "",
      "n_serie": "",
      "descricao": "",
      "conservacao": "EM USO", 
      "valor": 0,
      "situacao": "Ativo",
      "peso": "",
      "medidas": ""
    },
    "key": 1,
    "meta": {
      "inteiro": true,
      "updated": "",
      "partes": [],
      "volumado": false,
      "volume": null
    },
    "tipo": "Consumível",
    "short_descricao": ""
  }