import { ref, reactive, inject } from 'vue'
import { defineStore } from 'pinia'
import { getAuth, signOut, GoogleAuthProvider, signInWithPopup, signInWithRedirect } from "firebase/auth";
import { getFirestore, doc, addDoc, collection, getDoc } from 'firebase/firestore'
import { firebaseApp } from '../firebaseConfig'

const db = getFirestore(firebaseApp)

export async function registra_atividade(email, atividade){
    const user_registry = addDoc(collection(db, "atividade"), {
        "user_email": email,
        "atividade": atividade,
        "datahora": new Date()
    } )
}

export async function getUserPermissions(email){ 
    const user_registry = await getDoc(doc(db, "usuarios", email))
    if (user_registry.exists()) {
        const permissoes = user_registry.data()
        return permissoes
      } else {
        return null
      }
}

export async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const auth = getAuth(firebaseApp); 

    var result = await signInWithRedirect(auth, provider)
    if (!result.errorCode) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info. 

        registra_atividade( result.user.email, "login")
        return result.user

    } else {
        // Handle Errors here.
        const errorCode = result.code;
        const errorMessage = result.message;
        // The email of the user's account used.
        console.log([errorCode, errorMessage])
        const email = result.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
    };
}

export async function globalLogout(){
    const auth = getAuth(firebaseApp);  
    await signOut(auth)
}

export const useUserPermissionsStore = defineStore("usuario", {
        state: () => ({role: null, email: null, ambientes: [], usuario_de: []}),
        actions: {
            async get_permissions(){
                if(this.role == null){ 
                    const permissoes = await getUserPermissions(this.email) 
                    this.$patch({...permissoes})
                }
            },
            set_email(new_mail) {
                this.email = new_mail
            },
            reset(){
                this.$reset()
            }
        }
}) 