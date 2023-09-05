import { computed, ref, watch } from 'vue';
import { defineStore } from 'pinia';
import { firebaseApp } from '../firebaseConfig';
import { collection, where, doc, setDoc, query, updateDoc, addDoc, orderBy } from 'firebase/firestore';
import {useCollection, useDocument} from 'vuefire';
import { db } from '../backend/index.js'; 
import { useUserPermissionsStore } from './user';
 

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
    /* {
            categoria: null,
            responsavel: globaluser.value.email, 
            localizacao_atual: route.query.ambiente || null,
            origem: route.query.ambiente || null, 
            items: route.query.items || []
         }
     */
    dados.responsavel = doc(db, "usuarios", dados.responsavel)
    const itemsRef = []
    dados.items.forEach( (key) => {
        const itemRef = doc(db, `items/${key}`)  // resolve problema com int
        itemsRef.push( itemRef )
    })
    dados.items = itemsRef 
    dados.origem = doc(db, "ambientes", dados.origem)
    dados.localizacao_atual = doc(db, "ambientes", dados.localizacao_atual)
    dados.destino = doc(db, "ambientes-norte", dados.destino) 
    dados.data_criacao = new Date()

    if(dados.servicos.includes("Montagem e Desmontagem")){
        dados.status.push("Para Desmontagem")
    }

    const volumesRef = collection(db, "volumes") 
    const docRef = await addDoc(volumesRef, {...dados, deleted: false});

    await updateDoc(docRef, {codigo: docRef.id} )
    return docRef.id
}


export async function apaga_volume(codigo_volume){ 
    const docRef = doc(db, "volumes", codigo_volume);
    const uptime = await updateDoc(docRef, {deleted: true});
}


export const useVolumesEmailStore = defineStore("volumes-email", () => {
    const permissoes = useUserPermissionsStore()
    const email = computed(() => permissoes.email)
    const dados = ref([])

    watch(email, () => {
        const userRef = doc(db, "usuarios", email.value) 
        const volRef = collection(db, "volumes") 
        const q = query(volRef, where("responsavel", "==", userRef), where('deleted', '==', false), orderBy('data_criacao', 'desc'))
        useCollection(q, {wait: true, target: dados})  
    }, {immediate: true })
    return {email, dados}
})




export async function registra_volume_parte(dados){
    dados.responsavel = doc(db, "usuarios", dados.responsavel)  
    const docRef = doc(db, "volumes", dados.codigo);
    const uptime = await setDoc(docRef, {...dados, deleted: false});
}

export const simbolos_nbr = {
    'Frágil': '/fragil.webp',
    'Proibido Empilhar': '/proibido-empilhar.webp',
    'Proteger do Calor': '/proteger-contra-o-calor.webp',
    'Proteger da Luz': '/proteger-da-luz.webp',
    'Proteger da Umidade': '/protegerdaumidade.webp',
    'Corrosivo': '/corrosivo.webp',
    'Cargas Pesadas': '/cargas-pesadas.webp',
    'Explosivo': '/explosivo.webp',
    'Inflamável': '/inflamavel.webp',
    'Oxidante': '/oxidante.webp',
    'Risco Ambiental': '/risco-ambiental.webp',
    'Radioativo': '/radioativo.webp',
    'Gás Comprimido': '/gas-comprimido.webp',
  }

export const servicos = ['Montagem e Desmontagem', 'Calibração', 'Especializados']
