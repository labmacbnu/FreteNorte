import { getFirestore, getDoc, collection, doc } from 'firebase/firestore'
import { firebaseApp } from '../firebaseConfig'
import { defineStore } from 'pinia'
import { useRoute } from 'vue-router'
import { reactive, ref } from 'vue'

const db = getFirestore(firebaseApp) 

export const useSingleItemStore = defineStore("single-item", () => { 
    const dados = reactive({})
    async function get_item (codigo){
        const docRef = doc(db, "items", codigo);
        const docSnap = await getDoc(docRef);
        const doc = docSnap.data()
        for(let key in doc ) {
            dados[key] = doc[key]
        } 
    }
    return {dados, get_item}
})