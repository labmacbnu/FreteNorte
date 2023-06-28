import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue';
import { getFirestore, doc, addDoc, collection, getDocs, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore'
import { firebaseApp } from '../firebaseConfig'
import { useCollection } from 'vuefire';

const db = getFirestore(firebaseApp)

export const useUsuariosStore = defineStore("userscontrol", () => {
    const pre_usuarios  = useCollection(collection(db, "permissoes"))
    const usuarios = computed(() => {
        const users = {}
        pre_usuarios.value.forEach( function (doc) { 
            var email = doc.id 
            doc.email = email
            users[email] =  doc 
        }
        )
        return users
    })
    const loaded = ref(false)
    const edit_array = reactive([]) 

    async function update_role(email, role){
        const docref = doc(db, "permissoes", email)
        const uptime = await updateDoc(docref, {role: role})
    } 

    async function add_ambiente(email, ambiente){
        const docref = doc(db, "permissoes", email)
        const uptime = await updateDoc(docref, {ambientes: arrayUnion(ambiente)})
    } 

    async function remove_ambiente(email, ambiente){
        const docref = doc(db, "permissoes", email)
        const uptime = await updateDoc(docref, {ambientes: arrayRemove(ambiente)})
    }

    async function update_user(user) {
        const docref = doc(db, "permissoes", user.email)
        const uptime = await updateDoc(docref, {ambientes: user.ambientes, role: user.role})
        for(let edit of edit_array){
            if(edit[0] == 'add'){
                // atualiza o lider do ambiente
                updateDoc(doc(db, "ambientes", edit[2]), {
                    lider: edit[1]
                })
                // adiciona a lista de ambientes com lider
                updateDoc(doc(db, 'agregados', 'ambientes'),{
                    liderados: arrayUnion(edit[2])
                })
            } else if (edit[0] == 'remove') {
                // remove o lider do ambiente
                updateDoc(doc(db, "ambientes", edit[2]), {
                    lider: null
                })

                // remove da lista de ambientes com lider
                updateDoc(doc(db, 'agregados', 'ambientes'),{
                    liderados: arrayRemove(edit[2])
                })
            }
        } 
        edit_array.splice(0) // limpa o edit
        return uptime
    }


    return {usuarios, update_user, edit_array, add_ambiente, remove_ambiente, update_role}
})