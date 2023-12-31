import { computed, ref, watch } from 'vue';
import { defineStore } from 'pinia';
import { firebaseApp } from '../firebaseConfig';
import { collection, where, doc, setDoc, query, updateDoc, addDoc, orderBy, getCountFromServer } from 'firebase/firestore';
import {useCollection, useDocument} from 'vuefire';
import { db } from '@/backend/index.js'; 
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

function rename_sala_codigo(ambiente_str) {
    const sala_codigo = ambiente_str.replace(".", "")
    if(sala_codigo.length == 4){
        return sala_codigo + "0"
    } else if (sala_codigo.length == 5) {
        return sala_codigo
    } else {
        return "SIJ01"
    }
}

async function conta_volumes(ambiente_str){ 
    const ambienteRef = doc(db, "ambientes", ambiente_str)
    const volumes_query = query(collection(db, "volumes"), where('origem', '==', ambienteRef))
    const n_volumes = await getCountFromServer(volumes_query)
    return n_volumes.data().count
}

export async function registra_volume(origin_dados){
    /* {
            categoria: null,
            responsavel: globaluser.value.email, 
            localizacao_atual: route.query.ambiente || null,
            origem: route.query.ambiente || null, 
            items: route.query.items || []
         }
     */
    const dados = JSON.parse(JSON.stringify(origin_dados))
    dados.responsavel = doc(db, "usuarios", dados.responsavel)
    const itemsRef = dados.items.map( (key) =>  doc(db, `items/${key}`)  )
    // resolve problema com int 
    dados.items = itemsRef 
    const origem_string = dados.origem
    dados.origem = doc(db, "ambientes", dados.origem)
    dados.localizacao_atual = doc(db, "ambientes", dados.localizacao_atual)
    dados.destino = doc(db, "ambientes-norte", dados.destino) 
    dados.data_criacao = new Date()

    if(dados.servicos.includes("Montagem e Desmontagem")){
        dados.status.push("Para Desmontagem")
    }

    const volumesRef = collection(db, "volumes") 

    const n_volumes = await conta_volumes(origem_string)

    const origem_label = rename_sala_codigo(origem_string)

    const volume_codigo = origem_label + n_volumes.toString(16).padStart(3, "0").toUpperCase()

    const docRef = doc(volumesRef, volume_codigo);
    const uptime = await setDoc(docRef, {...dados, codigo: volume_codigo, deleted: false});

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
