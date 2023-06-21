import { ref, reactive, inject } from 'vue'
import { defineStore } from 'pinia'
import { getAuth, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
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

export async function getUserRole(email){ 
    const user_registry = await getDoc(doc(db, "permissoes", email))
    if (user_registry.exists()) {
        const permissoes = user_registry.data()
        return permissoes.role
      } else {
        return null
      }
}

export async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const auth = getAuth(firebaseApp); 

    var result = await signInWithPopup(auth, provider)
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

export const useUserStore = defineStore("usuario", { 
        state: () => ({ 
            displayName: "",
            email: "",
            photoURL: "",
            role: ""
        }),
        actions: { 
            async login() {
                const user = await loginWithGoogle()
                await registra_atividade( this.email, "login")
                this.$patch({ 
                    ...user
                })
                const role = await getUserRole(this.email)
                this.$patch({role: role})
            },
            async logout() { 
                await registra_atividade( this.email, "logout")
                await globalLogout()
                this.$patch({
                    displayName: "",
                    email: "",
                    photoURL: "",
                    role: ""
                })
 
            },
            async get_properties(){
                const role = await getUserRole(this.email)
                this.$patch({role: role})
            },
            async load_global(){
                const globaluser = inject("globaluser")
                this.$patch({...globaluser})
            }
            
        }
})  