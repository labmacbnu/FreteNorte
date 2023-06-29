import { createApp, ref } from 'vue'
import { createPinia } from 'pinia'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { firebaseApp } from './firebaseConfig'
import {VueFire} from 'vuefire'
import App from './App.vue'
import router from './router' 

const app = createApp(App)




app.use(createPinia())
app.use(router) 
app.use(VueFire, {firebaseApp})


app.mount('#app')
