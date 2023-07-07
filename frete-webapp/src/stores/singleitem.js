import { getFirestore, getDoc, setDoc, updateDoc, doc, arrayUnion, arrayRemove, deleteDoc } from 'firebase/firestore'
import { firebaseApp } from '../firebaseConfig'
import { defineStore } from 'pinia' 
import { useDocument } from  'vuefire';
import { ref, computed } from 'vue'; 

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
    const docRef = doc(db, "items", codigo)
    const uptime = await updateDoc(docRef, {...item_data})
    return uptime
}

export async function update_item_part(item_codigo, operation, partRef){
    const db = getFirestore(firebaseApp) 
    const docRef = doc(db, "items", item_codigo)
    if(operation == "add"){
        const uptime = await updateDoc(docRef, 
            {partes: arrayUnion(partRef)}
        ) 
        return true
    } else if (operation == "remove"){
        const uptime = await updateDoc(docRef, 
            {partes: arrayRemove(partRef)}
        ) 
        return true
    } else {
        return false
    }
}

export async function create_part(part_data){
    const db = getFirestore(firebaseApp) 
    const partRef = doc(db, "items-partes", part_data.key)

    const uptime = await setDoc(partRef, {...part_data})
    return partRef
}

export async function get_parte_ref(part_key){
    const db = getFirestore(firebaseApp) 
    return doc(db, "items-partes", part_key)
}

export async function delete_part(part_key){
    await deleteDoc(get_parte_ref(part_key)) 
}