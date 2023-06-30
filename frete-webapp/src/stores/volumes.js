import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import {firebaseApp} from '../firebaseConfig';
import {  collection, where, doc, setDoc, query } from 'firebase/firestore';
import {useCollection, useDocument} from 'vuefire';
import { db } from '../backend/index.js';
 

export const useNumVolumesStore = defineStore("volumes-num",  () => {
    const volumes = useDocument(doc(db, "agregados/volumes") )

    const codigo = computed(()  => {
        if (volumes.value == null){
            return null 
        } else {
            const quantidade = volumes.value.quantidade
            const base36 = quantidade.toString(36).toUpperCase()
            const padded = base36.padStart(3, "0")
        return      "V" + padded
        }
    })
    return {codigo, volumes}
})

export async function registra_volume(dados){
    const docRef = doc(db, "volumes", dados.codigo);
    const uptime = await setDoc(docRef, dados);
}

export function lista_volumes(email){ 
    const volRef = collection(db, "volumes")    
    const q = query(volRef, where("responsavel", "==", email))
    return useCollection(q)  
}