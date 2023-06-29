import { getFirestore, getDoc, updateDoc, doc } from 'firebase/firestore'
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