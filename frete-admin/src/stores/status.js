import { defineStore } from 'pinia'
import { db } from '@/backend/index'
import { doc, collection } from 'firebase/firestore'
import { useDocument } from 'vuefire'


export const useStatusList = defineStore("statuslist", () => { 
    const collref = collection(db, 'agregados')
    const {data: dados, promise } = useDocument(doc(collref, 'volumes_status'))
    return {dados}
})

export const volume_status = {
    "Criado": 0,
    "Para Desmontagem": 1,
    "Desmontado": 2,
    "Embalado": 3,
    "Loteado": 4, 
}
