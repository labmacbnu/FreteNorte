import { defineStore } from 'pinia'
import { db } from '@/backend/index'
import { doc, collection } from 'firebase/firestore'
import { useDocument } from 'vuefire'


export const useStatusList = defineStore("statuslist", () => { 
    const collref = collection(db, 'agregados')
    const {data: dados, promise } = useDocument(doc(collref, 'volumes_status'))
    return {dados}
})