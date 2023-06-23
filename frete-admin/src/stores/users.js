import { defineStore } from 'pinia'
import { reactive, ref } from 'vue';
import { getFirestore, doc, addDoc, collection, getDocs } from 'firebase/firestore'
import { firebaseApp } from '../firebaseConfig'

const db = getFirestore(firebaseApp)

export const useUsuariosStore = defineStore("userscontrol", () => {
    const usuarios  = reactive({})
    const loaded = ref(false)
    async function load_data(){
        if(loaded.value == false) {
            const querySnapshot = await getDocs(collection(db, "permissoes"));
            querySnapshot.forEach( function (doc) { 
                var docdt = doc.data() 
                var id = doc.id
                usuarios[id] = docdt
            }) 
            loaded.value = true
        }
    }
    return {usuarios, load_data}
})