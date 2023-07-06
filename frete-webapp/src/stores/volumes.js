import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { firebaseApp } from '../firebaseConfig';
import {  collection, where, doc, setDoc, query, updateDoc } from 'firebase/firestore';
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
            const padded = base36.padStart(4, "0")
        return      "V" + padded
        }
    })
    return {codigo, volumes}
})

export async function registra_volume(dados){
    dados.responsavel = doc(db, "permissoes", dados.responsavel)
    const itemsRef = []
    dados.items.forEach( (key) => {
        const itemRef = doc(db, "items", key) 
        itemsRef.push( itemRef )
    })
    dados.items = itemsRef
    const docRef = doc(db, "volumes", dados.codigo);
    const uptime = await setDoc(docRef, {...dados, deleted: false});
}


export async function apaga_volume(codigo_volume){ 
    const docRef = doc(db, "volumes", codigo_volume);
    const uptime = await updateDoc(docRef, {deleted: true});
}


export function lista_volumes(email){ 
    const userRef = doc(db, "permissoes", email)
    const volRef = collection(db, "volumes")    
    const q = query(volRef, where("responsavel", "==", userRef), where('deleted', '==', false))
    return useCollection(q, {wait: true})  
}