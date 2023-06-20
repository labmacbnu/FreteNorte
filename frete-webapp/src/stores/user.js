import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'
import { getAuth, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, doc, addDoc, collection, getDoc } from 'firebase/firestore'
import { firebaseApp } from '../firebaseConfig'

const db = getFirestore(firebaseApp)
//https://medium.com/@charliepython/pinia-firebase-v9-and-axios-with-vue-3-composition-6261626da931
async function registra_atividade(email, atividade){
    const user_registry = addDoc(collection(db, "atividade"), {
        "user_email": email,
        "atividade": atividade,
        "datahora": new Date()
    } )
}

async function getUserRole(email){ 
    const user_registry = await getDoc(doc(db, "permissoes", email))
    if (user_registry.exists()) {
        const permissoes = user_registry.data()
        return permissoes.role
      } else {
        return null
      }
}

async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const auth = getAuth(firebaseApp); 

    var result = await signInWithPopup(auth, provider)
    if (!result.errorCode) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info. 

        localStorage.setItem('user', JSON.stringify(result.user));
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

export const useUserStore = () => {
    const innerStore = defineStore({
        id: "usuario",
        state: () => ({
            isLogged: false,
            displayName: "John Doe",
            email: "none@not.com",
            photoURL: "https://t3.ftcdn.net/jpg/02/53/27/72/360_F_253277232_w0KhD626du0CeTExyY9HV5wANXHRjswV.jpg",
            role: ""
        }),
        actions: {
            async login() {
                const user = await loginWithGoogle()
                this.$patch({
                    isLogged: true,
                    ...user
                })
                const role = await getUserRole(this.email)
                this.$patch({role: role})
            },
            async logout() { 
                await registra_atividade( this.email, "logout")
                this.$patch({
                    isLogged: false,
                    displayName: "John Doe",
                    email: "none@not.com",
                    photoURL: "https://t3.ftcdn.net/jpg/02/53/27/72/360_F_253277232_w0KhD626du0CeTExyY9HV5wANXHRjswV.jpg"

                })

        
                this.resetDisc()
            },
            autologin() {
                const auth = getAuth(firebaseApp); 
                const user = auth.currentUser;
                if (user) {
                    this.$patch({
                        isLogged: true,
                        ...user
                    })
                 } 
            },
            resetDisc() {
                localStorage.removeItem("user")
            }
        }
    })
    const user = innerStore()
    if (!user.isLogged) {
        user.autologin()
    }
    return user;
}