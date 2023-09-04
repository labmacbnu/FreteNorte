import { db } from '@/backend'
import { ref, computed } from 'vue'
import { addDoc, runTransaction, collection, doc, arrayUnion } from 'firebase/firestore'
import moment from 'moment'

export const loteModel = {
    responsavel: String,
    data_criacao: Date,
    data_pronto: Date,
    local_pronto: String,
    carregamento: String,
    volumes: Array,
}


export async function save_lote(lote_data) { 
    const lotesRef = collection(db, "lotes")
    const volumesRef = collection(db, "volumes")
    const volumesDocs = lote_data.volumes.map( (volume) => doc(volumesRef, volume) ) 
    lote_data.data_pronto = moment(lote_data.data_pronto).toDate()
    lote_data.data_criacao = moment(lote_data.data_criacao).toDate()
    lote_data.responsavel = doc(db, 'usuarios', lote_data.responsavel)
    const lote = {...lote_data, volumes: volumesDocs} 
    const loteAdicionado = await addDoc(lotesRef, lote)
    const update = await runTransaction(db, async (transaction) => {
        volumesDocs.forEach( (volume) => {
            transaction.update(volume, {lote: loteAdicionado, status: arrayUnion('Loteado') })
        })
        return true
    })
    return update
}