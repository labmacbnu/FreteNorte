import { createApp, ref } from 'vue'
import { createPinia } from 'pinia'  
import App from './App.vue'
import router from './router'  
import { VueFire } from 'vuefire';
import { firebaseApp } from './firebaseConfig';

const app = createApp(App)
 


app.use(createPinia())
app.use(router)  
app.use(VueFire, {firebaseApp})
app.mount('#app')
