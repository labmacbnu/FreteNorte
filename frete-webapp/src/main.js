import { createApp, ref } from 'vue'
import { createPinia } from 'pinia'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { firebaseApp } from './firebaseConfig'

import App from './App.vue'
import router from './router' 

const app = createApp(App)




app.use(createPinia())
app.use(router) 


app.mount('#app')
