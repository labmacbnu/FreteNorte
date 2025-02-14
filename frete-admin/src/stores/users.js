import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue';
import { getFirestore, doc, addDoc, collection, getDocs, setDoc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore'
import { firebaseApp } from '../firebaseConfig'
import { useCollection } from 'vuefire';

const db = getFirestore(firebaseApp)

export const useUsuariosStore = defineStore("userscontrol", () => {
    const pre_usuarios  = useCollection(collection(db, "usuarios"))
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
        const docref = doc(db, "usuarios", email)
        const uptime = await updateDoc(docref, {role: role})
    } 

    async function add_ambiente(email, ambiente){
        const docref = doc(db, "usuarios", email)
        const uptime = await updateDoc(docref, {ambientes: arrayUnion(ambiente)})
    } 

    async function remove_ambiente(email, ambiente){
        const docref = doc(db, "usuarios", email)
        const uptime = await updateDoc(docref, {ambientes: arrayRemove(ambiente)})
    }

    async function update_user(user) {
        const docref = doc(db, "usuarios", user.email)
        const uptime = await updateDoc(docref, {ambientes: user.ambientes, role: user.role,
            usuario_de: user.usuario_de})
        for(let edit of edit_array){
            // edit = ['add'/'remove', 'user_email', 'ambientecodigo' ]
            switch(edit[0]){
                case 'add_lider':
                // atualiza o lider do ambiente
                    updateDoc(doc(db, "ambientes", edit[2]), {
                        lider: doc(db, "usuarios", edit[1])
                    })
                    // adiciona a lista de ambientes com lider
                    updateDoc(doc(db, 'agregados', 'ambientes'),{
                        liderados: arrayUnion(edit[2])
                    })
                    break;
                case 'remove_lider':
                    // remove o lider do ambiente
                    updateDoc(doc(db, "ambientes", edit[2]), {
                        lider: null
                    })
                    // remove da lista de ambientes com lider
                    updateDoc(doc(db, 'agregados', 'ambientes'),{
                        liderados: arrayRemove(edit[2])
                    }) 
                    break;
                case 'add_user':
                    updateDoc(doc(db, "usuarios", edit[1]), 
                    {
                        usuario_de: arrayUnion(edit[2])
                    })
                    break;
                case 'remove_user':
                    updateDoc(doc(db, "usuarios", edit[1]), 
                    {
                        usuario_de: arrayRemove(edit[2])
                    })
                    break;

            } 
        }
        edit_array.splice(0) // limpa o edit
        return uptime
    }

    async function add_user(user) {
        const docref = doc(db, "usuarios", user.email)
        const uptime = await setDoc(docref, user)
        return uptime
    }


    return {usuarios, update_user, edit_array, add_ambiente, remove_ambiente, update_role, add_user}
})