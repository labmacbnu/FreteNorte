import { defineStore } from 'pinia'
import { getFirestore, doc, addDoc, collection, getDoc, query, where, getDocs } from 'firebase/firestore'
import { firebaseApp } from '../firebaseConfig'
import { ref } from 'vue'

const db = getFirestore(firebaseApp)


export const useItemsStore = defineStore('items', ()=>{
 const ambiente = ref(null)
 const dados = ref([])
 async function load_data(){

    const q = query(collection(db, "items"), where('ambiente', '==', ambiente.value))
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach( function (doc) {  
        dados.value.push(doc.data()) 
    } )
    }
return {ambiente, dados, load_data}
})